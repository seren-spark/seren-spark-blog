import { describe, expect, it } from 'vitest';
import { buildActivityMap, buildTimeline, getContentDate } from '../src/lib/content-model';

const record = (
  collection: 'docs' | 'journal' | 'projects',
  id: string,
  data: Record<string, unknown>,
) => ({ collection, id, data });

describe('content date semantics', () => {
  it('prefers the historical learning date over publication date', () => {
    const result = getContentDate(
      record('docs', 'java/thread-pool', {
        firstLearnedAt: '2023-08-15',
        publishedAt: '2026-09-09',
      }),
      ['firstLearnedAt', 'publishedAt'],
    );

    expect(result?.source).toBe('firstLearnedAt');
    expect(result?.date.toISOString()).toContain('2023-08-15');
  });

  it('falls back to the next configured date when the first one is absent', () => {
    const result = getContentDate(
      record('journal', 'today', { publishedAt: '2026-09-09' }),
      ['occurredAt', 'publishedAt'],
    );

    expect(result?.source).toBe('publishedAt');
  });
});

describe('timeline aggregation', () => {
  it('normalizes records and sorts newest first without mutating input', () => {
    const records = [
      record('docs', 'old', { title: 'Old', firstLearnedAt: '2023-01-01' }),
      record('journal', 'new', { title: 'New', occurredAt: '2026-09-09' }),
    ];

    const result = buildTimeline(records);

    expect(result.map((event) => event.id)).toEqual(['new', 'old']);
    expect(records[0].id).toBe('old');
  });
});

describe('activity aggregation', () => {
  it('counts historical and journal activity on their source dates', () => {
    const result = buildActivityMap([
      record('docs', 'old', { firstLearnedAt: '2023-01-01', updatedAt: '2026-09-09' }),
      record('journal', 'log', { occurredAt: '2026-09-09' }),
    ]);

    expect(result.get('2023-01-01')).toBe(1);
    expect(result.get('2026-09-09')).toBe(2);
  });
});
