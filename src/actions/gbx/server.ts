"use server";

import { doServerActionWithAuth } from "@/lib/actions";
import { getGbxClient, getServers } from "@/lib/gbxclient";
import { getFiles } from "@/lib/server-utils";
import { LocalMapInfo } from "@/types/map";
import { ServerError, ServerResponse } from "@/types/responses";
import { ServerSettings } from "@/types/server";
import path from "path";

export async function getServerSettings(
  server: number,
): Promise<ServerResponse<ServerSettings>> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);
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
      throw new ServerError("Failed to get server settings");
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
      throw new ServerError("Failed to parse server settings");
    }
  });
}

export async function saveServerSettings(
  server: number,
  serverSettings: ServerSettings,
): Promise<ServerResponse> {
  return doServerActionWithAuth(["admin"], async () => {
    const client = await getGbxClient(server);

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
        throw new ServerError("Failed to save server settings");
      });

    if (!res) {
      throw new ServerError("Failed to save server settings");
    }

    if (!res[0]) {
      throw new ServerError("Failed to save server settings");
    } else if (!res[1]) {
      throw new ServerError("Failed to save connection rates");
    } else if (!res[2]) {
      throw new ServerError("Failed to save profile skins");
    } else if (!res[3]) {
      throw new ServerError("Failed to save map download settings");
    }
  });
}

export async function getLocalScripts(
  server: number,
): Promise<ServerResponse<string[]>> {
  return doServerActionWithAuth(["admin"], async () => {
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

    const servers = await getServers();

    if (!servers.find((s) => s.id == server)?.isLocal) {
      return defaultScripts;
    }

    try {
      const client = await getGbxClient(server);
      const userDataDirectory = await client.call("GameDataDirectory");

      if (!userDataDirectory) {
        throw new ServerError("Failed to get UserData directory");
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
  });
}

export async function getLocalMaps(
  server: number,
): Promise<ServerResponse<LocalMapInfo[]>> {
  return doServerActionWithAuth(["admin"], async () => {
    const servers = await getServers();
    if (!servers.find((s) => s.id == server)?.isLocal) {
      return [];
    }

    const client = await getGbxClient(server);
    const mapsDirectory = await client.call("GetMapsDirectory");

    if (!mapsDirectory) {
      throw new ServerError("Failed to get UserData directory");
    }

    const maps = await getFiles(mapsDirectory, /\.(Map|Challenge).*\.Gbx$/i);

    const validMaps = maps
      .map((map: string) => {
        return map.replace(mapsDirectory, "");
      })
      .filter((path) => path !== undefined);

    const mapInfoList: LocalMapInfo[] = [];

    for (const map of validMaps) {
      try {
        const mapInfo = await client.call("GetMapInfo", map);

        if (!mapInfo) {
          throw new ServerError(`Failed to get map info for ${map}`);
        }

        mapInfoList.push({
          ...mapInfo,
          Path: path.dirname(map),
        } as LocalMapInfo);
      } catch (error) {
        console.error(`Error getting map info for ${map}:`, error);
      }
    }

    return mapInfoList;
  });
}
