import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '@repositories/user.repository';
import { RegisterRequest } from '@api/auth/models/register.request';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import moment from 'moment-timezone';
import { config } from '@core/config/app.config';
import { UserEntity } from '@entities/user.entity';
import { AuthRequest } from '@api/auth/models/auth.request';
import { instanceToPlain, plainToClass } from 'class-transformer';
import { UserInfo } from '@api/auth/models/user-info';
import jwt from 'jsonwebtoken';
import { logger } from '@core/models/logger';
import { CommonService } from '@core/services/common.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly commonService: CommonService,
  ) {}

  async register(request: RegisterRequest): Promise<any> {
    try {
      const emailRegex =
        /^[^\s@.',][^\s@,]*(?:\.[^\s@,]+)*@[^\s@]+(?:\.com|(?:\.[^\s@]+)*\.com(?:\.[^\s@]+)*)$/;

      if (!emailRegex.test(request.email)) {
        throw new BadRequestException(
          this.commonService.translate('common.INVALID_EMAIL'),
        );
      }

      const user = await this.userRepository.findOne({
        where: { email: request.email },
      });

      // Check if user exists when creating user
      if (user) {
        throw new BadRequestException('User already exists');
      }

      // Create new user
      const salt = genSaltSync();
      const newUser = new UserEntity();

      const userId = this.commonService.generateUUIDv4();

      newUser.userId = userId;
      newUser.userName = request.userName;
      newUser.password = hashSync(`${request.password}`, salt);
      newUser.email = request.email;
      newUser.roleId = request.roleId;
      newUser.tenantId = request.tenantId;

      const now = moment().unix();
      newUser.createdAt = now;

      const response = await this.userRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const savedUser = await transactionalEntityManager.save(newUser);
          return savedUser;
        },
      );

      const userInfo = plainToClass(UserInfo, response, {
        excludeExtraneousValues: true,
      });

      const accessToken = jwt.sign(
        instanceToPlain(userInfo),
        config.jwt_secret,
        {
          expiresIn: config.jwt_access_token_expires_in,
        },
      );
      const refreshToken = jwt.sign(
        instanceToPlain(userInfo),
        config.jwt_secret,
        {
          expiresIn: config.jwt_refresh_token_expires_in,
        },
      );

      userInfo.accessToken = accessToken;
      userInfo.refreshToken = refreshToken;

      return userInfo;
    } catch (error) {
      logger.error('Error during registration', error);
      throw error;
    }
  }

  async authenticate(data: AuthRequest): Promise<UserInfo> {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data?.email)) {
        throw new BadRequestException(
          this.commonService.translate('common.INVALID_EMAIL'),
        );
      }

      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.userSetting', 'userSetting')
        .select(['user', 'role.roleName', 'userSetting.darkMode'])
        .where('user.email = :email', { email: data?.email })
        .andWhere('user.isActive = :isActive', { isActive: true })
        .getOne();

      if (!user || !compareSync(data.password, user.password)) {
        throw new UnauthorizedException(
          this.commonService.translate('common.INVALID_CREDENTIALS'),
        );
      }

      const userInfo = new UserInfo();
      userInfo.userId = user.userId;
      userInfo.email = user.email;
      userInfo.userName = user.userName;
      userInfo.tenantId = user.tenantId;
      userInfo.profilePictureUrl = user.profilePictureUrl;

      const accessToken = jwt.sign(
        instanceToPlain(userInfo),
        config.jwt_secret,
        {
          expiresIn: config.jwt_access_token_expires_in,
        },
      );
      const refreshToken = jwt.sign(
        instanceToPlain(userInfo),
        config.jwt_secret,
        {
          expiresIn: config.jwt_refresh_token_expires_in,
        },
      );

      // Update last login time
      user.updateLastLogin();
      await this.userRepository.save(user);

      userInfo.accessToken = accessToken;
      userInfo.refreshToken = refreshToken;

      return userInfo;
    } catch (error) {
      logger.error('Error during authentication', error);
      throw error;
    }
  }

  async refreshToken(token: string): Promise<any> {
    try {
      if (!token) {
        throw new BadGatewayException('Refresh token is required');
      }

      const decoded = jwt.verify(token, config.jwt_secret) as UserInfo;

      if (typeof decoded !== 'object' || !decoded.userName) {
        throw new BadGatewayException('Invalid refresh token');
      }

      const user = await this.userRepository.findOne({
        where: { userId: decoded?.userId, isActive: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userInfo = new UserInfo();
      userInfo.userId = decoded.userId;
      userInfo.email = decoded.email;
      userInfo.userName = decoded.userName;
      userInfo.roleName = decoded.roleName;
      userInfo.groupUserId = decoded.groupUserId;
      userInfo.tenantId = decoded.tenantId;
      userInfo.darkMode = decoded.darkMode;
      userInfo.profilePictureUrl = decoded.profilePictureUrl;

      const accessToken = jwt.sign(
        instanceToPlain(userInfo),
        config.jwt_secret,
        {
          expiresIn: config.jwt_access_token_expires_in,
        },
      );

      return { accessToken };
    } catch (error) {
      logger.error('Error refreshing token', error);
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      throw error;
    }
  }
}
