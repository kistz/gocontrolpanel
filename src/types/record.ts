import { ObjectId } from "mongodb";

export interface DBRecord {
  _id: ObjectId;
  login: string;
  time: number;
  mapUid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Record {
  _id: string;
  login: string;
  time: number;
  mapUid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
