import CreatePostForm from '@/components/CreatePostForm';
import InfinitePostFeed from '@/components/InfinitePostFeed';
import { getPosts } from '@/lib/actions/posts/actions';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

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
      <h1 className="text-3xl md:text-4xl font-semibold flex items-center justify-center sm:justify-start">
        n/{subnexus.name}
      </h1>
      <CreatePostForm session={session} />
      <ul role="list" className="grid grid-cols-1 gap-y-8">
        <InfinitePostFeed initialPosts={initialPosts} communityName={params.name} />
      </ul>
    </div>
  );
};

export default Page;
