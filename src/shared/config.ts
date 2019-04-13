export interface Config {
  DATABASE_URL: string;
  PORT: number;
};

const config: Config = {
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite://:memory',
  PORT: Number(process.env.PORT) || 8080
};

export { config };
