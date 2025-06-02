"use server";
import config from "@/lib/config";
import { MapInfo, NadeoTokens, WebIdentity } from "@/types/api/nadeo";
import { ServerError, ServerResponse } from "@/types/responses";
import { doServerAction } from "../actions";
import { getRedisClient } from "../redis";

const TOKEN_KEY = "nadeo:tokens";

const PROD_URL = "https://prod.trackmania.core.nadeo.online";

// This function is used to authenticate with the Nadeo API and store the tokens in Redis.
export async function authenticate(
  audience: string = "NadeoServices",
): Promise<void> {
  const login = config.NADEO.SERVER_LOGIN;
  const pass = config.NADEO.SERVER_PASSWORD;
  const contact = config.NADEO.CONTACT;

  const auth = Buffer.from(`${login}:${pass}`).toString("base64");

  console.log("Authenticating with Nadeo...");
  const response = await fetch(`${PROD_URL}/v2/authentication/token/basic`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "User-Agent": contact,
    },
    body: JSON.stringify({ audience }),
  });

  if (!response.ok) {
    throw new ServerError(
      `Failed to authenticate with Nadeo: ${response.status}`,
    );
  }

  const redis = await getRedisClient();

  const tokens: NadeoTokens = await response.json();
  await redis.set(TOKEN_KEY, JSON.stringify(tokens), "EX", 3600); // Store tokens for 1 hour
}

export async function getTokens(): Promise<NadeoTokens | null> {
  const redis = await getRedisClient();
  const raw = await redis.get(TOKEN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function getMapsInfo(
  mapUids: string[],
): Promise<ServerResponse<MapInfo[]>> {
  return doServerAction(async () => {
    const url = `${PROD_URL}/maps/?mapUidList=${mapUids.join(",")}`;
    return await doRequest<MapInfo[]>(url);
  });
}

export async function getWebIdentities(
  accountIds: string[],
): Promise<ServerResponse<WebIdentity[]>> {
  return doServerAction(async () => {
    const url = `${PROD_URL}/webidentities/?accountIdList=${accountIds.join(",")}`;
    return await doRequest<WebIdentity[]>(url);
  });
}

export async function doRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  let tokens = await getTokens();
  if (!tokens) {
    await authenticate();
    tokens = await getTokens();
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `nadeo_v1 t=${tokens!.accessToken}`);
  headers.set("User-Agent", config.NADEO.CONTACT);

  console.log("Requesting Nadeo API:", url);
  let res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    await authenticate();
    tokens = await getTokens();
    console.log("Retrying Nadeo API request with new tokens");
    headers.set("Authorization", `nadeo_v1 t=${tokens!.accessToken}`);
    res = await fetch(url, { ...init, headers });
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
