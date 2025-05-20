import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TestType {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column({ default: null })
  TestName: string;
  @Column({ default: null })
  CategoryId: number;
  
}