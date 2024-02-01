import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManyTomany1706673545753 implements MigrationInterface {
    name = 'AddManyTomany1706673545753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_045e5f059c22bccdaebee69a428\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`CREATE TABLE \`user_liked_article_article\` (\`userId\` int NOT NULL, \`articleId\` int NOT NULL, INDEX \`IDX_d2c2a527fccee23f76097350ad\` (\`userId\`), INDEX \`IDX_82a4a9215b29956ed7a1aa5c6e\` (\`articleId\`), PRIMARY KEY (\`userId\`, \`articleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`likedArticleId\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pass\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pass\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` ADD CONSTRAINT \`FK_d2c2a527fccee23f76097350ad2\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` ADD CONSTRAINT \`FK_82a4a9215b29956ed7a1aa5c6e5\` FOREIGN KEY (\`articleId\`) REFERENCES \`article\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` DROP FOREIGN KEY \`FK_82a4a9215b29956ed7a1aa5c6e5\``);
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` DROP FOREIGN KEY \`FK_d2c2a527fccee23f76097350ad2\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pass\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pass\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`likedArticleId\` int NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_82a4a9215b29956ed7a1aa5c6e\` ON \`user_liked_article_article\``);
        await queryRunner.query(`DROP INDEX \`IDX_d2c2a527fccee23f76097350ad\` ON \`user_liked_article_article\``);
        await queryRunner.query(`DROP TABLE \`user_liked_article_article\``);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`dbreact\`.\`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_045e5f059c22bccdaebee69a428\` FOREIGN KEY (\`likedArticleId\`) REFERENCES \`dbreact\`.\`article\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
