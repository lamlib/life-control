import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { MainSeeder } from './seeders/main.seeder';
import { DataSource } from 'typeorm';
import { Role } from '../modules/auth/entities/role.entity';
import { Permission } from '../modules/auth/entities/permission.entity';
import { RolePermission } from '../modules/auth/entities/role-permission.entity';
import { Account } from '../modules/users/entities/account.entity';
import { InternalAccount } from '../modules/users/entities/internal-account.entity';
import { HashingAlgorithm } from '../modules/auth/entities/hashing-algorithm.entity';
import { EmailStatus } from '../modules/users/entities/email-status.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);

  const dataSource = new DataSource({
    type: configService.get<string>('database.type') as any,
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
    entities: [Role, Permission, RolePermission, Account, InternalAccount, HashingAlgorithm, EmailStatus],
    synchronize: false,
  });

  await dataSource.initialize();
  await new MainSeeder(dataSource).seed();
  await dataSource.destroy();
  await app.close();
}

bootstrap();