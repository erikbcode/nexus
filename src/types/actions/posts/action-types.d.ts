import { ClientPost } from '@/types/db';

export type GetSinglePostResponse = {
  status: number;
  data: ClientPost | null;
};

export type GetPostsResponse = {
  status: number;
  data: ClientPost[];
};
