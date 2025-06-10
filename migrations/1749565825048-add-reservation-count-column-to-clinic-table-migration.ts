import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReservationCountColumnToClinicTableMigration1749565825048
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'clinics',
      new TableColumn({
        name: 'reservation_count',
        type: 'int',
        default: 0,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('clinics', 'reservation_count');
  }
}
