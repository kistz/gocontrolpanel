export interface Server {
  id: number;
  name: string;
  description?: string;
  host: string;
  xmlrpcPort: number;
  user: string;
  pass: string;
  isLocal: boolean;
  isConnected: boolean;
}

export interface Config {
  MONGODB: {
    URI: string;
    DB: string;
  };
  NODE_ENV: string;
  PORT: number;
  NADEO: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  };
  SERVERS: Server[];
  REDISURI: string;
}
