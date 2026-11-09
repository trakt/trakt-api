import { socialIdsResponseSchema } from '../../../_internal/response/socialIdsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the social ids of a person. */
export const personSocialIdsResponseSchema = socialIdsResponseSchema.extend({
  /**
   * TikTok handle without the leading `@`.
   */
  tiktok: z.string().nullish(),
  /**
   * YouTube channel id, starting with `UC`.
   */
  youtube: z.string().nullish(),
  /**
   * Wikidata entity id, like `Q43416`.
   */
  wikidata: z.string().nullish(),
  /**
   * Language code of the Wikipedia page in `wikipedia`.
   */
  wikipedia_language: z.string().nullish(),
});
