import { ObjectId } from "mongodb";

export interface Player {
  _id: ObjectId;
  login: string;
  nickName: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
