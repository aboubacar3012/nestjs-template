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

/**
 * Contrôleur pour gérer les articles.
 */
@Controller('api/articles')
@ApiTags('Articles')
export class ArticlesController {
  /**
   * Crée une instance du controller.
   * @param articlesService Service pour les opérations sur les articles.
   */
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Crée un nouvel article.
   * @param createArticleDto DTO de création d'article.
   * @returns L'article créé.
   */
  @Post()
  @ApiCreatedResponse({ type: ArticleEntity })
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articlesService.create(createArticleDto);
    return new ArticleEntity(article);
  }

  /**
   * Récupère la liste paginée des articles.
   * @param query DTO de pagination.
   * @returns Un objet contenant les articles et la pagination.
   */
  @Get()
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findAll(@Query() query: PaginationDto) {
    const response = await this.articlesService.findAll(query);
    return {
      items: response.items.map((article) => new ArticleEntity(article)),
      pagination: response.pagination,
    };
  }

  /**
   * Récupère la liste des articles en brouillon.
   * @returns Un tableau d'articles en brouillon.
   */
  @Get('drafts')
  @ApiOkResponse({ type: ArticleEntity, isArray: true })
  async findDrafts() {
    const response = await this.articlesService.findDrafts();
    return response.map((article) => new ArticleEntity(article));
  }

  /**
   * Récupère un article par son identifiant.
   * @param id L'identifiant de l'article.
   * @returns L'article trouvé.
   * @throws NotFoundException si l'article n'existe pas.
   */
  @Get(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async findOne(@Param('id') id: string) {
    const article = await this.articlesService.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  /**
   * Met à jour un article.
   * @param id L'identifiant de l'article.
   * @param updateArticleDto DTO de mise à jour.
   * @returns L'article mis à jour.
   * @throws NotFoundException si l'article n'existe pas.
   */
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

  /**
   * Supprime un article.
   * @param id L'identifiant de l'article.
   * @returns L'article supprimé ou un message si non trouvé.
   */
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
