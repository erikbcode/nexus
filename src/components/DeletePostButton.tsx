'use client';

import { toast } from '@/hooks/use-toast';
import { deletePost } from '@/lib/actions/posts/actions';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

type DeletePostOptions = {
  postId: string;
  authorId: string;
};

const DeletePostButton = ({ postId, authorId }: DeletePostOptions) => {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await deletePost({ data: { postId, authorId } });
    const variant = res.status === 200 ? 'default' : 'destructive';
    toast({
      title: res.data.title,
      description: res.data.description,
      variant,
    });

    if (res.status === 200) {
      router.back();
    }
  };

  return (
    <Button variant="destructive" size="sm" className="text-sm" onClick={() => handleDelete()}>
      Delete Post
    </Button>
  );
};

export default DeletePostButton;
