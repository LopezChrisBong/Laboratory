import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DoctorsSchedule {
      @PrimaryGeneratedColumn({ type: 'int' })
        id: number

        @Column({ type: "int" })
        doctorID: number

        @Column({ type: "varchar"})
        date: string

         @Column({ type: "varchar"})
        day: string

        @Column({ type: "varchar"})
        timeFrom: string

         @Column({ type: "varchar"})
        timeTo: string

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