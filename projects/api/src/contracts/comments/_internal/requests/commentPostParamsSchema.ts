import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';

import { z } from '../../../_internal/z.ts';
import { commentReplyParamsSchema } from './commentReplyParamsSchema.ts';

const idOnlySchema = z.object({
  ids: z.object({
    trakt: z.number(),
  }),
});

export const commentPostParamsSchema = commentReplyParamsSchema.and(
  z.union([
    z.object({ movie: movieResponseSchema }),
    z.object({ show: showResponseSchema }),
    z.object({ season: idOnlySchema }),
    z.object({ episode: idOnlySchema }),
    z.object({ list: idOnlySchema }),
  ]),
);
