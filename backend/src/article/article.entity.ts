import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum TagArticle {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  MARKETING = 'marketing',
  GRAPHIC = 'graphic',
  DEVOPS = 'devops',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  @OneToMany(() => User, (user) => user.likedArticle)
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 2000,
  })
  content: string;

  @Column({
    type: 'enum',
    enum: TagArticle,
  })
  tag: keyof typeof TagArticle;

  @Column({ type: 'bigint', default: null })
  createdAt: number;

  @Column({ type: 'bigint', default: null })
  updatedAt: number;

  @Column({ type: 'int', default: null })
  likes: number;

  @ManyToOne(() => User, (user) => user.articles)
  user: User;
}
