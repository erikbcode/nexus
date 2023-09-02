'use client';
import { toast } from '@/hooks/use-toast';
import { VoteType } from '@prisma/client';
import { useState } from 'react';
import { Button } from './ui/Button';
import { ArrowBigDown, ArrowBigUp, Loader } from 'lucide-react';
import { updateCommentVote } from '@/lib/actions/posts/comments/actions';

interface CommentVoteDisplayProps {
  initialVoteCount: number;
  initialVote?: VoteType | null;
  commentId: string;
}

const CommentVoteDisplay = ({ initialVoteCount, initialVote, commentId }: CommentVoteDisplayProps) => {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: VoteType) => {
    setIsLoading(true);
    const res = await updateCommentVote({ data: { voteType, commentId } });
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
    <>
      <div className="flex flex-row justify-center items-center gap-1">
        <Button
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className={`group`}
          onClick={() => handleVote(VoteType.UP)}
        >
          <ArrowBigUp className={`${upvoteClass} h-5 w-5`} />
        </Button>
        <div className="w-3 flex items-center justify-center">
          {isLoading ? <Loader className="animate-spin" /> : <p className="font-semibold text-sm">{voteCount}</p>}
        </div>

        <Button
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="dark:text-white group"
          onClick={() => handleVote(VoteType.DOWN)}
        >
          <ArrowBigDown className={`${downvoteClass} h-5 w-5`} />
        </Button>
      </div>
    </>
  );
};

export default CommentVoteDisplay;
