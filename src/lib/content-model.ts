export type ContentDateSource =
  | 'firstLearnedAt'
  | 'occurredAt'
  | 'startedAt'
  | 'publishedAt'
  | 'updatedAt';

export type ContentRecord = {
  id: string;
  collection: 'docs' | 'journal' | 'projects';
  data: Record<string, unknown>;
};

export type TimelineEvent = {
  id: string;
  title: string;
  collection: ContentRecord['collection'];
  date: Date;
  source: ContentDateSource;
};

function asDate(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

export function getContentDate(
  record: ContentRecord,
  sources: ContentDateSource[],
): { date: Date; source: ContentDateSource } | undefined {
  for (const source of sources) {
    const date = asDate(record.data[source]);
    if (date) return { date, source };
  }
  return undefined;
}

export function sortByDateDescending<T extends { date: Date }>(items: T[]): T[] {
  return [...items].sort((left, right) => right.date.valueOf() - left.date.valueOf());
}

export function buildTimeline(records: ContentRecord[]): TimelineEvent[] {
  const events = records.flatMap((record) => {
    const configuredSources: ContentDateSource[] =
      record.collection === 'docs'
        ? ['firstLearnedAt', 'publishedAt', 'updatedAt']
        : record.collection === 'journal'
          ? ['occurredAt', 'publishedAt', 'updatedAt']
          : ['startedAt', 'publishedAt', 'updatedAt'];
    const resolved = getContentDate(record, configuredSources);
    if (!resolved) return [];
    return [
      {
        id: record.id,
        title: String(record.data.title ?? record.id),
        collection: record.collection,
        date: resolved.date,
        source: resolved.source,
      },
    ];
  });

  return sortByDateDescending(events);
}

export function buildActivityMap(records: ContentRecord[]): Map<string, number> {
  const activity = new Map<string, number>();

  for (const record of records) {
    const sources: ContentDateSource[] =
      record.collection === 'docs'
        ? ['firstLearnedAt', 'updatedAt']
        : record.collection === 'journal'
          ? ['occurredAt']
          : ['startedAt', 'updatedAt'];

    for (const source of sources) {
      const date = asDate(record.data[source]);
      if (!date) continue;
      const key = date.toISOString().slice(0, 10);
      activity.set(key, (activity.get(key) ?? 0) + 1);
    }
  }

  return activity;
}
