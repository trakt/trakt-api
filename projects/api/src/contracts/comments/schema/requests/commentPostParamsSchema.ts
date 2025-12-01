import { z } from '../../../_internal/z.ts';
import { commentReplyParamsSchema } from './commentReplyParamsSchema.ts';

const idOnlySchema = z.object({
  ids: z.object({
    trakt: z.number().int(),
  }),
}).nullish();

export const commentPostParamsSchema = commentReplyParamsSchema.and(
  z.union([
    z.object({ movie: idOnlySchema }),
    z.object({ show: idOnlySchema }),
    z.object({ season: idOnlySchema }),
    z.object({ episode: idOnlySchema }),
    z.object({ list: idOnlySchema }),
  ]),
);
