import { User } from '@prisma/client';
import { User as UserIcon } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

interface UserAvatarProps {
  user: Pick<User, 'name' | 'image'>;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={user.image!} alt="User" />
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
