import { describe, expect, it } from 'vitest';

import { Str } from './str';

describe(`Str`, () => {
  describe(`toUnixLineEndings`, () => {
    it(`keeps existing new lines and removes carriage returns`, () => {
      const input = `line1\r\nline2\r\nline3`;

      const result = Str.toUnixLineEndings(input);

      expect(result).toBe(`line1\nline2\nline3`);
    });

    it(`replaces standalone carriage returns with new lines`, () => {
      const input = `line1\rline2\rline3`;

      const result = Str.toUnixLineEndings(input);

      expect(result).toBe(`line1\nline2\nline3`);
    });
  });

  describe(`trimAndJoin`, () => {
    it(`filters falsy values, trims entries and joins with the separator`, () => {
      const parts = [`  first  `, undefined, `second`, null, `  third`];

      const result = Str.trimAndJoin(`, `, parts);

      expect(result).toBe(`first, second, third`);
    });
  });
});
