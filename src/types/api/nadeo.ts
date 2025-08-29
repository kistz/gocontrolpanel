export interface NadeoTokens {
  accessToken: string;
  refreshToken: string;
}

export interface TrackmaniaCredentials {
  token_type: string;
  expires_in: number;
  access_token: string;
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

export interface AccountNames {
  [key: string]: string;
}

export interface MonthMapList {
  year: number;
  month: number;
  lastday: number;
  days: {
    campaignId: number;
    mapUid: string;
    day: number;
    monthDay: number;
    seasonUid: string;
    leaderboardGroup: null;
    startTimestamp: number;
    endTimestamp: number;
    relativeStart: number;
    relativeEnd: number;
  }[];
  media: {
    buttonBackgroundUrl: string;
    buttonForegroundUrl: string;
    decalUrl: string;
    popUpBackgroundUrl: string;
    popUpImageUrl: string;
    liveButtonBackgroundUrl: string;
    liveButtonForegroundUrl: string;
  };
}

export interface MonthMapListResponse {
  monthList: MonthMapList[];
  itemCount: number;
  nextRequestTimestamp: number;
  relativeNextRequest: number;
}

export interface Campaign {
  id: number;
  seasonUid: string;
  name: string;
  useCase: number;
  clubId: number;
  startTimestamp: number;
  endTimestamp: number;
  rankingSentTimestamp: number | null;
  year: number;
  week: number;
  day: number;
  monthYear: number;
  month: number;
  monthDay: number;
  playlist: {
    id: number;
    position: number;
    mapUid: string;
  }[];
  editionTimestamp: number;
}

export interface SeasonalCampaignsResponse {
  itemCount: number;
  campaignList: Campaign[];
  nextRequestTimestamp: number;
  relativeNextRequest: number;
}

export interface ShortsCampaignsResponse {
  itemCount: number;
  campaignList: Campaign[];
  nextRequestTimestamp: number;
  relativeNextRequest: number;
}
