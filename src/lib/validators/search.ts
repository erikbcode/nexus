import { z } from 'zod';

export const SearchValidator = z.object({
  query: z.string(),
});

export type SearchPayload = z.infer<typeof SearchValidator>;
