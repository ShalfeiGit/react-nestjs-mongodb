import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from 'src/article/article.entity';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  bio: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.OTHERS,
  })
  gender: keyof typeof UserGender;

  @Column({ default: null })
  password: string;

  @Column({ type: 'bigint', default: null })
  createdAt: number;

  @Column({ type: 'bigint', default: null })
  updatedAt: number;

  @Column({ default: null })
  refresh_token: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  @OneToMany(() => Article, (article) => article.id)
  liked: Article[];
}
