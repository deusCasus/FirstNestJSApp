import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1622243251428 implements MigrationInterface {
  name = 'init1622243251428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "username" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "task-list" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "caption" character varying(255) NOT NULL, "ownerId" integer, CONSTRAINT "PK_a7e7827bfc4cf45c62eabc30e3b" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "isArchived" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, "caption" character varying(255) NOT NULL, "description" text NOT NULL, "isComplete" boolean NOT NULL DEFAULT false, "taskListId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "task-list" ADD CONSTRAINT "FK_d9e7bd2c02231518dcd68fcd987" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5" FOREIGN KEY ("taskListId") REFERENCES "task-list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_47fc40cc98de35bf7aaaaaeeac5"`);
    await queryRunner.query(`ALTER TABLE "task-list" DROP CONSTRAINT "FK_d9e7bd2c02231518dcd68fcd987"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "task-list"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }

}
