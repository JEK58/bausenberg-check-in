// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  landing: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body;

  console.log("body: ", body);

  if (!body.landing) {
    return res.status(400).json({ landing: "No landing submitted" });
  }

  res.status(201).json({ landing: body.landing });
}
