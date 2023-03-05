import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 40, // Max 40 users per second
});

const CHECKIN_RATE_LIMIT = parseInt(process.env.CHECKIN_RATE_LIMIT ?? "10", 10);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  if (!body.name || !body.club) {
    return res.status(400).json({ entry: "Name or club not found" });
  }
  try {
    await limiter.check(res, CHECKIN_RATE_LIMIT, "CACHE_TOKEN"); // 2 requests per minute
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
  } catch (error) {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
export default handler;
