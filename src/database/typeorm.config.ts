import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'comidapp',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
  logging: true,
};

TypeOrmModule.forRoot({
  logging: true,
  logger: 'advanced-console',
});
