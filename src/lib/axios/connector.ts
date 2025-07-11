import config from "@/lib/config";
import axios from "axios";

export const axiosAuth = axios.create({
  baseURL: config.CONNECTOR_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
