export interface NadeoTokens {
  accessToken: string;
  refreshToken: string;
}

export interface MapInfo {
  author: string;
  authorScore: number;
  bronzeScore: number;
  collectionName: string;
  createdWithGamepadEditor: boolean;
  createdWithSimpleEditor: boolean;
  filename: string;
  goldScore: number;
  isPlayable: boolean;
  mapId: string;
  mapStyle: string;
  mapType: string;
  mapUid: string;
  name: string;
  silverScore: number;
  submitter: string;
  timestamp: Date;
  fileUrl: string;
  thumbnailUrl: string;
}

export interface WebIdentity {
  accountId: string;
  provider: string;
  uid: string;
  timestamp: Date;
}
