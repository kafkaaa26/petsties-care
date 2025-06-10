import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseMigration } from './base.migration';

export class CreateClinicTableMigration1749442774657
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the uuid-ossp extension is available for generating UUIDs
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'clinics',
        columns: [
          {
            name: 'clinic_id',
            type: 'varchar',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'clinic_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'clinic_description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'clinic_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'clinic_phone',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'clinic_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'clinic_specialties',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'clinic_services',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'price_per_service',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'working_hours',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'rating',
            type: 'float',
            isNullable: false,
            default: 5,
          },
          ...baseMigration,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clinics');
  }
}
