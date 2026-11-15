export const normalizeTag = (tag: string) => tag.trim().toLocaleLowerCase();
export const tagSlug = (tag: string) => normalizeTag(tag).replace(/\s+/g, '-').replace(/[\\/]+/g, '-');
export const tagHref = (tag: string) => `/tags/${encodeURIComponent(tagSlug(tag))}/`;

const palette = [
  ['#f9e3da', '#93452d'], ['#f7ebca', '#79601e'],
  ['#e6eddc', '#496333'], ['#e0ecf3', '#356079'],
  ['#eee3ef', '#79537d'], ['#f8e1e7', '#91485e'],
];

export function tagStyle(tag: string): string {
  const hash = [...normalizeTag(tag)].reduce((value, char) => (value * 31 + char.codePointAt(0)!) >>> 0, 0);
  const [background, color] = palette[hash % palette.length];
  return `--tag-background:${background};--tag-color:${color}`;
}
