import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MedicalInfo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', nullable: true })
  patientID: number;

  @Column({ type: 'int', nullable: true })
  appointmentID: number;

  @Column({ type: 'int' })
  doctorID: number;

  @Column({ type: 'varchar', nullable: true })
  am: string;

  @Column({ type: 'varchar', nullable: true })
  bp: string;

  @Column({ type: 'varchar', nullable: true })
  date: string;

  @Column({ type: 'varchar', nullable: true })
  dateDelivered: string;

  @Column({ type: 'varchar', nullable: true })
  deliveryDate: string;

  @Column({ type: 'varchar', nullable: true })
  deliveryMethod: string;

  @Column({ type: 'longtext', nullable: true })
  finding: string;

  @Column({ type: 'longtext', nullable: true })
  complain: string;

  @Column({ type: 'varchar', nullable: true })
  liveBirths: string;

  @Column({ type: 'varchar', nullable: true })
  Pnumber: string;

  @Column({ type: 'varchar', nullable: true })
  Gnumber: string;

  @Column({ type: 'varchar', nullable: true })
  PAnumber: string;

  @Column({ type: 'varchar', nullable: true })
  Lnumber: string;

  @Column({ type: 'varchar', nullable: true })
  Tnumber: string;

  @Column({ type: 'varchar', nullable: true })
  Anumber: string;

  @Column({ type: 'varchar', nullable: true })
  admitted: string;

  @Column({ type: 'varchar', nullable: true })
  discharge: string;

  @Column({ type: 'varchar', nullable: true })
  menstrual: string;

  @Column({ type: 'varchar', nullable: true })
  pregnant: string;

  @Column({ type: 'longtext', nullable: true })
  remarks: string;

  @Column({ type: 'longtext', nullable: true })
  treatment: string;

  @Column({ type: 'varchar', nullable: true })
  weight: string;

  @Column({ type: 'varchar', nullable: true })
  prevPreg: string;

  @Column({ type: 'varchar', nullable: true })
  age: string;

  @Column({ type: 'varchar', nullable: true })
  referred_by: string;

  @Column({ type: 'varchar', nullable: true })
  civil_status: string;

  @Column({ type: 'varchar', nullable: true })
  spouse: string;

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
