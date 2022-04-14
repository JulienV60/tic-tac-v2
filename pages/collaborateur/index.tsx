import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";

import React from "react";
import { userId, userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import moment from "moment";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.IdToken;
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
  if (profile === "Collaborateur") {
    const numeroSemaine = parseInt(moment().locale("fr").format("w")) - 1;
    const numeroSemaineSuivante = parseInt(moment().locale("fr").format("w"));
    console.log(numeroSemaine);
    console.log(numeroSemaineSuivante);
    const mongodb = await getDatabase();
    const searchCongesActual = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.horaires[numeroSemaine]);
    const searchCongesNext = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.horaires[numeroSemaineSuivante]);
    const allDateActuel = searchCongesActual.map(
      (element: any, index: number) => {
        if (index !== 0) {
          return {
            nameday: element.designation,
            date: element.date,
            horairesStart: moment(element.horaires.split("/")[0]).format(
              "HH:SS"
            ),
            horairesEnd: moment(element.horaires.split("/")[1]).format("HH:SS"),
          };
        }
      }
    );
    console.log(allDateActuel);
    const allDateNext = searchCongesNext.map((element: any, index: number) => {
      if (index !== 0) {
        return {
          nameday: element.designation,
          date: element.date,
          horairesStart: moment(element.horaires.split("/")[0]).format("HH:SS"),
          horairesEnd: moment(element.horaires.split("/")[1]).format("HH:SS"),
        };
      }
    });
    return {
      props: {
        allDate: JSON.stringify(allDateActuel),
        allDateNext: JSON.stringify(allDateNext),
        profileUser: profile,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
export default function Home(props: any) {
  const allDateActual = JSON.parse(props.allDate);
  const allDateNext = JSON.parse(props.allDateNext);
  return (
    <Layout>
      <div className="dashboard">
        <div className="anomalie">Anomalie</div>
        <div className="dataAnomalie">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. At minima,
          magnam porro, eaque beatae alias nam quod asperiores molestiae
          blanditiis reiciendis quas. Tempore dignissimos eveniet et recusandae
          veritatis magnam totam.
        </div>
        <div className="message">Message </div>
        <div className="datamessage"></div>
        <div className="horaires"> Horaires</div>
        <div className="dataHoraires">
          <span
            style={{
              backgroundColor: "#2f9dac",
              color: "white",
              fontFamily: "Bebas Neue",
              padding: "0",
              margin: "0",
            }}
          >
            Semaine Actuel:{" "}
          </span>
          <br></br>

          {allDateActual.map((element: any) => {
            if (element !== null) {
              return (
                <>
                  <p>
                    {element.nameday} <span></span>
                    {element.date} <span></span>
                    {element.horairesStart} <span></span>
                    {element.horairesEnd}
                  </p>
                </>
              );
            }
          })}
          <br></br>
          <span
            style={{
              backgroundColor: "#2f9dac",
              color: "white",
              fontFamily: "Bebas Neue",
              padding: "0",
              margin: "0",
            }}
          >
            Semaine Suivante:
          </span>
          {allDateNext.map((element: any) => {
            if (element !== null) {
              return (
                <>
                  <p>
                    {element.nameday} <span></span>
                    {element.date} <span></span>
                    {element.horairesStart} <span></span>
                    {element.horairesEnd}
                  </p>
                </>
              );
            }
          })}
        </div>
        <div className="compteurs">Compteurs </div>
        <div className="ecarts">Ecarts </div>
        <div className="datacompteurs"></div>
        <div className="dataecarts"></div>
        <div className="conges">Demandes de congés </div>
        <div className="dataconges"></div>
      </div>
    </Layout>
  );
}
