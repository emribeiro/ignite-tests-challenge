import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class CreateSenderIdColumn1624459633056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.addColumn("statements"
                                          , new TableColumn({
                                              name: "sender_id",
                                              type: "uuid",
                                              isNullable: true
                                          }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
