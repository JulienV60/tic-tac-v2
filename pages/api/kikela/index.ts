import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import { getDatabase } from "../../../src/database";
import { access } from "fs";
import moment from "moment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {

    const body = JSON.parse(req.body)
  const numeroSemaine =
          parseInt(moment().locale("fr").format("w")) -
          1;

        const numeroJourSemaine =
          parseInt(moment().locale("fr").format("e")) +
          1;
  const nom = body.nom;
  const prenom = body.prenom;

  const mongodb = await getDatabase();
  const Dispo = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ profile: "Collaborateur", nom: nom, prenom: prenom })
    .then((result) => {
      console.log(result);
      console.log(result?.length);

      if( result !== null) {
        console.log("=============" + result.horaires[numeroSemaine][numeroJourSemaine].horaires);

        if (result.horaires[numeroSemaine][numeroJourSemaine].horaires !== "") {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    })
    console.log(nom, prenom);
    console.log(req.body);



    console.log(Dispo);
    res.end(Dispo.toString());
  }

}