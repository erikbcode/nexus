'use client';
import React, { startTransition } from 'react';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubnexusPayload } from '@/lib/validators/subnexus';
import { toast } from '../hooks/use-toast';
import { useRouter } from 'next/navigation';
import { authToast } from '@/hooks/use-custom-toasts';

interface JoinCommunityToggleProps {
  subnexusId: string;
  subnexusName: string;
  isMember: boolean;
}

const JoinCommunityToggle = ({ subnexusId, subnexusName, isMember }: JoinCommunityToggleProps) => {
  const router = useRouter();

  const { mutate: joinCommunity, isLoading: isJoinLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubnexusPayload = {
        subnexusId: subnexusId,
      };

      const response = await fetch('/api/subnexus/subscribe', {
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
      return data.subnexusId as string;
    },
    onError: (err: Response) => {
      if (err.status === 401) {
        return authToast();
      }
      if (err.status === 400) {
        return toast({
          title: 'Already subscribed.',
          description: 'You are already subscribed to this community.',
          variant: 'destructive',
        });
      }
      return toast({
        title: 'There was an error.',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: 'Subscribed!',
        description: `You are now subscribed to n/${subnexusName}`,
      });
    },
  });

  const { mutate: leaveCommunity, isLoading: isLeaveLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubnexusPayload = {
        subnexusId: subnexusId,
      };

      const response = await fetch('/api/subnexus/unsubscribe', {
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
      return data.subnexusId as string;
    },
    onError: (err: Response) => {
      if (err.status === 401) {
        return authToast();
      }
      if (err.status === 400) {
        return toast({
          title: 'Not subscribed.',
          description: 'You cannot leave a community that you are not susbcribed to.',
          variant: 'destructive',
        });
      }
      return toast({
        title: 'There was an error.',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: 'Unsubscribed!',
        description: `You are now unsubscribed from n/${subnexusName}`,
      });
    },
  });

  return isMember ? (
    <Button className="w-full" onClick={() => leaveCommunity()} disabled={isLeaveLoading}>
      Leave Community
    </Button>
  ) : (
    <Button className="w-full" onClick={() => joinCommunity()} disabled={isJoinLoading}>
      Join Community
    </Button>
  );
};

export default JoinCommunityToggle;
