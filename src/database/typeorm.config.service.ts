import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private _configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this._configService.get('POSTGRES_HOST') || 'postgres-db',
      // host: 'localhost', // for local dev
      port: +this._configService.get<number>('POSTGRES_PORT') || 5432,
      username: this._configService.get('DATABASE_USER') || 'postgres',
      password: this._configService.get('DATABASE_PASSWORD') || 'postgres',
      database: this._configService.get('DATABASE_NAME') || 'catalog',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrationsRun: true,
      synchronize: true,
      logging: true,
      migrationsTableName: 'migrations',
      migrations: [__dirname + '/migrations/**/*.ts'],
      autoLoadEntities: true,
      cli: {
        migrationsDir: 'src/migrations',
      },
    };
  }
}
