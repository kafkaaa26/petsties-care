import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponse } from '@core/models/http.response';
import { ReservationService } from '../services/reservation.service';
import { ReservationRequest } from '../models/reservation.request';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('')
  async makeAReservation(@Body() request: ReservationRequest) {
    const response = await this.reservationService.create(request);
    return new HttpResponse(response).build();
  }
}
