import { afterAll, expect, test } from 'vitest';

import { getConfig, upsertConfig } from '@/models/configs';
import { configs, db } from '@/models/db';

test('insert json array as the config value', async () => {
  const res = await upsertConfig('json.array', [1, 2, 3, 4, 5, 6, 7]);
  if (!res.ok) {
    expect.fail(res.err);
  }
});

test('query the inserted config value from json', async () => {
  const key = `random.config.${(Math.random() + 1).toString(36).substring(7)}`;
  // This config value hasn't been inserted.
  const res1 = await getConfig(key);
  if (!res1.ok) {
    expect.fail(res1.err);
  }
  expect(res1.res).null;

  // Insert a config value.
  const res2 = await upsertConfig(key, [1, 3, 5, 7]);
  if (!res2.ok) {
    expect.fail(res2.err);
  }

  // Query the config value.
  const res3 = await getConfig<number[]>(key);
  if (!res3.ok) {
    expect.fail(res3.err);
  }
  expect(res3.res).toMatchObject([1, 3, 5, 7]);
});

afterAll(async () => {
  // Cleanup all the `configs` table.
  await db.delete(configs);
});
