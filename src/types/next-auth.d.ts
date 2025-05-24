import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    accountId: string;
    displayName: string;
  }

  interface Session {
    user: {
      id: string;
      roles: string[];
      displayName: string;
      accountId: string;
      ubiId: string;
      login: string;
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
    roles: string[];
    ubiId: string;
    jwt?: string;
  }
}
