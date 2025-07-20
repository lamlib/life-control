import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { TagsModule } from '../tags/tags.module';
import { ArticleTagModule } from '../article-tag/article-tag.module';
import { UsersModule } from '../users/users.module';
import { Account } from '../users/entities/account.entity';

@Module({
  imports: [
    TagsModule,
    ArticleTagModule,
    UsersModule,
    TypeOrmModule.forFeature([Article, Account]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
