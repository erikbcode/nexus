import { z } from 'zod';

export const UsernameValidator = z.object({
  username: z.string().min(3).max(20),
});

export type ChangeUsernamePayload = z.infer<typeof UsernameValidator>;
