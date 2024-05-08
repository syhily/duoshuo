import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const nullableInt = (num: number) =>
  z
    .string()
    .nullable()
    .transform((s) => (s === null ? num : Number.parseInt(s, 10)))
    .pipe(z.number().int());

export const defaultTablePrefix = 'duoshuo_';

export const env = createEnv({
  server: {
    // The System configuration.
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: nullableInt(4321),

    // The MySQL configuration, it's the same as the zeabur configuration.
    MYSQL_HOST: z.string(),
    MYSQL_PORT: nullableInt(3306),
    MYSQL_USERNAME: z.string(),
    MYSQL_PASSWORD: z.string(),
    MYSQL_DATABASE: z.string().default('duoshuo'),
  },
  runtimeEnv: process.env,
  isServer: typeof window === 'undefined',
  emptyStringAsUndefined: true,
});

export const isProd = () => env.NODE_ENV === 'production';
