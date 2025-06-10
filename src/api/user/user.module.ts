import { Module } from '@nestjs/common';
import { UserController } from '@api/user/controllers/user.controller';
import { UserService } from '@api/user/services/user.service';
import { CommonService } from '@core/services/common.service';

@Module({
  controllers: [UserController],
  providers: [CommonService, UserService],
})
export class UserModule {}
