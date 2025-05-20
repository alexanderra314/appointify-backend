import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('user_location_history')
export class UserLocationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  accuracy: number;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  deviceIdentifier: string;

  @Column({ type: 'boolean', default: false })
  isAnonymized: boolean;

  @Column({ type: 'timestamp', nullable: true })
  retentionExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
