'use client';
import { toast } from '@/hooks/use-toast';
import { deletePost } from '@/lib/actions/posts/actions';
import { MoreHorizontal, User, XCircle } from 'lucide-react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/DropdownMenu';

type PostOptionsProps = {
  session: Session | null;
  postId: string;
  authorId: string;
  authorUsername: string;
};

const PostOptions = ({ session, postId, authorId, authorUsername }: PostOptionsProps) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push(`/u/${authorUsername}`)}>
          <User className="mr-2 h-4 w-4" />
          <span>u/{authorUsername}</span>
        </DropdownMenuItem>
        {authorId === session?.user.id && (
          <DropdownMenuItem onClick={() => handleDelete()} className="focus:text-red-400">
            <XCircle className="mr-2 h-4 w-4" />
            <span>Delete Post</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostOptions;
