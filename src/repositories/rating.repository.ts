import { RatingQuery } from '@api/user/models/rating.query';
import { EntityRepository } from '@core/decorators/entity.repository.decorator';
import { RatingEntity } from '@entities/rating.entity';
import { Repository } from 'typeorm';

@EntityRepository(RatingEntity)
export class RatingRepository extends Repository<RatingEntity> {
  async getRatingsByClinicId(
    clinicId: string,
    query: RatingQuery,
  ): Promise<{
    ratings: RatingEntity[];
    total: number;
    totalPages: number;
  }> {
    const limit = query.take;
    const page = query.page;

    const baseQuery = this.createQueryBuilder('rating')
      .where('rating.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('rating.isAccepted = :isAccepted', { isAccepted: true })
      .andWhere('rating.clinicId = :clinicId', { clinicId });

    if (query.orderBy) {
      baseQuery.orderBy(`rating.${query.orderBy}`, query.orderType || 'ASC');
    } else {
      baseQuery.orderBy('rating.createdAt', 'DESC');
    }

    const total = await baseQuery.clone().getCount();
    const totalPages = limit ? Math.ceil(total / limit) : 1;

    let data: RatingEntity[];

    if (page && limit) {
      const offset = (page - 1) * limit;
      data = await baseQuery
        .select(this.selectRatingFields())
        .skip(offset)
        .take(limit + 1)
        .getMany();
    } else {
      data = await baseQuery.select(this.selectRatingFields()).getMany();
    }

    return {
      ratings: data,
      total,
      totalPages,
    };
  }

  private selectRatingFields() {
    return [
      'rating.userName',
      'rating.comment',
      'rating.rating',
      'rating.experienceDate',
      'rating.phoneNumber',
      'rating.createdAt',
    ];
  }
}
