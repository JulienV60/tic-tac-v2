import LayoutManager from "../../components/LayoutManager";
import { GetServerSideProps } from "next";
import { getDatabase } from "../../src/database";
import moment from "moment";
import {
  Eventcalendar,
  getJson,
  formatDate,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
  localeFr,
} from "@mobiscroll/react";
import React from "react";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
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
    const mongodb = await getDatabase();

    //list of collaborateurs
    const listCollaborateurs = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ profile: "Collaborateur" })
      .toArray();

    //return prenom id and img of collaborateurs
    const listPrenom = listCollaborateurs.map((element) => {
      return { prenom: element.prenom, _id: element._id, img: element.img };
    });

    //list of horaires of this semaine for all collaborateurs
    const data = await Promise.all(
      listPrenom.map(async (element) => {
        return await fetch(
          `${
            process.env.AUTH0_LOCAL
          }/api/manager/planning/db/loadPlanningDb?semaine=${parseInt(
            moment().locale("fr").format("w")
          )}&id=${element._id}`
        ).then((result) => result.json());
      })
    );

    return {
      props: {
        profileUser: profile,
        prenoms: JSON.stringify(listPrenom),
        dataPlanningInit: JSON.stringify(data),
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default function IndexManager(props: any) {
  return (
    <LayoutManager>
      <div className="parent">
        <div className="div1">Anomalie</div>
        <div className="div2"></div>
        <div className="div3">Message </div>
        <div className="div4"></div>
        <div className="div5"> Horaires</div>
        <div className="div6"></div>
        <div className="div7">Compteurs </div>
        <div className="div8">Ecarts </div>
        <div className="div9"></div>
        <div className="div10"></div>
        <div className="div11">Demandes de congés </div>
        <div className="div12"></div>
      </div>
    </LayoutManager>
  );
}
