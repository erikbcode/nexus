'use client';
import React from 'react';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

interface UserAccountNavProps {
  user: Pick<User, 'id' | 'name' | 'image'>;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.image!} alt="userimage" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Signed in as {user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(`/user/${user.id}`)}>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="focus:bg-red-400 focus:text-white" onClick={() => signOut()}>
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
