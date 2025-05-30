import { z } from '../z.ts';

export const crewPositionResponseSchema = z.enum([
  'acting',
  'production',
  'art',
  'crew',
  'costume & make-up',
  'directing',
  'writing',
  'sound',
  'camera',
  'lighting',
  'visual effects',
  'editing',
  'creator',
  'created by',
]).forceString();
