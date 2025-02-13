import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from '@/articles/dto/create-article.dto';
import { UpdateArticleDto } from '@/articles/dto/update-article.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from '@/articles/dto/pagination.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new article.
   * @param createArticleDto - The data to create a new article.
   * @returns The created article.
   */
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({ data: createArticleDto });
  }

  /**
   * Retrieves all published articles with pagination.
   * @param query - The pagination parameters.
   * @returns A paginated list of published articles.
   */
  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.prisma.article.findMany({
        where: { published: true },
        take: Number(limit),
        skip: Number(skip),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.article.count({ where: { published: true } }),
    ]);

    const result = {
      items,
      pagination: {
        totalItems,
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    };

    return result;
  }

  /**
   * Retrieves all draft articles.
   * @returns A list of draft articles.
   */
  findDrafts() {
    return this.prisma.article.findMany({
      where: { published: false },
    });
  }

  /**
   * Retrieves an article by its ID.
   * @param id - The ID of the article.
   * @returns The article corresponding to the ID.
   */
  findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  /**
   * Updates an article by its ID.
   * @param id - The ID of the article.
   * @param updateArticleDto - The new data for the article.
   * @returns The updated article.
   */
  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  /**
   * Deletes an article by its ID.
   * @param id - The ID of the article.
   * @returns The deleted article.
   */
  remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
