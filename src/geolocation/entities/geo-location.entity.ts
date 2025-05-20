import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';

@Entity('geo_locations')
export class GeoLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityType: string; // 'business', 'user', 'appointment'

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  accuracyMeters: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  altitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  formattedAddress: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  administrativeAreaLevel1: string; // Estado/Provincia

  @Column({ type: 'varchar', length: 100, nullable: true })
  administrativeAreaLevel2: string; // Ciudad/Municipio

  @Column({ type: 'varchar', length: 100, nullable: true })
  locality: string; // Ciudad

  @Column({ type: 'varchar', length: 100, nullable: true })
  sublocality: string; // Barrio/Distrito

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  placeId: string; // ID de Google Maps

  @Column({ type: 'enum', enum: ['manual', 'gps', 'ip', 'geocoding'], default: 'manual' })
  verificationMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  lastVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Business, business => business.geoLocation)
  business: Business;
}
