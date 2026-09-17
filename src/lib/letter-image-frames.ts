export const LETTER_IMAGE_STYLES = ['图3', '图层0', '图5', '图6', '图2'] as const;

export type LetterImageStyle = (typeof LETTER_IMAGE_STYLES)[number];

const LETTER_IMAGE_ASSET_VERSION = '20260917-names';

const STYLE_FRAMES: readonly (readonly LetterImageStyle[])[] = [
  ['图3', '图层0', '图5', '图6', '图2', '图3', '图层0', '图5', '图6', '图2'],
  ['图层0', '图5', '图6', '图2', '图3', '图层0', '图5', '图6', '图2', '图3'],
  ['图5', '图6', '图2', '图3', '图层0', '图5', '图6', '图2', '图3', '图层0'],
  ['图6', '图2', '图3', '图层0', '图5', '图6', '图2', '图3', '图层0', '图5'],
  ['图2', '图3', '图层0', '图5', '图6', '图2', '图3', '图层0', '图5', '图6'],
  ['图3', '图5', '图2', '图层0', '图6', '图3', '图5', '图2', '图层0', '图6'],
  ['图层0', '图6', '图3', '图5', '图2', '图层0', '图6', '图3', '图5', '图2'],
  ['图5', '图2', '图层0', '图6', '图3', '图5', '图2', '图层0', '图6', '图3'],
  ['图6', '图3', '图5', '图2', '图层0', '图6', '图3', '图5', '图2', '图层0'],
  ['图2', '图层0', '图6', '图3', '图5', '图2', '图层0', '图6', '图3', '图5'],
];

export const buildLetterImageFrames = (title: string): string[][] => {
  const letters = Array.from(title.replace(/\s+/g, '').toUpperCase());

  return STYLE_FRAMES.map((styles) =>
    letters.map((letter, index) => {
      const style = styles[index % styles.length];
      return `/media/letters/${style}/${letter}.webp?v=${LETTER_IMAGE_ASSET_VERSION}`;
    }),
  );
};
