import { IsNotEmpty, IsNumber, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NearbyBusinessesDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 40.7128,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  @Type(() => Number)
  latitude: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -74.006,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  @Type(() => Number)
  longitude: number;

  @ApiProperty({
    description: 'Search radius in kilometers',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(50)
  @Type(() => Number)
  radius?: number;

  @ApiProperty({
    description: 'Filter by business categories',
    example: ['Hair Salon', 'Spa'],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiProperty({
    description: 'Minimum rating filter (1-5)',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  minRating?: number;
}
