import { TMXMapSearch } from "@/types/api/tmx";
import "server-only";
import config from "../config";
import { withRateLimit } from "../ratelimiter";

const TMX_URL = "https://trackmania.exchange";

export async function searchTMXMaps(
  queryParams: Record<string, string | number>,
  count: number = 12,
): Promise<TMXMapSearch> {
  const fields = [
    "Authors",
    "AwardCount",
    "GbxMapName",
    "HasThumbnail",
    "MapId",
    "MapUid",
    "Medals.Author",
    "Medals.Gold",
    "Medals.Silver",
    "Medals.Bronze",
    "Name",
    "Tags",
  ];

  const params = new URLSearchParams({
    ...queryParams,
    fields: fields.join(","),
    count: count.toString(),
  });

  const url = `${TMX_URL}/api/maps?${params.toString()}`;

  const data = await doRequest<TMXMapSearch>(url, "tmx:searchMaps");

  return data;
}

async function doRequest<T>(url: string, key: string): Promise<T> {
  return withRateLimit<T>(key, async () => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": config.NADEO.CONTACT,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return res.json();
  });
}
