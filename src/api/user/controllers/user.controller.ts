import { Search } from '@core/decorators/search.decorator';
import { Body, Controller, Get, Post } from '@nestjs/common';
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
  async getClinics(
    // @CurrentUser() user: UserInfo,
    @Search(ClinicQuery) query: ClinicQuery,
  ) {
    const clinics = await this.userService.listClinics(query);
    return new HttpResponse(clinics).build();
  }

  @Get('/rating')
  async getRatings(
    // @CurrentUser() user: UserInfo,
    @Search(RatingQuery) query: RatingQuery,
  ) {
    const ratings = await this.userService.listRatings(query);
    return new HttpResponse(ratings).build();
  }

  @Post('/clinic')
  // @UseGuards(AuthorizedWithRoles(UserRole.ADMIN))
  async createClinic(
    // @CurrentUser() user: UserInfo,
    @Body() request: ClinicRequest,
  ) {
    const response = await this.userService.createClinic(request);
    return new HttpResponse(response).build();
  }

  @Post('/rating')
  // @UseGuards(AuthorizedWithRoles(UserRole.ADMIN))
  async createRating(
    // @CurrentUser() user: UserInfo,
    @Body() request: RatingRequest,
  ) {
    const response = await this.userService.createRating(request);
    return new HttpResponse(response).build();
  }
}
