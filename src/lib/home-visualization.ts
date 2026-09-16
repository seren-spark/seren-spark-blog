import type { ActivityPoint } from './content-queries';

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export type HeatmapDay = {
  date: string;
  count: number;
  level: ActivityLevel;
};

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeCount(count: number): number {
  return Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
}

function toActivityLevel(count: number): ActivityLevel {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function buildYearHeatmap(
  activity: readonly ActivityPoint[],
  year: number,
): Array<HeatmapDay | null> {
  if (!Number.isInteger(year)) throw new TypeError('Heatmap year must be an integer.');

  const counts = new Map(
    activity.map((point) => [point.date, normalizeCount(point.count)] as const),
  );
  const firstDay = new Date(Date.UTC(year, 0, 1));
  const cells: Array<HeatmapDay | null> = Array.from(
    { length: firstDay.getUTCDay() },
    () => null,
  );

  for (
    const date = firstDay;
    date.getUTCFullYear() === year;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const key = toDateKey(date);
    const count = counts.get(key) ?? 0;
    cells.push({ date: key, count, level: toActivityLevel(count) });
  }

  return cells;
}
