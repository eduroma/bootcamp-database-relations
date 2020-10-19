import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class CreateOrdersTable1602092685391 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.createTable(new Table({
      name: 'orders',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'customer_id',
          type: 'uuid',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
      foreignKeys: [
        {
          name: 'OrderCustomerFK',
          referencedTableName: 'customers',
          referencedColumnNames: ['id'],
          columnNames: ['customer_id'],
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders', 'OrderCustomerFK')
    await queryRunner.dropTable('orders')
  }

}
