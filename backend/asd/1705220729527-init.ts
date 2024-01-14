import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1705220729527 implements MigrationInterface {
  name = 'Init1705220729527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(200) NOT NULL, \`email\` varchar(200) NOT NULL, \`bio\` varchar(1000) NULL, \`age\` int NULL, \`gender\` enum ('male', 'female', 'others') NOT NULL DEFAULT 'others', \`password\` varchar(255) NULL, \`createdAt\` bigint NULL, \`updatedAt\` bigint NULL, \`refresh_token\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
