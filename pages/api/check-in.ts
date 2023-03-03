import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  if (!body.name || !body.club) {
    return res.status(400).json({ entry: "Name or club not found" });
  }

  try {
    const checkin = await prisma.checkIn.create({
      data: {
        name: req.body.name,
        checkInDate: new Date(),
        club: req.body.club,
      },
    });

    res.status(201).send(checkin);
  } catch (error) {
    console.log(error);
    res.status(400).json("Error: " + error);
  }
}
export default handler;
