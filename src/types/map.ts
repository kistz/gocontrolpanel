import { ObjectId } from "mongodb";

export interface DBMap {
  _id: ObjectId;
  name: string;
  uid: string;
  fileName: string;
  author: string;
  authorNickname: string;
  authorTime: number;
  goldTime: number;
  silverTime: number;
  bronzeTime: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Map {
  _id: string;
  name: string;
  uid: string;
  fileName: string;
  author: string;
  authorNickname: string;
  authorTime: number;
  goldTime: number;
  silverTime: number;
  bronzeTime: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
