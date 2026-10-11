import { builder } from '../../_internal/builder.ts';
import { z } from '../../_internal/z.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { smartListDraftsSummaryResponseSchema } from '../schema/response/smartListDraftsSummaryResponseSchema.ts';

/** ts-rest contract for the `smartListDrafts` endpoints. */
export const smartListDrafts = builder.router({
  summary: {
    summary: 'Get lists ready to become smart lists',
    description: `#### 🔒 OAuth Required
Returns how many of your personal lists that stopped updating (see \`stale_origin\` on a list) have a ready-made smart list setup, the best setup's \`confidence\`, and the top three of those lists. Only the owner can read it.

Lists are counted when their setup's \`confidence\` is 0.5 or more and they haven't been converted yet. With none, it returns \`convertible_count: 0\` and \`best_confidence: null\`.`,
    path: '',
    method: 'GET',
    pathParams: profileParamsSchema,
    responses: {
      200: smartListDraftsSummaryResponseSchema,
      401: z.undefined(),
      404: z.undefined(),
    },
  },
}, {
  pathPrefix: '/:id/smart-list-drafts',
});
