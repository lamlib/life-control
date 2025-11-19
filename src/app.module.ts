import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Account } from './modules/users/entities/account.entity';
import { Permission } from './modules/auth/entities/permission.entity';
import { Role } from './modules/auth/entities/role.entity';
import { RolePermission } from './modules/auth/entities/role-permission.entity';
import { InternalAccount } from './modules/users/entities/internal-account.entity';
import { HashingAlgorithm } from './modules/auth/entities/hashing-algorithm.entity';
import { EmailStatus } from './modules/users/entities/email-status.entity';
import { ExternalAccount } from './modules/users/entities/external-account.entity';
import { ExternalProvider } from './modules/users/entities/external-provider.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Token } from './modules/auth/entities/refresh-token.entity';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { FilesModule } from './modules/files/files.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { Article } from './modules/articles/entities/article.entity';
import { TagsModule } from './modules/tags/tags.module';
import { ArticleTagModule } from './modules/article-tag/article-tag.module';
import { Tag } from './modules/tags/entities/tag.entity';
import { ArticleTag } from './modules/article-tag/entities/article-tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env.development`],
      load: [configuration],
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): MailerOptions => ({
        transport: {
          host: configService.get<string>('email.host'),
          port: parseInt(configService.get<string>('email.port') as string),
          auth: {
            user: configService.get<string>('email.username'),
            pass: configService.get<string>('email.password'),
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<string>('database.type') as any,
        host: configService.get<string>('database.host'),
        port: Number(configService.get<string>('database.port')),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [
          Account,
          Permission,
          Role,
          RolePermission,
          InternalAccount,
          HashingAlgorithm,
          EmailStatus,
          ExternalAccount,
          ExternalProvider,
          Token,
          Article,
          Tag,
          ArticleTag,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MailerModule,
    FilesModule,
    ArticlesModule,
    TagsModule,
    ArticleTagModule,
  ],
})
export class AppModule {}
