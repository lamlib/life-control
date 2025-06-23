import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
  @ApiProperty({ example: 1, description: 'Unique identifier of the article' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'My First Article', description: 'Title of the article' })
  @Column()
  title: string;

  @ApiProperty({ example: 'This is example of simple article description', description: 'Description of article' })
  @Column()
  description: string;

  @ApiProperty({ example: 'This is the content of the article.', description: 'Content body' })
  @Column({ type: 'longtext' })
  content: string;
}
