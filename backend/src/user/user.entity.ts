import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

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
    length: 200,
  })
  hashPassword: string;

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
}
