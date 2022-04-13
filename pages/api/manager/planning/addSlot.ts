import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../../../src/userInfos";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessTokken = req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }
  if (profile === "Manager") {
    const fs = require("fs");
    fs.appendFile("ArrayPlanning.json", `[${req.body}]`, function (err: any) {
      if (err) throw err;
      console.log("Fichier mis à jour !");
    });
  }
  res.end(JSON.stringify({ data: "data" }));
}
