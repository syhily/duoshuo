import { eq, sql } from 'drizzle-orm';

import { configs, db } from '@/models/db';
import { failureResult, nullResult, singleResult, voidResult, type Result, type Void } from '@/models/types';

const getConfigQuery = db.query.configs
  .findFirst({
    where: eq(configs.name, sql.placeholder('name')),
  })
  .prepare();

export const getConfig = async <T>(name: string): Promise<Result<T>> => {
  try {
    const config = await getConfigQuery.execute({ name });
    return config === undefined ? nullResult() : singleResult(config.value as T);
  } catch (e: unknown) {
    return failureResult(e);
  }
};

const upsertConfigQuery = db
  .insert(configs)
  .values({ name: sql.placeholder('name'), value: sql.placeholder('value') })
  .onDuplicateKeyUpdate({ set: { value: sql.placeholder('value') } })
  .prepare();

export const upsertConfig = async <T>(name: string, value: T): Promise<Void> => {
  try {
    await upsertConfigQuery.execute({ name, value });
  } catch (e: unknown) {
    return failureResult(e);
  }
  return voidResult();
};
