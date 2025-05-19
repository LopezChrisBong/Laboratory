import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ServiceCategory {
    @PrimaryGeneratedColumn({type:"int"})
    id:number
    
    @Column({ type: "varchar", nullable: false })
    category_description: string;

    @Column({ type: 'int', nullable: false })
    service_type: number;

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