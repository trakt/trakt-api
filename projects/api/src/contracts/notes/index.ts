import { authMetadata, builder } from '../_internal/builder.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { z } from '../_internal/z.ts';

const noteItemSchema = z
  .object({
    type: z.string().optional(),
  })
  .passthrough();

const noteMediaRequestSchema = z
  .object({
    ids: z.object({
      trakt: z.number().int().openapi({ description: 'Trakt ID' }),
    }),
  })
  .nullish();

const noteCreateRequestSchema = z.object({
  movie: noteMediaRequestSchema,
  show: noteMediaRequestSchema,
  season: noteMediaRequestSchema,
  episode: noteMediaRequestSchema,
  person: noteMediaRequestSchema,
  attached_to: z
    .object({
      type: z.enum(['history', 'collection', 'rating']),
      id: z.number().int().nullish(),
    })
    .nullish(),
  notes: z.string(),
  privacy: z.enum(['private', 'public', 'friends']).nullish(),
  spoiler: z.boolean().nullish(),
});

const noteRequestSchema = z
  .object({
    item: noteItemSchema.optional(),
    notes: z.string().optional(),
    privacy: z.string().optional(),
    spoiler: z.boolean().optional(),
  })
  .passthrough();

/** Zod schema for the note response. */
export const noteResponseSchema = z
  .object({
    id: z.number().int(),
    notes: z.string().nullable().optional(),
    privacy: z.string().optional(),
    spoiler: z.boolean().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    item: noteItemSchema.optional(),
  })
  .passthrough();

const ENTITY_LEVEL = builder.router(
  {
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
  },
  {
    pathPrefix: '/:id',
  },
);

/** ts-rest contract for the `notes` endpoints. */
export const notes = builder.router(
  {
    create: {
      summary: 'Add notes',
      description: `#### 🔒 OAuth Required 😁 Emojis
Add a new note to a movie, show, season, episode, or person. Send the media object under its own key (\`movie\`, \`show\`, \`season\`, \`episode\`, or \`person\`) with its Trakt ID in \`ids.trakt\`.

To attach the note to a history, collection, or rating entry instead, also send \`attached_to\` with its \`type\` (\`history\`, \`collection\`, or \`rating\`). For \`history\`, send the history \`id\` and no media object. \`privacy\` and \`spoiler\` only apply to these attached notes.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movie\`, \`show\`, \`season\`, \`episode\`, \`person\` | object | Media object with \`ids.trakt\`. |
| \`attached_to\` | object | Optional \`type\` and \`id\`. |
| \`notes\` * | string | The note text. |
| \`privacy\` | string | \`private\`, \`public\`, or \`friends\`. |
| \`spoiler\` | boolean | Is this a spoiler? |`,
      path: '',
      method: 'POST',
      body: noteCreateRequestSchema,
      responses: {
        201: noteResponseSchema,
      },
    },
    ...ENTITY_LEVEL,
  },
  {
    pathPrefix: '/notes',
    metadata: authMetadata('required'),
  },
);

/** The note create request payload. */
export type NoteCreateRequest = z.infer<typeof noteCreateRequestSchema>;
/** The note request payload. */
export type NoteRequest = z.infer<typeof noteRequestSchema>;
/** The note response payload. */
export type NoteResponse = z.infer<typeof noteResponseSchema>;
