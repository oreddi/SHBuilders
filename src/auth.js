import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import authConfig from "./auth.config";
import { prisma } from "@/lib/prisma";

// Break-glass admin from env (PM_PASSWORD) so the team can never be locked out,
// e.g. before any users exist in the database.
const ENV_ADMIN_EMAIL = "admin@shbuilders.com";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Team Access",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (user?.password && (await bcrypt.compare(password, user.password))) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }

        if (email === ENV_ADMIN_EMAIL && process.env.PM_PASSWORD && password === process.env.PM_PASSWORD) {
          return { id: "env-admin", name: "Admin User", email: ENV_ADMIN_EMAIL, role: "ADMIN" };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});
