
type Env = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  array(key: string): string[];
};

type ConfigContext = {
  env: Env;
};

export default ({ env }: ConfigContext) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  app: {
    keys: env.array('APP_KEYS'),
  },
});
