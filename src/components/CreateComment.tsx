'use client';
import React, { useState } from 'react';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { createComment } from '@/lib/actions/posts/comments/actions';
import { toast } from '@/hooks/use-toast';

type CreateCommentProps = {
  postId: string;
  replyToId: string | null;
};

const CreateComment = ({ postId, replyToId }: CreateCommentProps) => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handlePost = async () => {
    const data = {
      text: input,
      postId,
      replyToId,
    };
    const res = await createComment({ data });
    const variant = res.status === 200 ? 'default' : 'destructive';
    return toast({
      title: res.data.title,
      description: res.data.description,
      variant,
    });
  };

  return (
    <div className="space-y-2 my-4">
      <h3 className="text-sm">Post your comment</h3>
      <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your comment..." />
      <Button onClick={() => handlePost()} className="px-4 float-right">
        Post
      </Button>
    </div>
  );
};

export default CreateComment;
