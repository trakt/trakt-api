import { z } from '../../../_internal/z.ts';

export const plexSyncRequestSchema = z.object({
  server_id: z.string().optional().openapi({
    description:
      'Sync this server; omit to sync every server in the saved selection.',
  }),
  all_data: z.boolean().optional().openapi({
    description:
      'When true, re-pulls full history; otherwise an incremental sync.',
  }),
});
