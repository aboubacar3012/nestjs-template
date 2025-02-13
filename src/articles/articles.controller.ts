import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from '@/articles/articles.service';
import { CreateArticleDto } from '@/articles/dto/create-article.dto';
import { UpdateArticleDto } from '@/articles/dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from '@/articles/entities/article.entity';
import { PaginationArticlesDto } from '@/articles/dto/pagination-articles.dto';

@Controller('api/articles')
@ApiTags('Articles endpoints')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  findAll(@Query() query: PaginationArticlesDto) {
    return this.articlesService.findAll(query);
  }

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  findDrafts() {
    return this.articlesService.findDrafts();
  }

  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id') id: string) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }

    return article;
  }

  @Patch(':id')
  @ApiOkResponse({ type: ArticleEntity })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id') id: string) {
    const article = await this.articlesService.remove(id);
    if (!article) {
      return { message: 'Article not found' };
    }
    return article;
  }
}
