export interface DBPlayer {
  login: string;
  nickName: string;
  path: string;
  roles?: string[];
  ubiUid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
