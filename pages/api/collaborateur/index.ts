import { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../src/database";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const dateCongés = req.body.date;
    const mongodb = await getDatabase();
  } else {
    res.end(JSON.stringify(req.body));
  }
}
