'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import { toast } from '@/hooks/use-toast';
import { changeUsername } from '@/lib/actions/user/actions';
import { useRouter } from 'next/navigation';

type ProfileUpdateFormProps = {
  currentUsername: string;
  userId: string;
};

const ProfileUpdateForm = ({ currentUsername, userId }: ProfileUpdateFormProps) => {
  const router = useRouter();

  async function clientAction(formData: FormData) {
    const res = await changeUsername(formData, userId);
    const variant = res.status !== 200 ? 'destructive' : 'default';
    const newUsername = formData.get('username');

    if (res.status === 200) {
      router.push(`/u/${newUsername}`);
    }

    return toast({
      title: res.data.title,
      description: res.data.description,
      variant,
    });
  }
  return (
    <div className="w-full">
      <form action={clientAction}>
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Update username</CardTitle>
            <CardDescription>Enter a new username</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Label>New username</Label>
              <Input id="username" name="username" type="text" placeholder="Username" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-fit ">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ProfileUpdateForm;
