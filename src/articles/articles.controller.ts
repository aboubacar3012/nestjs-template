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
import { PaginationDto } from '@/articles/dto/pagination.dto';

@Controller('api/articles')
@ApiTags('Articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articlesService.create(createArticleDto);
    return new ArticleEntity(article);
  }

  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll(@Query() query: PaginationDto) {
    const response = await this.articlesService.findAll(query);
    return {
      items: response.items.map((article) => new ArticleEntity(article)),
      pagination: response.pagination,
    };
  }

  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const response = await this.articlesService.findDrafts();
    return response.map((article) => new ArticleEntity(article));
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
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articlesService.update(id, updateArticleDto);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return new ArticleEntity(article);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id') id: string) {
    const article = await this.articlesService.remove(id);
    if (!article) {
      return { message: 'Article not found' };
    }
    return new ArticleEntity(article);
  }
}
