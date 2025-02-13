import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

export const jwtSecretUiid =
  'b4c1b3b0-1b4b-4b7b-8b4b-4b1b3b0b4c1b-d4c1b3b0-1b4b-4b7b-8b4b-4b1b3b0b4c1b';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecretUiid,
      signOptions: { expiresIn: '30m' }, // 5 minutes
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
