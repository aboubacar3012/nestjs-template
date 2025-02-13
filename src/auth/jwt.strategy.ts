import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from '@/auth/auth.module';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * JwtStrategy constructor
   * @param {UsersService} usersService - The users service
   */
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Validate the JWT payload
   * @param {Object} payload - The JWT payload
   * @param {string} payload.userId - The user ID from the payload
   * @returns {Promise<any>} - The validated user
   * @throws {UnauthorizedException} - If the user is not found
   */
  async validate(payload: { userId: string }) {
    const user = await this.usersService.findOne(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
