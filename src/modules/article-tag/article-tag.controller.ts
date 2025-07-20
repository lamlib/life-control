import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ArticleTagService } from './article-tag.service';
import { CreateArticleTagDto } from './dto/create-article-tag.dto';

@Controller('article-tag')
export class ArticleTagController {
  constructor(private readonly articleTagService: ArticleTagService) {}

  @Post()
  create(@Body() createArticleTagDto: CreateArticleTagDto) {
    return this.articleTagService.create(createArticleTagDto);
  }

  @Get()
  findAll() {
    return this.articleTagService.findAll();
  }

  @Get(':articleId/:tagId')
  findOne(
    @Param('articleId') articleId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.articleTagService.findOneByArticleIdAndTagId(
      +articleId,
      +tagId,
    );
  }

  @Delete(':articleId/:tagId')
  remove(@Param('articleId') articleId: string, @Param('tagId') tagId: string) {
    return this.articleTagService.removeByArticleIdAndTagId(+articleId, +tagId);
  }
}
