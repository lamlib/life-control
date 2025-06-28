import { ApiProperty } from "@nestjs/swagger";
import { ArticleTag } from "../../article-tag/entities/article-tag.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tag {
    @ApiProperty({ example: 1, description: 'Unique identifier of the tag' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Technology', description: 'Name of the tag' })
    @Column()
    name: string;

    @ApiProperty({ example: 'Articles related to technology', description: 'Description of the tag' })
    @Column()
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ nullable: true })
    createdBy: number;

    @Column({ nullable: true })
    updatedBy: number;

    @Column({ nullable: true })
    deletedBy: number;

    @OneToMany(() => ArticleTag, articleTag => articleTag.tag)
    articleTags: ArticleTag[];
}
