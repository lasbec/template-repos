import { describe, expect, it } from "vitest";

import { ErCase, OkCase, UnwrapError, er, is_er, is_ok, ok } from "./result";

describe(`Result helpers`, () => {
    describe(`ok`, () => {
        it(`wraps a value into an OkCase`, () => {
            const result = ok(42);

            expect(result).toBeInstanceOf(OkCase);
            expect(result.unwrap()).toBe(42);
            expect(result.is_ok()).toBe(true);
            expect(result.is_er()).toBe(false);
            expect(is_ok(result)).toBe(true);
            expect(is_er(result)).toBe(false);
            expect(result.toString()).toBe(`[OK] 42`);
            expect(result.toJSON()).toEqual({ ok: true, result: 42 });
        });
    });

    describe(`er`, () => {
        it(`wraps an error into an ErCase`, () => {
            const error = er(`boom`);

            expect(error).toBeInstanceOf(ErCase);
            expect(error.unwrapError()).toBe(`boom`);
            expect(error.is_ok()).toBe(false);
            expect(error.is_er()).toBe(true);
            expect(is_ok(error)).toBe(false);
            expect(is_er(error)).toBe(true);
            expect(error.toString()).toBe(`[Error] boom`);
            expect(error.toJSON()).toEqual({ ok: false, error: `boom` });
        });

        it(`throws an UnwrapError when unwrap is called`, () => {
            const error = er(`boom`);

            expect(() => error.unwrap()).toThrowError(UnwrapError);
        });

        it(`preserves the original Error when unwrapping`, () => {
            const original = new Error(`original`);
            const error = er(original);

            try {
                error.unwrap();
            } catch (err) {
                expect(err).toBeInstanceOf(UnwrapError);
                expect((err as UnwrapError).cause).toBe(original);
                expect((err as UnwrapError).data).toBe(null);
            }
        });
    });
});
