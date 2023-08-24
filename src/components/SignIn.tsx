import React from 'react';
import { Button } from './ui/Button';
import AuthOptions from './AuthOptions';
import Link from 'next/link';

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <div>Logo</div>
        <div className="text-2xl font-semibold">Welcome Back</div>
        <div className="text-md max-w-xs mx-auto">
          By continuing, you are setting up a Nexus account agree to our User Agreement and Privacy Policy.
        </div>
        <AuthOptions />
        <p>
          New to Nexus?{' '}
          <Link className="underline underline-offset-4" href="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
