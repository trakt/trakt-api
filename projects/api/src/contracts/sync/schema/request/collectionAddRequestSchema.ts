import { mediaItemsRequestSchemaFactory } from '../../../_internal/request/mediaItemsRequestSchemaFactory.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the collection add request. */
export const collectionAddRequestSchema = mediaItemsRequestSchemaFactory({
  collected_at: z
    .union([z.string().datetime(), z.enum(['released', 'unknown', 'now'])])
    .nullish()
    .openapi({
      description:
        'When the item was collected: a UTC datetime, `released` for its release date, `unknown` for no specific date, or `now` for the current time. Defaults to the stored date, else now.',
    }),
  media_type: z
    .enum([
      'digital',
      'bluray',
      'hddvd',
      'dvd',
      'vcd',
      'vhs',
      'betamax',
      'laserdisc',
    ])
    .nullish(),
  resolution: z
    .enum([
      'uhd_4k',
      'hd_1080p',
      'hd_1080i',
      'hd_720p',
      'sd_480p',
      'sd_480i',
      'sd_576p',
      'sd_576i',
    ])
    .nullish(),
  hdr: z.enum(['dolby_vision', 'hdr10', 'hdr10_plus', 'hlg']).nullish(),
  audio: z
    .enum([
      'lpcm',
      'mp3',
      'mp2',
      'aac',
      'ogg',
      'ogg_opus',
      'wma',
      'flac',
      'dts',
      'dts_ma',
      'dts_hr',
      'dts_x',
      'auro_3d',
      'dolby_digital',
      'dolby_digital_plus',
      'dolby_digital_plus_atmos',
      'dolby_atmos',
      'dolby_truehd',
      'dolby_prologic',
    ])
    .nullish(),
  audio_channels: z
    .enum([
      '1.0',
      '2.0',
      '2.1',
      '3.0',
      '3.1',
      '4.0',
      '4.1',
      '5.0',
      '5.1',
      '5.1.2',
      '5.1.4',
      '6.1',
      '7.1',
      '7.1.2',
      '7.1.4',
      '9.1',
      '10.1',
    ])
    .nullish(),
  '3d': z.boolean().nullish(),
});
