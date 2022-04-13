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
    fs.readFile("ArrayPlanning.json", "utf8", function (err: any, data: any) {
      const content = data.split("]");

      fs.unlink("ArrayPlanning.json", (err: any) => {
        if (err) throw err;
        console.log("Fichier supprimé !");
      });

      const arrayReturned = content.forEach((element: any, index: number) => {
        const elementFormatString = element.replace("[", "");
        const elementFormatJson = JSON.parse(elementFormatString);
        const stringReceived = JSON.parse(req.body);

        if (elementFormatJson.id !== stringReceived.id) {
          fs.appendFile(
            "ArrayPlanning.json",
            `[${JSON.stringify(elementFormatJson)}]`,
            function (err: any) {
              if (err) throw err;
              console.log("Fichier mis à jour !");
            }
          );
        } else {
          fs.appendFile(
            "ArrayPlanning2.json",
            `[${JSON.stringify(elementFormatJson)}]`,
            function (err: any) {
              if (err) throw err;
              console.log("Fichier mis à jour !");
            }
          );
        }
      });
    });
  }

  res.end(JSON.stringify({ data: "data" }));
}
