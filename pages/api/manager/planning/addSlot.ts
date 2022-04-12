import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fs = require("fs");

  fs.appendFile("ArrayPlanning.json", `[${req.body}]`, function (err: any) {
    if (err) throw err;
    console.log("Fichier mis à jour !");
  });

  res.end(JSON.stringify({ data: "data" }));
}
