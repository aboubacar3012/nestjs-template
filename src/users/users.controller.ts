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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '@/articles/dto/pagination.dto';
import { UserEntity } from '@/users/entities/user.entity';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user.
   * @param createUserDto - Data transfer object for creating a user.
   * @returns The created user entity.
   */
  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity({ ...user, name: user.name });
  }

  /**
   * Retrieve all users with pagination.
   * @param query - Pagination query parameters.
   * @returns A list of user entities and pagination info.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity, isArray: true })
  async findAll(@Query() query: PaginationDto) {
    const response = await this.usersService.findAll(query);
    return {
      items: response.items.map((user) => new UserEntity(user)),
      pagination: response.pagination,
    };
  }

  /**
   * Retrieve a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user entity.
   * @throws NotFoundException if the user is not found.
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserEntity(user);
  }

  /**
   * Update a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data transfer object for updating a user.
   * @returns The updated user entity.
   * @throws NotFoundException if the user is not found.
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserEntity(updatedUser);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns The deleted user entity.
   * @throws NotFoundException if the user is not found.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(id);

    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserEntity(deletedUser);
  }
}
