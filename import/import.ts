import { Club, Landing } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import data from "./data/collection.json";

const prisma = new PrismaClient();

async function importData() {
  data.forEach(async (oldEntry) => {
    const checkOutDate = oldEntry.checkOutDate
      ? new Date(oldEntry.checkOutDate)
      : undefined;

    const entry = {
      name: oldEntry.name,
      club: oldEntry.club as Club,
      landing: convertLanding(oldEntry.landing),
      checkInDate: new Date(oldEntry.checkInDate),
      checkOutDate: checkOutDate,
    };

    await prisma.checkIn.create({
      data: entry,
    });

    return true;
  });
}

function convertLanding(landing?: string): Landing | undefined {
  switch (landing) {
    case "Landewiese":
      return Landing.REGULAR;

    case "Notlandewiese":
      return Landing.ALT;

    case "Doch nicht gestartet":
      return Landing.DNF;

    case "Streckenflug":
      return Landing.XC;
  }
}

importData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
