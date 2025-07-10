"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { axiosHetzner } from "@/lib/axios/hetzner";
import { getKeyHetznerRateLimit, getRedisClient } from "@/lib/redis";
import {
  HetznerServer,
  HetznerServerResponse,
} from "@/types/api/hetzner/servers";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";
import { getApiToken, setRateLimit } from "./util";

export async function getHetznerServers(
  projectId: string,
): Promise<ServerResponse<HetznerServerResponse>> {
  return doServerActionWithAuth([], async () => {
    const token = await getApiToken(projectId);

    const res = await axiosHetzner.get<HetznerServerResponse>("/servers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await setRateLimit(projectId, res);

    return res.data;
  });
}

export async function getHetznerServersPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
  fetchArgs?: { projectId: string },
): Promise<ServerResponse<PaginationResponse<HetznerServer>>> {
  return doServerActionWithAuth([], async () => {
    const { projectId } = fetchArgs || {};
    if (!projectId) {
      throw new Error("Project ID is required to fetch Hetzner servers.");
    }

    const token = await getApiToken(projectId);

    const params = new URLSearchParams({
      page: pagination.pageIndex.toString(),
      per_page: pagination.pageSize.toString(),
      sort: `${sorting.field}:${sorting.order.toLowerCase()}`,
    });

    if (filter) {
      params.append("name", filter);
    }

    const res = await axiosHetzner.get<HetznerServerResponse>("/servers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    
    await setRateLimit(projectId, res);

    return {
      data: res.data.servers,
      totalCount: res.data.meta.pagination.total_entries || 0,
    };
  });
}

export async function deleteHetznerServer(
  projectId: string,
  serverId: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth([], async () => {
    const token = await getApiToken(projectId);

    const res = await axiosHetzner.delete(`/servers/${serverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await setRateLimit(projectId, res);
  });
}

export async function getRateLimit(
  projectId: string,
): Promise<ServerResponse<{ limit: number; remaining: number }>> {
  return doServerActionWithAuth([], async () => {
    const client = await getRedisClient();
    const rateLimitData = await client.get(getKeyHetznerRateLimit(projectId));

    if (!rateLimitData) {
      await getHetznerServers(projectId);
      const newRateLimitData = await client.get(
        getKeyHetznerRateLimit(projectId),
      );
      if (!newRateLimitData) {
        throw new Error("Rate limit data not found after fetching servers.");
      }
      return JSON.parse(newRateLimitData);
    }

    const { limit, remaining } = JSON.parse(rateLimitData);

    return {
      limit: parseFloat(limit).toFixed(0),
      remaining: parseFloat(remaining).toFixed(0),
    };
  });
}
