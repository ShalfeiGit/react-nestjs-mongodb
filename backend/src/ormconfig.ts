import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'dbUser',
  password: 'dbPassword',
  database: 'dbReact',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
};

export const dataSource = new DataSource(dataSourceOptions);
