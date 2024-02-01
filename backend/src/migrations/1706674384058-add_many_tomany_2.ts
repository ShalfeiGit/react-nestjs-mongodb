import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManyTomany21706674384058 implements MigrationInterface {
    name = 'AddManyTomany21706674384058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` DROP FOREIGN KEY \`FK_82a4a9215b29956ed7a1aa5c6e5\``);
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` DROP FOREIGN KEY \`FK_d2c2a527fccee23f76097350ad2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pass\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pass\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
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
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` ADD CONSTRAINT \`FK_d2c2a527fccee23f76097350ad2\` FOREIGN KEY (\`userId\`) REFERENCES \`dbreact\`.\`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_liked_article_article\` ADD CONSTRAINT \`FK_82a4a9215b29956ed7a1aa5c6e5\` FOREIGN KEY (\`articleId\`) REFERENCES \`dbreact\`.\`article\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`dbreact\`.\`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
