import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fs = require("fs");

  const path = "ArrayPlanning.json";

  try {
    if (fs.existsSync(path)) {
      fs.unlink("ArrayPlanning.json", (err: any) => {
        if (err) throw err;
        console.log("Fichier supprimé !");
      });
    }
    if (fs.existsSync("ArrayPlanning2.json")) {
      fs.unlink("ArrayPlanning2.json", (err: any) => {
        if (err) throw err;
        console.log("Fichier supprimé !");
      });
    }
  } catch (err) {
    console.error(err);
  }
}