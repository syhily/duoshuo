import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db } from '@/models/db';
import { isProd } from '@/utils/env';

// The relative path is valid only through the npm start!!!
const migrationsFolder = isProd() ? 'dist/models/migration' : 'models/migration';

// Modify the table prefix.

console.log('Start to migrate the database schema.');
await migrate(db, {
  migrationsFolder: migrationsFolder,
  migrationsTable: '__duoshuo_migration',
  migrationsSchema: 'duoshuo',
});
console.log('Finish migrate the database schema.');
