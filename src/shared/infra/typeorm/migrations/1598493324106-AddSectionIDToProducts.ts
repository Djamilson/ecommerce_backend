import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddSectionIDToSectionsProducts1598493324106
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'section_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'ProductsSections',
        columnNames: ['section_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sections',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('products', 'ProductsSections');

    await queryRunner.dropColumn('products', 'section_id');
  }
}
