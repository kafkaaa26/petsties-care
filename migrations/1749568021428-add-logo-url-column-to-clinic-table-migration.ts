import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLogoUrlColumnToClinicTableMigration1749568021428
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'clinics',
      new TableColumn({
        name: 'logo_url',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('clinics', 'logo_url');
  }
}
