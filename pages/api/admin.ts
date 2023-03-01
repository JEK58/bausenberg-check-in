// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from "@/middleware/mongoose";
import CheckIn from "@/models/Check-In";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  console.log("body: ", body);

  if (!body.name || !body.club) {
    return res.status(400).json({ entry: "Name or club not found" });
  }

  try {
    const checkIn = new CheckIn({
      name: req.body.name,
      checkInDate: Date.now(),
      club: req.body.club,
    });

    const response = await checkIn.save();
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).json("Error: " + error);
  }
};
export default connectDB(handler);
