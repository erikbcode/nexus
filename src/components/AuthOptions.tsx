'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useToast } from '../hooks/use-toast';

const AuthOptions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      toast({
        title: 'There was a problem.',
        description: 'There was an error logging in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        className="flex flex-row w-full gap-2 items-center justify-center"
      >
        <Image width="20" height="20" src="/images/google_g_logo.png" alt="Google Logo" />
        Sign In With Google
      </Button>
    </div>
  );
};

export default AuthOptions;
