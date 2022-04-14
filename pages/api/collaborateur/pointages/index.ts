import { NextApiRequest, NextApiResponse } from "next";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { userId, userProfil } from "../../../../src/userInfos";
import { getDatabase } from "../../../../src/database";
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

    const numeroSemaine =
      parseInt(moment(date.semaine[0]).locale("fr").format("w")) - 1;

    const numeroJourSemaine =
      parseInt(moment(date.jour).locale("fr").format("e")) + 1;

    const heurePlannif = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => result?.horaires)
      .then((horaires) => horaires[numeroSemaine]);

    const heurePlannifJour = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => result?.horaires)
      .then((horaires) => horaires[numeroSemaine][numeroJourSemaine].horaires);

    const heureMatin = moment(heurePlannifJour.split("/")[0]).format("HH:ss");
    const heureAprem = moment(heurePlannifJour.split("/")[1]).format("HH:ss");

    const totalHeurePlanif = heurePlannif.map((element: any) => {
      return parseInt(element.heure_necessaire);
    });

    let sumTotalHeures = 0;
    for (let i = 0; i < totalHeurePlanif.length; i++) {
      sumTotalHeures += parseInt(totalHeurePlanif[i]);
    }

    const totalHeureRea = heurePlannif.map((element: any) => {
      if (element.heure_realisees !== undefined) {
        return parseInt(element.heure_realisees);
      } else {
        return 0;
      }
    });

    let sumTotalHeuresRea = 0;
    for (let i = 0; i < totalHeureRea.length; i++) {
      sumTotalHeuresRea += parseInt(totalHeureRea[i]);
    }

    res.end(
      JSON.stringify({
        heuresPlanif: sumTotalHeures,
        heuresrea: sumTotalHeuresRea,
        heureMatin: heureMatin,
        heureAprem: heureAprem,
      })
    );
  } else {
    res.end(JSON.stringify("test"));
  }
}
