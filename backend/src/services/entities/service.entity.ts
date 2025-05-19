import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Service {

     @PrimaryGeneratedColumn({ type: 'int' })
        id: number

        @Column({ type: "int" })
        service_type: number  //1 = laboratory, 2 = imaging, 3 = packages

         @Column({ type: "varchar" })
        service_description: string

         @Column({ type: "varchar", nullable:true })
        service_category: string

         @Column({ type: "int", nullable:true })
        service_price: number

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
