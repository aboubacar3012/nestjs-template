import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from '@/articles/dto/create-article.dto';
import { UpdateArticleDto } from '@/articles/dto/update-article.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from '@/articles/dto/pagination.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({ data: createArticleDto });
  }

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

  findDrafts() {
    return this.prisma.article.findMany({
      where: { published: false },
    });
  }

  findOne(id: string) {
    return this.prisma.article.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
