import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import GitlabProvider from "next-auth/providers/gitlab";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@config";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_CLIENT_ID || "",
      clientSecret: process.env.GITLAB_CLIENT_SECRET || "",
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      if (session?.user) session.user.id = user.id;
      return session;
    },
  },
  events: {},
  debug: false,
};

export default NextAuth(authOptions);
