'use client';
import { timeSince } from '@/lib/utils';
import { ClientPost } from '@/types/db';
import { ChatBubbleLeftIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import VoteDisplay from './VoteDisplay';
import { buttonVariants } from './ui/Button';

const PostCard = ({
  id,
  content,
  createdAt,
  title,
  author,
  subnexus,
  voteCount,
  currentUserVote,
  commentCount,
}: ClientPost) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 shadow flex flex-row items-center">
      <div className="hidden md:contents">
        <VoteDisplay initialVoteCount={voteCount} initialVote={currentUserVote} postId={id} />
      </div>
      <div className="flex flex-col w-full min-w-0">
        {/* Author and Subnexus*/}
        {/* Wide Screen */}
        <div className="hidden sm:flex items-center mb-2 text-zinc-500 text-sm md:text-base">
          <Link href={`/n/${subnexus.name}`} className="text-zinc-800 dark:text-white underline-offset-3 underline">
            /n/{subnexus.name}
          </Link>
          <span className="mx-2">•</span>
          <span>Posted by</span>
          <Link href={`/u/${author.username}`} className="ml-1  underline underline-offset-3">
            /u/{author.username}
          </Link>

          <span className="mx-2">•</span>
          <span>{timeSince(new Date(createdAt))}</span>
        </div>
        {/* Small Screen */}
        <div className="flex gap-0 text-sm sm:hidden mb-2 text-zinc-500">
          <Link href={`/n/${subnexus.name}`} className="text-zinc-800 dark:text-white underline-offset-3 underline">
            /n/{subnexus.name}
          </Link>
          <span className="mx-2">•</span>
          <div>
            <Link href={`/u/${author.username}`} className="ml-1  underline underline-offset-3">
              /u/{author.username}
            </Link>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        {/* Content */}
        <p className="break-words text-lg text-gray-700 dark:text-zinc-400 overflow-wrap">{content}</p>

        <div className="mt-2 flex flex-row">
          <div className="contents md:hidden">
            <VoteDisplay postId={id} initialVoteCount={voteCount} initialVote={currentUserVote} />
          </div>
          <Link
            className={buttonVariants({
              variant: 'ghost',
              className: `text-zinc-400 w-fit flex items-center gap-2 rounded`,
              size: 'sm',
            })}
            href={`/n/${subnexus.name}/post/${id}`}
            scroll={true}
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">{formatNumber(commentCount)}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
