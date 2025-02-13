import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { PaginationDto } from '@/articles/dto/pagination.dto';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user with hashed password.
   * @param {CreateUserDto} createUserDto - Data transfer object for creating a user.
   * @returns {Promise<any>} The created user.
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  /**
   * Finds all users with pagination.
   * @param {PaginationDto} query - Pagination query parameters.
   * @returns {Promise<any>} The paginated list of users.
   */
  async findAll(query: PaginationDto): Promise<any> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        take: Number(limit),
        skip: Number(skip),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
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
   * Finds a user by ID.
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<any>} The found user.
   */
  findOne(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Updates a user by ID.
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - Data transfer object for updating a user.
   * @returns {Promise<any>} The updated user.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Removes a user by ID.
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<any>} The removed user.
   */
  remove(id: string): Promise<any> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
