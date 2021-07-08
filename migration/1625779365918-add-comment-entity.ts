import {MigrationInterface, QueryRunner} from "typeorm";

export class addCommentEntity1625779365918 implements MigrationInterface {
    name = 'addCommentEntity1625779365918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task-comment" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "content" text NOT NULL, "taskId" integer, "creatorId" integer, CONSTRAINT "PK_0d1d875bdfae75607106a2abe50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "task-list" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "isArchived" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "task-comment" ADD CONSTRAINT "FK_6a76aaf7bdc4af75cb2f41b0814" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task-comment" ADD CONSTRAINT "FK_277a1145e740c2adc6dcfaae4c2" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task-comment" DROP CONSTRAINT "FK_277a1145e740c2adc6dcfaae4c2"`);
        await queryRunner.query(`ALTER TABLE "task-comment" DROP CONSTRAINT "FK_6a76aaf7bdc4af75cb2f41b0814"`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "isArchived" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "task-list" ALTER COLUMN "isArchived" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isArchived" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "task-comment"`);
    }

}
