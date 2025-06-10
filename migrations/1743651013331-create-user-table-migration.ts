import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { baseMigration } from './base.migration';

export class CreateUserTableMigration1743651013331
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: false,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'user_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'is_sso_user',
            type: 'boolean',
            default: false,
          },
          {
            name: 'profile_picture_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tenant_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'last_login_at',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'bigint',
            isNullable: true,
          },
          ...baseMigration,
        ],
        indices: [
          {
            name: 'IDX_USER_CURSOR_ID',
            columnNames: ['id'],
          },
          {
            name: 'IDX_users_email',
            columnNames: ['email'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
