'use client';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/use-toast';
import { CreateSubnexusPayload } from '@/lib/validators/subnexus';
import { Input } from '@/components/ui/Input';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [input, setInput] = useState('');

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubnexusPayload = {
        name: input,
      };

      const response = await fetch('/api/subnexus', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      return data.name as string;
    },
    onError: (err: Response) => {
      if (err.status === 409) {
        return toast({
          title: 'Subnexus already exists.',
          description: 'Please choose a different subnexus name.',
          variant: 'destructive',
        });
      }

      if (err.status === 401) {
        return toast({
          title: 'Login required.',
          description: 'You need to be logged in to do that.',
          variant: 'destructive',
        });
      }

      if (err.status === 400) {
        return toast({
          title: 'Invalid subnexus name.',
          description: 'Please choose a name between 3 and 21 characters.',
          variant: 'destructive',
        });
      }

      return toast({
        title: 'There was an error.',
        description: 'Could not create subnexus',
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      router.push(`/n/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto border-zinc-400">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-gray-200 font-black h-px" />

        <div className="space-y-2">
          <p className="text-xl font-semibold">Name</p>
          <p className="text-sm pb-2">Community names including capitalization cannot be changed.</p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">n/</p>
            <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6" />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button disabled={isLoading} variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button isLoading={isLoading} disabled={input.length === 0} onClick={() => createCommunity()}>
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
