import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    accountId: string;
    displayName: string;
  }

  interface Session {
    user: {
      _id: string;
      roles: string[];
      displayName: string;
      accountId: string;
      login: string;
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
    _id: string;
    accountId: string;
    login: string;
    displayName: string;
    roles: string[];
  }
}