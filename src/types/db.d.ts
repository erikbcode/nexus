import { User, Post, Subnexus, Vote } from '@prisma/client';

export type ClientUser = {
  username: string | null;
  image: string | null;
  id: string;
};

export type ClientPost = Post & {
  subnexus: {
    name: string;
  };
  author: ClientUser;
  votes: Vote[];
  voteCount: number;
  currentUserVote: VoteType | null;
};
