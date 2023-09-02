import { User, Post, Subnexus, Vote, Comment, CommentVote } from '@prisma/client';

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
  comments: Comment[];
  commentCount: number;
};

type NestedComment = {
  id: string;
  text: string;
  postId: string;
  author: {
    username: string | null;
    image: string | null;
  };
  replies: NestedComment[];
  votes: CommentVote[];
  currentUserVote: VoteType;
  voteCount: number;
};
