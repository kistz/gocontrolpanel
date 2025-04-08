"use server";

import { getGbxClient } from "@/gbx/gbxclient";
import { ServerSettings } from "@/types/server";

const serverVisibilities = ["visible", "hidden", "hidden from nations"];

export async function getServerSettings(): Promise<ServerSettings> {
  const client = await getGbxClient();
  const settings = await client.multicall([
    ["GetServerOptions"], 
    ["GetHideServer"],
    ["IsKeepingPlayerSlots"],
    ["AreHornsDisabled"],
    ["AreServiceAnnouncesDisabled"],
    ["GetSystemInfo"],
    ["GetServerTags"],
    ["AreProfileSkinsDisabled"]
  ]);

  if (!settings) {
    throw new Error("Failed to get server settings");
  }
  
  try {
    const serverOptions = settings[0];
    const serverVisibility = settings[1];
    const keepPlayerSlots = settings[2];
    const hornsDisabled = settings[3];
    const serviceAnnouncesDisabled = settings[4];
    const systemInfo = settings[5];
    const serverTags = settings[6];
    const profileSkinsDisabled = settings[7];
  
    const serverSettings: ServerSettings = {
      defaultOptions: {
        serverName: serverOptions.Name,
        serverComment: serverOptions.Comment,
        serverPassword: serverOptions.Password,
        serverPasswordSpectator: serverOptions.PasswordForSpectator,
        callVoteTimeout: serverOptions.CurrentCallVoteTimeOut/1000,
        callVoteRatio: serverOptions.CallVoteRatio,
        serverVisibility: serverVisibilities[serverVisibility] as "visible" | "hidden" | "hidden from nations",
        maxPlayers: serverOptions.CurrentMaxPlayers,
        maxSpectators: serverOptions.CurrentMaxSpectators,
        keepPlayerSlots: keepPlayerSlots,
        allowMapDownload: serverOptions.AllowChallengeDownload,
        autoSaveReplays: serverOptions.AutoSaveReplays,
        horns: !hornsDisabled,
        serviceAnnouncements: !serviceAnnouncesDisabled,
      },
      downloadRate: systemInfo.ConnectionDownloadRate,
      uploadRate: systemInfo.ConnectionUploadRate,
      serverTags: serverTags.map((tag: any) => ({
        name: tag.Name,
        value: tag.Value,
      })),
      profileSkins: !profileSkinsDisabled,
    }

    return serverSettings;
  } catch (error) {
    console.error("Error parsing server settings:", error);
    throw new Error("Failed to parse server settings");
  }
}