import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ClinicEntity } from './clinic.entity';

@Entity('reservations')
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'pet_type', type: 'varchar' })
  petType: string;

  @Column({ name: 'service_type', type: 'varchar' })
  serviceType: string;

  @Column({ name: 'pet_state', type: 'varchar' })
  petState: string;

  @Column({ name: 'user_name', type: 'varchar' })
  userName: string;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string | null;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: string | null;

  @Column({ name: 'date_reservation', type: 'varchar' })
  dateReservation: string;

  @Column({ name: 'clinic_id', type: 'varchar' })
  clinicId: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToOne(() => ClinicEntity, (clinic) => clinic.reservations)
  @JoinColumn({ name: 'clinic_id' })
  clinic: ClinicEntity;
}
