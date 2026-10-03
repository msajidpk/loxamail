import { prisma } from "../lib/db";
import { hashPassword } from "../lib/password";

async function main() {
  const email = "admin@loxamail.com";
  const password = "Admin@123456";

  const passwordHash = await hashPassword(password);

  // Find or create the internal ADMIN role.
  let role = await prisma.role.findFirst({
    where: {
      key: "ADMIN",
      scope: "INTERNAL",
    },
  });

  if (!role) {
    role = await prisma.role.create({
      data: {
        key: "ADMIN",
        name: "Administrator",
        scope: "INTERNAL",
      },
    });
  }

  // Find or create the admin user.
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        status: "ACTIVE",
      },
    });
  } else {
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
        status: "ACTIVE",
      },
    });
  }

  // Assign ADMIN role if it is not already assigned.
  const existingAssignment =
    await prisma.internalRoleAssignment.findFirst({
      where: {
        userId: user.id,
        roleId: role.id,
      },
    });

  if (!existingAssignment) {
    await prisma.internalRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });
  }

  console.log("");
  console.log("=================================");
  console.log("LoxaMail Admin Created");
  console.log("=================================");
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`User ID:  ${user.id}`);
  console.log(`Role:     ${role.key}`);
  console.log("=================================");
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
