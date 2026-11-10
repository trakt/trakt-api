import { builder } from '../_internal/builder.ts';
import { awardCeremonyResponseSchema } from '../_internal/response/awardCeremonyResponseSchema.ts';
import { awardRefResponseSchema } from '../_internal/response/awardRefResponseSchema.ts';
import { personAwardResponseSchema } from '../_internal/response/personAwardResponseSchema.ts';
import { titleAwardResponseSchema } from '../_internal/response/titleAwardResponseSchema.ts';
import { upcomingCeremonyResponseSchema } from '../_internal/response/upcomingCeremonyResponseSchema.ts';
import type { z } from '../_internal/z.ts';

/** ts-rest contract for the `awards` endpoints. */
export const awards = builder.router(
  {
    ceremonies: {
      summary: 'Get upcoming award ceremonies',
      description: `#### 🫣 Limited Access
This endpoint is limited to official apps and may not be available to all API consumers.

Returns the next ceremony of each award, with its edition, \`year\`, \`nominations_at\` and \`held_at\` dates.`,
      path: '/ceremonies',
      method: 'GET',
      responses: {
        200: upcomingCeremonyResponseSchema.array(),
      },
    },
  },
  {
    pathPrefix: '/awards',
  },
);

/** The award response payload. */
export type AwardRefResponse = z.infer<typeof awardRefResponseSchema>;

/** The award ceremony response payload. */
export type AwardCeremonyResponse = z.infer<typeof awardCeremonyResponseSchema>;

/** The title award response payload. */
export type TitleAwardResponse = z.infer<typeof titleAwardResponseSchema>;

/** The person award response payload. */
export type PersonAwardResponse = z.infer<typeof personAwardResponseSchema>;

/** The upcoming award ceremony response payload. */
export type UpcomingCeremonyResponse = z.infer<
  typeof upcomingCeremonyResponseSchema
>;
