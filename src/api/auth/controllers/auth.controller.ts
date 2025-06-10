import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@api/auth/services/auth.service';
import { AuthRequest } from '@api/auth/models/auth.request';
import { HttpResponse } from '@core/models/http.response';
import { RegisterRequest } from '@api/auth/models/register.request';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async create(@Body() data: RegisterRequest) {
    const response = await this.authService.register(data);
    return new HttpResponse(response).build();
  }

  @Post('common')
  async authen(@Body() data: AuthRequest) {
    const user = await this.authService.authenticate(data);
    return new HttpResponse(user).build();
  }

  @Post('refresh')
  async refreshToken(@Body() data: { refreshToken: string }) {
    const response = await this.authService.refreshToken(data.refreshToken);
    return new HttpResponse(response).build();
  }
}
