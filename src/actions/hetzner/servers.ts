"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { axiosHetzner } from "@/lib/axios/hetzner";
import { getList } from "@/lib/utils";
import { getHetznerProject } from "../database/hetzner-projects";
import { HetznerServerResponse } from "@/types/api/hetzner/servers";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";

export async function getHetznerServers(projectId: string): Promise<ServerResponse<HetznerServerResponse>> {
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
  sorting: { field: string; order: 'asc' | 'desc' },
  filter?: string,
  fetchArgs?: { projectId: string }
): Promise<ServerResponse<PaginationResponse<HetznerServerResponse>>> {
  return doServerActionWithAuth([], async () => {
    const { projectId } = fetchArgs || {};
    if (!projectId) {
      throw new Error("Project ID is required to fetch Hetzner servers.");
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

    const res = await axiosHetzner.get<HetznerServerResponse>("/servers", {
      headers: {
        Authorization: `Bearer ${apiTokens[0]}`,
      },
      params: {
      },
    });

    return {
      data: res.data,
      totalCount: res.data.length,
    };
  });
}