"use server";

import { AddHetznerDatabaseSchemaType } from "@/forms/admin/hetzner/database/add-hetzner-database-schema";
import { AddHetznerServerSchemaType } from "@/forms/admin/hetzner/server/add-hetzner-server-schema";
import { AttachHetznerServerToNetworkSchemaType } from "@/forms/admin/hetzner/server/attach-hetzner-server-to-network-schema";
import { doServerActionWithAuth } from "@/lib/actions";
import { axiosHetzner } from "@/lib/axios/hetzner";
import {
  getKeyHetznerRateLimit,
  getKeyHetznerRecentlyCreatedServers,
  getRedisClient,
} from "@/lib/redis";
import { generateRandomString } from "@/lib/utils";
import {
  HetznerServer,
  HetznerServerCache,
  HetznerServersResponse,
} from "@/types/api/hetzner/servers";
import { PaginationResponse, ServerResponse } from "@/types/responses";
import { PaginationState } from "@tanstack/react-table";
import { readFileSync } from "fs";
import { Handlebars } from "@/lib/handlebars";
import path from "path";
import { packageDirectorySync } from "pkg-dir";
import { getApiToken, getHetznerServers, setRateLimit } from "./util";

const root = packageDirectorySync() || process.cwd();

// Dedi template
const dediTemplatePath = path.join(root, "hetzner", "server-init.sh.hbs");
const dediTemplateContent = readFileSync(dediTemplatePath, "utf-8");
export const dediTemplate = Handlebars.compile(dediTemplateContent);

// Database template
const dbTemplatePath = path.join(root, "hetzner", "database-init.sh.hbs");
const dbTemplateContent = readFileSync(dbTemplatePath, "utf-8");
export const dbTemplate = Handlebars.compile(dbTemplateContent);

export async function getHetznerServersPaginated(
  pagination: PaginationState,
  sorting: { field: string; order: "asc" | "desc" },
  filter?: string,
  fetchArgs?: { projectId: string },
): Promise<ServerResponse<PaginationResponse<HetznerServer>>> {
  return doServerActionWithAuth(
    [
      "hetzner:servers:view",
      `hetzner:${fetchArgs?.projectId}:moderator`,
      `hetzner:${fetchArgs?.projectId}:admin`,
    ],
    async () => {
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
    },
  );
}

export async function deleteHetznerServer(
  projectId: string,
  serverId: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    ["hetzner:servers:delete", `hetzner:${projectId}:admin`],
    async () => {
      const token = await getApiToken(projectId);

      const res = await axiosHetzner.delete(`/servers/${serverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const client = await getRedisClient();
      const key = getKeyHetznerRecentlyCreatedServers(projectId);

      const servers = await client.lrange(key, 0, -1);

      const updatedServers = servers
        .map((item) => JSON.parse(item))
        .filter((server: HetznerServerCache) => server.id !== serverId);

      await client.del(key);
      if (updatedServers.length > 0) {
        await client.rpush(
          key,
          ...updatedServers.map((s) => JSON.stringify(s)),
        );
        await client.expire(key, 60 * 60 * 2); // Keep for 2 hours
      }

      await setRateLimit(projectId, res);
    },
  );
}

export async function getRateLimit(
  projectId: string,
): Promise<ServerResponse<{ limit: number; remaining: number }>> {
  return doServerActionWithAuth(
    [
      "hetzner:servers:view",
      `hetzner:${projectId}:moderator`,
      `hetzner:${projectId}:admin`,
    ],
    async () => {
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

        const { limit, remaining } = JSON.parse(newRateLimitData);

        return {
          limit: Math.floor(parseFloat(limit)),
          remaining: Math.floor(parseFloat(remaining)),
        };
      }

      const { limit, remaining } = JSON.parse(rateLimitData);

      return {
        limit: Math.floor(parseFloat(limit)),
        remaining: Math.floor(parseFloat(remaining)),
      };
    },
  );
}

export async function createHetznerServer(
  projectId: string,
  data: AddHetznerServerSchemaType,
): Promise<ServerResponse<HetznerServer>> {
  return doServerActionWithAuth(
    ["hetzner:servers:create", `hetzner:${projectId}:admin`],
    async () => {
      const token = await getApiToken(projectId);

      const dediData = {
        dedi_login: data.dediLogin,
        dedi_password: data.dediPassword,
        room_password: data.roomPassword,
        superadmin_password:
          data.superAdminPassword || generateRandomString(16),
        admin_password: data.adminPassword || generateRandomString(16),
        user_password: data.userPassword || generateRandomString(16),
        filemanager_password:
          data.filemanagerPassword || generateRandomString(16),
      };

      const userData = dediTemplate(dediData);

      const body = {
        name: data.name,
        server_type: parseInt(data.serverType),
        image: parseInt(data.image),
        location: data.location,
        user_data: userData,
        labels: {
          type: "dedi",
          "authorization.superadmin.password": dediData.superadmin_password,
          "authorization.admin.password": dediData.admin_password,
          "authorization.user.password": dediData.user_password,
          "filemanager.password": dediData.filemanager_password,
        },
        public_net: {
          enable_ipv4: true,
          enable_ipv6: false,
        },
      };

      const res = await axiosHetzner.post<{
        server: HetznerServer;
      }>("/servers", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cachedServer: HetznerServerCache = {
        id: res.data.server.id,
        projectId,
        name: res.data.server.name,
        ip: res.data.server.public_net.ipv4?.ip,
        labels: res.data.server.labels,
      };

      const client = await getRedisClient();
      const key = getKeyHetznerRecentlyCreatedServers(projectId);
      await client.lpush(key, JSON.stringify(cachedServer));
      await client.expire(key, 60 * 60 * 2); // Keep for 2 hours

      await setRateLimit(projectId, res);

      return res.data.server;
    },
  );
}

export async function getRecentlyCreatedHetznerServers(): Promise<
  ServerResponse<HetznerServerCache[]>
> {
  return doServerActionWithAuth(
    [`hetzner::moderator`, `hetzner::admin`],
    async (session) => {
      const projectIds = session.user.projects.map((p) => p.id);

      if (projectIds.length === 0) {
        return [];
      }

      const client = await getRedisClient();
      const keys = projectIds.map((id) =>
        getKeyHetznerRecentlyCreatedServers(id),
      );

      const results = await Promise.all(
        keys.map((key) => client.lrange(key, 0, -1)),
      );

      const servers: HetznerServerCache[] = results.flatMap((result) =>
        result.map((item) => JSON.parse(item)),
      );

      return servers;
    },
  );
}

export async function createHetznerDatabase(
  projectId: string,
  data: AddHetznerDatabaseSchemaType,
): Promise<ServerResponse<HetznerServer>> {
  return doServerActionWithAuth(
    ["hetzner:servers:create", `hetzner:${projectId}:admin`],
    async () => {
      const token = await getApiToken(projectId);

      const dbData = {
        db_type: data.databaseType,
        db_root_password: data.databaseRootPassword || generateRandomString(16),
        db_name: data.databaseName,
        db_user: data.databaseUser || generateRandomString(16),
        db_password: data.databasePassword || generateRandomString(16),
      };

      const userData = dbTemplate(dbData);

      const body = {
        name: data.name,
        server_type: parseInt(data.serverType),
        image: parseInt(data.image),
        location: data.location,
        user_data: userData,
        labels: {
          type: "database",
          "database.type": dbData.db_type,
          "authorization.database.name": dbData.db_name,
          "authorization.database.user": dbData.db_user,
          "authorization.database.password": dbData.db_password,
        },
        public_net: {
          enable_ipv4: false,
          enable_ipv6: true,
        },
      };

      const res = await axiosHetzner.post<{
        server: HetznerServer;
      }>("/servers", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await setRateLimit(projectId, res);

      return res.data.server;
    },
  );
}

export async function attachHetznerServerToNetwork(
  projectId: string,
  serverId: number,
  data: AttachHetznerServerToNetworkSchemaType,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    ["hetzner:servers:create", `hetzner:${projectId}:admin`],
    async () => {
      const token = await getApiToken(projectId);

      const body = {
        network: parseInt(data.networkId),
        ip: data.ip,
      };

      const res = await axiosHetzner.post(
        `/servers/${serverId}/actions/attach_to_network`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await setRateLimit(projectId, res);
    },
  );
}

export async function detachHetznerServerFromNetwork(
  projectId: string,
  serverId: number,
  network: number,
): Promise<ServerResponse> {
  return doServerActionWithAuth(
    ["hetzner:servers:create", `hetzner:${projectId}:admin`],
    async () => {
      const token = await getApiToken(projectId);

      const res = await axiosHetzner.post(
        `/servers/${serverId}/actions/detach_from_network`,
        { network },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await setRateLimit(projectId, res);
    },
  );
}

export async function getAllDatabases(
  projectId: string,
): Promise<ServerResponse<HetznerServer[]>> {
  return doServerActionWithAuth(
    ["hetzner:servers:create", `hetzner:${projectId}:admin`],
    async () => {
      const token = await getApiToken(projectId);

      const servers: HetznerServer[] = [];
      let page = 1;
      let totalEntries = 0;

      do {
        const res = await axiosHetzner.get<HetznerServersResponse>("/servers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
            per_page: 50,
          },
        });

        servers.push(...res.data.servers);
        totalEntries = res.data.meta.pagination.total_entries || 0;
        page++;
      } while (servers.length < totalEntries);

      return servers.filter((server) => server.labels.type === "database");
    },
  );
}
