import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const customerSchema = z.object({
  type: z.enum(["COMPANY", "INDIVIDUAL"]),
  displayName: z.string().trim().min(2).max(191),
  status: z.enum(["ACTIVE", "SUSPENDED", "INACTIVE"]),
});

async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user?.id ||
    session.user.status !== "ACTIVE" ||
    !session.user.internalRoles.includes("ADMIN")
  ) {
    return null;
  }

  return session;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await params;

  const body = await request.json();
  const parsed = customerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid customer data",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const existing = await prisma.customerAccount.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Customer not found" },
      { status: 404 },
    );
  }

  const customer = await prisma.customerAccount.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(customer);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await params;

  const existing = await prisma.customerAccount.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: {
          contacts: true,
          memberships: true,
          orders: true,
          services: true,
          invoices: true,
          tickets: true,
        },
      },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Customer not found" },
      { status: 404 },
    );
  }

  const counts = existing._count;

  const hasDependencies = Object.values(counts).some(
    (count) => count > 0,
  );

  if (hasDependencies) {
    return NextResponse.json(
      {
        error:
          "This customer cannot be deleted because it has related records.",
      },
      { status: 409 },
    );
  }

  await prisma.customerAccount.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
