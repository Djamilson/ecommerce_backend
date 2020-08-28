import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddBirdthDateFieldToPersons1598651801326
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'persons',
      new TableColumn({
        name: 'birdth_date',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('persons', 'birdth_date');
  }
}
