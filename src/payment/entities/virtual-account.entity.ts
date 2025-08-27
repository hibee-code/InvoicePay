
import { Business } from 'src/business/entities/business.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class VirtualAccount {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

	@Column({ type: 'bigint' })
	businessId: string;

    @Column({ type: 'varchar' })
    accountNumber: string;

    @Column({ type: 'varchar' })
    bankName: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    providerRef?: string;
    
    //relation 
    @ManyToOne(() => Business, business => business.virtualAccounts)
    business: Business;


    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
    
}
