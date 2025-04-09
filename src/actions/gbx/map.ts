"use server";

import { getGbxClient } from "@/gbx/gbxclient";
import { withAuth } from "@/lib/auth";
import { MapInfo } from "@/types/map";

export async function getCurrentMapInfo(): Promise<MapInfo> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  const mapInfo = await client.call("GetCurrentMapInfo");

  if (!mapInfo) {
    throw new Error("Failed to get current map info");
  }

  return mapInfo;
}

export async function getCurrentMapIndex(): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  const mapIndex = await client.call("GetCurrentMapIndex");

  if (typeof mapIndex !== "number") {
    throw new Error("Failed to get current map index");
  }

  return mapIndex;
}
