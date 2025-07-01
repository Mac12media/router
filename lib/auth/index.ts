import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "../db";
import type { NextAuthConfig } from "next-auth";
import { User } from "next-auth";
import Resend from "next-auth/providers/resend";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Extend session to include `id`
declare module "next-auth" {
  interface Session extends User {
    user: {
      id: string;
    } & Session;
  }
}

export const config = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    // 🔐 Credentials Provider for email + password login
    Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const email = credentials?.email;
    const password = credentials?.password;

    if (typeof email !== "string" || typeof password !== "string") {
      console.log("Missing email or password");
      return null;
    }

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    if (!user) {
      console.log("User not found:", email);
      return null;
    }

    if (!user.hashedPassword) {
      console.log("User has no password set");
      return null;
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isValid) {
      console.log("Invalid password for user:", email);
      return null;
    }

    console.log("Successful login for:", email);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}),


    // ✉️ Magic Link Provider
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "mail@expo-recruits.com",
      // Optional: sendVerificationRequest
    }),

    // 🐙 GitHub Provider (optional)
    GitHub,
  ],
  callbacks: {
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/check-email", // after sending magic link
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);
