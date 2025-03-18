import { parse } from 'dotenv';
import * as joi from '@hapi/joi';
import * as fs from 'fs';

export interface EnvConfig {
  [key: string]: string;
}
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = parse(fs.readFileSync(filePath));
    this.envConfig = ConfigService.validateInput(config);
  }

  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: joi.ObjectSchema = joi.object({
      APP_ENV: joi
        .string()
        .valid('dev', 'prod')
        .default('dev'),
      APP_URL: joi.string().uri({
        scheme: [/https?/],
      }),
      WEBTOKEN_SECRET_KEY: joi.string().required(),
      WEBTOKEN_EXPIRATION_TIME: joi.number().default(1800),
      DB_URL: joi.string().regex(/^mongodb/),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  isEnv(env: string): boolean {
    return this.envConfig.APP_ENV === env;
  }
}
