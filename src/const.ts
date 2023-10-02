import { AuthOptions } from "next-auth";
import DiscordProvider from "./context/DiscordProvider";
import { PrismaClient } from "@prisma/client";

export const __dev__ = process.env.NODE_ENV === "development";
export const __prod__ = process.env.NODE_ENV === "production";
export const __test__ = process.env.NODE_ENV === "test";

export const API_BASE = __dev__
  ? "http://localhost:4000"
  : "https://uwuting.com";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        if (session.user != undefined && token?.picture?.includes("discord")) {
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
};

export const Database = new PrismaClient();
