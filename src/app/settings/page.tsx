import React from 'react';
import { authOptions, getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileUpdateForm from '@/components/ProfileUpdateForm';

const SettingsPage = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || '/sign-in');
  }

  return (
    <div className="container">
      <div className="grid items-start gap-8">
        <h2 className="font-semibold text-3xl md:text-4xl flex justify-center sm:justify-start">Settings</h2>
        <div className="w-full md:w-4/6 m-auto flex justify-center">
          <ProfileUpdateForm userId={session.user.id} currentUsername={session.user.username || ''} />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
