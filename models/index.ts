import { drizzle } from 'drizzle-orm/mysql2';
import { createPool, type Pool } from 'mysql2/promise';

import * as schema from '@/models/schema';
import { env, isProd } from '@/utils/env';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn =
  globalForDb.conn ??
  createPool({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
  });

// Cache the connection.
if (!isProd()) {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, {
  logger: !isProd(), // Enable the log in development
  schema: schema,
  mode: 'default',
});
