'use server';
import { getAuthSession } from '../auth';
import { prisma } from '../db';
import { postTake } from '../globals';
import { PostValidator } from '../validators/post';

interface FetchCommunityPostsOptions {
  subnexusName: string;
  page?: number;
}

export async function fetchCommunityPosts({ page = 0, subnexusName }: FetchCommunityPostsOptions) {
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

  return posts;
}

interface FetchDefaultPostsOptions {
  page?: number;
}

export async function fetchDefaultPosts({ page = 0 }: FetchDefaultPostsOptions) {
  const posts = await prisma.post.findMany({
    select: {
      title: true,
      content: true,
      id: true,
      createdAt: true,
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

  return posts;
}

interface CreateCommunityPostOptions {
  data: {
    title: string;
    content: string;
    subnexusName: string;
  };
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
    return {
      status: 400,
      data: { title: 'Error when creating the post.', description: 'Please try again later.' },
    };
  }
}
