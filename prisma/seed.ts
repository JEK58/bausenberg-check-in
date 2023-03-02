import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.checkIn.create({
    data: {
      name: "Alice Foobar",
      landing: "Landewiese",
      checkInDate: new Date("2022-03-02T15:28:10.072Z"),
      checkOutDate: new Date("2022-03-02T16:28:10.072Z"),
      club: "RML",
    },
  });
  const bob = await prisma.checkIn.create({
    data: {
      name: "Bob Fountain",
      landing: "Landewiese",
      checkInDate: new Date("2023-03-02T15:28:10.072Z"),
      checkOutDate: new Date("2023-03-02T16:28:10.072Z"),
      club: "DGC",
    },
  });
  console.log({ alice, bob });
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
