// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  entry: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body;

  console.log("body: ", body);

  if (!body.name || !body.club) {
    return res.status(400).json({ entry: "Name or club not found" });
  }

  res.status(201).json({ entry: `${body.name} ${body.club}` });
}
