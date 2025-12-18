import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MedicalCertificate {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: true })
  patientID: number;


  @Column({ type: 'int' })
  doctorID: number;


  @Column({ type: 'varchar', nullable: true })
  date: string;

  @Column({ type: 'longtext', nullable: true })
  diagnosis: string;

  @Column({ type: 'longtext', nullable: true })
  recommendations: string;


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
