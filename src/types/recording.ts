import { ObjectId } from "mongodb";

export interface Recording {
  name: string;
  type: string;
  mode: string;
  maps: MapRecords[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface MapRecords {
  _id: ObjectId;
  mapId: ObjectId;
  matchRounds: MatchRound[];
  rounds: Round[];
  finishes: PlayerFinish[];
}

export interface MatchRound {
  _id: ObjectId;
  roundNumber: number;
  teams: Team[];
}

export interface Round {
  _id: ObjectId;
  roundNumber: number;
  players: PlayerRound[];
}

export interface Team {
  _id: ObjectId;
  teamId: number;
  name: string;
  points: number;
  totalPoints: number;
  players: PlayerRound[];
}

export interface PlayerRound {
  _id: ObjectId;
  playerId?: ObjectId;
  login: string;
  accountId: string;
  points: number;
  totalPoints: number;
  time: number;
  checkpoints: number[];
}

export interface PlayerFinish {
  _id: ObjectId;
  playerId?: ObjectId;
  login: string;
  accountId: string;
  time: number;
  checkpoints: number[];
  timestamp: Date;
}
