'use server';
import {
  CreateCommunityPostOptions,
  FetchCommunityPostsOptions,
  FetchDefaultPostsOptions,
  UpdateVoteOptions,
} from '@/types/actions/actions';
import { getAuthSession } from '../auth';
import { prisma } from '../db';
import { postTake } from '../globals';
import { PostValidator } from '../validators/post';
import { z } from 'zod';
import { VoteValidator } from '@/lib/validators/vote';
import { VoteType } from '@prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function fetchCommunityPosts({ page = 0, subnexusName }: FetchCommunityPostsOptions) {
  const session = await getAuthSession();
  const posts = await prisma.post.findMany({
    where: {
      subnexus: {
        name: subnexusName,
      },
    },
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      votes: true,
      subnexus: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: page * postTake,
    take: postTake,
  });

  const postsWithVoteCount = posts.map((post) => {
    let voteCount = 0;
    let currentUserVote = null;

    post.votes.forEach((vote) => {
      voteCount += vote.type === 'UP' ? 1 : -1;
      if (session && vote.userId === session.user.id) {
        currentUserVote = vote.type;
      }
    });

    return {
      ...post,
      voteCount,
      currentUserVote,
    };
  });

  return postsWithVoteCount;
}

export async function fetchDefaultPosts({ page = 0 }: FetchDefaultPostsOptions) {
  const session = await getAuthSession();

  const posts = await prisma.post.findMany({
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
      votes: true,
      subnexus: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: page * postTake,
    take: postTake,
  });

  const postsWithVoteCount = posts.map((post) => {
    let voteCount = 0;
    let currentUserVote = null;

    post.votes.forEach((vote) => {
      voteCount += vote.type === 'UP' ? 1 : -1;
      if (session && vote.userId === session.user.id) {
        currentUserVote = vote.type;
      }
    });

    return {
      ...post,
      voteCount,
      currentUserVote,
    };
  });

  return postsWithVoteCount;
}

export async function createCommunityPost({ data }: CreateCommunityPostOptions) {
  try {
    const session = await getAuthSession();
    const { subnexusName, content, title } = PostValidator.parse(data);

    if (!session?.user) {
      return {
        status: 401,
        data: { title: 'Login required.', description: 'You need to be logged in to do that.' },
      };
    }

    const subnexus = await prisma.subnexus.findFirst({
      where: {
        name: subnexusName,
      },
    });

    if (!subnexus) {
      return {
        status: 404,
        data: {
          title: 'The subnexus does not exist.',
          description: 'Please post to an existing community.',
        },
      };
    }

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: session?.user.id!,
        subnexusId: subnexus?.id!,
      },
    });

    return {
      status: 200,
      data: { title: 'New post created.', description: `Successfully posted to n/${subnexusName}` },
    };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return {
        status: 400,
        data: {
          title: 'Invalid post contents.',
          description: 'Please enter a title between 3 and 21 characters, and content between 3 and 500 characters.',
        },
      };
    }
    return {
      status: 403,
      data: { title: 'Error when creating the post.', description: 'Please try again later.' },
    };
  }
}

export async function updateVote({ data }: UpdateVoteOptions) {
  try {
    const { voteType, postId } = VoteValidator.parse(data);

    const session = await getAuthSession();

    if (!session?.user) {
      return {
        status: 401,
        data: { title: 'Login required.', description: 'You need to be logged in to do that.', updateCount: undefined },
      };
    }

    // Check if the user has already voted
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return {
        status: 404,
        data: {
          title: 'Post not found.',
          description: 'That post does not exist',
          updateCount: undefined,
        },
      };
    }

    if (existingVote) {
      // Vote type is the same as existingVote, so remove the vote
      if (existingVote.type === voteType) {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
        });

        const updateCount = voteType === VoteType.UP ? -1 : 1;
        revalidateTag('prisma-votes');
        return {
          status: 200,
          data: { title: 'Success.', description: 'Vote removed.', newVoteType: undefined, updateCount },
        };
      } else {
        // Vote is a different type, so update it
        await prisma.vote.update({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId,
            },
          },
          data: {
            type: voteType,
          },
        });

        const updateCount = voteType === VoteType.UP ? 2 : -2;

        revalidateTag(`prisma-votes`);
        return {
          status: 200,
          data: { title: 'Success.', description: 'Vote registered.', newVoteType: voteType, updateCount },
        };
      }
    }

    // Vote doesn't exist, so create it
    await prisma.vote.create({
      data: {
        userId: session.user.id,
        postId: postId,
        type: voteType,
      },
    });

    const updateCount = voteType === VoteType.UP ? 1 : -1;
    revalidateTag('prisma-votes');
    return {
      status: 200,
      data: { title: 'Success.', description: 'Vote registered', newVoteType: voteType, updateCount },
    };
  } catch (e) {
    console.log(e);
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
