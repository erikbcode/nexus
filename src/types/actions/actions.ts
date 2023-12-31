import { VoteType } from '@prisma/client';

export interface CreateCommunityPostOptions {
  data: {
    title: string;
    content: string;
    subnexusName: string;
  };
}

export interface CreateCommunityPostResponse {
  status: number;
  data: {
    title: string;
    description: string;
  };
}

export interface UpdateVoteOptions {
  data: {
    voteType: VoteType;
    postId: string;
  };
}

export interface UpdateVoteResponse {
  status: number;
  data: {
    title: string;
    description: string;
    newVoteType: 'UP' | 'DOWN' | undefined;
  };
}

export interface DeletePostOptions {
  data: {
    postId: string;
    authorId: string;
  };
}
