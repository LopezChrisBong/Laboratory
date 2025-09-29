import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ServiceLabResult {

     @PrimaryGeneratedColumn({ type: 'int' })
        id: number

        @Column({ type: "int" })
        labID: number 

         @Column({ type: "int" })
        patientID: number

          @Column({ type: "int" })
        serviceID: number

         @Column({ type: "longtext"})
        service_description: string

         @Column({ type: "int", nullable:true })
        service_price: number

          @Column({ type: "longtext", nullable:true })
        service_result: string

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
