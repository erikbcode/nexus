import { prisma } from '@/lib/db';
import React from 'react';
import { notFound } from 'next/navigation';
import CreatePostForm from '@/components/CreatePostForm';
import { getAuthSession } from '@/lib/auth';
import { getPosts } from '@/lib/actions/posts/actions';
import InfinitePostFeed from '@/components/InfinitePostFeed';

interface SubnexusPageProps {
  params: {
    name: string;
  };
}

const Page = async ({ params }: SubnexusPageProps) => {
  const session = await getAuthSession();
  const { name } = params;

  const subnexus = await prisma.subnexus.findFirst({
    where: {
      name,
    },
    select: {
      name: true,
      createdAt: true,
      subscribers: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          author: {
            select: {
              username: true,
            },
          },
          subnexus: {
            select: {
              name: true,
            },
          },
          comments: true,
          votes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  const { data: initialPosts } = await getPosts({ communityName: params.name });

  if (!subnexus) {
    return notFound();
  }

  return (
    <div className="flex gap-8 flex-col">
      <CreatePostForm session={session} />
      <ul role="list" className="grid grid-cols-1 gap-y-8">
        <InfinitePostFeed initialPosts={initialPosts} communityName={params.name} />
      </ul>
    </div>
  );
};

export default Page;
