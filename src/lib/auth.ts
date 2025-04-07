import { getPlayerById, getPlayerByLogin } from "@/database/player";
import { Player } from "@/types/player";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession, NextAuthOptions, Profile } from "next-auth";
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
      scope: "",
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
    return {
      id: profile.accountId,
      accountId: profile.accountId,
      displayName: profile.displayName,
    };
  },
});

export const authOptions: NextAuthOptions = {
  providers: [NadeoProvider()],
  callbacks: {
    async session({ session, token }) {
      if (!token) {
        throw new Error("Token is missing");
      }

      session.user = {
        _id: token._id,
        accountId: token.accountId,
        login: token.login,
        displayName: token.displayName,
        roles: token.roles || [],
        ubiId: token.ubiId,
      };

      return session;
    },
    async jwt({ token, user }) {
      let dbUser: Player | null;
      if (user) {
        const login = slugid.encode(user.accountId);
        dbUser = await getPlayerByLogin(login);

        token.accountId = user.accountId;
        token.login = login;
        token.displayName = user.displayName;
      } else {
        dbUser = await getPlayerById(token._id);
      }

      if (!dbUser) {
        throw new Error(`User not found`);
      }

      token._id = dbUser._id.toString();
      token.roles = dbUser.roles || [];
      token.ubiId = dbUser.ubiUid;

      return token;
    },
  },
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
