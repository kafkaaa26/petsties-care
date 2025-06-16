import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HttpResponse } from '@core/models/http.response';
import { ReservationService } from '../services/reservation.service';
import { ReservationRequest } from '../models/reservation.request';
import { ReservationQuery } from '../models/reservation.query';
import { Search } from '@core/decorators/search.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}
  @Get('')
  async getReservation(@Search(ReservationQuery) query: ReservationQuery) {
    const response = await this.reservationService.getListReservation(query);
    return new HttpResponse(response).build();
  }

  @Post('')
  async makeAReservation(@Body() request: ReservationRequest) {
    const response = await this.reservationService.create(request);
    return new HttpResponse(response).build();
  }

  @Delete(':reservationId')
  async deleteReservation(@Param('reservationId') reservationId: string) {
    const response = await this.reservationService.delete(reservationId);
    return new HttpResponse(response).build();
  }
}
