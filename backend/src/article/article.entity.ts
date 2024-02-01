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
  VIDEO = 'video',
  TOOLS = 'tools',
  MOBILE = 'mobile',
  GAMEDEV = 'gamedev',
  CMS = 'cms',
  BLOCKCHAIN = 'blockchain',
  QA = 'Quality assurance',
  SECURITY = 'security',
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
  })
  title: string;

  @Column({ type: 'varchar', length: 16000 })
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

  @Column({ type: 'int', default: 0 })
  likes: number;

  @ManyToOne(() => User, (user) => user.articles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
