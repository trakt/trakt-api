import { z } from '../z.ts';

/** Zod schema for the jobs response. */
export const jobsResponseSchema = z.object({
  job: z.string(),
  jobs: z.array(z.string()),
});
