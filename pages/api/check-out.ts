import connectDB from "@/middleware/mongoose";
import CheckIn from "@/models/Check-In";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  console.log("body: ", body);

  if (!body.id || !body.landing) {
    return res.status(400).json("Landing or id not found");
  }

  try {
    const query = { _id: body.id };
    const response = await CheckIn.findOneAndUpdate(query, {
      landing: req.body.landing,
      checkOutDate: Date.now(),
    });
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).json("Error: " + error);
  }
};
export default connectDB(handler);
