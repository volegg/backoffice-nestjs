import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  Min,
} from 'class-validator';
import { TransactionStatus, TransactionSubType, TransactionType } from '../const';

export class TransactionCreateDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
    type: TransactionType;

  @ApiProperty({ enum: TransactionSubType })
  @IsEnum(TransactionSubType)
    subType: TransactionSubType;

  @ApiProperty()
  @IsNumber()
  @Min(0)
    amount: number;

  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
    status: TransactionStatus;

  @ApiProperty()
  @IsMongoId()
    user: string;
}
