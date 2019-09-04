import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 500 })
  email!: string;

  @Column({ type: 'text', select: false })
  passwordHash!: string;
}
