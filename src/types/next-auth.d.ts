import "next-auth";
import "next-auth/jwt";
import { UserGroup, UserProject, UserServer } from "./auth";
import { ISODateString } from "next-auth";

declare module "next-auth" {
  interface User {
    accountId: string;
    displayName: string;
  }

  interface Session {
    user: {
      id: string;
      admin: boolean;
      displayName: string;
      accountId: string;
      ubiId?: string;
      login: string;
      permissions: string[];
      groups: UserGroup[];
      projects: UserProject[];
      servers: UserServer[];
      adminClubs: { id: number; name: string }[];
    };
    expires: ISODateString;
  }

  interface Profile {
    accountId: string;
    displayName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountId: string;
    login: string;
    displayName: string;
    admin: boolean;
    ubiId?: string;
    permissions: string[];
    groups: UserGroup[];
    projects: UserProject[];
    servers: UserServer[];
    adminClubs: { id: number; name: string }[];
  }
}
