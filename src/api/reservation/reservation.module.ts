import { Module } from '@nestjs/common';
import { ReservationController } from '@api/reservation/controllers/reservation.controller';
import { ReservationService } from '@api/reservation/services/reservation.service';
import { CommonService } from '@core/services/common.service';
import { S3Service } from '@core/services/s3.service';

@Module({
  controllers: [ReservationController],
  providers: [CommonService, ReservationService, S3Service],
})
export class ReservationModule {}
