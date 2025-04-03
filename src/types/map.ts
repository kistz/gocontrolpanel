export interface Map {
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
