import { z } from '../z.ts';

export const jobsResponseSchema = z.object({
  job: z.string(),
  jobs: z.array(z.string()),
});
