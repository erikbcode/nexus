import React from 'react';

interface ProfilePageProps {
  params: {
    username: string;
  };
}
const Page = ({ params }: ProfilePageProps) => {
  return <div>Page</div>;
};

export default Page;
