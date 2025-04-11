"use server";

import { getGbxClient } from "@/gbx/gbxclient";
import { withAuth } from "@/lib/auth";
import { getFiles } from "@/lib/server-utils";
import { ServerSettings } from "@/types/server";

export async function getServerSettings(): Promise<ServerSettings> {
  await withAuth(["admin"]);

  const client = await getGbxClient();
  const settings = await client.multicall([
    ["GetServerOptions"],
    ["GetHideServer"],
    ["IsKeepingPlayerSlots"],
    ["AreHornsDisabled"],
    ["AreServiceAnnouncesDisabled"],
    ["GetSystemInfo"],
    ["AreProfileSkinsDisabled"],
    ["IsMapDownloadAllowed"],
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
    const profileSkinsDisabled = settings[6];
    const mapDownloadAllowed = settings[7];

    const serverSettings: ServerSettings = {
      defaultOptions: {
        Name: serverOptions.Name,
        Comment: serverOptions.Comment,
        Password: serverOptions.Password,
        PasswordForSpectator: serverOptions.PasswordForSpectator,
        NextCallVoteTimeOut: serverOptions.CurrentCallVoteTimeOut / 1000,
        CallVoteRatio: serverOptions.CallVoteRatio * 100,
        HideServer: serverVisibility,
        NextMaxPlayers: serverOptions.NextMaxPlayers,
        NextMaxSpectators: serverOptions.NextMaxSpectators,
        KeepPlayerSlots: keepPlayerSlots,
        AutoSaveReplays: serverOptions.AutoSaveReplays,
        DisableHorns: !hornsDisabled,
        DisableServiceAnnounces: !serviceAnnouncesDisabled,
      },
      allowMapDownload: mapDownloadAllowed,
      downloadRate: systemInfo.ConnectionDownloadRate,
      uploadRate: systemInfo.ConnectionUploadRate,
      profileSkins: !profileSkinsDisabled,
    };

    return serverSettings;
  } catch (error) {
    console.error("Error parsing server settings:", error);
    throw new Error("Failed to parse server settings");
  }
}

export async function saveServerSettings(
  serverSettings: ServerSettings,
): Promise<void> {
  await withAuth(["admin"]);

  const client = await getGbxClient();

  serverSettings.defaultOptions.NextCallVoteTimeOut *= 1000; // Convert to milliseconds
  serverSettings.defaultOptions.CallVoteRatio /= 100; // Convert to 0-1 range
  serverSettings.defaultOptions.DisableHorns =
    !serverSettings.defaultOptions.DisableHorns;
  serverSettings.defaultOptions.DisableServiceAnnounces =
    !serverSettings.defaultOptions.DisableServiceAnnounces;

  const res = await client
    .multicall([
      ["SetServerOptions", serverSettings.defaultOptions],
      [
        "SetConnectionRates",
        serverSettings.downloadRate,
        serverSettings.uploadRate,
      ],
      ["DisableProfileSkins", !serverSettings.profileSkins],
      ["AllowMapDownload", serverSettings.allowMapDownload],
    ])
    .catch((error) => {
      console.error("Error saving server settings:", error);
      throw new Error("Failed to save server settings");
    });

  if (!res) {
    throw new Error("Failed to save server settings");
  }

  if (!res[0]) {
    throw new Error("Failed to save server settings");
  } else if (!res[1]) {
    throw new Error("Failed to save connection rates");
  } else if (!res[2]) {
    throw new Error("Failed to save profile skins");
  } else if (!res[3]) {
    throw new Error("Failed to save map download settings");
  }
}

export async function getScripts(): Promise<string[]> {
  await withAuth(["admin"]);

  const defaultScripts = [
    "Trackmania/TM_TimeAttack_Online.Script.txt",
    "Trackmania/TM_Laps_Online.Script.txt",
    "Trackmania/TM_Rounds_Online.Script.txt",
    "Trackmania/TM_Cup_Online.Script.txt",
    "Trackmania/TM_Teams_Online.Script.txt",
    "Trackmania/TM_Knockout_Online.Script.txt",
    "Trackmania/Deprecated/TM_Champion_Online.Script.txt",
    "Trackmania/TM_RoyalTimeAttack_Online.Script.txt",
    "Trackmania/TM_StuntMulti_Online.Script.txt",
    "Trackmania/TM_Platform_Online.Script.txt",
    "TrackMania/TM_TMWC2023_Online.Script.txt",
    "TrackMania/TM_TMWTTeams_Online.Script.txt",
  ];

  try {
    const client = await getGbxClient();
    const userDataDirectory = await client.call("GameDataDirectory");
  
    if (!userDataDirectory) {
      throw new Error("Failed to get UserData directory");
    }
  
    const scriptsDirectory = userDataDirectory + "Scripts/Modes/";
    const scripts = await getFiles(scriptsDirectory, /.*\.Script\.txt$/);
  
    const validScripts = scripts
      .map((script: string) => {
        return script.replace(scriptsDirectory, "");
      })
      .filter((path) => path !== undefined);
  
    const allScripts = [...validScripts, ...defaultScripts];

    return [...new Set(allScripts)];
  } catch (error) {
    console.error("Error getting scripts:", error);
    return defaultScripts;
  }
}
