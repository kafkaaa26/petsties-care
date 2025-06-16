import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClinicQuery } from '@api/user/models/clinic.query';
import { CommonService } from '@core/services/common.service';
import { Logger } from '@core/decorators/logger.decorator';
import { logger } from '@core/models/logger';
import { commonConstant } from '@constants/common.constant';
import { ClinicRequest } from '../models/clinic.request';
import { ClinicEntity } from '@entities/clinic.entity';
import moment from 'moment';
import { ClinicRepository } from '@repositories/clinic.repository';
import { RatingRepository } from '@repositories/rating.repository';
import { RatingQuery } from '../models/rating.query';
import { RatingRequest } from '../models/rating.request';
import { RatingEntity } from '@entities/rating.entity';
import { div, normalizeVietnamese, plus } from '@core/utils/common';

@Injectable()
export class UserService {
  constructor(
    private readonly commonService: CommonService,
    private readonly clinicRepository: ClinicRepository,
    private readonly ratingRepository: RatingRepository,
  ) {}

  @Logger()
  async listClinics(query: ClinicQuery): Promise<any> {
    try {
      let { clinics, total, totalPages } =
        await this.clinicRepository.getAllClinics(query);

      const county = query.county && normalizeVietnamese(query.county);
      if (county) {
        clinics = clinics.sort((a, b) => {
          const sameCountyA = normalizeVietnamese(a.clinicAddress).includes(
            county,
          );
          const sameCountyB = normalizeVietnamese(b.clinicAddress).includes(
            county,
          );

          if (sameCountyA && !sameCountyB) {
            return -1; // a nearer to the county, so it comes before b
          }

          if (!sameCountyA && sameCountyB) {
            return 1; // b nearer to the county, so it comes before a
          }

          return 0;
        });
      }

      return {
        clinics: clinics.map((clinic) => {
          if (county) {
            delete clinic.pricePerService;
            delete clinic.workingHours;
            delete clinic.clinicSpecialties;
            clinic.clinicServices = [clinic.clinicServices.shift()];
          }

          return {
            ...clinic,
            createdAt: this.commonService.formatDateFromEpochTime(
              clinic.createdAt,
              commonConstant.FORMAT_DATE_TIME,
            ),
          };
        }),
        pagination: {
          total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Error fetching clinic list:', error);
      throw new BadRequestException(
        'Error fetching clinic list. Please try again later.',
      );
    }
  }

  @Logger()
  async getClinicDetail(clinicId: string): Promise<any> {
    try {
      if (!clinicId) {
        throw new BadRequestException(
          'Clinic ID is required to fetch clinic details.',
        );
      }

      const clinic = await this.clinicRepository
        .createQueryBuilder('clinic')
        .where('clinic.clinicId = :clinicId', { clinicId })
        .andWhere('clinic.isDeleted = :clinicIsDeleted', {
          clinicIsDeleted: false,
        })
        .leftJoinAndSelect(
          'clinic.ratings',
          'rating',
          'rating.isAccepted = :isAccepted',
          {
            isAccepted: true,
          },
        )
        .getOne();

      if (!clinic) {
        throw new NotFoundException('Clinic not found or has been deleted.');
      }

      return clinic;
    } catch (error) {
      logger.error('Error fetching clinic detail:', error);
      throw error;
    }
  }

  @Logger()
  async listRatings(query: RatingQuery): Promise<any> {
    try {
      const clinicId = query.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'Clinic ID is required to fetch ratings.',
        );
      }

      const clinic = await this.clinicRepository
        .createQueryBuilder('clinic')
        .where('clinic.clinicId = :clinicId', { clinicId })
        .andWhere('clinic.isDeleted = :clinicIsDeleted', {
          clinicIsDeleted: false,
        })
        .getOne();

      if (!clinic) {
        throw new NotFoundException('Clinic not found or has been deleted.');
      }

      const { ratings, total, totalPages } =
        await this.ratingRepository.getRatingsByClinicId(clinicId, query);

      return {
        overview: {
          clicnicId: clinic.clinicId,
          clinicName: clinic.clinicName,
          rating: clinic.rating,
          ratingCount: ratings.length,
          reservationCount: clinic.reservationCount,
        },
        ratings: ratings.map((rating) => ({
          ...rating,
          createdAt: this.commonService.formatDateFromEpochTime(
            rating.createdAt,
            commonConstant.FORMAT_DATE_TIME,
          ),
        })),
        pagination: {
          total,
          totalPages,
        },
      };
    } catch (error) {
      logger.error('Error fetching ratings list:', error);
      throw error;
    }
  }

  @Logger()
  async createClinic(request: ClinicRequest): Promise<any> {
    try {
      if (request.clinicEmail) {
        const emailRegex =
          /^[^\s@.',][^\s@,]*(?:\.[^\s@,]+)*@[^\s@]+(?:\.com|(?:\.[^\s@]+)*\.com(?:\.[^\s@]+)*)$/;

        if (!emailRegex.test(request.clinicEmail)) {
          throw new BadRequestException(
            this.commonService.translate('common.INVALID_EMAIL'),
          );
        }
      }

      const newRating = new ClinicEntity();
      const clinicId = this.commonService.generateUUIDv4();
      const now = moment().unix();

      newRating.clinicId = clinicId;
      newRating.clinicName = request.clinicName;
      newRating.clinicDescription = request.clinicDescription || '';
      newRating.clinicEmail = request.clinicEmail || '';
      newRating.clinicPhone = request.clinicPhone || '';
      newRating.clinicAddress = request.clinicAddress || '';
      newRating.clinicServices = request.clinicServices || [];
      newRating.clinicSpecialties = request.clinicSpecialties.join(', ');
      newRating.pricePerService = request.pricePerService || [];
      newRating.workingHours = request.workingHours || {};
      newRating.rating = request.rating;
      newRating.createdAt = now;
      newRating.updatedAt = now;

      return await this.clinicRepository.save(newRating);
    } catch (error) {
      logger.error('Error during clinic creation:', error);
      throw error;
    }
  }

  @Logger()
  async createRating(request: RatingRequest): Promise<any> {
    try {
      const clinicId = request.clinicId;
      if (!clinicId) {
        throw new BadRequestException(
          'Clinic ID is required to create a rating.',
        );
      }

      const clinic = await this.clinicRepository
        .createQueryBuilder('clinic')
        .leftJoinAndSelect(
          'clinic.ratings',
          'rating',
          'rating.isAccepted = :isAccepted',
          {
            isAccepted: true,
          },
        )
        .where('clinic.clinicId = :clinicId', { clinicId })
        .andWhere('clinic.isDeleted = :clinicIsDeleted', {
          clinicIsDeleted: false,
        })
        .getOne();

      if (!clinic) {
        throw new NotFoundException('Clinic not found or has been deleted.');
      }

      const newRating = new RatingEntity();
      const now = moment().unix();

      newRating.clinicId = clinicId;
      newRating.userName = request.userName || '';
      newRating.comment = request.comment || '';
      newRating.rating = request.rating;
      newRating.experienceDate = request.experienceDate || '';
      newRating.isAccepted = true;
      newRating.phoneNumber = request.phoneNumber || '';
      newRating.createdAt = now;
      newRating.updatedAt = now;

      // update clinic rating
      const clinicRating = div(
        clinic.ratings.reduce(
          (acc, item) => plus(acc, item.rating),
          request.rating,
        ),
        plus(clinic.ratings.length || 0, 1),
      );

      return await Promise.all([
        this.ratingRepository.save(newRating),
        this.clinicRepository.update(
          { clinicId },
          {
            rating: clinicRating,
            updatedAt: now,
          },
        ),
      ]);
    } catch (error) {
      logger.error('Error during rating creation:', error);
      throw error;
    }
  }
}
