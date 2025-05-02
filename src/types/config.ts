export interface Config {
  MONGODB: {
    URI: string;
    DB: string;
  };
  NODE_ENV: string;
  PORT: number;
  CONNECTOR_URL: string;
  DEFAULT_ADMINS: string[];
  NADEO: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
    SERVER_LOGIN: string;
    SERVER_PASSWORD: string;
    CONTACT: string;
  };
  REDISURI: string;
}
