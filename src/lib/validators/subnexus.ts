import { z } from 'zod';

export const SubnexusValidator = z.object({
  name: z.string().min(3).max(21),
});

export const SubnexusSubscriptionValidator = z.object({
  subnexusId: z.string(),
});

export type CreateSubnexusPayload = z.infer<typeof SubnexusValidator>;
export type SubscribeToSubnexusPayload = z.infer<typeof SubnexusSubscriptionValidator>;
