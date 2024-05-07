import type { Config } from 'drizzle-kit';

import 'dotenv-flow/config';

import { defaultTablePrefix, env } from '@/utils/env';

export default {
  out: './models/migration',
  schema: './models/schema.ts',
  driver: 'mysql2',
  dbCredentials: {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
  },
  verbose: true,
  strict: true,
  tablesFilter: [`${defaultTablePrefix}*`],
} satisfies Config;
