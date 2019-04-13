export interface Config {
  DATABASE_URL: string;
  PORT: number;
  LOG_LEVEL: string;
  ENVIRONMENT: string;
};

const config: Config = {
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite://:memory',
  PORT: Number(process.env.PORT) || 8080,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENVIRONMENT: process.env.ENVIRONMENT || 'local'
};

export { config };
