import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GeolocationService } from './geolocation.service';
import { NearbyBusinessesDto } from './dto/nearby-businesses.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('geolocation')
@Controller('api/geolocation')
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Get('nearby-businesses')
  @ApiOperation({ summary: 'Get nearby businesses' })
  @ApiResponse({ status: 200, description: 'Returns a list of nearby businesses' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'categories', required: false, type: [String] })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  async getNearbyBusinesses(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 5,
    @Query('categories') categories?: string[],
    @Query('minRating') minRating?: number,
  ) {
    return this.geolocationService.findNearbyBusinesses({
      latitude,
      longitude,
      radius,
      categories,
      minRating,
    });
  }

  @Post('user-location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save user location' })
  @ApiResponse({ status: 201, description: 'User location saved successfully' })
  async saveUserLocation(
    @Body() locationData: { userId: string; latitude: number; longitude: number; accuracy?: number }
  ) {
    return this.geolocationService.saveUserLocation(locationData);
  }

  @Get('business/:id/distance')
  @ApiOperation({ summary: 'Calculate distance to a business' })
  @ApiResponse({ status: 200, description: 'Returns the distance to the business' })
  @ApiQuery({ name: 'fromLatitude', required: true, type: Number })
  @ApiQuery({ name: 'fromLongitude', required: true, type: Number })
  async getDistanceToBusiness(
    @Param('id') businessId: string,
    @Query('fromLatitude') fromLatitude: number,
    @Query('fromLongitude') fromLongitude: number,
  ) {
    return this.geolocationService.calculateDistanceToBusiness(
      businessId,
      fromLatitude,
      fromLongitude,
    );
  }

  @Get('geocode')
  @ApiOperation({ summary: 'Geocode an address' })
  @ApiResponse({ status: 200, description: 'Returns geocoded coordinates' })
  @ApiQuery({ name: 'address', required: true, type: String })
  async geocodeAddress(@Query('address') address: string) {
    return this.geolocationService.geocodeAddress(address);
  }

  @Get('reverse-geocode')
  @ApiOperation({ summary: 'Reverse geocode coordinates' })
  @ApiResponse({ status: 200, description: 'Returns address for coordinates' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  async reverseGeocode(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
  ) {
    return this.geolocationService.reverseGeocode(latitude, longitude);
  }
}
