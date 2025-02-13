//src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from '@/auth/entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * AuthService constructor
   * @param {PrismaService} prisma - The Prisma service
   * @param {JwtService} jwtService - The JWT service
   */
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Login a user with email and password
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @returns {Promise<AuthEntity>} - The authentication entity containing the access token
   * @throws {NotFoundException} - If no user is found for the given email
   * @throws {UnauthorizedException} - If the password is invalid
   */
  async login(email: string, password: string): Promise<AuthEntity> {
    // Step 1: Fetch a user with the given email
    const user = await this.prisma.user.findUnique({ where: { email: email } });

    // If no user is found, throw an error
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Step 2: Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Step 3: Generate a JWT containing the user's ID and return it
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
