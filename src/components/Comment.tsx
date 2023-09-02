'use client';
import { NestedComment } from '@/types/db';
import React, { useState } from 'react';
import { Button } from './ui/Button';
import UserAvatar from './ui/UserAvatar';
import { MessageSquare } from 'lucide-react';
import CommentVoteDisplay from './CommentVoteDisplay';
import { Textarea } from './ui/Textarea';
import { createComment } from '@/lib/actions/posts/comments/actions';
import { toast } from '@/hooks/use-toast';

type CommentProps = {
  comment: NestedComment;
  level?: number;
};

const Comment = ({ comment, level = 0 }: CommentProps) => {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState('');

  const handleReply = async () => {
    const data = {
      text: input,
      postId: comment.postId,
      replyToId: comment.id,
    };
    const res = await createComment({ data });
    const variant = res.status === 200 ? 'default' : 'destructive';

    if (res.status === 200) {
      handleClose();
    }

    return toast({
      title: res.data.title,
      description: res.data.description,
      variant,
    });
  };

  const handleClose = () => {
    setInput('');
    setShowInput(false);
  };

  const user = {
    username: comment.author.username,
    image: comment.author.image,
  };
  return (
    <div className={`pl-6 border-l-2 py-2 border-zinc-200 dark:border-zinc-600 h-full max-w-full w-full`}>
      <div className="flex flex-col items-start gap-4 h-full">
        <div className="flex flex-row gap-3">
          <UserAvatar user={user} small />
          <small className="font-semibold">u/{comment.author.username}</small>
        </div>
        <div className="text-sm">{comment.text}</div>
        <div className="flex flex-row">
          <CommentVoteDisplay
            commentId={comment.id}
            initialVoteCount={comment.voteCount}
            initialVote={comment.currentUserVote}
          />
          <Button
            variant="ghost"
            className="text-xs py-0 px-2 h-10 rounded items-center space-x-1 text-zinc-600"
            onClick={() => setShowInput(!showInput)}
          >
            <MessageSquare className="w-6 h-6" />
            <p>Reply</p>
          </Button>
          {/* {showInput && renderComments(replies, level + 1)} */}
        </div>
      </div>
      {showInput && (
        <div className="w-full">
          <div className="flex gap-2 flex-col">
            <h3 className="text-sm">Post your comment</h3>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your comment..." />
            <div className="flex flex-row self-end gap-2">
              <Button onClick={handleClose} variant="destructive" className="w-16 text-zinc-500 hover:text-zinc-200">
                Cancel
              </Button>
              <Button onClick={() => handleReply()} variant="subtle" className="w-16">
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full">{renderComments(comment.replies, level + 1)}</div>
    </div>
  );
};

export default Comment;

function renderComments(comments: NestedComment[], level = 0) {
  return comments.map((comment) => <Comment comment={comment} level={level} key={comment.id} />);
}
