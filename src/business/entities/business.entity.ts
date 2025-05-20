import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { GeoLocation } from '../../geolocation/entities/geo-location.entity';
import { Service } from './service.entity';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Tenant } from '../../auth/entities/tenant.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImageUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'jsonb', nullable: true })
  businessHours: object;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: true })
  isVisibleOnMap: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  searchBoostScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @OneToOne(() => GeoLocation, geoLocation => geoLocation.business, { cascade: true })
  geoLocation: GeoLocation;

  @OneToMany(() => Service, service => service.business)
  services: Service[];

  @OneToMany(() => Appointment, appointment => appointment.business)
  appointments: Appointment[];
}
