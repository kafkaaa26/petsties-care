import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RatingEntity } from './rating.entity';
import { ReservationEntity } from './reservation.entity';

@Entity('clinics')
export class ClinicEntity extends BaseEntity {
  @PrimaryColumn({ name: 'clinic_id', type: 'varchar' })
  clinicId: string;

  @Column({ name: 'clinic_name', type: 'varchar' })
  clinicName: string;

  @Column({ name: 'clinic_address', type: 'varchar' })
  clinicAddress: string;

  @Column({ name: 'clinic_description', type: 'varchar', nullable: true })
  clinicDescription: string | null;

  @Column({ name: 'clinic_phone', type: 'varchar' })
  clinicPhone: string;

  @Column({ name: 'clinic_email', type: 'varchar', nullable: true })
  clinicEmail: string | null;

  @Column({ name: 'clinic_specialties', type: 'varchar' })
  clinicSpecialties: string;

  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl: string | null;

  @Column({ name: 'clinic_services', type: 'jsonb', nullable: true })
  clinicServices: Record<string, any>[] | null;

  @Column({ name: 'price_per_service', type: 'jsonb', nullable: true })
  pricePerService: Record<string, number>[] | null;

  @Column({ name: 'working_hours', type: 'jsonb', nullable: true })
  workingHours: Record<string, string> | null;

  @Column({ name: 'rating', type: 'float', default: 5 })
  rating: number;

  @Column({ name: 'reservation_count', type: 'int', default: 0 })
  reservationCount: number;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(() => RatingEntity, (rating) => rating.clinic)
  ratings: RatingEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.clinic)
  reservations: ReservationEntity[];
}
