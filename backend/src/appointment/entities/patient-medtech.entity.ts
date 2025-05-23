import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PatientMedtech {
      @PrimaryGeneratedColumn({ type: 'int' })
        id: number

        @Column({ type: "int" })
        patientID: number

        @Column({ type: "int" })
        appointmentID: number

        @Column({ type: "int", nullable:true })
        medtechID: number
        

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
