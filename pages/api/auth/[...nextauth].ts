import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password || !credentials.username) return null;

        try {
          const user = await prisma.user.findFirst({
            where: {
              name: credentials.username,
            },
          });

          if (!user) return null;

          const match = await bcrypt.compare(credentials.password, user.pwHash);

          if (match) {
            return { name: user.name } as any;
          } else {
            return null;
          }
        } catch (error) {
          console.log("could not hash password.", error);
        }
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
