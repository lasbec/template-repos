import type { none } from './none';
import { Str } from './str';

export class AssertionError extends Error {
  constructor(
    readonly value: unknown,
    msg: string,
  ) {
    super(msg);
  }
}

export abstract class Assert {
  static notNone<T>(val: T, msg: string): asserts val is Exclude<T, none> {
    if (val === undefined || val === null) {
      throw new AssertionError(val, `NotNoneAssertion: ${msg}`);
    }
  }

  static string(val: unknown, msg: string): asserts val is string {
    if (typeof val !== `string`) {
      throw new AssertionError(val, `StringAssertion: ${msg}`);
    }
  }

  static is<T>(val: unknown, id: T, msg: string): asserts val is T {
    if (val !== id) {
      throw new AssertionError(val, `IdentityAssertion<${id}>: ${msg}`);
    }
  }

  static never(val: never, msg: string): never {
    throw new AssertionError(val, `NeverAssertion: ${msg}`);
  }

  static oneOf<P extends string | number | boolean>(
    value: unknown,
    list: ReadonlyArray<P>,
    msg: string,
  ): asserts value is P {
    if (!(<unknown[]>list).includes(value)) {
      throw new AssertionError(
        value,
        `OneOfAssertion<${Str.snippet(list.join(`, `), 50)}>: ${msg}`,
      );
    }
  }

  static finiteNumber(val: unknown, msg: string): asserts val is number {
    if (typeof val !== `number`) {
      throw new AssertionError(val, `NumberAssertion: ${msg}`);
    }
    if (Number.isNaN(val)) {
      throw new AssertionError(val, `NotNaNAssertion: ${msg}`);
    }
    if (!Number.isFinite(val)) {
      throw new AssertionError(val, `FiniteAssertion: ${msg}`);
    }
  }
}
