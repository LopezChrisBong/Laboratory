import { Users } from 'src/auth/entities/auth.entity';
import { UserType } from 'src/user-type/entities/user-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserDetail {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  fname: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 50,
  })
  mname: string;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 50,
  })
  lname: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 10,
  })
  suffix: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 10,
  })
  bdate: string;



  @Column({
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  birth_place: string;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 6,
  })
  sex: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  email: string;


  @Column({
    nullable: true,
    type: 'varchar',
    length: 13,
  })
  mobile_no: string;



  @Column({
    nullable: true,
    type: 'tinyint',
    default: false,
  })
  isApproved: boolean;

  @Column({
    type: 'int',
    default: 1,
  })
  status: number;

  @Column({
    nullable: true,
    type: 'datetime',
  })
  date_approved: string;

  @Column({
    nullable: true,
    type: 'int',
  })
  userID: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 150,
  })
  profile_img: string;

   @Column({
    type: 'varchar',
    nullable: true,
    length: 150,
  })
  liscence_no: string;


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
}
