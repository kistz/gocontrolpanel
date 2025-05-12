import config from "@/lib/config";
import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: config.CONNECTOR_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAuth.interceptors.request.use(
  (request) => {
    request.headers["Authorization"] = `Bearer ${config.CONNECTOR_API_KEY}`;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);
