import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascade1706619008852 implements MigrationInterface {
    name = 'AddCascade1706619008852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_045e5f059c22bccdaebee69a428\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pass\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pass\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_045e5f059c22bccdaebee69a428\` FOREIGN KEY (\`likedArticleId\`) REFERENCES \`article\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_045e5f059c22bccdaebee69a428\``);
        await queryRunner.query(`ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_636f17dadfea1ffb4a412296a28\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`pass\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`pass\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_045e5f059c22bccdaebee69a428\` FOREIGN KEY (\`likedArticleId\`) REFERENCES \`dbreact\`.\`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article\` ADD CONSTRAINT \`FK_636f17dadfea1ffb4a412296a28\` FOREIGN KEY (\`userId\`) REFERENCES \`dbreact\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
