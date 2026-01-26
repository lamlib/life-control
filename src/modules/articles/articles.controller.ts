import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Articles')
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() request: Request,
  ) {
    const { accountId } = await request['user'];
    return await this.articlesService.create(createArticleDto, accountId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  async findAll() {
    return await this.articlesService.findAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get all articles by Account ID' })
  async findAllByAccountId(@Req() request: Request) {
    const { accountId } = request['user'];
    return await this.articlesService.findAllByAccountId(accountId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: string) {
    return await this.articlesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiParam({ name: 'id', type: Number })
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return await this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article by ID' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id') id: string) {
    return await this.articlesService.remove(+id);
  }
}
