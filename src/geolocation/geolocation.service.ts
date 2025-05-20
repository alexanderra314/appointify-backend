import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoLocation } from './entities/geo-location.entity';
import { Business } from '../business/entities/business.entity';
import { NearbyBusinessesDto } from './dto/nearby-businesses.dto';
import { UserLocationHistory } from './entities/user-location-history.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeolocationService {
  private readonly googleMapsApiKey: string;

  constructor(
    @InjectRepository(GeoLocation)
    private geoLocationRepository: Repository<GeoLocation>,
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    @InjectRepository(UserLocationHistory)
    private userLocationHistoryRepository: Repository<UserLocationHistory>,
    private configService: ConfigService,
  ) {
    this.googleMapsApiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
  }

  /**
   * Encuentra negocios cercanos a una ubicación dada
   */
  async findNearbyBusinesses(params: NearbyBusinessesDto) {
    const { latitude, longitude, radius, categories, minRating } = params;
    
    // Consulta SQL con PostGIS para encontrar negocios cercanos
    const query = this.businessRepository
      .createQueryBuilder('business')
      .innerJoin('business.geoLocation', 'geoLocation')
      .select([
        'business.id',
        'business.name',
        'business.description',
        'business.category',
        'business.rating',
        'business.imageUrl',
        'geoLocation.latitude',
        'geoLocation.longitude',
        'geoLocation.formattedAddress',
        `ST_Distance(
          ST_SetSRID(ST_MakePoint(geoLocation.longitude, geoLocation.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography
        ) as distance`,
      ])
      .where(`ST_DWithin(
        ST_SetSRID(ST_MakePoint(geoLocation.longitude, geoLocation.latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
        :radius
      )`)
      .andWhere('business.isActive = :isActive', { isActive: true })
      .setParameters({
        latitude,
        longitude,
        radius: radius * 1000, // Convertir km a metros
      })
      .orderBy('distance', 'ASC');

    // Aplicar filtros adicionales si se proporcionan
    if (categories && categories.length > 0) {
      query.andWhere('business.category IN (:...categories)', { categories });
    }

    if (minRating) {
      query.andWhere('business.rating >= :minRating', { minRating });
    }

    const businesses = await query.getMany();

    // Transformar resultados para incluir la distancia en km
    return businesses.map((business: any) => ({
      ...business,
      distance: parseFloat((business.distance / 1000).toFixed(2)), // Convertir metros a km
    }));
  }

  /**
   * Guarda la ubicación de un usuario
   */
  async saveUserLocation(locationData: { userId: string; latitude: number; longitude: number; accuracy?: number }) {
    const { userId, latitude, longitude, accuracy } = locationData;

    // Guardar en el historial de ubicaciones
    const locationHistory = this.userLocationHistoryRepository.create({
      userId,
      latitude,
      longitude,
      accuracy: accuracy || null,
      recordedAt: new Date(),
    });
    await this.userLocationHistoryRepository.save(locationHistory);

    // Actualizar la última ubicación conocida del usuario
    // Esto podría estar en un servicio de usuario separado
    // pero lo incluimos aquí para simplificar
    /*
    await this.userRepository.update(
      { id: userId },
      { 
        lastKnownLatitude: latitude,
        lastKnownLongitude: longitude,
        lastLocationUpdate: new Date()
      }
    );
    */

    return { success: true, message: 'User location saved successfully' };
  }

  /**
   * Calcula la distancia a un negocio específico
   */
  async calculateDistanceToBusiness(
    businessId: string,
    fromLatitude: number,
    fromLongitude: number,
  ) {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['geoLocation'],
    });

    if (!business || !business.geoLocation) {
      throw new Error('Business or business location not found');
    }

    // Calcular distancia usando PostGIS
    const result = await this.businessRepository.query(`
      SELECT ST_Distance(
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography
      ) as distance
    `, [
      business.geoLocation.longitude,
      business.geoLocation.latitude,
      fromLongitude,
      fromLatitude,
    ]);

    const distanceInMeters = parseFloat(result[0].distance);
    const distanceInKm = distanceInMeters / 1000;

    return {
      businessId,
      distance: {
        meters: Math.round(distanceInMeters),
        kilometers: parseFloat(distanceInKm.toFixed(2)),
      },
    };
  }

  /**
   * Geocodifica una dirección a coordenadas
   */
  async geocodeAddress(address: string) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: this.googleMapsApiKey,
          },
        },
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;

        return {
          latitude: lat,
          longitude: lng,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          components: result.address_components,
        };
      }

      throw new Error(`Geocoding failed: ${response.data.status}`);
    } catch (error) {
      throw new Error(`Geocoding error: ${error.message}`);
    }
  }

  /**
   * Geocodificación inversa: coordenadas a dirección
   */
  async reverseGeocode(latitude: number, longitude: number) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: this.googleMapsApiKey,
          },
        },
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];

        return {
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
          components: result.address_components,
        };
      }

      throw new Error(`Reverse geocoding failed: ${response.data.status}`);
    } catch (error) {
      throw new Error(`Reverse geocoding error: ${error.message}`);
    }
  }
}
