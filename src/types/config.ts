
export interface Config {
  MONGODB: {
    URI: string;
    DB: string;
  };
  NODE_ENV: string;
  PORT: number;
  CONNECTOR_URL: string;
  NADEO: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  };
  REDISURI: string;
}
