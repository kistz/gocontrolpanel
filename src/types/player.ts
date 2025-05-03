import { ObjectId } from "mongodb";

export interface DBPlayer {
  _id: ObjectId;
  login: string;
  nickName: string;
  path: string;
  roles?: string[];
  ubiUid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Player {
  _id: string;
  login: string;
  nickName: string;
  path: string;
  roles?: string[];
  ubiUid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
