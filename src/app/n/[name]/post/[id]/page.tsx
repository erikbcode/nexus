import CommentSection from '@/components/CommentSection';
import PostOptions from '@/components/PostOptions';
import VoteDisplay from '@/components/VoteDisplay';
import { getSinglePost } from '@/lib/actions/posts/actions';
import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PostPageParams = {
  params: {
    id: string;
  };
};

const Page = async ({ params }: PostPageParams) => {
  const session = await getAuthSession();
  const post = await getSinglePost(params.id);

  const { data } = post;

  if (post.status !== 200) {
    throw new Error('Error when fetching post');
  }

  if (!post || !data) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-flow-col grid-cols-1 md:grid-cols-10">
        {/* Vote display */}
        <div className="self-start hidden md:flex mt-12 w-fit">
          <VoteDisplay postId={data.id} initialVoteCount={data.voteCount} initialVote={data.currentUserVote} />
        </div>
        <div className="border p-4 gap-20 rounded-md flex flex-col justify-between col-span-9">
          <div className="min-h-0 flex flex-col">
            <div className="flex justify-between">
              <small className="text-gray-500">
                Posted by <Link href={`/u/${data.author.username}`}>u/{data.author.username}</Link>
              </small>
              <PostOptions
                session={session}
                authorId={data.authorId}
                postId={data.id}
                authorUsername={data.author.username!}
              />
            </div>
            <h2 className="text-2xl font-semibold mt-2">{data!.title}</h2>
            <hr className="my-4 border-gray-300" />
            <p className="max-h-none text-base break-words">{data!.content}</p>
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
