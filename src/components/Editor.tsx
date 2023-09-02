'use client';
import React, { useState } from 'react';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { toast } from '../hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createCommunityPost } from '@/lib/actions/posts/actions';

interface EditorProps {
  subnexusName: string;
}

const Editor = ({ subnexusName }: EditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMutation = async () => {
    setIsLoading(true);
    const res = await createCommunityPost({ data: { title, content, subnexusName } });
    const variant = res.status === 200 ? 'default' : 'destructive';
    if (res.status === 200) {
      router.push(`/n/${subnexusName}`);
    }
    toast({
      title: res.data.title,
      description: res.data.description,
      variant,
    });
    setIsLoading(false);
  };

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
      <Button className="w-fit" onClick={() => handleMutation()} disabled={isLoading}>
        Submit Post
      </Button>
    </div>
  );
};
export default Editor;
