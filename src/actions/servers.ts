"use server";

import { Server } from "@/types/config";
import servers from "../../servers.json";

export async function getServers(): Promise<Server[]> {
  return servers;
}