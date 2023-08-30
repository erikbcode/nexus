'use server';
import {
  CreateCommunityPostOptions,
  FetchCommunityPostsOptions,
  FetchDefaultPostsOptions,
  FetchUserPostsOptions,
  UpdateVoteOptions,
} from '@/types/actions/actions';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { INFINITE_SCROLL_POST_TAKE } from '@/lib/globals';
import { PostValidator } from '@/lib/validators/post';
import { z } from 'zod';
import { VoteValidator } from '@/lib/validators/vote';
import { VoteType } from '@prisma/client';
import { revalidatePath, revalidateTag } from 'next/cache';
import { ClientPost } from '@/types/db';

type GetUserPostsOption = { username: string; page?: number };
type GetCommunityPostsOption = { communityName: string; page?: number };
type GetAllPostsOption = { page?: number };
type GetPostsOptions = GetUserPostsOption | GetCommunityPostsOption | GetAllPostsOption;

export async function getPosts(options: GetPostsOptions): Promise<ClientPost[]> {
  const session = await getAuthSession();
  const { page = 0 } = options;

  let whereClause = {};
  if ('username' in options) {
    const { username } = options;
    whereClause = {
      author: {
        username,
      },
    };
  } else if ('communityName' in options) {
    const { communityName } = options;
    whereClause = {
      subnexus: {
        name: communityName,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      image: true,
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
    skip: page * INFINITE_SCROLL_POST_TAKE,
    take: INFINITE_SCROLL_POST_TAKE,
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

  return postsWithVoteCount as ClientPost[];
}

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
    skip: page * INFINITE_SCROLL_POST_TAKE,
    take: INFINITE_SCROLL_POST_TAKE,
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

export async function fetchUserPosts({ page = 0, username }: FetchUserPostsOptions) {
  const session = await getAuthSession();
  const posts = await prisma.post.findMany({
    where: {
      author: {
        username,
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
    skip: page * INFINITE_SCROLL_POST_TAKE,
    take: INFINITE_SCROLL_POST_TAKE,
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
    skip: page * INFINITE_SCROLL_POST_TAKE,
    take: INFINITE_SCROLL_POST_TAKE,
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

    revalidatePath('/n/[name]');
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
          description: 'Please enter a title between 3 and 21 characters, and content between 3 and 191 characters.',
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

    // Check if post exists and if it doesn't, return an error
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
        revalidatePath('/');
        revalidatePath('/n/[name]');
        revalidatePath('/u/[username]');
        return {
          status: 200,
          data: { title: 'Success.', description: 'Vote removed.', newVoteType: undefined, updateCount },
        };
      } else {
        // Vote is of a different type so update it and corresonding count
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
        revalidatePath('/');
        revalidatePath('/n/[name]');
        revalidatePath('/u/[username]');
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
    revalidatePath('/');
    revalidatePath('/n/[name]');
    revalidatePath('/u/[username]');
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