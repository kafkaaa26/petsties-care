import { Module } from '@nestjs/common';
import { UserModule } from '@api/user/user.module';
import { AuthModule } from '@api/auth/auth.module';
import { ReservationModule } from '@api/reservation/reservation.module';

@Module({
  imports: [AuthModule, UserModule, ReservationModule],
})
export class ApiModule {}
