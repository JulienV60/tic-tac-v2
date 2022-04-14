import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../../../../src/userInfos";
import { getDatabase } from "../../../../../src/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const accessTokken = req.cookies.IdToken;
    const date = JSON.parse(req.body);

    let profile;
    let idUser;
    let decoded: any;
    if (accessTokken === undefined) {
      profile = null;
    } else {
      decoded = jwt_decode(accessTokken);
      profile = await userProfil(decoded.email);
      idUser = await userId(decoded.email);
    }
    const mongodb = await getDatabase();

    res.end(JSON.stringify("test"));
  } else {
    res.end(JSON.stringify("test"));
  }
}
