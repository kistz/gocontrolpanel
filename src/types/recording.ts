import { ObjectId } from "mongodb";

export interface DBRecording {
  _id: ObjectId;
  name: string;
  type: string;
  mode: string;
  maps: MapRecords[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface MapRecords {
  _id: string;
  mapId: string;
  matchRounds: MatchRound[];
  rounds: Round[];
  finishes: PlayerFinish[];
}

export interface MatchRound {
  _id: string;
  roundNumber: number;
  teams: Team[];
}

export interface Round {
  _id: string;
  roundNumber: number;
  players: PlayerRound[];
}

export interface Team {
  _id: string;
  teamId: number;
  name: string;
  points: number;
  totalPoints: number;
  players: PlayerRound[];
}

export interface PlayerRound {
  _id: string;
  playerId?: string;
  login: string;
  accountId: string;
  points: number;
  totalPoints: number;
  time: number;
  checkpoints: number[];
}

export interface PlayerFinish {
  _id: string;
  playerId?: string;
  login: string;
  accountId: string;
  time: number;
  checkpoints: number[];
  timestamp: Date;
}
