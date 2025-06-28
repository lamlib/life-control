import { Injectable } from '@nestjs/common';
import { CreateArticleTagDto } from './dto/create-article-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleTag } from './entities/article-tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleTagService {
  constructor(
    @InjectRepository(ArticleTag)
    private readonly articleTagRepository: Repository<ArticleTag>,
  ) {}

  create(createArticleTagDto: CreateArticleTagDto): Promise<ArticleTag> {
    const articleTag: ArticleTag = this.articleTagRepository.create(createArticleTagDto);
    return this.articleTagRepository.save(articleTag);
  }

  findAll() {
    return this.articleTagRepository.find();
  }

  findAllByArticleId(articleId: number) {
    return this.articleTagRepository.find({ where: { articleId } });  
  }

  findAllByTagId(tagId: number) {
    return this.articleTagRepository.find({ where: { tagId } });
  }

  findOneByArticleIdAndTagId(articleId: number, tagId: number): Promise<ArticleTag | null> {
    return this.articleTagRepository.findOneBy({ articleId, tagId });
  }

  removeByArticleIdAndTagId(articleId: number, tagId: number) {
    return this.articleTagRepository.delete({ articleId, tagId });
  }
}
