import type { NextApiRequest, NextApiResponse } from "next";
import { getCookies } from "cookies-next";
import moment from "moment";
import { getDatabase } from "../../../../../src/database";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fs = require("fs");

  fs.readFile("ArrayPlanning.json", "utf8", function (err: any, data: any) {
    const content = data.split("]");

    const arrayReturned = content.forEach(
      async (element: any, index: number) => {
        const elementFormatString = element.replace("[", "");
        const elementFormatJson = JSON.parse(elementFormatString);

        const dateElement = moment(elementFormatJson.start)
          .locale("fr")
          .format("L");

        const heureElementStart = moment(elementFormatJson.start)
          .locale("fr")
          .format("LT");

        const heureElementEnd = moment(elementFormatJson.end)
          .locale("fr")
          .format("LT");

        const numeroSemaine =
          parseInt(moment(elementFormatJson.start).locale("fr").format("w")) -
          1;

        const numeroJourSemaine =
          parseInt(moment(elementFormatJson.start).locale("fr").format("e")) +
          1;

        const mongodb = await getDatabase();

        const collaborateur = await mongodb
          .db()
          .collection("Collaborateurs")
          .updateOne(
            {
              _id: new ObjectId(elementFormatJson.collaborateur),
            },
            {
              $set: {
                [`horaires.${numeroSemaine}.${numeroJourSemaine}.horaires`]: `${elementFormatJson.start}/${elementFormatJson.end}`,
                [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_necessaire`]: `${
                  moment(elementFormatJson.end).diff(
                    elementFormatJson.start,
                    "minutes"
                  ) / 60
                }`,
              },
            }
          );
      }
    );
  });
  if (fs.existsSync("ArrayPlanning2.json")) {
    fs.readFile("ArrayPlanning2.json", "utf8", function (err: any, data: any) {
      const content = data?.split("]");

      const arrayReturned = content.forEach(
        async (element: any, index: number) => {
          const elementFormatString = element.replace("[", "");
          const elementFormatJson = JSON.parse(elementFormatString);

          const dateElement = moment(elementFormatJson.start)
            .locale("fr")
            .format("L");

          const heureElementStart = moment(elementFormatJson.start)
            .locale("fr")
            .format("LT");

          const heureElementEnd = moment(elementFormatJson.end)
            .locale("fr")
            .format("LT");

          const numeroSemaine =
            parseInt(moment(elementFormatJson.start).locale("fr").format("w")) -
            1;

          const numeroJourSemaine =
            parseInt(moment(elementFormatJson.start).locale("fr").format("e")) +
            1;

          const mongodb = await getDatabase();

          const collaborateur = await mongodb
            .db()
            .collection("Collaborateurs")
            .updateOne(
              {
                _id: new ObjectId(elementFormatJson.collaborateur),
              },
              {
                $set: {
                  [`horaires.${numeroSemaine}.${numeroJourSemaine}.horaires`]:
                    "",
                  [`horaires.${numeroSemaine}.${numeroJourSemaine}.heure_necessaire`]:
                    "",
                },
              }
            );
        }
      );
    });
  }

  res.redirect(`${req.headers.referer}`);
}
