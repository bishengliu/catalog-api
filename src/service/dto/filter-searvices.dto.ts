import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export enum FilterKey {
  SERVICE = 'service',
  DESCRIPTION = 'description',
}

export enum OrderByKey {
  SERVICE = 'service',
  CREATEDATE = 'createAt',
}

export class FilterServicesDto {
  @ApiProperty({
    enum: FilterKey,
  })
  @IsString()
  @IsNotEmpty()
  filterKey: FilterKey;

  @ApiProperty({
    type: String,
    minimum: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  filterValue: string;

  @ApiProperty({
    enum: OrderByKey,
  })
  OrderBy: OrderByKey;

  @ApiProperty({
    type: Number,
  })
  limits: number;

  @ApiProperty({
    type: Number,
  })
  offset: number;
}
