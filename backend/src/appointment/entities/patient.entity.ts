import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Patient {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number

    @Column({ type: "varchar", nullable: true,})
    patientID: string

    @Column({ type: "varchar"})
    // @Column({ type: "varchar" })
    f_name: string
    
    @Column({ type: "varchar"})
    // @Column({ type: "varchar" })
    l_name: string

    
    @Column({ type: "varchar", nullable:true })
    m_name: string

     @Column({ type: "varchar", nullable:true })
    suffix: string

    
    @Column({ type: "int" })
    age: number

    
    @Column({ type: "varchar" })
    civil_status: string

    
    @Column({ type: "varchar" })
    occupation: string

    
    @Column({ type: "varchar" })
    gender: string

    @Column({ type: "varchar" })
    region: string

    @Column({ type: "varchar" })
    province: string


    @Column({ type: "varchar" })
    city_muni: string

    @Column({ type: "varchar" })
    baranggay: string

    @Column({ type: "varchar" })
    purok: string

    @Column({ type: "varchar", nullable:true })
    spouse: string
    
    @Column({ type: "bigint" })
    contact_no: number

    @Column({ type: "varchar" })
    b_date: string

    
    @Column({ type: "varchar" })
    address: string

       
    @Column({ type: "int", default:0 })
    status: number
    
    @Column({ type: "int", nullable:true })
    doctorID:number

    @Column({ type: "int", nullable:true })
    medtechID:number



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
