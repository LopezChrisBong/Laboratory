import { Exclude } from 'class-transformer';
import { UserDetail } from 'src/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserLogs {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({ type: 'int', default: true })
  userID: number;

  @CreateDateColumn({
    nullable: false,
    type: 'datetime',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: Date;

  // @OneToOne(type => UserDetail)
  // @JoinColumn({ referencedColumnName: 'id' })
  // userdetail: UserDetail
}
