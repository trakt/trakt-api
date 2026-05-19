import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedPeopleQuerySchema } from '../_internal/request/extendedPeopleQuerySchema.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { peopleReportRequestSchema } from './schema/request/peopleReportRequestSchema.ts';
import { peopleMovieCreditsResponseSchema } from './schema/response/peopleMovieCreditsResponseSchema.ts';
import { peopleShowCreditsResponseSchema } from './schema/response/peopleShowCreditsResponseSchema.ts';
import { personResponseSchema } from './schema/response/personResponseSchema.ts';

export const people = builder.router({
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
}, {
  pathPrefix: '/people/:id',
});

export { personResponseSchema };
export type PersonResponse = z.infer<
  typeof personResponseSchema
>;

export { peopleMovieCreditsResponseSchema };

export { peopleShowCreditsResponseSchema };

export { peopleReportRequestSchema };
export type PeopleReportRequest = z.infer<typeof peopleReportRequestSchema>;
export type PeopleMovieCreditsResponse = z.infer<
  typeof peopleMovieCreditsResponseSchema
>;
export type PeopleShowCreditsResponse = z.infer<
  typeof peopleShowCreditsResponseSchema
>;
