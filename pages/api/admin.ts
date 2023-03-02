import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  console.log("body: ", body);

  if (!body.id) {
    return res.status(400).json({ entry: "ID not found" });
  }

  try {
    const checkin = await prisma.checkIn.delete({
      where: {
        id: body.id,
      },
    });

    console.log(checkin);

    res.status(200).send(checkin);
  } catch (error) {
    console.log(error);
    res.status(400).json("Error: " + error);
  }
}
export default handler;
