'use client';
import React, { useState } from 'react';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { CreatePostPayload } from '@/lib/validators/post';
import { toast } from '../hooks/use-toast';
import { authToast } from '@/hooks/use-custom-toasts';
import { useRouter } from 'next/navigation';

interface EditorProps {
  subnexusName: string;
}

const Editor = ({ subnexusName }: EditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const { mutate: submitPost, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreatePostPayload = {
        title,
        content,
        subnexusName,
      };

      const response = await fetch('/api/subnexus/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          subnexusName,
        }),
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      return data.id as string;
    },
    onError: (err: Response) => {
      if (err.status === 401) {
        return authToast();
      }
      if (err.status === 404) {
        return toast({
          title: 'Subnexus does not exist.',
          description: 'Please post to an existing subnexus.',
          variant: 'destructive',
        });
      }
      if (err.status === 400) {
        return toast({
          title: 'Invalid post content.',
          description:
            'Please enter a valid title between 3 and 21 characters, and content between 3 and 500 characters.',
          variant: 'destructive',
        });
      }
      toast({
        title: 'There was an error.',
        description: 'Could not create post. Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.push(`/n/${subnexusName}`);
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Label className="text-xl">Title</Label>
        <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label className="text-xl">Post Content</Label>
        <Textarea placeholder="Content" onChange={(e) => setContent(e.target.value)} />
      </div>
      <Button className="w-fit" onClick={() => submitPost()}>
        Submit Post
      </Button>
    </div>
  );
};
export default Editor;
