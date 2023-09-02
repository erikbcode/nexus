'use client';
import { ClientPost } from '@/types/db';
import React, { useEffect, useState } from 'react';
import { getPosts } from '@/lib/actions/posts/actions';
import { INFINITE_SCROLL_POST_TAKE } from '@/lib/globals';
import PostCard from './PostCard';
import { useInView } from 'react-intersection-observer';
import { Loader } from 'lucide-react';

type InfinitePostFeedProps = {
  initialPosts: ClientPost[];
  username?: string;
  communityName?: string;
};

const InfinitePostFeed = ({ initialPosts, username, communityName }: InfinitePostFeedProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [ref, inView] = useInView();

  async function loadMorePosts() {
    const nextPage = page + 1;
    const { data: newPosts } = await getPosts({ username, communityName, page: nextPage });
    if (newPosts?.length) {
      setPage(nextPage);
      setPosts((oldPosts: ClientPost[] | undefined) => [...(oldPosts?.length ? oldPosts : []), ...newPosts]);
      if (newPosts?.length < INFINITE_SCROLL_POST_TAKE) {
        setHasMorePosts(false);
      }
    } else {
      setHasMorePosts(false);
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      if (hasMorePosts) {
        await loadMorePosts();
      }
    };
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-4 w-full mb-2">
      {posts.map((post) => {
        return <PostCard key={post.id} {...post} />;
      })}
      {/* loading spinner */}

      {hasMorePosts && (
        <div className="flex justify-center">
          <Loader ref={ref} className="animate-spin flex justify-center" />
        </div>
      )}
    </div>
  );
};

export default InfinitePostFeed;
