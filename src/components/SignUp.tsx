import React from 'react';
import AuthForm from './AuthForm';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <div>Logo</div>
        <div className="text-2xl font-semibold">Sign Up</div>
        <div className="text-md max-w-xs mx-auto">
          By continuing, you are setting up a Nexus account agree to our User Agreement and Privacy Policy.
        </div>
        <AuthForm />
        <p>
          Already have an account?{' '}
          <Link className="underline underline-offset-4" href="/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
