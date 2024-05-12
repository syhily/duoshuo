import { afterAll, expect, test } from 'vitest';

import { getConfig, upsertConfig } from '@/models/configs';
import { configs, db } from '@/models/db';

const randomKey = () => `random.config.${(Math.random() + 1).toString(36).substring(7)}`;

test('insert json array as the config value', async () => {
  const res = await upsertConfig('json.array', [1, 2, 3, 4, 5, 6, 7]);
  if (!res.ok) {
    expect.fail(res.err);
  }
});

test('query the invalid config name', async () => {
  const key = randomKey();
  const res = await getConfig(key);
  if (!res.ok) {
    expect.fail(res.err);
  }
  expect(res.res).null;
});

test('query the inserted config value from json', async () => {
  const key = randomKey();
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

test('upsert the config with different value', async () => {
  const key = randomKey();
  const res1 = await getConfig(key);
  if (!res1.ok) {
    expect.fail(res1.err);
  }
  expect(res1.res).null;

  const res2 = await upsertConfig(key, { name: 'Yufan' });
  if (!res2.ok) {
    expect.fail(res2.err);
  }

  const res3 = await getConfig(key);
  if (!res3.ok) {
    expect.fail(res3.err);
  }
  expect(res3.res).toMatchObject({ name: 'Yufan' });

  const res4 = await upsertConfig(key, { name: 'Yufan Sheng' });
  if (!res4.ok) {
    expect.fail(res4.err);
  }

  const res5 = await getConfig(key);
  if (!res5.ok) {
    expect.fail(res5.err);
  }
  expect(res5.res).toMatchObject({ name: 'Yufan Sheng' });
});

afterAll(async () => {
  // Cleanup all the `configs` table.
  await db.delete(configs);
});
