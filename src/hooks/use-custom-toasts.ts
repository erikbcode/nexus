import { toast } from './use-toast';

export const authToast = () => {
  return toast({
    title: 'Login required.',
    description: 'You need to be logged in to do that.',
    variant: 'destructive',
  });
};
