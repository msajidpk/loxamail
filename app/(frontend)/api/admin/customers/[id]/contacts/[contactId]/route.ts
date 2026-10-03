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

type RouteContext = {
  params: Promise<{
    id: string;
    contactId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id: customerAccountId, contactId } = await params;

  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact data." },
      { status: 400 },
    );
  }

  const existing = await prisma.contact.findFirst({
    where: {
      id: contactId,
      customerAccountId,
    },
    select: {
      id: true,
    },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Contact not found." },
      { status: 404 },
    );
  }

  const contact = await prisma.contact.update({
    where: {
      id: existing.id,
    },
    data: {
      displayName: parsed.data.displayName,
      email: parsed.data.email || null,
    },
  });

  return NextResponse.json(contact);
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id: customerAccountId, contactId } = await params;

  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      customerAccountId,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!contact) {
    return NextResponse.json(
      { error: "Contact not found." },
      { status: 404 },
    );
  }

  if (contact.userId) {
    return NextResponse.json(
      { error: "This contact is linked to a user and cannot be deleted." },
      { status: 409 },
    );
  }

  await prisma.contact.delete({
    where: {
      id: contact.id,
    },
  });

  return NextResponse.json({ success: true });
}
