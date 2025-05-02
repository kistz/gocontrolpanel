import { EditPlayerSchema } from "@/forms/admin/edit-player-schema";
import { ObjectId } from "mongodb";
import { z } from "zod";

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

export type EditPlayer = z.infer<typeof EditPlayerSchema>;