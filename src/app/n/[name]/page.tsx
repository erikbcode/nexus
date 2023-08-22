import { prisma } from '@/lib/db';
import { TrackPreviousIcon } from '@radix-ui/react-icons';
import React from 'react';
import { notFound } from 'next/navigation';
import CreatePostForm from '@/components/CreatePostForm';
import { getAuthSession } from '@/lib/auth';

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
          comments: true,
          votes: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!subnexus) {
    return notFound();
  }

  return (
    <div className="">
      <CreatePostForm session={session} />
      {/* <InfinitePostList initialPosts={} /> */}
    </div>
  );
};

export default Page;
