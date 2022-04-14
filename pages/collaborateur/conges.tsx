import {
  Datepicker,
  Eventcalendar,
  getJson,
  toast,
  localeFr,
  SegmentedItem,
} from "@mobiscroll/react";
import { GetServerSideProps, NextPage } from "next";
import { Card, Button } from "react-bootstrap";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";
import { userId, userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import React, { useState } from "react";
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
    const mongodb = await getDatabase();

    const congesInfo = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => {
        return { droitCP: result?.droit_cp, soldesCP: result?.soldes_cp };
      });

    const infoArrayConges = await mongodb
      .db()
      .collection("Collaborateurs")
      .findOne({ idUser: idUser?.toString() })
      .then((result) => {
        return result?.conges;
      });

    if (infoArrayConges !== undefined) {
      const congesNotApprouved = infoArrayConges.filter(
        (element: any, index: any) => element.traited === false
      );
      const congesApprouved = infoArrayConges.filter(
        (element: any, index: any) => element.approuved === true
      );
      const congesRefused = infoArrayConges.filter(
        (element: any, index: any) =>
          element.approuved === false && element.traited === true
      );
      const congesTake = congesApprouved.map((element: any, index: any) => {
        return element.nbrdays;
      });
      let sum = 0;
      for (let i = 0; i < congesTake.length; i++) {
        sum += congesTake[i];
      }

      return {
        props: {
          demandeRefused: congesRefused.length,
          demandeawait: congesNotApprouved.length,
          demandeApprouved: congesApprouved.length,
          nbrTake: sum,
          data: congesInfo,
          dataListConges: JSON.stringify(infoArrayConges),
        },
      };
    } else {
      return {
        props: {
          demandeawait: null,
          data: congesInfo,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
};

export default function Conges(props: any) {
  const [date, setMyDate] = React.useState();
  const [calendar, setCalendar] = React.useState();
  const [showbutton, setShowButton] = React.useState(false);
  let dataConges = [];
  if (props.demandeawait !== null) {
    dataConges = JSON.parse(props.dataListConges);
  }
  const pickerChange = async (ev: any) => {
    const date: any = ev.value;
    const dateStart = moment(date[0]);
    const dateEnd = moment(date[1]);
    const diffInDays = dateEnd.diff(dateStart, "day");

    if (diffInDays <= props.data.soldesCP) {
      setShowButton(true);
    }
    setMyDate(ev.value);
  };
  const sendDate = async (e: any) => {
    const test = await fetch("/api/collaborateur", {
      method: "POST",
      body: JSON.stringify({ date: date }),
    });
    window.location.reload();
  };

  return (
    <>
      <Layout>
        <div className="container">
          <section className="leave-section">
            <div className="leave-title" style={{ borderRadius: "5px" }}>
              <h3 className="leave-h3 ">Soldes des congés payés</h3>
            </div>
            <Card.Img
              style={{ width: "5rem", height: "5rem" }}
              src="/calendar.png"
            />
            <div className="container-picker">
              {" "}
              <form
                method="POST"
                action={`${process.env.AUTH0_LOCAL}/api/collaborateur`}
              >
                <span className="leave-picker ">
                  <div>
                    {" "}
                    <Datepicker
                      themeVariant="light"
                      controls={["calendar"]}
                      select="range"
                      rangeHighlight={true}
                      showRangeLabels={true}
                      value={date}
                      onChange={pickerChange}
                      endIcon="calendar"
                    />{" "}
                  </div>
                </span>
                {showbutton === true ? (
                  <button
                    type="button"
                    className="btn"
                    style={{ backgroundColor: "#2f9dac", color: "white" }}
                    onClick={sendDate}
                    id="date"
                  >
                    Valider
                  </button>
                ) : (
                  <></>
                )}
              </form>
            </div>

            <div className="leave-history">
              <div className="libelle">
                Droits <p>{props.data.droitCP}</p>
              </div>
              <div className="start">
                {" "}
                Pris <p>{props.nbrTake}</p>
              </div>
              <div className="end">
                Soldes <p>{props.data.soldesCP}</p>
              </div>
              <div className="quantity">
                Demandes en cours <p>{props.demandeawait}</p>
              </div>{" "}
              <div className="rest">
                Demandes acceptées <p>{props.demandeApprouved}</p>
              </div>{" "}
              <div className="forecast-balances">
                Demandes refusées<p>{props.demandeRefused}</p>
              </div>
              <div className="forecast-balances">Soldes prévitionnels</div>
            </div>
          </section>

          <section className="leave-section">
            <div className="leave-title" style={{ borderRadius: "5px" }}>
              <h3 className="leave-h3">Historiques des demandes</h3>
            </div>

            <div className="leave-history">
              <div className="start" style={{ borderRadius: "5px" }}>
                {" "}
                Date de Début
              </div>
              <div className="end" style={{ borderRadius: "5px" }}>
                Date de fin
              </div>
              <div className="quantity" style={{ borderRadius: "5px" }}>
                Quantité
              </div>
              <div className="rest" style={{ borderRadius: "5px" }}>
                Statut
              </div>
              <div
                className="forecast-balances"
                style={{ borderRadius: "5px" }}
              >
                Soldes prévisionnels
              </div>
            </div>
            {dataConges.map((element: any, index: number) => {
              return (
                <div
                  key={index}
                  className="leave-history"
                  style={{ borderRadius: "5px" }}
                >
                  <div className="start" style={{ borderRadius: "5px" }}>
                    {moment(element.start).format("L")}
                  </div>
                  <div className="end" style={{ borderRadius: "5px" }}>
                    {" "}
                    {moment(element.end).format("L")}
                  </div>
                  <div className="quantity" style={{ borderRadius: "5px" }}>
                    {element.nbrdays}
                  </div>
                  <div className="rest" style={{ borderRadius: "5px" }}>
                    {element.approuved.toString()}
                  </div>
                  <div
                    className="forecast-balances"
                    style={{ borderRadius: "5px" }}
                  >
                    Soldes prévisionnels
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </Layout>
    </>
  );
}
