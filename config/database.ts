
import type { Core } from '@strapi/strapi';

export default ({ env }: Core.Config.Shared.ConfigParams) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'neondb'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: {
        rejectUnauthorized: false,
      },
      schema: env('DATABASE_SCHEMA', 'public'),
    },
    pool: {
      min: 0,
      max: 5,
    },
    acquireConnectionTimeout: 60000,
  },
});
