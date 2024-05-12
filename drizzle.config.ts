import type { Config } from 'drizzle-kit';

import 'dotenv-flow/config';

import { env } from '@/utils/env';

export default {
  out: './models/migration',
  schema: './models/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USERNAME,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
  },
  migrations: {
    table: '__duoshuo_migration',
    schema: 'duoshuo',
  },
  verbose: true,
  strict: true,
} satisfies Config;
