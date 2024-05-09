import { migrate } from 'drizzle-orm/mysql2/migrator';

import { db } from '@/models/db';
import { defaultTablePrefix, isProd } from '@/utils/env';

// The relative path is valid only through the npm start!!!
const migrationsFolder = isProd() ? 'dist/models/migration' : 'models/migration';

// Modify the table prefix.

console.log('Start to migrate the database schema.');
await migrate(db, { migrationsFolder: migrationsFolder, migrationsTable: `__${defaultTablePrefix}migration` });
console.log('Finish migrate the database schema.');
