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
        (element: any, index: any) => element.approuved === false
      );
      const congesApprouved = infoArrayConges.filter(
        (element: any, index: any) => element.approuved === true
      );
      const congesTake = congesApprouved.map(
        (element: any, index: any) => {
          return element.nbrdays;
        }
      );
      let sum = 0;
      for (let i = 0; i < congesTake.length; i++) {
        sum += congesTake[i];
      }

      return {
        props: {
          demandeawait: congesNotApprouved.length,
          demandeApprouved: congesApprouved.length,
          data: congesInfo,
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

  const pickerChange = async (ev: any) => {
    const date: any = ev.value;
    const dateStart = moment(date[0]);
    const dateEnd = moment(date[1]);
    const diffInDays = dateEnd.diff(dateStart, "day");

    if (diffInDays < props.data.soldesCP) {
      setShowButton(true);
    }
    setMyDate(ev.value);
  };
  const sendDate = async (e: any) => {
    const test = await fetch("/api/collaborateur", {
      method: "POST",
      body: JSON.stringify({ date: date }),
    });
  };

  return (
    <>
      <Layout>
        <div className="container">
          <section className="leave-section">
            <div className="leave-title">
              <h3 className="leave-h3">Soldes des congés payés</h3>
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
                  <Datepicker
                    controls={["calendar"]}
                    select="range"
                    rangeHighlight={true}
                    showRangeLabels={true}
                    value={date}
                    onChange={pickerChange}
                  />
                </span>
                {showbutton === true ? <button type="button" onClick={sendDate} id="date">
                  Valider
                </button> : <></>
                }

              </form>
            </div>

            <div className="leave-history">
              <div className="libelle">
                Droits <p>{props.data.droitCP}</p>
              </div>
              <div className="start"> Pris</div>
              <div className="end">
                Soldes <p>{props.data.soldesCP}</p>
              </div>
              <div className="quantity">Demandes en cours <p>{props.demandeawait}</p></div>{" "}
              <div className="rest">Demandes accept. <p>{props.demandeApprouved}</p></div>
              <div className="forecast-balances">Soldes prévitionnels</div>
            </div>
          </section>

          <section className="leave-section">
            <div className="leave-title">
              <h3 className="leave-h3">Historiques des demandes</h3>
            </div>

            <div className="leave-history">
              <div className="libelle">Libellé</div>
              <div className="start"> Date de Début</div>
              <div className="end">Date de fin</div>
              <div className="quantity">Quantité</div>
              <div className="rest">Repos</div>
              <div className="forecast-balances">Soldes prévisionnels</div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
