import { z } from 'zod';

export const CreateCommentValidator = z.object({
  text: z.string().min(3).max(191),
  postId: z.string(),
  replyToId: z.string().nullish(),
});
