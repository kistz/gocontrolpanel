export interface Config {
  MONGODB: {
    URI: string;
    DB: string;
  };
  NODE_ENV: string;
  CONNECTOR_URL: string;
  DEFAULT_ADMINS: string[];
  CONNECTOR_API_KEY: string;
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
