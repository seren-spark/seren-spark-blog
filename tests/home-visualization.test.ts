import { describe, expect, it } from 'vitest';
import { buildYearHeatmap } from '../src/lib/home-visualization';

describe('homepage visualization data', () => {
  it('aligns a leap year to Sunday-first heatmap rows', () => {
    const cells = buildYearHeatmap(
      [
        { date: '2024-01-01', count: 1 },
        { date: '2024-02-29', count: 4 },
        { date: '2024-12-31', count: 8 },
        { date: '2023-12-31', count: 99 },
      ],
      2024,
    );

    expect(cells).toHaveLength(367);
    expect(cells[0]).toBeNull();
    expect(cells[1]).toMatchObject({ date: '2024-01-01', count: 1, level: 1 });
    expect(cells.find((cell) => cell?.date === '2024-02-29')).toMatchObject({
      count: 4,
      level: 3,
    });
    expect(cells.at(-1)).toMatchObject({ date: '2024-12-31', count: 8, level: 4 });
  });

  it('keeps inactive days and clamps invalid counts to zero', () => {
    const cells = buildYearHeatmap(
      [
        { date: '2025-01-01', count: -2 },
        { date: '2025-01-02', count: Number.NaN },
        { date: '2025-01-03', count: 2 },
      ],
      2025,
    );

    expect(cells.find((cell) => cell?.date === '2025-01-01')).toMatchObject({ count: 0, level: 0 });
    expect(cells.find((cell) => cell?.date === '2025-01-02')).toMatchObject({ count: 0, level: 0 });
    expect(cells.find((cell) => cell?.date === '2025-01-03')).toMatchObject({ count: 2, level: 2 });
  });
});
