import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateArticleTagDto {
    @ApiProperty({ description: 'Title of article', example: '' })
    @IsNumber()
    articleId: number;

    @ApiProperty({ description: 'Description of article', example: '' })
    @IsNumber()
    tagId: number;
}
