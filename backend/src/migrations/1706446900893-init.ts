import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1706446900893 implements MigrationInterface {
    name = 'Init1706446900893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(200) NOT NULL, \`email\` varchar(200) NOT NULL, \`bio\` varchar(1000) NULL, \`age\` int NULL, \`gender\` enum ('male', 'female', 'others') NOT NULL DEFAULT 'others', \`pass\` varchar(255) NULL, \`createdAt\` bigint NULL, \`updatedAt\` bigint NULL, \`refresh_token\` varchar(255) NULL, \`likedArticleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`content\` varchar(16000) NOT NULL, \`tag\` enum ('frontend', 'backend', 'marketing', 'graphic', 'devops', 'video', 'tools', 'mobile', 'gamedev', 'cms', 'blockchain', 'Quality assurance', 'security') NOT NULL, \`createdAt\` bigint NULL, \`updatedAt\` bigint NULL, \`likes\` int NOT NULL DEFAULT '0', \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_045e5f059c22bccdaebee69a428\` FOREIGN KEY (\`likedArticleId\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_045e5f059c22bccdaebee69a428\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
