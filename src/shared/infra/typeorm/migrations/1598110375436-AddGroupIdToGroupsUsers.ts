import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddGroupIdToGroupsUsers1598110375436
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'groups_users',
      new TableColumn({
        name: 'group_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'groups_users',
      new TableForeignKey({
        name: 'GroupsUsersGroup',
        columnNames: ['group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groups',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('groups_users', 'GroupsUsersGroup');

    await queryRunner.dropColumn('groups_users', 'group_id');
  }
}
