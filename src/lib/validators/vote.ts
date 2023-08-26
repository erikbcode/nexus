import { z } from 'zod';

enum VoteType {
  UP = 'UP',
  DOWN = 'DOWN',
}

export const VoteValidator = z.object({
  voteType: z.enum([VoteType.UP, VoteType.DOWN]),
  postId: z.string(),
});
