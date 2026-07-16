import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedPeopleQuerySchema } from '../_internal/request/extendedPeopleQuerySchema.ts';
import { extendedProfileQuerySchema } from '../_internal/request/extendedProfileQuerySchema.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { refreshQuerySchema } from '../_internal/request/refreshQuerySchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { listSortSchema } from '../_internal/response/listSortSchema.ts';
import { listTypeSchema } from '../_internal/response/listTypeSchema.ts';
import { z } from '../_internal/z.ts';
import { peopleReportRequestSchema } from './schema/request/peopleReportRequestSchema.ts';
import { peopleMovieCreditsResponseSchema } from './schema/response/peopleMovieCreditsResponseSchema.ts';
import { peopleShowCreditsResponseSchema } from './schema/response/peopleShowCreditsResponseSchema.ts';
import { personResponseSchema } from './schema/response/personResponseSchema.ts';

const startDateParamsSchema = z.object({
  start_date: z.string().describe('UTC date to start checking for updates.'),
});

const personUpdatedResponseSchema = z.object({
  updated_at: z.string().datetime(),
  person: personResponseSchema,
});

const ENTITY_LEVEL = builder.router({
  summary: {
    summary: 'Get a single person',
    description: `#### ✨ Extended Info
Returns a single person's details.

#### Gender
If available, the \`gender\` property will be set to \`male\`, \`female\`, or \`non_binary\`.

#### Known For Department
If available, the \`known_for_department\` property will be set to \`production\`, \`art\`, \`crew\`, \`costume & make-up\`, \`directing\`, \`writing\`, \`sound\`, \`camera\`, \`visual effects\`, \`lighting\`, or \`editing\`. Many people have credits across departments, \`known_for\` allows you to select their default credits more accurately.`,
    path: '/',
    pathParams: idParamsSchema,
    query: extendedPeopleQuerySchema,
    method: 'GET',
    responses: {
      200: personResponseSchema,
    },
  },
  movies: {
    summary: 'Get movie credits',
    description: `#### ✨ Extended Info
Returns all movies where this person is in the \`cast\` or \`crew\`. Each \`cast\` object will have a \`characters\` array and a standard \`movie\` object.

The \`crew\` object will be broken up by department into \`production\`, \`art\`, \`crew\`, \`costume & make-up\`, \`directing\`, \`writing\`, \`sound\`, \`camera\`, \`visual effects\`, \`lighting\`, and \`editing\` (if there are people for those crew positions). Each of those members will have a \`jobs\` array and a standard \`movie\` object.`,
    path: '/movies',
    pathParams: idParamsSchema,
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: peopleMovieCreditsResponseSchema,
    },
  },
  shows: {
    summary: 'Get show credits',
    description: `#### ✨ Extended Info
Returns all shows where this person is in the \`cast\` or \`crew\`, including the \`episode_count\` for which they appear. Each \`cast\` object will have a \`characters\` array and a standard \`show\` object. If \`series_regular\` is \`true\`, this person is a series regular and not simply a guest star.

The \`crew\` object will be broken up by department into \`production\`, \`art\`, \`crew\`, \`costume & make-up\`, \`directing\`, \`writing\`, \`sound\`, \`camera\`, \`visual effects\`, \`lighting\`, \`editing\`, and \`created  by\` (if there are people for those crew positions). Each of those members will have a \`jobs\` array and a standard \`show\` object.`,
    path: '/shows',
    pathParams: idParamsSchema,
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: peopleShowCreditsResponseSchema,
    },
  },
  lists: {
    summary: 'Get lists containing this person',
    description: `#### 📄 Pagination 😁 Emojis

Returns all lists that contain this person. By default, \`personal\` lists are returned sorted by the most \`popular\`.`,
    path: '/lists/:type/:sort',
    method: 'GET',
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema),
    pathParams: idParamsSchema
      .merge(listSortSchema)
      .merge(listTypeSchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  report: {
    summary: 'Report a person',
    description: `#### 🔒 OAuth Required
Report a person for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per person.

| reason | description |
|---|---|
| \`duplicate\` | Duplicate of another person on Trakt |
| \`remove\` | Should be removed from Trakt |
| \`data_refresh\` | Request a full metadata refresh |
| \`metadata\` | Metadata is wrong (name, biography, etc) |
| \`adult\` | Marked as adult when it shouldn't be (or vice versa) |
| \`language\` | Not in English |
| \`spam\` | Spam or fake person |
| \`tmdb\` | Should use TMDB as the datasource |
| \`other\` | Anything else (add details in \`message\`) |`,
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema,
    body: peopleReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
  refresh: {
    summary: 'Refresh person metadata',
    description: `#### 🔥 VIP Only 🔒 OAuth Required
Queue a full metadata refresh for a person. Pass \`images=true\` to also refresh the person's images.`,
    path: '/refresh',
    method: 'POST',
    query: refreshQuerySchema,
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      201: z.undefined(),
    },
  },
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  updates: {
    summary: 'Get recently updated people',
    description:
      'Returns all people updated since the specified UTC date. We recommend storing the latest `updated_at` locally and using it for the next request.',
    path: '/updates/:start_date',
    method: 'GET',
    pathParams: startDateParamsSchema,
    query: extendedPeopleQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: personUpdatedResponseSchema.array(),
    },
  },
  updatedIds: {
    summary: 'Get recently updated people Trakt IDs',
    description:
      'Returns Trakt IDs for people updated since the specified UTC date.',
    path: '/updates/id/:start_date',
    method: 'GET',
    pathParams: startDateParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: z.number().int().array(),
    },
  },
});

/** ts-rest contract for the `people` endpoints. */
export const people = builder.router({
  ...GLOBAL_LEVEL,
  ...ENTITY_LEVEL,
}, {
  pathPrefix: '/people',
});

export { personResponseSchema };
/** The person response payload. */
export type PersonResponse = z.infer<
  typeof personResponseSchema
>;

export { peopleMovieCreditsResponseSchema };

export { peopleShowCreditsResponseSchema };

export { peopleReportRequestSchema };
/** The people report request payload. */
export type PeopleReportRequest = z.infer<typeof peopleReportRequestSchema>;
/** The people movie credits response payload. */
export type PeopleMovieCreditsResponse = z.infer<
  typeof peopleMovieCreditsResponseSchema
>;
/** The people show credits response payload. */
export type PeopleShowCreditsResponse = z.infer<
  typeof peopleShowCreditsResponseSchema
>;
