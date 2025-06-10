import { Column } from 'typeorm';

export class BaseEntity {
  @Column({ name: 'created_at' })
  createdAt: number;

  @Column({ name: 'updated_at' })
  updatedAt: number;
}
