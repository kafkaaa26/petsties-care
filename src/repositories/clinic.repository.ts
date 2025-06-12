import { ClinicQuery } from '@api/user/models/clinic.query';
import { EntityRepository } from '@core/decorators/entity.repository.decorator';
import { ClinicEntity } from '@entities/clinic.entity';
import { Repository } from 'typeorm';

@EntityRepository(ClinicEntity)
export class ClinicRepository extends Repository<ClinicEntity> {
  async getAllClinics(query: ClinicQuery): Promise<{
    clinics: ClinicEntity[];
    total: number;
    totalPages: number;
  }> {
    const limit = query.take;
    const page = query.page;

    const baseQuery = this.createQueryBuilder('clinic').where(
      'clinic.isDeleted = :isDeleted',
      { isDeleted: false },
    );

    if (query.orderBy) {
      baseQuery.orderBy(`clinic.${query.orderBy}`, query.orderType || 'ASC');
    } else {
      baseQuery.orderBy('clinic.createdAt', 'DESC');
    }

    const total = await baseQuery.clone().getCount();
    const totalPages = limit ? Math.ceil(total / limit) : 1;

    let data: ClinicEntity[];

    if (page && limit) {
      const offset = (page - 1) * limit;
      data = await baseQuery
        .select(this.selectClinicFields())
        .skip(offset)
        .take(limit + 1)
        .getMany();
    } else {
      data = await baseQuery.select(this.selectClinicFields()).getMany();
    }

    return {
      clinics: data,
      total,
      totalPages,
    };
  }

  private selectClinicFields() {
    return [
      'clinic.clinicId',
      'clinic.clinicName',
      'clinic.clinicDescription',
      'clinic.clinicEmail',
      'clinic.clinicPhone',
      'clinic.clinicAddress',
      'clinic.clinicServices',
      'clinic.clinicSpecialties',
      'clinic.pricePerService',
      'clinic.workingHours',
      'clinic.reservationCount',
      'clinic.logoUrl',
      'clinic.rating',
      'clinic.createdAt',
    ];
  }
}
