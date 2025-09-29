import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DoctorSpecialization {

     @PrimaryGeneratedColumn({ type: 'int' })
        id: number

        @Column({ type: "int" })
        doctorID: number

        @Column({ type: "varchar"})
        specialty: string

         @Column({ type: "varchar"})
        specialty_description: string

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