
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {

@PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
  id: number;
  @Column()
  categoryName: string;

}