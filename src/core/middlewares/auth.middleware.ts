import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  BadGatewayException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { config } from '@core/config/app.config';
import { logger } from '@core/models/logger';
import { UserRepository } from '@repositories/user.repository';
import { UserRole } from '@core/enums/user-role.enum';

export function AuthorizedWithRoles(...requiredRoles: UserRole[]) {
  @Injectable()
  class AuthorizedRoleGuard extends Authorized {
    constructor(readonly userRepository: UserRepository) {
      super(userRepository);
      this.requiredRoles = requiredRoles;
    }
  }

  return AuthorizedRoleGuard;
}

@Injectable()
export class Authorized implements CanActivate {
  requiredRoles: UserRole[] = [];

  constructor(readonly userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request?.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Token invalid');
    }
    logger.log('Auth header:', authHeader);

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt_secret);
      if (typeof decoded !== 'object' || !decoded.userName) {
        throw new BadGatewayException('Invalid refresh token');
      }

      const user = await this.userRepository.findOne({
        where: { userId: decoded?.userId, isActive: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userInfo = {
        ...decoded,
      };

      logger.log('User info:', userInfo);
      request.user = userInfo;
      request.token = token;

      if (!this.requiredRoles.length) {
        return true;
      }

      logger.log(
        `Checking role: ${userInfo.roleName}, required: ${this.requiredRoles}`,
      );

      if (
        userInfo.roleName === UserRole.ADMIN &&
        this.requiredRoles.includes(UserRole.ADMIN)
      ) {
        return true;
      }

      throw new ForbiddenException('Insufficient permissions');
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }

      logger.error('Token invalid:', error);
      throw new UnauthorizedException('Token invalid');
    }
  }
}
