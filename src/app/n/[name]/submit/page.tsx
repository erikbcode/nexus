import Editor from '@/components/Editor';
import { Label } from '@/components/ui/Label';
import React from 'react';

interface SubmitPageProps {
  params: {
    name: string;
  };
}

const Page = ({ params }: SubmitPageProps) => {
  return (
    <div className="">
      <div className="flex flex-row items-center mb-8">
        <h3 className="font-semibold text-lg">Create Post </h3>
        <p className="ml-2 font-light text-zinc-500"> in n/{params.name}</p>
      </div>
      <Editor subnexusName={params.name} />
    </div>
  );
};

export default Page;
