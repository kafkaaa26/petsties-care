import { Module } from '@nestjs/common';
import { ReservationController } from '@api/reservation/controllers/reservation.controller';
import { ReservationService } from '@api/reservation/services/reservation.service';
import { CommonService } from '@core/services/common.service';

@Module({
  controllers: [ReservationController],
  providers: [CommonService, ReservationService],
})
export class ReservationModule {}
