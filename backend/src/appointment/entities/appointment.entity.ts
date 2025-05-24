import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Appointment {
      @PrimaryGeneratedColumn({ type: 'int' })
        id: number

        @Column({ type: "varchar" })
        patientID: string

        @Column({ type: "varchar", nullable:true })
        date: string


        @Column({ type: "varchar", nullable:true })
        time: string

        //  @Column({ type: "longtext", nullable:true})
        // service: string

        //  @Column({ type: "longtext", nullable:true})
        // service_package: string

        @Column({ type: "longtext", nullable:true})
        clinic: string
        
        @Column({ type: "int", nullable:true })
        doctorID:number

        @Column({ type: "int", nullable:true })
        medtechID:number

        @Column({ type: "int", default: 0}) //(0 = pending) (1 = done) (2 = working) 
        status: number
        

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
