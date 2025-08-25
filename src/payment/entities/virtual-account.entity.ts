
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
    providerRef: string

    @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;
    
}
