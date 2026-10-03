import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "./lib/db";
import { verifyPassword } from "./lib/password";

const credentialsSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email,
          },
          select: {
            id: true,
            email: true,
            passwordHash: true,
            status: true,
          },
        });

        if (!user || user.status !== "ACTIVE") {
          return null;
        }

        const validPassword = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (typeof user?.id === "string") {
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      const userId =
        typeof token.userId === "string"
          ? token.userId
          : typeof token.sub === "string"
            ? token.sub
            : undefined;

      if (!userId || !session.user) {
        return session;
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          email: true,
          status: true,
        },
      });

      if (!user || user.status !== "ACTIVE") {
        return session;
      }

      const [internalRoleAssignments, memberships] = await Promise.all([
        prisma.internalRoleAssignment.findMany({
          where: {
            userId: user.id,
          },
          select: {
            role: {
              select: {
                key: true,
                scope: true,
              },
            },
          },
        }),

        prisma.customerMembership.findMany({
          where: {
            userId: user.id,
            status: "ACTIVE",
          },
          select: {
            id: true,
            customerAccountId: true,
            customerAccount: {
              select: {
                displayName: true,
              },
            },
            role: {
              select: {
                key: true,
              },
            },
          },
        }),
      ]);

      session.user.id = user.id;
      session.user.email = user.email;
      session.user.status = user.status;

      session.user.internalRoles = internalRoleAssignments
        .filter((assignment) => assignment.role.scope === "INTERNAL")
        .map((assignment) => assignment.role.key);

      session.user.memberships = memberships.map((membership) => ({
        id: membership.id,
        customerAccountId: membership.customerAccountId,
        displayName: membership.customerAccount.displayName,
        roleKey: membership.role?.key ?? null,
      }));

      return session;
    },
  },
});
