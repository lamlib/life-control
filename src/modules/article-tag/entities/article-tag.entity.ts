import { Article } from "../../articles/entities/article.entity";
import { Tag } from "../../tags/entities/tag.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class ArticleTag {
    @PrimaryColumn({ type: 'int' })
    articleId: number;

    @PrimaryColumn({ type: 'int' })
    tagId: number;

    @ManyToOne(() => Article, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'articleId' })
    article: Article;

    @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tagId' })
    tag: Tag;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date;

    @Column({ nullable: true })
    createdBy: number;

    @Column({ nullable: true })
    deletedBy: number;
}