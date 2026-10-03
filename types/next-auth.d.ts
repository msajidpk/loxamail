import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      status: string;
      internalRoles: string[];
      memberships: {
        id: string;
        customerAccountId: string;
        displayName: string;
        roleKey: string | null;
      }[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    status: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
