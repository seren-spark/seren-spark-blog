import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  buildLetterImageFrames,
  LETTER_IMAGE_STYLES,
} from '../src/lib/letter-image-frames';

describe('letter image frames', () => {
  const title = 'SEREN SPARK';
  const letters = Array.from(title.replace(/\s+/g, ''));
  const frames = buildLetterImageFrames(title);

  it('builds ten complete frames with the correct letter in every position', () => {
    expect(frames).toHaveLength(10);

    frames.forEach((frame) => {
      expect(frame).toHaveLength(letters.length);
      frame.forEach((source, index) => {
        expect(source).toMatch(new RegExp(`/${letters[index]}\\.webp\\?v=`));
      });
    });
  });

  it('uses every visual style exactly twice at each letter position', () => {
    letters.forEach((_, position) => {
      const styles = frames.map((frame) => frame[position].split('/').at(-2));

      LETTER_IMAGE_STYLES.forEach((style) => {
        expect(styles.filter((value) => value === style)).toHaveLength(2);
      });
    });
  });

  it('keeps frame order stable and ignores title whitespace', () => {
    expect(buildLetterImageFrames(' SEREN   SPARK ')).toEqual(frames);
    expect(buildLetterImageFrames(title)).toEqual(frames);
  });

  it('only references generated image files that exist', () => {
    frames.flat().forEach((source) => {
      const filePath = source.split('?')[0];
      expect(existsSync(resolve('public', filePath.slice(1)))).toBe(true);
    });
  });
});
