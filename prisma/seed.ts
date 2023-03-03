import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
async function main() {
  // Create admin user
  if (!process.env.ADMIN_PASSWORD)
    return console.log("ADMIN_PASSWORD not set in .env");

  const iterations = 12;
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, iterations);

  const admin = await prisma.user.create({
    data: {
      name: "admin",
      pwHash: hash,
    },
  });

  // Create demo entries
  const alice = await prisma.checkIn.create({
    data: {
      name: "Alice Foobar",
      landing: "REGULAR",
      checkInDate: new Date("2022-03-02T15:28:10.072Z"),
      checkOutDate: new Date("2022-03-02T16:28:10.072Z"),
      club: "RML",
    },
  });
  const bob = await prisma.checkIn.create({
    data: {
      name: "Bob Fountain",
      landing: "XC",
      checkInDate: new Date("2023-03-02T15:28:10.072Z"),
      checkOutDate: new Date("2023-03-02T16:28:10.072Z"),
      club: "DGC",
    },
  });
  const seal = await prisma.checkIn.create({
    data: {
      name: "Seal Knows",
      landing: "DNF",
      checkInDate: new Date("2023-05-02T15:28:10.072Z"),
      checkOutDate: new Date("2023-05-02T16:28:10.072Z"),
      club: "DGC",
    },
  });
  const carmen = await prisma.checkIn.create({
    data: {
      name: "Carmen Hates",
      landing: "ALT",
      checkInDate: new Date("2023-07-02T15:28:10.072Z"),
      checkOutDate: new Date("2023-07-02T16:28:10.072Z"),
      club: "RML",
    },
  });
  console.log({ alice, bob, seal, carmen, admin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
