import type { Config } from 'drizzle-kit';

import 'dotenv-flow/config';

import { env } from '@/utils/env';

export default {
  schema: './models/schema.ts',
  driver: 'mysql2',
  dbCredentials: {
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
  },
  tablesFilter: [`${env.MYSQL_TABLE_PREFIX}*`],
} satisfies Config;
