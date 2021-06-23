import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class createReceivedIdColumn1624490309669 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        return await queryRunner.addColumn("statements", new TableColumn({
            name: "receiver_id",
            type: "uuid",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
