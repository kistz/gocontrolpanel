import { ObjectId } from "mongodb";

export interface DBPlayer {
  _id: ObjectId;
  login: string;
  nickName: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Player {
  _id: string;
  login: string;
  nickName: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
