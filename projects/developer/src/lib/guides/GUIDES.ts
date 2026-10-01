import { GUIDE_SOURCES } from './GUIDE_SOURCES.ts';
import { parseGuideContents } from './parseGuideContents.ts';

export const GUIDES: ReadonlyArray<{ title: string; slug: string }> =
  parseGuideContents(GUIDE_SOURCES.get('contents') ?? '').flatMap((group) =>
    group.items
  );
