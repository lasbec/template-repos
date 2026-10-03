import { describe, expect, it } from 'vitest';

import { er, ErCase, ok, OkCase, UnwrapError } from './result';

describe(`Result helpers`, () => {
  describe(`ok`, () => {
    it(`wraps a value into an OkCase`, () => {
      const result = ok(42);

      expect(result).toBeInstanceOf(OkCase);
      expect(result.unwrap(`should not throw`)).toBe(42);
      expect(result.isOk()).toBe(true);
      expect(result.isEr()).toBe(false);
      expect(result.toString()).toBe(`[OK] 42`);
      expect(result.toJSON()).toEqual({ ok: true, result: 42 });
    });
  });

  describe(`er`, () => {
    it(`wraps an error into an ErCase`, () => {
      const error = er(`boom`);

      expect(error).toBeInstanceOf(ErCase);
      expect(error.isOk()).toBe(false);
      expect(error.isEr()).toBe(true);
      expect(error.toString()).toBe(`[Error] boom`);
      expect(error.toJSON()).toEqual({ ok: false, error: `boom` });
    });

    it(`throws an UnwrapError when unwrap is called`, () => {
      const error = er(`boom`);

      expect(() => error.unwrap(`should throw`)).toThrowError(UnwrapError);
    });

    it(`preserves the original Error when unwrapping`, () => {
      const original = new Error(`original`);
      const error = er(original);

      try {
        error.unwrap(`throwing`);
      } catch (err) {
        expect(err).toBeInstanceOf(UnwrapError);
        expect((err as UnwrapError).cause).toBe(original);
      }
    });
  });
});
