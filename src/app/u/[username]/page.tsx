import InfinitePostFeed from '@/components/InfinitePostFeed';
import { getPosts } from '@/lib/actions/posts/actions';
import React from 'react';

interface ProfilePageProps {
  params: {
    username: string;
  };
}
const Page = async ({ params }: ProfilePageProps) => {
  const username = params.username;

  const { data: initialPosts } = await getPosts({ username });

  return (
    <div>
      <InfinitePostFeed initialPosts={initialPosts} username={username} />
    </div>
  );
};

export default Page;
