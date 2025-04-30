import config from "@/lib/config";
import redis from "@/lib/redis";
import { NadeoTokens } from "@/types/nadeo";

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
    throw new Error(`Failed to authenticate with Nadeo: ${response.status}`);
  }

  const tokens: NadeoTokens = await response.json();
  await redis.set(TOKEN_KEY, JSON.stringify(tokens));
}

export async function getTokens(): Promise<NadeoTokens | null> {
  const raw = await redis.get(TOKEN_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function getMapsInfo(mapUids: string[]): Promise<any[]> {
  const url = `${PROD_URL}/maps/?mapUidList=${mapUids.join(",")}`;
  return await doRequest<any[]>(url);
}

export async function getWebIdentities(accountIds: string[]): Promise<any[]> {
  const url = `${PROD_URL}/webidentities/?accountIdList=${accountIds.join(",")}`;
  return await doRequest<any[]>(url);
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
  headers.set("Authorization", `nadeo_v1 t=${tokens!.access_token}`);
  headers.set("User-Agent", config.NADEO.REDIRECT_URI);

  let res = await fetch(url, { ...init, headers });

  if (res.status === 401) {
    await authenticate();
    tokens = await getTokens();
    res = await fetch(url, { ...init, headers });
    headers.set("Authorization", `nadeo_v1 t=${tokens!.access_token}`);
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
