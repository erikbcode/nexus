import UserPostList from '@/components/UserPostList';
import { fetchUserPosts } from '@/lib/actions/dbActions';
import { prisma } from '@/lib/db';
import React from 'react';

interface ProfilePageProps {
  params: {
    username: string;
  };
}
const Page = async ({ params }: ProfilePageProps) => {
  const username = params.username;

  const posts = await fetchUserPosts({ username });

  return (
    <div>
      <UserPostList initialPosts={posts} username={username} />
    </div>
  );
};

export default Page;
