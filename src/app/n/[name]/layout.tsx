import JoinCommunityToggle from '@/components/JoinCommunityToggle';
import { Button } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';
import { notFound } from 'next/navigation';
import React from 'react';

interface SubnexusLayoutProps {
  children: React.ReactNode;
  params: {
    name: string;
  };
}

const Layout = async ({ children, params }: SubnexusLayoutProps) => {
  const session = await getAuthSession();
  const { name } = params;

  const subnexus = await prisma.subnexus.findFirst({
    where: {
      name,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      subscribers: true,
      creatorId: true,
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

  const subscription = !session?.user
    ? undefined
    : await prisma.subscription.findFirst({
        where: {
          userId: session?.user.id,
          subnexus: {
            name,
          },
        },
      });

  const subscriberCount = await prisma.subscription.count({
    where: {
      subnexus: {
        name,
      },
    },
  });

  const isSubscribed = !!subscription;

  if (!subnexus) {
    return notFound();
  }

  return (
    <div className="mobileContainer sm:container mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 w-full">
        <div className="col-span-2 w-full">{children}</div>
        <div className="overflow-hidden order-first mb-8 md:mb-0 md:order-last rounded-md border h-fit w-full">
          <div className="bg-zinc-300 dark:bg-zinc-600 flex gap-2 items-center px-6 py-4">
            <h2 className="text-base font-semibold">About n/{subnexus.name}</h2>
          </div>
          <div className="flex flex-col justify-between gap-4 px-6 py-4 text-zinc-400">
            <div className="flex justify-between">
              <p>Created</p>
              <p className="text-zinc-800 dark:text-zinc-300">{subnexus.createdAt.toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Members</p>
              <p className="text-zinc-800 dark:text-zinc-300">{subscriberCount}</p>
            </div>
            <hr className="bg-gray-200 font-black h-px"></hr>
            <div className="py-4 w-full">
              {subnexus.creatorId === session?.user.id ? (
                <Button className="w-full" disabled>
                  You own this community
                </Button>
              ) : (
                <JoinCommunityToggle subnexusName={subnexus.name} subnexusId={subnexus.id} isMember={isSubscribed} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
