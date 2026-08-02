import { builder } from '../_internal/builder.ts';
import type { z } from '../_internal/z.ts';
import { teamMemberResponseSchema } from './schema/response/teamMemberResponseSchema.ts';

/** ts-rest contract for the `team` endpoints. */
export const team = builder.router({
  members: {
    summary: 'Get team members',
    description: 'Returns Trakt team members with their full profile details.',
    path: '/',
    method: 'GET',
    responses: {
      200: teamMemberResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/team',
});

export { teamMemberResponseSchema };
/** The team member response payload. */
export type TeamMemberResponse = z.infer<typeof teamMemberResponseSchema>;
