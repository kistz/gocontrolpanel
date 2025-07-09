import "next-auth";
import "next-auth/jwt";
import { UserGroup } from "./auth";

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
      ubiId: string;
      login: string;
      groups: UserGroup[];
    };
    expires: ISODateString;
    jwt?: string;
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
    ubiId: string;
    groups: UserGroup[];
    jwt?: string;
  }
}
