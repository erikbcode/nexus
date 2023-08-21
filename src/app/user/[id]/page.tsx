import { useParams } from 'next/navigation';
import React from 'react';

type UserProfileProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: UserProfileProps) => {
  return (
    <div>
      <p>{params.id} Profile</p>
    </div>
  );
};

export default Page;
