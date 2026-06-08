import { z } from '../../../_internal/z.ts';

export const plexAccountSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const plexLibrarySchema = z.object({
  id: z.number().int(),
  uuid: z.string(),
  type: z.string(),
  title: z.string(),
  agent: z.string(),
  scanner: z.string(),
  selected: z.boolean().openapi({
    description:
      "Whether this library is in the user's current sync selection.",
  }),
  url: z.string(),
});

export const plexServerAccountsResponseSchema = z.object({
  accounts: plexAccountSchema.array().openapi({
    description:
      'Home accounts on the server; empty for servers the user does not own.',
  }),
  libraries: plexLibrarySchema.array(),
});
