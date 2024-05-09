import { eq, sql } from 'drizzle-orm';

import { configs, db } from '@/models/db';
import type { Void } from '@/models/types';

const getConfigQuery = db.query.configs
  .findFirst({
    where: eq(configs.name, sql.placeholder('name')),
  })
  .prepare();

export const getConfig = async <T>(name: string): Promise<T | null> => {
  const config = await getConfigQuery.execute({ name });
  return config === undefined ? null : (config.value as T);
};

const upsertConfigQuery = db
  .insert(configs)
  .values({ name: sql.placeholder('name'), value: sql.placeholder('value') })
  .onDuplicateKeyUpdate({ set: { value: sql.placeholder('value') } })
  .prepare();

export const upsertConfig = async <T>(name: string, value: T): Promise<Void> => {
  await upsertConfigQuery.execute({ name, value });
  return { ok: true };
};
