'use client';
import React from 'react';
import { User } from 'next-auth';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Avatar } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserAccountNavProps {
  user: Pick<User, 'id' | 'name' | 'image'>;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  const router = useRouter();
  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          size="md"
          src={user.image!}
          fallback="no image"
        />
      </DropdownTrigger>
      <DropdownMenu disabledKeys={[]}>
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{user.name}</p>
        </DropdownItem>
        <DropdownItem key="settings" onClick={() => router.push(`/user/${user.id}`)}>
          My Profile
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserAccountNav;
