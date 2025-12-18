import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Notification {
          @PrimaryGeneratedColumn({ type: 'int' })
            id: number
    
            @Column({ type: "int", nullable:true })
            patientID: number

             @Column({ type: "text" })
            title: string

            @Column({ type: "text" })
            message: string
            

             @Column({ type: "text" })
            route: string

             @Column({ type: "boolean", default:false })
            read: boolean
            
            @Column({ type: "int" })
            assignedID:number

            @Column({ type: "int", nullable:true })
            appointmentID:number
    
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
