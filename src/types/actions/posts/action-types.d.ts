import { ClientPost } from '@/types/db';

export type GetPostsResponse = {
  status: number;
  data: ClientPost[];
};
