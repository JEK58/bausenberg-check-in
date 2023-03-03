import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  console.log("body: ", body);
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (req.method === "DELETE") {
    if (!body.id) {
      return res.status(400).json("Error:No ID provisioned");
    }
    try {
      const checkin = await prisma.checkIn.delete({
        where: {
          id: body.id,
        },
      });
      res.status(200).send(checkin);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export default handler;
