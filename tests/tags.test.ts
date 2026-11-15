import { expect, it } from 'vitest';
import { buildTagIndex } from '../src/lib/content-queries';
import { tagHref, tagStyle } from '../src/lib/tags';

it('shares tag destinations and colors across content collections and casing', () => {
  const tags = buildTagIndex({
    docs: [{ id: 'node', data: { tags: ['Node.js'] } }],
    journal: [{ id: 'post', data: { tags: [' node.JS '] } }], projects: [],
  });
  expect(tags).toHaveLength(1);
  expect(tags[0].count).toBe(2);
  expect(tagHref(' node.JS ')).toBe(`/tags/${encodeURIComponent(tags[0].slug)}/`);
  expect(tagStyle(' node.JS ')).toBe(tagStyle(tags[0].label));
  expect(new Set(['Redis', 'Vue', '前端', 'Java'].map(tagStyle)).size).toBeGreaterThan(1);
});
