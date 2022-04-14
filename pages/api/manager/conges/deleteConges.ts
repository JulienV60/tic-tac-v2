import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../../../src/userInfos";
import { getDatabase } from "../../../../src/database";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const queryId = Object.keys(req.query)[0];
  const queryIndex = req.query.i;
  const queryDay = req.query.day;

  const mongodb = await getDatabase();
  const searchSoldesCp = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ [`conges.${queryIndex}.id`]: queryId })
    .then((cp) => {
      return cp?.soldes_cp;
    });
  const newSoldes = searchSoldesCp - parseInt(queryDay.toString());
  console.log(newSoldes);
  const searchConges = await mongodb
    .db()
    .collection("Collaborateurs")
    .updateOne(
      { [`conges.${queryIndex}.id`]: queryId },
      {
        $set: {
          [`conges.${queryIndex}.traited`]: true,
        },
      }
    );
  res.redirect(303, "/manager/conges");
}
