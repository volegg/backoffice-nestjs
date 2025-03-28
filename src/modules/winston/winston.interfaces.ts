import { ModuleMetadata } from '@nestjs/common/interfaces';
import { AnyType } from '../../types';
import { LoggerOptions } from 'winston';

export type WinstonModuleOptions = LoggerOptions;

export interface WinstonModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: AnyType[])
    => Promise<WinstonModuleOptions> | WinstonModuleOptions;
  inject?: AnyType[];
}
