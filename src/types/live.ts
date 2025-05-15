export interface LiveInfo {
  isWarmup: boolean;
  mode: string;
  currentMap: string;
  pointsLimit?: number;
  roundsLimit?: number;
  mapLimit?: number;
  maps: string[];
  teams?: Record<number, Team>;
  players?: Record<string, PlayerRound>;
  activeRound: ActiveRound;
}

export interface Team {
  id: number;
  name: string;
  roundPoints: number;
  matchPoints: number;
}

export interface PlayerRound {
  login: string;
  accountId: string;
  name: string;
  team: number;
  rank: number;
  roundPoints: number;
  matchPoints: number;
  bestTime: number;
  bestCheckpoints: number[];
  prevTime: number;
  prevCheckpoints: number[];
}

export interface ActiveRound {
  players?: Record<string, PlayerWaypoint>;
}

export interface PlayerWaypoint {
  login: string;
  accountId: string;
  time: number;
  hasFinished: boolean;
  hasGivenUp: boolean;
  checkpoint: number;
}
