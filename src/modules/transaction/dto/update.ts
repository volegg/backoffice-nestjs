import { PartialType } from '@nestjs/mapped-types';
import { TransactionCreateDto } from './create';

export class TransactionUpdateDto extends PartialType(TransactionCreateDto) { }
