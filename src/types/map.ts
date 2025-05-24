import { Maps } from "@/lib/prisma/generated";

export interface MapInfoMinimal {
  Name: string;
  UId: string;
  FileName: string;
  Environnement: string;
  Author: string;
  AuthorNickname: string;
  GoldTime: number;
  CopperPrice: number;
  MapType: string;
  MapStyle: string;
}

export interface MapInfo {
  Name: string;
  UId: string;
  FileName: string;
  Author: string;
  AuthorNickname: string;
  Environnement: string;
  Mood: string;
  BronzeTime: number;
  SilverTime: number;
  GoldTime: number;
  AuthorTime: number;
  CopperPrice: number;
  LapRace: boolean;
  NbLaps: number;
  NbCheckpoints: number;
  MapType: string;
  MapStyle: string;
}

export interface LocalMapInfo extends MapInfo {
  Path: string;
}

export interface JukeboxMap extends Maps {
  QueuedBy: string;
  QueuedByDisplayName: string;
  QueuedAt: Date;
}
