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
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@/articles/dto/pagination.dto';
import { UserEntity } from '@/users/entities/user.entity';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity({ ...user, name: user.name });
  }

  @Get()
  @ApiResponse({ type: UserEntity, isArray: true })
  async findAll(@Query() query: PaginationDto) {
    const response = await this.usersService.findAll(query);
    return {
      items: response.items.map((user) => new UserEntity(user)),
      pagination: response.pagination,
    };
  }

  @Get(':id')
  @ApiResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserEntity(user);
  }

  @Patch(':id')
  @ApiResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserEntity(updatedUser);
  }

  @Delete(':id')
  @ApiResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    const deletedUser = await this.usersService.remove(id);

    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserEntity(deletedUser);
  }
}
