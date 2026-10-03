import { redirect } from "next/navigation";
import { auth } from "../auth";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id || session.user.status !== "ACTIVE") {
    redirect("/login");
  }

  return session;
}

export async function requireInternalUser() {
  const session = await requireAuth();

  if (session.user.internalRoles.length === 0) {
    redirect("/");
  }

  return session;
}

export async function requireCustomerMembership(customerAccountId: string) {
  const session = await requireAuth();

  const membership = session.user.memberships.find(
    (item) => item.customerAccountId === customerAccountId,
  );

  if (!membership) {
    redirect("/");
  }

  return { session, membership };
}
