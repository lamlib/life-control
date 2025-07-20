import { ApiProperty } from '@nestjs/swagger';
import { ArticleTag } from '../../article-tag/entities/article-tag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @ApiProperty({ example: 1, description: 'Unique identifier of the article' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'My First Article',
    description: 'Title of the article',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'This is example of simple article description',
    description: 'Description of article',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: 'This is the content of the article.',
    description: 'Content body',
  })
  @Column({ type: 'longtext' })
  content: string;

  @Column({ nullable: false })
  accountId: number;

  @Column({ nullable: false })
  authorName: string;

  @ApiProperty({
    description: 'Image URL of the article thumbnail',
    example: 'https://example.com/thumbnail.jpg',
  })
  @Column({ type: 'longtext' })
  thumbnail: string;

  @OneToMany(() => ArticleTag, (articleTag) => articleTag.article)
  articleTags: ArticleTag[];
}
