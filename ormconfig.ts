import { DataSource } from 'typeorm';
import * as migration from './migrations';
import { dbConfig } from './src/core/config/db.config';

export const connectionSource = new DataSource({
  ...dbConfig,
  migrations: Object.values(migration),
});
