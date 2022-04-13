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
import { userProfil } from "../../src/userInfos";

export const getServerSideProps: GetServerSideProps = async (context) => {
const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded:any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }
  if (profile === "Collaborateur") {
    return {
      props: {
        profileUser: profile
      },
    };
  } else {
    return {
      props: {
        profileUser: null,

      },
    };
  }
};

const conges: NextPage = () => {
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
              <span className="leave-picker ">
                <Datepicker
                  select="range"
                  rangeHighlight={true}
                  showRangeLabels={true}
                />
              </span>
              <Button variant="secondary">Valider</Button>
            </div>

            <div className="leave-history">
              <div className="libelle">Droits</div>
              <div className="start"> Pris</div>
              <div className="end">Soldes</div>
              <div className="quantity">Demandes en cours</div>
              <div className="rest">Demandes accept. ou validées</div>
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
};

export default conges;
