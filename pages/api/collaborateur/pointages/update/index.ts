import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../../../../src/userInfos";
import { getDatabase } from "../../../../../src/database";
import moment from "moment";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const accessTokken = req.cookies.IdToken;
    const data = JSON.parse(req.body);
    const heureMatin = data.heureMatin;
    const heureAprem = data.heureAprem;
    const motif = data.motif;
    const jour = moment(data.jour).format("L");

    const numeroSemaine = parseInt(moment(jour).locale("fr").format("w")) - 1;

    const numeroJourSemaine =
      parseInt(moment(jour).locale("fr").format("e")) + 1;

    console.log(heureMatin);
    console.log(heureAprem);
    console.log(motif);
    console.log(jour);
    console.log(numeroJourSemaine);
    console.log(numeroSemaine);

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
    const collaborateur = await mongodb
      .db()
      .collection("Collaborateurs")
      .updateOne(
        {
          idUser: idUser,
        },
        {
          $set: {
            [`horaires.${numeroSemaine}.${numeroJourSemaine}.horaires`]: "",
            [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_pointage_matin`]: `${heureMatin}`,
            [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_pointage_aprem`]: `${heureAprem}`,
          },
        }
      );

    res.end(JSON.stringify("test"));
  } else {
    res.end(JSON.stringify("test"));
  }
}
