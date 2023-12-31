'use client';
import React from 'react';
import { User } from '@prisma/client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import UserAvatar from './ui/UserAvatar';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';

interface UserAccountNavProps {
  user: Pick<User, 'id' | 'username' | 'image'>;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const { setTheme } = useTheme();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none rounded-full border-4 border-zinc-100 dark:border-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-500">
        <UserAvatar user={{ username: user.username!, image: user.image! }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Signed in as {`${user.username!}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/u/${user.username}`)}>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Select Theme</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
              <SunIcon className="h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
              <MoonIcon className="h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => router.push(`/settings`)}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-red-400 focus:text-white" onClick={() => signOut()}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
