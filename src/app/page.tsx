import InfinitePostFeed from '@/components/InfinitePostFeed';
import { buttonVariants } from '@/components/ui/Button';
import { getPosts } from '@/lib/actions/posts/actions';
import { HomeIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default async function Home() {
  const { data: posts } = await getPosts({});

  return (
    <div className="mobileContainer sm:container">
      <h1 className="text-3xl md:text-4xl w-full font-semibold mb-8 flex items-center justify-center sm:justify-start">
        Your feed
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <InfinitePostFeed initialPosts={posts} />
        </div>
        <div className="border overflow-hidden border-zinc-200 dark:border-zinc-800 h-fit rounded-md order-first md:order-last">
          <div className="bg-emerald-200 dark:bg-emerald-600 flex gap-2 items-center px-6 py-4">
            <HomeIcon height="20" width="20" />
            <h2 className="font-semibold text-lg">Home</h2>
          </div>
          <div className="flex flex-col justify-between gap-4 px-6 py-4">
            <h3 className="text-zinc-500 text-base">
              Your personal Nexus homepage. Come here to check in with your favorite communities.
            </h3>
            <Link href="/n/create" className={buttonVariants({ className: 'w-full mt-4 mb-6' })}>
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
