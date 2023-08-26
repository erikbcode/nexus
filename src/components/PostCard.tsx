'use client';
import { timeSince } from '@/lib/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { Button } from './ui/Button';
import { VoteType } from '@prisma/client';
import { updateVote } from '@/lib/actions/dbActions';
import { toast } from '@/hooks/use-toast';
import { UpdateVoteResponse } from '@/types/actions/actions';
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  voteCount: number;
  initialVote: VoteType | null;
  subnexus: {
    name: string;
  };
  author: {
    id: string;
    image: string | null;
    username: string | null;
  };
};

const PostCard = ({ id, content, createdAt, title, author, subnexus, voteCount, initialVote }: Post) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 shadow">
      <div className="grid grid-cols-[min-content,1fr] items-center">
        <VoteDisplay initialVoteCount={voteCount} initialVote={initialVote} postId={id} />
        <div>
          {/* Author and Subnexus*/}
          {/* Wide Screen */}
          <div className="hidden sm:flex items-center mb-2 text-zinc-500">
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
          <div className="flex gap-0 sm:hidden mb-2 text-zinc-500">
            <Link href={`/n/${subnexus.name}`} className="text-zinc-800 dark:text-white underline-offset-3 underline">
              /n/{subnexus.name}
            </Link>
            <span className="mx-2">•</span>
            <div>
              <span>By</span>
              <Link href={`/u/${author.username}`} className="ml-1  underline underline-offset-3">
                /u/{author.username}
              </Link>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold mb-2">{title}</h2>

          {/* Content */}
          <p className="text-lg text-gray-700 dark:text-zinc-400">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

interface VoteDisplayProps {
  initialVoteCount: number;
  initialVote?: VoteType | null;
  postId: string;
}

const VoteDisplay = ({ initialVoteCount, initialVote, postId }: VoteDisplayProps) => {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);

  const handleVote = async (voteType: VoteType) => {
    const res = await updateVote({ data: { voteType, postId } });
    const variant = res.status === 200 ? 'default' : 'destructive';
    if (res.status !== 200) {
      // Vote was not successful, so don't change
      return toast({
        title: res.data.title,
        description: res.data.description,
        variant,
      });
    }

    // Vote was successful, so update state
    if (res.data.newVoteType === undefined) {
      setCurrentVote(null);
    } else {
      res.data.newVoteType === VoteType.UP ? setCurrentVote(VoteType.UP) : setCurrentVote(VoteType.DOWN);
    }

    setVoteCount(voteCount + res.data.updateCount!);

    return toast({
      title: res.data.title,
      description: res.data.description,
      variant,
    });
  };

  // Tailwind css classnames for upvote and downvote
  const upvoteClass =
    currentVote === VoteType.UP
      ? 'text-emerald-500 fill-emerald-500 group-hover:fill-none'
      : 'group-hover:text-emerald-500 dark:text-white';
  const downvoteClass =
    currentVote === VoteType.DOWN
      ? 'text-rose-500 fill-rose-500 group-hover:fill-none'
      : 'group-hover:text-rose-500 dark:text-white';

  return (
    <>
      <div className="px-4 mx-2 flex flex-col justify-center items-center gap-3">
        <Button variant="ghost" size="sm" className={`group`} onClick={() => handleVote(VoteType.UP)}>
          <ArrowBigUp className={`${upvoteClass}`} />
        </Button>
        <p className="font-semibold">{voteCount}</p>
        <Button variant="ghost" size="sm" className="dark:text-white group" onClick={() => handleVote(VoteType.DOWN)}>
          <ArrowBigDown className={`${downvoteClass}`} />
        </Button>
      </div>
    </>
  );
};
