import NextAuth, { DefaultSession } from "next-auth";
import { authOptions } from "../../../../src/const";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

declare module "next-auth" {
  interface Session {
    user: {
      // THis typing matches the default nextauth typing
      id: string | null | undefined;
    } & DefaultSession["user"];
  }
}
