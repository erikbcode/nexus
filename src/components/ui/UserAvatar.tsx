import { User } from '@prisma/client';
import { User as UserIcon } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

interface UserAvatarProps {
  user: Pick<User, 'username' | 'image'>;
  large?: boolean;
  small?: boolean;
}

const UserAvatar = ({ user, large, small }: UserAvatarProps) => {
  const username = user.username ? user.username : 'username';
  const sizeClasses = large ? 'w-20 h-20' : small ? 'w-6 h-6' : 'w-12 h-12';

  return (
    <Avatar className={sizeClasses}>
      <AvatarImage src={user.image!} alt={username} />
      <AvatarFallback>
        <UserIcon />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
