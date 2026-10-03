import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const contactSchema = z.object({
  displayName: z.string().trim().min(2).max(191),
  email: z
    .string()
    .trim()
    .email()
    .max(191)
    .optional()
    .or(z.literal("")),
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id: customerAccountId } = await params;

  const customer = await prisma.customerAccount.findUnique({
    where: { id: customerAccountId },
    select: { id: true },
  });

  if (!customer) {
    return NextResponse.json(
      { error: "Customer not found." },
      { status: 404 },
    );
  }

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact data." },
      { status: 400 },
    );
  }

  const contact = await prisma.contact.create({
    data: {
      customerAccountId,
      displayName: parsed.data.displayName,
      email: parsed.data.email || null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
