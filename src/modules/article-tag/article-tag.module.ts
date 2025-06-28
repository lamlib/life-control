import { Module } from '@nestjs/common';
import { ArticleTagService } from './article-tag.service';
import { ArticleTagController } from './article-tag.controller';
import { ArticleTag } from './entities/article-tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleTag])],
  controllers: [ArticleTagController],
  providers: [ArticleTagService],
  exports: [ArticleTagService],
})
export class ArticleTagModule {}
