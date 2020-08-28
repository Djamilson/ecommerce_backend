import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRGFieldToPersons1598651751067
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'persons',
      new TableColumn({
        name: 'rg',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('persons', 'rg');
  }
}
