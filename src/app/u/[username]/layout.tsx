import UserAvatar from '@/components/ui/UserAvatar';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react';

type UserProfileLayoutProps = {
  children: React.ReactNode;
  params: {
    username: string;
  };
};

const Layout = async ({ children, params }: UserProfileLayoutProps) => {
  const username = params.username;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      createdAt: true,
      image: true,
      username: true,
    },
  });

  const userPostCount = await prisma.post.count({
    where: {
      author: {
        username,
      },
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="mobileContainer sm:container">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8 flex justify-center sm:justify-start">u/{username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
        <div className="col-span-2">{children}</div>
        <div className="order-first md:order-last overflow-hidden mb-8 md:mb-0 rounded-md border h-fit">
          <div className="flex flex-col gap-2 items-center justify-center px-6 py-4 bg-gradient-to-br from-blue-500 to-indigo-400">
            <UserAvatar user={user} large />
            <h2 className="text-xl font-semibold bg-white dark:bg-zinc-800 px-3 py-1 rounded-md text-zinc-800 dark:text-zinc-300">
              {`${username}'s`} Profile
            </h2>
          </div>

          <div className="flex flex-col gap-4 px-6 py-4 text-zinc-500">
            <div className="flex justify-between">
              <p>Joined</p>
              <p className="text-zinc-800 dark:text-zinc-300">{user?.createdAt.toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Posts</p>
              <p className="text-zinc-800 dark:text-zinc-300">{userPostCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
