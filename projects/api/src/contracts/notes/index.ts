import { authMetadata, builder } from '../_internal/builder.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { z } from '../_internal/z.ts';

const noteItemSchema = z.object({
  type: z.string().optional(),
}).passthrough();

const noteRequestSchema = z.object({
  item: noteItemSchema.optional(),
  notes: z.string().optional(),
  privacy: z.string().optional(),
  spoiler: z.boolean().optional(),
}).passthrough();

/** Zod schema for the note response. */
export const noteResponseSchema = z.object({
  id: z.number().int(),
  notes: z.string().nullable().optional(),
  privacy: z.string().optional(),
  spoiler: z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  item: noteItemSchema.optional(),
}).passthrough();

const ENTITY_LEVEL = builder.router({
  summary: {
    summary: 'Get a note',
    description: 'Returns a single note.',
    path: '',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: noteResponseSchema,
    },
  },
  update: {
    summary: 'Update a note',
    description: 'Update a single note.',
    path: '',
    method: 'PUT',
    pathParams: idParamsSchema,
    body: noteRequestSchema,
    responses: {
      200: noteResponseSchema,
    },
  },
  delete: {
    summary: 'Delete a note',
    description: 'Delete a single note.',
    path: '',
    method: 'DELETE',
    pathParams: idParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  item: {
    summary: 'Get the attached item',
    description:
      'Returns the media item this note is attached to. The media type can be `movie`, `show`, `season`, `episode`, `person`, or `list` and it also returns the standard media object for that media type.',
    path: '/item',
    method: 'GET',
    pathParams: idParamsSchema,
    responses: {
      200: noteItemSchema,
    },
  },
}, {
  pathPrefix: '/:id',
});

/** ts-rest contract for the `notes` endpoints. */
export const notes = builder.router({
  create: {
    summary: 'Add notes',
    description: `#### 🔒 OAuth Required 😁 Emojis
Add a new note to a movie, show, season, episode, person, or list.`,
    path: '',
    method: 'POST',
    body: noteRequestSchema,
    responses: {
      201: noteResponseSchema,
    },
  },
  ...ENTITY_LEVEL,
}, {
  pathPrefix: '/notes',
  metadata: authMetadata('required'),
});

/** The note request payload. */
export type NoteRequest = z.infer<typeof noteRequestSchema>;
/** The note response payload. */
export type NoteResponse = z.infer<typeof noteResponseSchema>;
