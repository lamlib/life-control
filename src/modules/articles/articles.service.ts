import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from '../tags/entities/tag.entity';
import { TagsService } from '../tags/tags.service';
import { ArticleTagService } from '../article-tag/article-tag.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    private readonly _tagService: TagsService,

    private readonly _articleTagService: ArticleTagService,

    private readonly _userService: UsersService,
  ) {}

  /**
   * Lưu bài viết vào cơ sở dũ liệu
   * @param createArticleDto
   * @returns
   */
  async create(
    createArticleDto: CreateArticleDto,
    accountId: number,
  ): Promise<Article> {
    const listTag: Tag[] = [];

    for (const rawTag of createArticleDto.listTag) {
      let tag = await this._tagService.findOneByName(rawTag);
      if (!tag) {
        tag = await this._tagService.create({
          name: rawTag,
          description: '',
        });
      }
      listTag.push(tag);
    }

    const account = await this._userService.findOneAccountById(accountId);

    let article: Article = this.articleRepository.create(createArticleDto);
    article.accountId = accountId;
    article.authorName = 'test';
    article = await this.articleRepository.save(article);

    for (const tag of listTag) {
      const exits = await this._articleTagService.findOneByArticleIdAndTagId(
        article.id,
        tag.id,
      );
      if (!exits) {
        await this._articleTagService.create({
          articleId: article.id,
          tagId: tag.id,
        });
      }
    }
    return article;
  }

  async findAll() {
    const articles = await this.articleRepository.find({
      relations: ['articleTags', 'articleTags.tag'],
    });

    return articles.map((article) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      content: article.content,
      thumbnail: article.thumbnail,
      authorName: article.authorName,
      tags: article.articleTags.map((at) => at.tag?.name).filter(Boolean), // lấy name tag
    }));
  }

  findOne(id: number) {
    return this.articleRepository.findOneBy({ id });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.articleRepository.update(id, updateArticleDto);
  }

  remove(id: number) {
    return this.articleRepository.delete(id);
  }
}
