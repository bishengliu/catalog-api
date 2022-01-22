import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    type: FilterKey,
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
    type: OrderByKey,
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
