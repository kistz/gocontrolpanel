"use server";

import { getGbxClient } from "@/gbx/gbxclient";
import { withAuth } from "@/lib/auth";
import { MapInfo } from "@/types/map";

export async function getCurrentMapInfo(server: number): Promise<MapInfo> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const mapInfo = await client.call("GetCurrentMapInfo");

  if (!mapInfo) {
    throw new Error("Failed to get current map info");
  }

  return mapInfo;
}

export async function getCurrentMapIndex(server: number): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const mapIndex = await client.call("GetCurrentMapIndex");

  if (typeof mapIndex !== "number") {
    throw new Error("Failed to get current map index");
  }

  return mapIndex;
}

export async function jumpToMap(server: number, index: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("JumpToMapIndex", index);
}

export async function setNextMap(server: number, index: number): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("SetNextMapIndex", index);
}

export async function addMap(server: number, filename: string): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("AddMap", filename);
}

export async function addMapList(server: number, filenames: string[]): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const res = await client.call("AddMapList", filenames);

  if (typeof res !== "number") {
    throw new Error("Failed to add map list");
  }

  return res;
}

export async function removeMap(server: number, filename: string): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("RemoveMap", filename);
}

export async function removeMapList(server: number, filenames: string[]): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const res = await client.call("RemoveMapList", filenames);

  if (typeof res !== "number") {
    throw new Error("Failed to remove map list");
  }

  return res;
}

export async function insertMap(server: number, filename: string): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  await client.call("InsertMap", filename);
}

export async function insertMapList(server: number, filenames: string[]): Promise<number> {
  await withAuth(["admin"]);

  const client = await getGbxClient(server);
  const res = await client.call("InsertMapList", filenames);

  if (typeof res !== "number") {
    throw new Error("Failed to insert map list");
  }

  return res;
}