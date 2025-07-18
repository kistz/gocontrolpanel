export interface SPlayerInfo {
  Login: string;
  NickName: string;
  PlayerId: number;
  SpectatorStatus: number;
  TeamId: number;
  LadderRanking: number;
  Flags: number;
}

export interface PlayerChat {
  PlayerUid: number;
  Login: string;
  Text: string;
  IsRegistredCmd: boolean;
  Options: number;
}
