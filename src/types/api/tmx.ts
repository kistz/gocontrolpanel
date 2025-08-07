export interface TMXUser {
  UserId: number;
  Name: string;
}

export interface TMXTag {
  TagId: number;
  Name: string;
  Color: string;
}

export interface TMXMedals {
  Author: number;
  Gold: number;
  Silver: number;
  Bronze: number;
}

export interface TMXImage {
  Position: number;
  Width: number;
  Height: number;
  HasHighQuality: boolean;
}

export interface TMXMap {
  MapId: number;
  MapUid: string;
  Name: string;
  GbxMapName: string | null;
  Authors: {
    User: TMXUser;
    Role: string;
  }[];
  AwardCount: number;
  Tags: TMXTag[];
  Medals: TMXMedals;
  HasThumbnail: boolean;
  Images: TMXImage[];
}

export interface TMXMapSearch {
  More: boolean;
  Results: TMXMap[];
}