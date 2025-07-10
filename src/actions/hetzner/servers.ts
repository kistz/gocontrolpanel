"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { axiosHetzner } from "@/lib/axios/hetzner";
import { getKeyHetznerRateLimit, getRedisClient } from "@/lib/redis";
import {
  HetznerServer,
  HetznerServerResponse,
  HetznerServersResponse,
} from "@/types/api/hetzner/servers";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import path from "path";
import { packageDirectorySync } from "pkg-dir";
import { getApiToken, setRateLimit } from "./util";

const root = packageDirectorySync() || process.cwd();
const templatePath = path.join(root, "hetzner", "server-init.sh.hbs");
const templateContent = readFileSync(templatePath, "utf-8");
const template = Handlebars.compile(templateContent);

export async function getHetznerServers(
  projectId: string,
): Promise<ServerResponse<HetznerServersResponse>> {
  return doServerActionWithAuth([], async () => {
    const token = await getApiToken(projectId);

    const res = await axiosHetzner.get<HetznerServersResponse>("/servers", {
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

    const res = await axiosHetzner.get<HetznerServersResponse>("/servers", {
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
      limit: Math.floor(parseFloat(limit)),
      remaining: Math.floor(parseFloat(remaining)),
    };
  });
}

export async function createHetznerServer(
  projectId: string,
): Promise<ServerResponse<HetznerServer>> {
  return doServerActionWithAuth([], async () => {
    const token = await getApiToken(projectId);

    const data = {
      dedi_login: "gcp-test",
      dedi_password: "%J==.E#DLEHNh$,)",
      room_password: "test",
      superadmin_password: "test",
      admin_password: "test",
      user_password: "test",
    };

    const userData = template(data);

    const body = {
      name: "my-server",
      server_type: "cpx11",
      image: "ubuntu-24.04",
      location: "fsn1",
      user_data: userData,
      labels: {
        "authorization.superadmin.password": data.superadmin_password,
        "authorization.admin.password": data.admin_password,
        "authorization.user.password": data.user_password,
      },
      public_net: {
        enable_ipv4: true,
        enable_ipv6: false,
      }
    }

    const res = await axiosHetzner.post<HetznerServerResponse>(
      "/servers",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await setRateLimit(projectId, res);

    console.log("Server created:", res.data);

    return res.data.server;
  });
}
