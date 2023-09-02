import CommentSection from '@/components/CommentSection';
import VoteDisplay from '@/components/VoteDisplay';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { getSinglePost } from '@/lib/actions/posts/actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

type PostPageParams = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: PostPageParams) => {
  const post = await getSinglePost(params.id);

  const { data } = post;

  if (post.status !== 200) {
    throw new Error('Error when fetching post');
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen">
      <div className="grid grid-flow-col grid-cols-[auto, 1fr] place-items-center">
        {/* Vote display */}
        <div className="self-start hidden md:flex mt-12">
          <VoteDisplay postId={data!.id} initialVoteCount={data!.voteCount} initialVote={data!.currentUserVote} />
        </div>
        <div className="border p-4 gap-20 rounded-md flex flex-col justify-between">
          <div className="min-h-0 flex flex-col break-words">
            <small className="text-gray-500">
              Posted by <Link href={`/u/${data!.author.username}`}>u/{data!.author.username}</Link>
            </small>
            <h2 className="text-2xl font-semibold mt-2">{data!.title}</h2>
            <hr className="my-4 border-gray-300" />
            <p className="max-h-none text-base break-all">{data!.content}</p>
            <div className="self-start flex md:hidden mt-12">
              <VoteDisplay postId={data!.id} initialVoteCount={data!.voteCount} initialVote={data!.currentUserVote} />
            </div>
          </div>
          {/* <div className="flex flex-row items-end gap-8">
            <p className="text-sm">{data!.comments.length} comments</p>
          </div> */}

          <div>
            <CommentSection postId={data?.id!} />
          </div>
        </div>

        {/* Create comment card */}
      </div>
    </div>
  );
};

export default Page;
