import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from '@/auth/jwt.strategy';

export const jwtSecret =
  'b4c1b3b0-1b4b-4b7b-8b4b-4b1b3b0b4c1b-d4c1b3b0-1b4b-4b7b-8b4b-4b1b3b0b4c1b';

/**
 * AuthModule is responsible for handling authentication-related functionality.
 * It imports necessary modules and provides authentication services and controllers.
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '30m' }, // 30 minutes
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
