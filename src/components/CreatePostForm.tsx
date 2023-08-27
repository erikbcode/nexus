'use client';
import React from 'react';
import { Session } from 'next-auth';
import UserAvatar from './ui/UserAvatar';
import { Input } from './ui/Input';
import { usePathname, useRouter } from 'next/navigation';
import { ImageIcon, LinkIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface CreatePostFormProps {
  session: Session | null;
}

const CreatePostForm = ({ session }: CreatePostFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="w-full shadow bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:border rounded-md py-6 px-4 flex flex-row gap-2 items-center">
      <UserAvatar user={{ username: session?.user.username!, image: session?.user.image! }} />
      <Input className="text-base h-10" onClick={() => router.push(`${pathname}/submit`)} placeholder="Create post" />
      <Button variant="ghost" onClick={() => router.push(`${pathname}/submit`)}>
        <ImageIcon className="dark:text-white" />
      </Button>
      <Button variant="ghost" className="dark:text-white" onClick={() => router.push(`${pathname}/submit`)}>
        <LinkIcon />
      </Button>
    </div>
  );
};

export default CreatePostForm;
