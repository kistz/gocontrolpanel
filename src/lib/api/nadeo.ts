import config from "@/lib/config";
import {
  AccountNames,
  ClubActivitiesResponse,
  ClubCampaignsResponse,
  MapInfo,
  MonthMapListResponse,
  NadeoTokens,
  SeasonalCampaignsResponse,
  ShortsCampaignsResponse,
  TrackmaniaCredentials,
  WebIdentity,
} from "@/types/api/nadeo";
import { ServerError, ServerResponse } from "@/types/responses";
import "server-only";
import { doServerAction } from "../actions";
import { withRateLimit } from "../ratelimiter";
import { getRedisClient } from "../redis";

const getTokenKey = (audience: string) => `nadeo:tokens:${audience}`;
const CREDENTIALS_TOKEN_KEY = "nadeo:credentials_token";

const PROD_URL = "https://prod.trackmania.core.nadeo.online";
const API_URL = "https://api.trackmania.com/api";
const LIVE_URL = "https://live-services.trackmania.nadeo.live";

// This function is used to authenticate with the Nadeo API and store the tokens in Redis.
export async function authenticate(
  audience: string = "NadeoServices",
): Promise<NadeoTokens> {
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

  console.log("Authenticated successfully with Nadeo");

  const redis = await getRedisClient();

  const tokens: NadeoTokens = await response.json();
  await redis.set(getTokenKey(audience), JSON.stringify(tokens), "EX", 3600); // Store tokens for 1 hour
  return tokens;
}

// This function is used to authenticate with the Trackmania API and store the credentials token in Redis.
export async function authenticateCredentials(): Promise<string> {
  const clientId = config.NADEO.CLIENT_ID;
  const clientSecret = config.NADEO.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new ServerError(
      "Nadeo client ID and secret are required for authentication.",
    );
  }

  console.log("Authenticating with Trackmania API...");
  const response = await fetch(`${API_URL}/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new ServerError(
      `Failed to authenticate with Trackmania API: ${response.status}`,
    );
  }

  console.log("Authenticated successfully with Trackmania API");

  const redis = await getRedisClient();

  const credentials: TrackmaniaCredentials = await response.json();
  await redis.set(
    CREDENTIALS_TOKEN_KEY,
    credentials.access_token,
    "EX",
    credentials.expires_in,
  );
  return credentials.access_token;
}

export async function getTokens(
  audience: string = "NadeoServices",
): Promise<NadeoTokens | null> {
  const redis = await getRedisClient();
  const raw = await redis.get(getTokenKey(audience));
  return raw ? JSON.parse(raw) : null;
}

export async function getCredentialsToken(): Promise<string | null> {
  const redis = await getRedisClient();
  const raw = await redis.get(CREDENTIALS_TOKEN_KEY);
  return raw;
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

export async function searchAccountNames(
  accountNames: string[],
): Promise<ServerResponse<AccountNames>> {
  return doServerAction(async () => {
    const url = `${API_URL}/display-names/account-ids`;
    const params = new URLSearchParams();
    accountNames.forEach((name) => params.append("displayName[]", name));

    return await doCredentialsRequest<AccountNames>(
      `${url}?${params.toString()}`,
    );
  });
}

export async function getTotdRoyalMaps(
  length: number = 1,
  offset: number = 0,
  royal: boolean = false,
): Promise<MonthMapListResponse> {
  const url = `${LIVE_URL}/api/token/campaign/month?length=${length}&offset=${offset}&royal=${royal}`;
  return await doRequest<MonthMapListResponse>(url, "NadeoLiveServices");
}

export async function getSeasonalCampaigns(
  length: number = 1,
  offset: number = 0,
): Promise<SeasonalCampaignsResponse> {
  const url = `${LIVE_URL}/api/campaign/official?length=${length}&offset=${offset}`;
  return await doRequest<SeasonalCampaignsResponse>(url, "NadeoLiveServices");
}

export async function getShortsCampaigns(
  length: number = 1,
  offset: number = 0,
): Promise<ShortsCampaignsResponse> {
  const url = `${LIVE_URL}/api/campaign/weekly-shorts?length=${length}&offset=${offset}`;
  return await doRequest<ShortsCampaignsResponse>(url, "NadeoLiveServices");
}

export async function getClubCampaigns(
  length: number = 1,
  offset: number = 0,
  name: string = "",
): Promise<ClubCampaignsResponse> {
  const url = `${LIVE_URL}/api/token/club/campaign?length=${length}&offset=${offset}&name=${encodeURIComponent(
    name,
  )}`;
  return await doRequest<ClubCampaignsResponse>(url, "NadeoLiveServices");
}

export async function getClubActivities(
  clubId: number,
  length: number = 1,
  offset: number = 0,
): Promise<ClubActivitiesResponse> {
  const url = `${LIVE_URL}/api/token/club/${clubId}/activity?length=${length}&offset=${offset}&active=true`;
  return await doRequest<ClubActivitiesResponse>(url, "NadeoLiveServices");
}

export async function doRequest<T>(
  url: string,
  audience: string = "NadeoServices",
  init: RequestInit = {},
): Promise<T> {
  return withRateLimit("nadeo:doRequest", async () => {
    let tokens = await getTokens(audience);
    if (!tokens) {
      tokens = await authenticate(audience);
    }

    const headers = new Headers(init.headers);
    headers.set("Authorization", `nadeo_v1 t=${tokens.accessToken}`);
    headers.set("User-Agent", config.NADEO.CONTACT);

    console.log("Requesting Nadeo API:", url);
    let res = await fetch(url, { ...init, headers });

    if (res.status === 401) {
      tokens = await authenticate(audience);
      console.log("Retrying Nadeo API request with new tokens");
      headers.set("Authorization", `nadeo_v1 t=${tokens.accessToken}`);
      res = await fetch(url, { ...init, headers });
    }

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  });
}

export async function doCredentialsRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  return withRateLimit("nadeo:doCredentialsRequest", async () => {
    let token = await getCredentialsToken();
    if (!token) {
      token = await authenticateCredentials();
    }

    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("User-Agent", config.NADEO.CONTACT);

    console.log("Requesting Trackmania API:", url);
    let res = await fetch(url, { ...init, headers });

    if (res.status === 401) {
      token = await authenticateCredentials();
      console.log("Retrying Trackmania API request with new token");
      headers.set("Authorization", `Bearer ${token}`);
      res = await fetch(url, { ...init, headers });
    }

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  });
}
