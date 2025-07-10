"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { axiosHetzner } from "@/lib/axios/hetzner";
import { getRedisClient } from "@/lib/redis";
import { getList } from "@/lib/utils";
import {
  HetznerServer,
  HetznerServerResponse,
} from "@/types/api/hetzner/servers";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";
import { getHetznerProject } from "../database/hetzner-projects";

export async function getHetznerServers(
  projectId: string,
): Promise<ServerResponse<HetznerServerResponse>> {
  return doServerActionWithAuth([], async () => {
    const { data: project } = await getHetznerProject(projectId);

    const apiTokens = getList(project?.apiTokens);

    if (apiTokens.length === 0) {
      throw new Error("No API tokens found for the Hetzner project.");
    }

    const res = await axiosHetzner.get<HetznerServerResponse>("/servers", {
      headers: {
        Authorization: `Bearer ${apiTokens[0]}`,
      },
    });

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
    const client = await getRedisClient();
    const data = await client.get("hetzner");
    console.log("Hetzner servers data from cache:", data);
    if (data) {
      const parsedData = JSON.parse(data);
      return {
        data: parsedData.data,
        totalCount: parsedData.totalCount,
      };
    }

    const { data: project } = await getHetznerProject(projectId);
    const apiTokens = getList(project?.apiTokens);

    if (apiTokens.length === 0) {
      throw new Error("No API tokens found for the Hetzner project.");
    }

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
        Authorization: `Bearer ${apiTokens[0]}`,
      },
      params,
    });

    await client.set(
      "hetzner",
      JSON.stringify({
        data: res.data.servers,
        totalCount: res.data.meta.pagination.total_entries || 0,
      }),
    );

    return {
      data: res.data.servers,
      totalCount: res.data.meta.pagination.total_entries || 0,
    };
  });
}
