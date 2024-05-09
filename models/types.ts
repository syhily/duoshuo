export interface Success<T> {
  readonly ok: true;
  readonly res: T;
}

export interface Failure {
  readonly ok: false;
  readonly err: string;
}

export type Void = { readonly ok: true } | Failure;

export type Result<T> = Success<T | null> | Failure;

export type ResultSet<T> = (Success<Array<T>> & { readonly count: number }) | Failure;

export const voidResult = (): Void => ({ ok: true });

export const nullResult = (): Success<null> => ({ ok: true, res: null });

export const singleResult = <T>(res: T): Success<T> => ({ ok: true, res: res });

export const multiResult = <T>(res?: T[]): ResultSet<T> => {
  if (!res) {
    return { ok: true, res: [], count: 0 };
  }
  return { ok: true, res: res, count: res.length };
};

export const failureResult = (err: unknown): Failure => {
  if (err instanceof Error) {
    return { ok: false, err: err.message };
  }

  if (typeof err === 'string') {
    return { ok: false, err: err };
  }

  return { ok: false, err: 'unknown' };
};
