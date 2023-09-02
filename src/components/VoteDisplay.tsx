'use client';
import { toast } from '@/hooks/use-toast';
import { updateVote } from '@/lib/actions/posts/actions';
import { VoteType } from '@prisma/client';
import { useState } from 'react';
import { Button } from './ui/Button';
import { ArrowBigDown, ArrowBigUp, Loader } from 'lucide-react';

interface VoteDisplayProps {
  initialVoteCount: number;
  initialVote?: VoteType | null;
  postId: string;
}

const VoteDisplay = ({ initialVoteCount, initialVote, postId }: VoteDisplayProps) => {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: VoteType) => {
    setIsLoading(true);
    const res = await updateVote({ data: { voteType, postId } });
    const variant = res.status === 200 ? 'default' : 'destructive';
    if (res.status === 200) {
      // Vote was successful, so update state
      setCurrentVote(res.data.newVoteType);
      setVoteCount(voteCount + res.data.updateCount!);
    }

    setIsLoading(false);

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
    <div className="flex flex-row md:flex-col md:mr-2 justify-center items-center gap-0 md:gap-3">
      <Button
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className={`group`}
        onClick={() => handleVote(VoteType.UP)}
      >
        <ArrowBigUp className={`${upvoteClass} w-5 h-5 md:w-6 md:h-6`} />
      </Button>
      <div className="w-4 md:h-4 flex items-center justify-center">
        {isLoading ? (
          <Loader className="animate-spin w-full h-full" />
        ) : (
          <p className="font-semibold text-xs md:text-base">{voteCount}</p>
        )}
      </div>

      <Button
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className="dark:text-white group"
        onClick={() => handleVote(VoteType.DOWN)}
      >
        <ArrowBigDown className={`${downvoteClass} w-5 h-5 md:w-6 md:h-6`} />
      </Button>
    </div>
  );
};

export default VoteDisplay;
