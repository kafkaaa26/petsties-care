import moment from 'moment';
import { Entity, Column, Index, Unique, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @Column({ name: 'id', type: 'bigint', generated: true })
  @Index('IDX_USER_CURSOR_ID')
  id: number;

  @PrimaryColumn({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'user_name', type: 'varchar' })
  userName: string;

  @Column({ name: 'email', type: 'varchar' })
  @Index('IDX_users_email')
  email: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @Column({ name: 'role_id', type: 'varchar' })
  roleId: string;

  @Column({ name: 'is_sso_user', type: 'boolean', default: false })
  isSsoUser: boolean;

  @Column({ name: 'profile_picture_url', type: 'varchar', nullable: true })
  profilePictureUrl: string | null;

  @Column({ name: 'tenant_id', type: 'varchar', nullable: true })
  tenantId: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: number | null;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: number | null;

  isUserActive(): boolean {
    return this.isActive && !this.deletedAt;
  }

  updateLastLogin(): void {
    this.lastLoginAt = moment().unix();
  }
}
