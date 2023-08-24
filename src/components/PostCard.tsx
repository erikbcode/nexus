import { timeSince } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  subnexus: {
    name: string;
  };
  author: {
    id: string;
    image: string | null;
    username: string | null;
  };
};

const PostCard = ({ id, content, createdAt, title, author, subnexus }: Post) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 shadow">
      {/* Author and Subnexus*/}
      <div className="flex items-center mb-2 text-zinc-500 text-start">
        <Link href={`/n/${subnexus.name}`} className="text-zinc-700 underline-offset-3 underline">
          /n/{subnexus.name}
        </Link>
        <span className="mx-2">•</span>
        <span>Posted by</span>
        <Link href={`/u/${author.username}`} className="ml-1  hover:underline">
          /u/{author.username}
        </Link>

        <span className="mx-2">•</span>
        <span>{timeSince(new Date(createdAt))}</span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      {/* Content */}
      <p className="text-lg text-gray-700">{content}</p>
    </div>
  );
};

export default PostCard;
