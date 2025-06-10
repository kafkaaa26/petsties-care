import { Module } from '@nestjs/common';
import { CommonService } from '@core/services/common.service';
import { AuthService } from '@api/auth/services/auth.service';
import { AuthController } from '@api/auth/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [CommonService, AuthService],
})
export class AuthModule {}
