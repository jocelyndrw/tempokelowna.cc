import { getCollection } from 'astro:content';

export const requiredSectionIds = [
  'about',
  'benefits',
  'licensing',
  'join-us',
  'wnr',
  'social-rides',
  'conduct',
] as const;

export type SectionId = (typeof requiredSectionIds)[number];

export async function getSections() {
  const entries = await getCollection('sections');
  const byId = new Map<SectionId, (typeof entries)[number]>();
  const duplicates: string[] = [];

  for (const entry of entries) {
    const id = entry.data.section;
    if (byId.has(id)) duplicates.push(id);
    else byId.set(id, entry);
  }

  const missing = requiredSectionIds.filter((id) => !byId.has(id));
  if (duplicates.length || missing.length || entries.length !== requiredSectionIds.length) {
    const details = [
      duplicates.length ? `duplicate section ids: ${[...new Set(duplicates)].join(', ')}` : '',
      missing.length ? `missing sections: ${missing.join(', ')}` : '',
      entries.length !== requiredSectionIds.length
        ? `expected ${requiredSectionIds.length} Markdown sections, found ${entries.length}`
        : '',
    ].filter(Boolean).join('; ');
    throw new Error(`Invalid homepage section content: ${details}`);
  }

  return Object.fromEntries(
    requiredSectionIds.map((id) => [id, byId.get(id)!]),
  ) as Record<SectionId, (typeof entries)[number]>;
}
