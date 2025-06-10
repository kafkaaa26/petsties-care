import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseMigration } from './base.migration';

export class CreateReservationTableMigration1749442945248
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reservations',
        columns: [
          {
            name: 'reservation_id',
            type: 'varchar',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'pet_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'service_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'pet_state',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'user_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date_reservation',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'clinic_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
          ...baseMigration,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reservations');
  }
}
