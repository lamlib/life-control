import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ description: 'Title of article', example: '' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of article', example: '' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Content of article', example: '' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Content of article', example: '' })
  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  listTag: string[];
}
