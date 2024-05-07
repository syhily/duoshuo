import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import 'dotenv-flow/config';

const int = z
  .string()
  .transform((s) => Number.parseInt(s, 10))
  .pipe(z.number().int());

const nullableInt = (num: number) =>
  z
    .string()
    .nullable()
    .transform((s) => (s === null ? num : Number.parseInt(s, 10)))
    .pipe(z.number().int());

// const boolean = z
//   .string()
//   .refine((s) => s === 'true' || s === 'false')
//   .transform((s) => s === 'true');

export const env = createEnv({
  server: {
    // The System configuration.
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: nullableInt(4321),

    // The MySQL configuration, it's the same as the zeabur configuration.
    MYSQL_HOST: z.string(),
    MYSQL_PORT: int,
    MYSQL_USERNAME: z.string(),
    MYSQL_PASSWORD: z.string(),
    MYSQL_DATABASE: z.string(),
    MYSQL_TABLE_PREFIX: z.string().nullable().default('duoshuo_'),
  },
  runtimeEnv: process.env,
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: true,
});
