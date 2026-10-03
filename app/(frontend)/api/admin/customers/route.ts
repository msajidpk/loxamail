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

export async function GET(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";

    const customers = await prisma.customerAccount.findMany({
      where: search
        ? {
            displayName: {
              contains: search,
            },
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        displayName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            contacts: true,
            memberships: true,
            orders: true,
            services: true,
            invoices: true,
          },
        },
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /api/admin/customers failed:", error);

    return NextResponse.json(
      { error: "Unable to load customers." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
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

    const customer = await prisma.customerAccount.create({
      data: parsed.data,
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/customers failed:", error);

    return NextResponse.json(
      { error: "Unable to create customer." },
      { status: 500 },
    );
  }
}
