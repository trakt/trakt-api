import { builder } from '../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import type { z } from '../_internal/z.ts';
import { teamMemberResponseSchema } from './schema/response/teamMemberResponseSchema.ts';

export const team = builder.router({
  members: {
    path: '/',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>(),
    responses: {
      200: teamMemberResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/team',
});

export { teamMemberResponseSchema };
export type TeamMemberResponse = z.infer<typeof teamMemberResponseSchema>;
