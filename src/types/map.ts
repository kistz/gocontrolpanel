export interface Map {
  id: string;
  name: string;
  uid: string;
  fileName: string;
  author: string;
  authorNickname: string;
  authorTime: number;
  goldTime: number;
  silverTime: number;
  bronzeTime: number;
  submitter?: string;
  timestamp?: Date;
  fileUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

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

export interface JukeboxMap extends Map {
  QueuedBy: string;
  QueuedByDisplayName: string;
  QueuedAt: Date;
}
