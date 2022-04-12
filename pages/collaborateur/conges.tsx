import {
  Datepicker,
  Eventcalendar,
  getJson,
  toast,
  localeFr,
  SegmentedItem,
} from "@mobiscroll/react";
import { NextPage } from "next";
import { Card, Button } from "react-bootstrap";
import LayoutCollab from "../../components/LayoutCollab";

const conges: NextPage = () => {
  return (
    <>
      <LayoutCollab>
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
      </LayoutCollab>
    </>
  );
};

export default conges;
