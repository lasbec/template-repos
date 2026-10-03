export class OkCase<R> {
  readonly _result: R;

  constructor(result: R) {
    this._result = result;
  }

  toString(): string {
    return `[OK] ${this._result}`;
  }

  toJSON() {
    return { ok: true, result: this._result };
  }

  result(): R {
    return this._result;
  }

  unwrap(_msg: string): R {
    return this._result;
  }

  isOk(): this is OkCase<R> {
    return true;
  }

  isEr(): this is ErCase<any> {
    return false;
  }

  errorOr<T>(fallback: T): T {
    return fallback;
  }
}

export class ErCase<E> {
  readonly _error: E;

  toString(): string {
    return `[Error] ${this._error}`;
  }

  toJSON() {
    return { ok: false, error: this._error };
  }

  constructor(result: E) {
    this._error = result;
  }

  error(): E {
    return this._error;
  }

  unwrap(msg: string): never {
    throw new UnwrapError(msg, { cause: this._error });
  }

  isOk(): this is OkCase<E> {
    return false;
  }

  isEr(): this is ErCase<any> {
    return true;
  }

  errorOr<T>(_fallback: T): E {
    return this._error;
  }

  resultOr<T>(fallback: T): T {
    return fallback;
  }
}

export class UnwrapError extends Error {}

export type Result<R, E = Error> = OkCase<R> | ErCase<E>;

export function ok<R>(result: R): OkCase<R> {
  return new OkCase<R>(result);
}

export function er<E>(error: E): ErCase<E> {
  return new ErCase<E>(error);
}
