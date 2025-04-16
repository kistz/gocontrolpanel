import Redis from "ioredis";
import config from "./config";

const redis = new Redis(config.REDISURI);

export default redis;
