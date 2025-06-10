import { EntityRepository } from '@core/decorators/entity.repository.decorator';
import { ReservationEntity } from '@entities/reservation.entity';
import { Repository } from 'typeorm';

@EntityRepository(ReservationEntity)
export class ReservationRepository extends Repository<ReservationEntity> {}
