import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmConfigService } from './database/typeorm.config.service';
import { ServiceModule } from './service/service.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TerminusModule,
    ServiceModule,
    AuthModule,
    PermissionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
