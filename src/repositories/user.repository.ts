import { EntityRepository } from '@core/decorators/entity.repository.decorator';
import { UserEntity } from '@entities/user.entity';
import { Repository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
