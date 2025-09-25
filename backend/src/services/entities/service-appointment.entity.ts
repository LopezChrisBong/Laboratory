import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ServiceAppointment {
    @PrimaryGeneratedColumn({type:"int"})
    id:number

    @Column({ type: 'int' })
    patientID: number;

    @Column({ type: 'int', nullable:true })
    appointmentID: number;

    @Column({ type: 'int', nullable:true })
    doctorID: number;

    @Column({ type: 'int', nullable:true })
    medtechID: number;
    
    @Column({ type: "longtext", nullable: true })
    service_list: string;

    @Column({ type: 'longtext', nullable: true })
    package_list: string;

     @Column({ type: "int", default:0 })
    status: number

    
     @Column({ type: "longtext", nullable:true})
    attachment: string

    

    @CreateDateColumn({
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