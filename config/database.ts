
type Env = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
};

type ConfigContext = {
  env: Env;
};

export default ({ env }: ConfigContext) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 0,
      max: 5,
    },
    acquireConnectionTimeout: 60000,
  },
});
