import { Search } from '@core/decorators/search.decorator';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HttpResponse } from '@core/models/http.response';
import { UserService } from '@api/user/services/user.service';
import { ClinicQuery } from '@api/user/models/clinic.query';
import { ClinicRequest } from '../models/clinic.request';
import { RatingQuery } from '../models/rating.query';
import { RatingRequest } from '../models/rating.request';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/clinic')
  async getClinics(@Search(ClinicQuery) query: ClinicQuery) {
    const clinics = await this.userService.listClinics(query);
    return new HttpResponse(clinics).build();
  }

  @Get('/clinic/:clinicId')
  async getDetailClinic(@Param('clinicId') clinicId: string) {
    const clinic = await this.userService.getClinicDetail(clinicId);
    return new HttpResponse(clinic).build();
  }

  @Get('/rating')
  async getRatings(@Search(RatingQuery) query: RatingQuery) {
    const ratings = await this.userService.listRatings(query);
    return new HttpResponse(ratings).build();
  }

  @Post('/clinic')
  // @UseGuards(AuthorizedWithRoles(UserRole.ADMIN))
  async createClinic(@Body() request: ClinicRequest) {
    const response = await this.userService.createClinic(request);
    return new HttpResponse(response).build();
  }

  @Post('/rating')
  async createRating(@Body() request: RatingRequest) {
    const response = await this.userService.createRating(request);
    return new HttpResponse(response).build();
  }
}
