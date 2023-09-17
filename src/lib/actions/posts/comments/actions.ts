'use server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { CreateCommentValidator } from '@/lib/validators/comment';
import { CommentVoteValidator } from '@/lib/validators/vote';
import {
  CreateCommentOptions,
  CreateCommentResponse,
  UpdateCommentVoteOptions,
} from '@/types/actions/posts/comments/action-types';
import { NestedComment } from '@/types/db';
import { VoteType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function createComment({ data }: CreateCommentOptions): Promise<CreateCommentResponse> {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return {
        status: 401,
        data: {
          title: 'Login required.',
          description: 'You need to be logged in to do that.',
        },
      };
    }

    const { text, postId, replyToId } = CreateCommentValidator.parse(data);

    const newComment = await prisma.comment.create({
      data: {
        text,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    });

    revalidatePath(`/n/[name]/post/[id]`);

    return {
      status: 200,
      data: {
        title: 'Success.',
        description: 'Comment created successfully.',
        commentId: newComment.id,
      },
    };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        status: 400,
        data: {
          title: 'Invalid comment input.',
          description: 'Please enter a comment between 3 and 191 characters.',
        },
      };
    }

    return {
      status: 400,
      data: {
        title: 'Failed to post comment.',
        description: 'Please try again later.',
      },
    };
  }
}

type GetNestedCommentsOptions = {
  postId: string;
  replyToId: string | null;
};

export async function getNestedComments({ postId, replyToId }: GetNestedCommentsOptions): Promise<NestedComment[]> {
  try {
    const session = await getAuthSession();

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        replyToId,
      },
      select: {
        id: true,
        postId: true,
        author: {
          select: {
            username: true,
            image: true,
          },
        },
        votes: true,
        text: true,
      },
    });

    if (!comments || comments.length === 0) {
      return [];
    }

    const commentsWithVotes = comments.map((comment) => {
      let voteCount = 0;
      let currentUserVote = null;

      comment.votes.forEach((vote) => {
        voteCount += vote.type === 'UP' ? 1 : -1;
        if (session && vote.userId === session.user.id) {
          currentUserVote = vote.type;
        }
      });

      return {
        ...comment,
        voteCount,
        currentUserVote,
      };
    });

    const nestedComments: NestedComment[] = await Promise.all(
      commentsWithVotes.map(async (comment) => {
        const replies = await getNestedComments({ postId, replyToId: comment.id });
        return { ...comment, replies };
      }),
    );

    return nestedComments;
  } catch (e) {
    return [];
  }
}

export async function updateCommentVote({ data }: UpdateCommentVoteOptions) {
  try {
    const { voteType, commentId } = CommentVoteValidator.parse(data);

    const session = await getAuthSession();

    if (!session?.user) {
      return {
        status: 401,
        data: { title: 'Login required.', description: 'You need to be logged in to do that.', updateCount: undefined },
      };
    }

    // Check if the user has already voted
    const existingVote = await prisma.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    // Check if post exists and if it doesn't, return an error
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        author: true,
        votes: true,
      },
    });

    if (!comment) {
      return {
        status: 404,
        data: {
          title: 'Comment not found.',
          description: 'That comment does not exist',
          updateCount: undefined,
        },
      };
    }

    if (existingVote) {
      // Vote type is the same as existingVote, so remove the vote
      if (existingVote.type === voteType) {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        });

        const updateCount = voteType === VoteType.UP ? -1 : 1;
        revalidatePath('/n/[name]/post/[id]');
        return {
          status: 200,
          data: { title: 'Success.', description: 'Vote removed.', newVoteType: undefined, updateCount },
        };
      } else {
        // Vote is of a different type so update it and corresonding count
        await prisma.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
          data: {
            type: voteType,
          },
        });

        const updateCount = voteType === VoteType.UP ? 2 : -2;
        revalidatePath('/n/[name]/post/[id]');
        return {
          status: 200,
          data: { title: 'Success.', description: 'Vote registered.', newVoteType: voteType, updateCount },
        };
      }
    }

    // Vote doesn't exist, so create it
    await prisma.commentVote.create({
      data: {
        userId: session.user.id,
        commentId,
        type: voteType,
      },
    });

    const updateCount = voteType === VoteType.UP ? 1 : -1;
    revalidatePath('/n/[name]/post/[id]');
    return {
      status: 200,
      data: { title: 'Success.', description: 'Vote registered', newVoteType: voteType, updateCount },
    };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        status: 400,
        data: {
          title: 'Failed to vote.',
          description: 'Invalid vote parameters.',
          updateCount: undefined,
        },
      };
    }

    return {
      status: 500,
      data: {
        title: 'Vote Failed.',
        description: 'Could not vote at this time.',
        updateCount: undefined,
      },
    };
  }
}

type DeleteCommentAndRepliesOptions = {
  commentId: string;
};

export async function deleteCommentAndReplies({ commentId }: DeleteCommentAndRepliesOptions) {
  try {
    // Find the comment by ID
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        replies: true,
      },
    });

    if (!comment) {
      return {
        status: 400,
        data: {
          title: 'Delete failed.',
          description: 'Comment does not exist.',
        },
      };
    }

    // Recursively delete replies
    for (const reply of comment.replies) {
      await deleteCommentAndReplies({ commentId: reply.id });
    }

    // Delete the comment itself
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    console.log(`Comment ${commentId} and its replies deleted successfully`);
  } catch (error) {
    console.error('Error deleting comment and replies:', error);
  }
}
