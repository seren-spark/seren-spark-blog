import { describe, expect, it } from 'vitest';
import {
  buildActivitySeries,
  buildHomeData,
  buildTagIndex,
  buildTimelineFromCollections,
  filterEntriesByTag,
  groupEntriesByYear,
  sortJournalEntries,
  validateContentRelations,
} from '../src/lib/content-queries';

const journalEntry = (id: string, occurredAt: string) => ({
  id,
  data: { title: id, occurredAt: new Date(occurredAt) },
});

describe('content queries', () => {
  it('sorts journal entries by their actual occurred date', () => {
    const entries = [journalEntry('old', '2023-01-01'), journalEntry('new', '2026-09-09')];

    expect(sortJournalEntries(entries).map((entry) => entry.id)).toEqual(['new', 'old']);
  });

  it('groups journal entries by calendar year', () => {
    const groups = groupEntriesByYear([
      journalEntry('new', '2026-09-09'),
      journalEntry('old', '2023-01-01'),
    ]);

    expect([...groups.keys()]).toEqual([2026, 2023]);
    expect(groups.get(2023)?.map((entry) => entry.id)).toEqual(['old']);
  });

  it('combines all content collections for the timeline', () => {
    const timeline = buildTimelineFromCollections({
      docs: [{ id: 'doc', data: { title: 'Doc', firstLearnedAt: new Date('2023-01-01') } }],
      journal: [journalEntry('journal', '2026-09-09')],
      projects: [],
    });

    expect(timeline.map((event) => event.id)).toEqual(['journal', 'doc']);
  });

  it('serializes activity maps into sorted page data', () => {
    const series = buildActivitySeries([
      { id: 'doc', collection: 'docs', data: { firstLearnedAt: new Date('2023-01-01') } },
      { id: 'journal', collection: 'journal', data: { occurredAt: new Date('2026-09-09') } },
    ]);

    expect(series).toEqual([
      { date: '2023-01-01', count: 1 },
      { date: '2026-09-09', count: 1 },
    ]);
  });

  it('filters entries by tag without changing their order', () => {
    const entries = [
      { ...journalEntry('java', '2026-09-09'), data: { ...journalEntry('java', '2026-09-09').data, tags: ['Java'] } },
      { ...journalEntry('astro', '2026-09-08'), data: { ...journalEntry('astro', '2026-09-08').data, tags: ['Astro'] } },
    ];

    expect(filterEntriesByTag(entries, 'java').map((entry) => entry.id)).toEqual(['java']);
  });

  it('builds all homepage data from one collection input', () => {
    const home = buildHomeData({
      docs: [{ id: 'doc', body: '# 你好', data: { title: 'Doc', firstLearnedAt: new Date('2023-01-01'), tags: ['Astro'] } }],
      journal: [{ ...journalEntry('journal', '2026-09-09'), body: '`ignored` Astro blog', data: { ...journalEntry('journal', '2026-09-09').data, tags: ['astro'] } }],
      projects: [{ id: 'project', body: '项目 Project 2', data: { title: 'Project', startedAt: new Date('2026-09-01'), tags: ['Vue'] } }],
    });

    expect(home.stats).toEqual({ notes: 1, journal: 1, projects: 1, total: 3 });
    expect(home.recent.map((event) => event.id)).toEqual(['journal', 'project', 'doc']);
    expect(home.activity).toEqual([
      { date: '2023-01-01', count: 1 },
      { date: '2026-09-01', count: 1 },
      { date: '2026-09-09', count: 1 },
    ]);
    expect(home.insights.wordCount).toBe(8);
    expect(home.insights.recordSpanDays).toBeGreaterThan(1_300);
    expect(home.insights.focusTags).toEqual(['Astro', 'Vue']);
  });

  it('builds a case-insensitive tag index with stable counts', () => {
    const tags = buildTagIndex({
      docs: [{ id: 'doc', data: { title: 'Doc', tags: ['Java', '并发'] } }],
      journal: [{ id: 'log', data: { title: 'Log', tags: ['java'] } }],
      projects: [],
    });

    expect(tags.map(({ label, slug, count }) => ({ label, slug, count }))).toEqual([
      { label: 'Java', slug: 'java', count: 2 },
      { label: '并发', slug: '并发', count: 1 },
    ]);
  });

  it('reports references to content that does not exist', () => {
    const issues = validateContentRelations({
      docs: [{ id: 'existing-doc', data: { title: 'Doc' } }],
      journal: [
        {
          id: 'log',
          data: { title: 'Log', relatedDocs: ['existing-doc', 'missing-doc'] },
        },
      ],
      projects: [
        {
          id: 'project',
          data: { title: 'Project', relatedJournal: ['missing-log'] },
        },
      ],
    });

    expect(issues).toEqual([
      {
        sourceCollection: 'journal',
        sourceId: 'log',
        field: 'relatedDocs',
        targetId: 'missing-doc',
      },
      {
        sourceCollection: 'projects',
        sourceId: 'project',
        field: 'relatedJournal',
        targetId: 'missing-log',
      },
    ]);
  });
});
