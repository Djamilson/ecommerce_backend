import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCpfFieldToPersons1598650429381
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'persons',
      new TableColumn({
        name: 'cpf',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('persons', 'cpf');
  }
}
