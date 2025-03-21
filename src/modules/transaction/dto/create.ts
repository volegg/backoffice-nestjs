import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber } from 'class-validator';
import { TransactionStatus, TransactionSubType, TransactionType } from '../../../const';
import { Types } from 'mongoose';

export class TransactionCreateDto {
  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
    type: string;

  @ApiProperty({ enum: TransactionSubType })
  @IsEnum(TransactionSubType)
    subType: string[];

  @ApiProperty()
  @IsNumber()
    amount: number;

  @ApiProperty({ enum: TransactionStatus })
  @IsEnum(TransactionStatus)
    status: string;

  @ApiProperty()
  @IsMongoId()
    user: Types.ObjectId;
}
