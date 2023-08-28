import { z } from 'zod';

export const PostValidator = z.object({
  title: z.string().min(3).max(21),
  content: z.string().min(3).max(191),
  subnexusName: z.string(),
});

export type CreatePostPayload = z.infer<typeof PostValidator>;
