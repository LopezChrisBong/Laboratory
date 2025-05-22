
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MedicalInfo {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number


    @Column({ type: "int"})
    patientID:number

    @Column({ type: "int", nullable:true})
    appointmentID:number

    @Column({ type: "int"})
    doctorID:number
    

    @Column({ type: "varchar", nullable: true,})
    am: string

    @Column({ type: "varchar",nullable:true })
    bp: string

    @Column({ type: "varchar",nullable:true })
    date: string

    @Column({ type: "varchar",nullable:true })
    dateDelivered: string

    @Column({ type: "varchar",nullable:true })
    deliveryDate: string
    
    @Column({ type: "varchar",nullable:true })
    deliveryMethod: string

    @Column({ type: "longtext",nullable:true })
    finding: string

    @Column({ type: "varchar",nullable:true })
    liveBirths: string

    @Column({ type: "varchar",nullable:true })
    menstrual: string

    @Column({ type: "varchar",nullable:true })
    pregnant: string

    @Column({ type: "longtext",nullable:true })
    remarks: string

    @Column({ type: "longtext",nullable:true })
    treatment: string

    @Column({ type: "varchar",nullable:true })
    weight: string

    @Column({ type: "varchar",nullable:true })
    prevPreg:string
  


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
