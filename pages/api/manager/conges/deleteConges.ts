import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../../../src/userInfos";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryId = Object.keys(req.query)[0];
  const queryIndex = req.query.i;
}
