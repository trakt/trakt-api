import { z } from '../../../_internal/z.ts';

export const sharingRequestSchema = z
  .object({
    twitter: z.boolean().nullish(),
    mastodon: z.boolean().nullish(),
    tumblr: z.boolean().nullish(),
  })
  .nullish()
  .describe(
    `The sharing object is optional and will apply the user's settings if not sent. 
    If sharing is sent, each key will override the user's setting for that social network. 
    Send true to post or false to not post on the indicated social network.
    You can see which social networks a user has connected with the /users/settings method.`,
  );
