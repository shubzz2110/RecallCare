import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { UserRole } from "../generated/prisma/enums";

async function main() {
  const email = "homkar1997@gmail.com";
  const password = "AdminPassword123!";
  const name = "Shubham Homkar";

  // check if already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      password: passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  console.log("Admin user created successfully!");
  console.log("Login email:", email);
  console.log("Login password:", password);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
