import { prisma } from "../lib/db";
import { verifyPassword } from "../lib/password";

async function main() {
  const email = "admin@loxamail.com";
  const password = "Admin@123456";

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      status: true,
      passwordHash: true,
    },
  });

  console.log("");
  console.log("===== ADMIN CHECK =====");

  if (!user) {
    console.log("USER: NOT FOUND");
    return;
  }

  console.log("USER: FOUND");
  console.log("Email:", user.email);
  console.log("Status:", user.status);
  console.log("Password hash exists:", Boolean(user.passwordHash));

  const passwordValid = await verifyPassword(
    password,
    user.passwordHash,
  );

  console.log("Password valid:", passwordValid);

  const roleAssignments = await prisma.internalRoleAssignment.findMany({
    where: {
      userId: user.id,
    },
    select: {
      role: {
        select: {
          key: true,
          name: true,
          scope: true,
        },
      },
    },
  });

  console.log(
    "Roles:",
    roleAssignments.map((item) => item.role),
  );

  console.log("========================");
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
