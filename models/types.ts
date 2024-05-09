export interface Success<T> {
  readonly ok: true;
  readonly res: T;
}

export interface Failure {
  readonly ok: false;
  readonly err: string;
}

export type Void = { ok: true } | Failure;

export type Result<T> = Success<T> | Failure;

export type ResultSet<T> = (Success<Array<T>> & { count: number }) | Failure;
