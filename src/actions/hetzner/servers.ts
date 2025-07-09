"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { axiosHetzner } from "@/lib/axios/hetzner";
import { getList } from "@/lib/utils";
import { getHetznerProject } from "../database/hetzner-projects";
import { HetznerServerResponse } from "@/types/api/hetzner/servers";
import { ServerResponse } from "@/types/responses";

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
