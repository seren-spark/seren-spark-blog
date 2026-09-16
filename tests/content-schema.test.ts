import { describe, expect, it } from 'vitest';
import { journalSchema, projectSchema } from '../src/content-schema';

describe('content schemas', () => {
  it('accepts a historical journal date and coerces it to Date', () => {
    const parsed = journalSchema.parse({
      title: '历史笔记',
      type: 'journal',
      occurredAt: '2023-08-15',
    });

    expect(parsed.occurredAt).toBeInstanceOf(Date);
    expect(parsed.occurredAt.toISOString()).toContain('2023-08-15');
  });

  it('rejects an invalid journal date', () => {
    const result = journalSchema.safeParse({
      title: '错误日期',
      type: 'journal',
      occurredAt: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });

  it('rejects tags that are not a string array', () => {
    const result = journalSchema.safeParse({
      title: '错误标签',
      type: 'journal',
      occurredAt: '2023-08-15',
      tags: 'Java',
    });

    expect(result.success).toBe(false);
  });

  it('rejects unsupported project status values', () => {
    const result = projectSchema.safeParse({
      title: '项目',
      type: 'project',
      status: 'unknown',
    });

    expect(result.success).toBe(false);
  });
});
