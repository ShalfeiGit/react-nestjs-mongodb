import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1705217031334 implements MigrationInterface {
    name = 'Init1705217031334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(200) NOT NULL, \`email\` varchar(200) NOT NULL, \`bio\` varchar(1000) NULL, \`age\` int NULL, \`gender\` enum ('male', 'female', 'others') NOT NULL DEFAULT 'others', \`password\` varchar(255) NULL, \`createdAt\` bigint NULL, \`updatedAt\` bigint NULL, \`refresh_token\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`content\` varchar(20000) NOT NULL, \`tag\` enum ('frontend', 'backend', 'marketing', 'graphic', 'devops') NOT NULL, \`createdAt\` bigint NULL, \`updatedAt\` bigint NULL, \`likes\` int NULL, \`idId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_3d2e60d50dae25c1b5fce581ec1\` FOREIGN KEY (\`idId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_3d2e60d50dae25c1b5fce581ec1\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
