import { LiveInfo } from "./live";
import { PlayerInfo } from "./player";

export interface ServerInfo {
  id: string;
  name: string;
  filemanagerUrl?: string;
  isConnected: boolean;
}

export interface ChatConfig {
  manualRouting: boolean;
  messageFormat: string;
  connectMessage: string;
  disconnectMessage: string;
}

export interface ServerClientInfo {
  activeMap?: string;
  activePlayers: PlayerInfo[];
  liveInfo?: LiveInfo;
  chat?: ChatConfig;
}