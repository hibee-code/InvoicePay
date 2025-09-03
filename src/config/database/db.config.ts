import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
dotenv.config();


export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  host: process.env.DB_HOST,
  entities: [join(__dirname, '../../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
  synchronize: false,
  logging: true,
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
  },
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

import { getMetadataArgsStorage } from 'typeorm';

console.log(
  'Entities loaded:',
  getMetadataArgsStorage().tables.map((t) => t.target)
);

if (require.main === module) {
  dataSource
    .initialize()
    .then(() => console.log('Database connection established successfully!'))
    .catch((error) => console.error('Error connecting to the database:', error));
}
