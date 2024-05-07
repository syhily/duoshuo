import { bigint, mysqlTableCreator, serial, timestamp } from 'drizzle-orm/mysql-core';

import { env } from '@/utils/env';

/**
 * Add schema table prefix for sharing the database with other applications.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
const mysqlTable = mysqlTableCreator((name) => `${env.MYSQL_TABLE_PREFIX}${name}`);

// Common columns for all the tables used in the duoshuo.
const commonColumns = {
  id: serial('id').primaryKey(),
  createTime: timestamp('create_time').notNull().defaultNow(),
  updateTime: timestamp('update_time').notNull().defaultNow().onUpdateNow(),
  // The 'deleted' column serves for logical deletion. A value of 0 indicates the record is active.
  // When a record is deleted, the 'deleted' column will store the timestamp of the deletion.
  deleted: bigint('deleted', { mode: 'number', unsigned: true }).default(0),
};

// The comments' table for storing the users' comments.
export const comments = mysqlTable('comments', {
  ...commonColumns,
});
