import { ObjectId } from "mongodb";

export interface Player {
  login: string;
  nickName: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
