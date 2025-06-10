import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ClinicEntity } from './clinic.entity';

@Entity('ratings')
export class RatingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'clinic_id', type: 'varchar' })
  clinicId: string;

  @Column({ name: 'user_name', type: 'varchar' })
  userName: string;

  @Column({ name: 'comment', type: 'varchar', nullable: true })
  comment: string | null;

  @Column({ name: 'rating', type: 'int', default: 5 })
  rating: number;

  @Column({ name: 'experience_date', type: 'varchar' })
  experienceDate: string;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Column({ name: 'is_accepted', type: 'boolean', default: false })
  isAccepted: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.ratings)
  @JoinColumn({ name: 'clinic_id' })
  clinic: ClinicEntity;
}
