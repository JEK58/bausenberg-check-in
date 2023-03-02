import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  console.log("body: ", body);

  if (!body.id || !body.landing) {
    return res.status(400).json("Landing or id not found");
  }

  try {
    const response = await prisma.checkIn.update({
      where: { id: body.id },
      data: {
        landing: req.body.landing,
        checkOutDate: new Date(),
      },
    });
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).json("Error: " + error);
  }
}
export default handler;
