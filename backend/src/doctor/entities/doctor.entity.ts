import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Doctor {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  name: string;
  @Column({ default: null })
  contact_number: string;
  @Column({ default: null })
  email: String;
  @Column({ default: null })
  specializationId: number;

}