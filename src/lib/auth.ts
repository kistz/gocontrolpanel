import {
  collections,
  connectToDatabase,
  getDatabase,
} from "@/database/mongodb";
import { getPlayerByLogin } from "@/database/player";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import NextAuth, { NextAuthOptions, Profile } from "next-auth";
import { OAuthConfig } from "next-auth/providers/oauth";
import slugid from "slugid";
import config from "./config";

const NadeoProvider = (): OAuthConfig<Profile> => ({
  id: "nadeo",
  name: "Nadeo",
  type: "oauth",
  authorization: {
    url: "https://api.trackmania.com/oauth/authorize",
    params: {
      response_type: "code",
      client_id: config.NADEO_CLIENT_ID,
      redirect_uri: config.NADEO_REDIRECT_URI,
      scope: ""
    },
  },
  token: {
    url: "https://api.trackmania.com/api/access_token",
    async request({ params }) {
      const response = await fetch(
        "https://api.trackmania.com/api/access_token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NADEO_CLIENT_ID!,
            client_secret: process.env.NADEO_CLIENT_SECRET!,
            code: params.code || "",
            redirect_uri: process.env.NADEO_REDIRECT_URI!,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch access token");
      }

      const data = await response.json();

      return { tokens: data };
    },
  },
  userinfo: "https://api.trackmania.com/api/user",
  clientId: config.NADEO_CLIENT_ID,
  clientSecret: config.NADEO_CLIENT_SECRET,
  async profile(profile) {
    console.log(profile);
    return {
      id: profile.accountId,
      accountId: profile.accountId,
      displayName: profile.displayName,
    };
  },
});

export const authOptions: NextAuthOptions = {
  providers: [NadeoProvider()],
  session: {
    strategy: "database",
  },
  adapter: MongoDBAdapter(connectToDatabase()),
  callbacks: {
    async session({ session, user }) {
      const login = slugid.encode(user.accountId);
      const dbUser = await getPlayerByLogin(login);
      if (!dbUser) {
        throw new Error(`User with login ${login} not found`);
      }

      session.user.roles = dbUser.roles || [];

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const login = slugid.encode(user.accountId);
        const dbUser = await getPlayerByLogin(login);
        if (!dbUser) {
          throw new Error(`User with login ${login} not found`);
        }

        token._id = dbUser._id.toString();
        token.accountId = user.accountId;
        token.displayName = user.displayName;
        token.roles = dbUser.roles || [];
      }

      return token;
    },
  },
};