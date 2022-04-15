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

    const infoArrayConges = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => {
        return result?.conges;
      });

    const congesNotApprouved = infoArrayConges.filter(
      (element: any, index: any) => element.traited === false
    );
    const searchMessage = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((data) => data?.message);
    const numSemaine = parseInt(moment().locale("fr").format("w")) - 1;

    const contingentActuel = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => result?.horaires);
    const heures: any[] = [];

    for (let i = 0; i <= numSemaine; i++) {
      for (let j = 0; j < 7; j++) {
        heures.push(contingentActuel[i][j].heure_necessaire);
      }
    }
    console.log(heures);
    return {
      props: {
        message: JSON.stringify(searchMessage),
        congesPending: JSON.stringify(congesNotApprouved),
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
  const message = JSON.parse(props.message);
  const allDateActual = JSON.parse(props.allDate);
  const allDateNext = JSON.parse(props.allDateNext);
  const congesPending = JSON.parse(props.congesPending);

  const temps = moment().locale("FR").format("DD-MM-YYYY");

  return (
    <Layout>
      <div className="dashboard">
        <div className="anomalie">Anomalie</div>
        <div className="dataAnomalie"></div>
        <div className="message">Message</div>

        <div
          className="datamessage"
          style={{
            fontFamily: "Bebas Neue",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          {message}
        </div>
        <div className="horaires"> Horaires</div>
        <div
          className="dataHoraires"
          style={{
            backgroundColor: "#2f9dac",
            color: "white",
          }}
        >
          <span
            style={{
              borderRadius: "5px",
              backgroundColor: "#2f9dac",
              color: "white",
              fontFamily: "Bebas Neue",
              fontSize: "2rem",
              paddingTop: "3.5rem",
              textAlign: "center",
            }}
          >
            Semaine Actuel:
          </span>
          <br></br>
          {allDateActual.map((element: any) => {
            if (element !== null) {
              return (
                <>
                  <p
                    style={{
                      marginLeft: "1rem",
                      color: "white",
                      marginRight: "0",
                      paddingRight: "1rem",
                      paddingLeft: "1rem",
                      width: "auto",
                      height: "5rem",
                    }}
                  ></p>
                  {element.nameday.toUpperCase()}
                  <br></br>
                  {element.date}
                  <br></br>
                  {element.horairesStart}
                  <br></br>
                  {element.horairesEnd}
                  <br></br>
                </>
              );
            }
          })}{" "}
          <div style={{ border: "2px solid white" }}></div>
          <br></br>
          <span
            style={{
              backgroundColor: "#2f9dac",
              color: "white",
              fontFamily: "Bebas Neue",
              fontSize: "2rem",

              paddingTop: "3.5rem",
              paddingRight: "1rem",
              paddingLeft: "1rem",
              textAlign: "center",
            }}
          >
            Semaine Suivante:
          </span>
          {allDateNext.map((element: any) => {
            if (element !== null) {
              return (
                <>
                  <p
                    style={{
                      marginLeft: "1rem",
                      color: "white",
                      margin: "0 0 0 0",
                      paddingRight: "1rem",
                      paddingLeft: "1rem",
                      width: "auto",
                      height: "5rem",
                    }}
                  ></p>
                  {element.nameday.toUpperCase()}
                  <br></br>
                  {element.date}
                  <br></br>
                  {element.horairesStart}
                  <br></br>
                  {element.horairesEnd}
                  <br></br>
                </>
              );
            }
          })}
        </div>
        <div className="compteurs">Compteurs </div>
        <div className="ecarts">Ecarts </div>
        <div className="datacompteurs">
          Contingent contractuel cumulé au {temps}
        </div>
        <div className="dataecarts"></div>
        <div className="conges">Demandes de congés </div>

        {congesPending.map((element: any, index: number) => {
          if (element.traited === false) {
            return (
              <div
                key={index}
                className="dataconges"
                style={{ borderRadius: "5px" }}
              >
                <p> Commence le : {moment(element.start).format("L")}</p>{" "}
                <p> Finis le : {moment(element.end).format("L")}</p>{" "}
                <p> Nombres de jours : {element.nbrdays}</p>
              </div>
            );
          }
        })}
      </div>
    </Layout>
  );
}
