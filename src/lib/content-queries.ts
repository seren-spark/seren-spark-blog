import {
  buildActivityMap,
  buildTimeline,
  type ContentRecord,
  type TimelineEvent,
} from './content-model';

export type JournalEntryLike = {
  id: string;
  data: {
    occurredAt: Date;
  };
};

export type ContentEntryLike = {
  id: string;
  body?: string;
  data: object;
};

export type ContentCollectionsInput = {
  docs: readonly ContentEntryLike[];
  journal: readonly ContentEntryLike[];
  projects: readonly ContentEntryLike[];
};

export function sortJournalEntries<T extends JournalEntryLike>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (left, right) => right.data.occurredAt.valueOf() - left.data.occurredAt.valueOf(),
  );
}

export function groupEntriesByYear<T extends JournalEntryLike>(
  entries: readonly T[],
): Map<number, T[]> {
  const groups = new Map<number, T[]>();

  for (const entry of sortJournalEntries(entries)) {
    const year = entry.data.occurredAt.getUTCFullYear();
    const yearEntries = groups.get(year) ?? [];
    yearEntries.push(entry);
    groups.set(year, yearEntries);
  }

  return groups;
}

function toRecords(
  collection: ContentRecord['collection'],
  entries: readonly ContentEntryLike[],
): ContentRecord[] {
  return entries.map((entry) => ({
    id: entry.id,
    collection,
    data: entry.data as Record<string, unknown>,
  }));
}

export function mergeContentCollections(input: ContentCollectionsInput): ContentRecord[] {
  return [
    ...toRecords('docs', input.docs),
    ...toRecords('journal', input.journal),
    ...toRecords('projects', input.projects),
  ];
}

export function buildTimelineFromCollections(input: ContentCollectionsInput): TimelineEvent[] {
  return buildTimeline(mergeContentCollections(input));
}

export type ActivityPoint = { date: string; count: number };

export function buildActivitySeries(records: readonly ContentRecord[]): ActivityPoint[] {
  return [...buildActivityMap([...records]).entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, count]) => ({ date, count }));
}

export function filterEntriesByTag<T extends ContentEntryLike>(
  entries: readonly T[],
  tag: string,
): T[] {
  const normalizedTag = tag.trim().toLocaleLowerCase();
  if (!normalizedTag) return [];

  return entries.filter((entry) => {
    const tags = (entry.data as { tags?: unknown }).tags;
    return (
      Array.isArray(tags) &&
      tags.some(
        (candidate) =>
          typeof candidate === 'string' && candidate.trim().toLocaleLowerCase() === normalizedTag,
      )
    );
  });
}

export type HomeData = {
  stats: {
    notes: number;
    journal: number;
    projects: number;
    total: number;
  };
  timeline: TimelineEvent[];
  recent: TimelineEvent[];
  activity: ActivityPoint[];
  insights: {
    wordCount: number;
    recordSpanDays: number;
    focusTags: string[];
  };
};

function countMarkdownWords(markdown: string): number {
  const readableText = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|=-]/g, ' ');
  const hanCharacters = readableText.match(/\p{Script=Han}/gu)?.length ?? 0;
  const latinWords = readableText.match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g)?.length ?? 0;
  return hanCharacters + latinWords;
}

export function buildHomeData(
  input: ContentCollectionsInput,
  recentLimit = 5,
): HomeData {
  const records = mergeContentCollections(input);
  const timeline = buildTimeline(records);
  const safeLimit = Math.max(0, Math.trunc(recentLimit));
  const datedTimes = timeline.map((event) => event.date.valueOf());
  const recordSpanDays = datedTimes.length > 0
    ? Math.max(1, Math.floor((Math.max(...datedTimes) - Math.min(...datedTimes)) / 86_400_000) + 1)
    : 0;
  const wordCount = [...input.docs, ...input.journal, ...input.projects]
    .reduce((total, entry) => total + countMarkdownWords(entry.body ?? ''), 0);
  const focusTags = buildTagIndex(input)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'zh-CN'))
    .slice(0, 3)
    .map((tag) => tag.label);

  return {
    stats: {
      notes: input.docs.length,
      journal: input.journal.length,
      projects: input.projects.length,
      total: records.length,
    },
    timeline,
    recent: timeline.slice(0, safeLimit),
    activity: buildActivitySeries(records),
    insights: { wordCount, recordSpanDays, focusTags },
  };
}

export type TagIndexItem = {
  label: string;
  slug: string;
  count: number;
  entries: ContentRecord[];
};

function normalizeTag(tag: string): string {
  return tag.trim().toLocaleLowerCase();
}

function tagSlug(tag: string): string {
  return normalizeTag(tag).replace(/\s+/g, '-').replace(/[\\/]+/g, '-');
}

export function buildTagIndex(input: ContentCollectionsInput): TagIndexItem[] {
  const groups = new Map<string, TagIndexItem>();

  for (const record of mergeContentCollections(input)) {
    const tags = record.data.tags;
    if (!Array.isArray(tags)) continue;

    const seenOnRecord = new Set<string>();
    for (const candidate of tags) {
      if (typeof candidate !== 'string') continue;
      const key = normalizeTag(candidate);
      if (!key || seenOnRecord.has(key)) continue;
      seenOnRecord.add(key);

      const existing = groups.get(key);
      if (existing) {
        existing.count += 1;
        existing.entries.push(record);
      } else {
        groups.set(key, {
          label: candidate.trim(),
          slug: tagSlug(candidate),
          count: 1,
          entries: [record],
        });
      }
    }
  }

  return [...groups.values()];
}

export type RelationIssue = {
  sourceCollection: 'journal' | 'projects';
  sourceId: string;
  field: 'relatedDocs' | 'relatedJournal';
  targetId: string;
};

function stringList(data: object, field: string): string[] {
  const value = (data as Record<string, unknown>)[field];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export function validateContentRelations(input: ContentCollectionsInput): RelationIssue[] {
  const docIds = new Set(input.docs.map((entry) => entry.id));
  const journalIds = new Set(input.journal.map((entry) => entry.id));
  const issues: RelationIssue[] = [];

  for (const entry of input.journal) {
    for (const targetId of stringList(entry.data, 'relatedDocs')) {
      if (!docIds.has(targetId)) {
        issues.push({
          sourceCollection: 'journal',
          sourceId: entry.id,
          field: 'relatedDocs',
          targetId,
        });
      }
    }
  }

  for (const entry of input.projects) {
    for (const targetId of stringList(entry.data, 'relatedDocs')) {
      if (!docIds.has(targetId)) {
        issues.push({
          sourceCollection: 'projects',
          sourceId: entry.id,
          field: 'relatedDocs',
          targetId,
        });
      }
    }

    for (const targetId of stringList(entry.data, 'relatedJournal')) {
      if (!journalIds.has(targetId)) {
        issues.push({
          sourceCollection: 'projects',
          sourceId: entry.id,
          field: 'relatedJournal',
          targetId,
        });
      }
    }
  }

  return issues;
}
