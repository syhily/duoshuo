import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import * as schema from '@/models/db/schema';
import { env, isProd } from '@/utils/env';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR update.
 */
const globalForDb = globalThis as unknown as {
  conn: pg.Pool | undefined;
};

const conn =
  globalForDb.conn ??
  new pg.Pool({
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    user: env.POSTGRES_USERNAME,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    keepAlive: true,
  });

// Cache the connection.
if (!isProd()) {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, {
  logger: !isProd(), // Enable the log in development
  schema: schema,
});

export * from '@/models/db/schema';
