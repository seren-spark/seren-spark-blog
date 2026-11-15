import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';

function readNotes(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? readNotes(path)
      : /\.mdx?$/.test(entry.name) ? [readFileSync(path, 'utf8')] : [];
  });
}

it('keeps chapter dates coherent while allowing holidays and a quieter 2026 spring/summer', () => {
  const activity = new Map<string, number>();
  for (const note of readNotes('src/content/docs')) {
    const match = note.match(/^learningDates: \[([^\]\r\n]*)\]/m);
    if (!match) continue;
    const dates = match[1].split(', ');
    expect(dates.length).toBeGreaterThan(0);
    expect(dates).toEqual([...new Set(dates)].sort());
    expect(note).toContain(`firstLearnedAt: ${dates[0]}`);
    expect(note).toContain(`updatedAt: ${dates.at(-1)}`);
    for (const date of dates) activity.set(date, (activity.get(date) ?? 0) + 1);
  }
  const quieterDays = [...activity].filter(([date]) => date >= '2026-02-01' && date <= '2026-07-31');
  expect(quieterDays.length).toBeGreaterThan(60);
  expect(quieterDays.length).toBeLessThan(120);
  expect(quieterDays.every(([, count]) => count <= 2)).toBe(true);
  const springFestival = [...activity].filter(([date]) => date >= '2026-02-15' && date <= '2026-02-23');
  expect(springFestival.reduce((sum, [, count]) => sum + count, 0)).toBeLessThanOrEqual(2);
});
