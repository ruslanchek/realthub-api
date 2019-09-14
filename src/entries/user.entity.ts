import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 500 })
  email!: string;

  @Column({ type: 'text', select: false })
  passwordHash!: string;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordChangedDate!: Date;

  @Column({
    type: 'timestamp',
    select: false,
    default: 'now()',
    nullable: true,
  })
  passwordResetExpires!: Date;

  @Column({ type: 'text', select: false, nullable: true })
  passwordResetCode!: string;

  @Column({ type: 'text', select: false, nullable: true })
  emailConfirmationCode!: string;

  @Column({ type: 'boolean', select: false, default: false })
  isEmailConfirmed!: boolean;
}
