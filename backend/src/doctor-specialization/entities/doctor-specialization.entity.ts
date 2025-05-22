import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DoctorSpecialization {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column()
  specialization_name: string;

}