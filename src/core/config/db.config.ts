import { DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
dotenv.config();

export const dbConfig: DataSourceOptions = {
  migrationsTableName: 'migrations',
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_POST),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
  synchronize: false,
  logging: ['query', 'error'],
};
