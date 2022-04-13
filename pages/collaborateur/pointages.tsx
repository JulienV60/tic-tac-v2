import { Datepicker } from "@mobiscroll/react";
import { setOptions, localeFr } from "@mobiscroll/react";
import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});
import { NextPage } from "next";
import { Layout } from "../../components/LayoutCollab";

const pointages: NextPage = () => {
  return (
    <div>
      <Layout />
      <form action="" method="POST" className="form-example-pointages">
        <div className="form-example">
          <label className="LabelPointages">Semaine</label>
          {/* <Datepicker
            controls={["calendar"]}
            select="preset-range"
            firstSelectDay={1}
            selectSize={7}
          /> */}
          <input
            className="InputFormPointages"
            type="week"
            name="semainePointages"
            id="semainePointage"
          />
        </div>
        <div className="form-example">
          <label className="LabelPointages">Jour</label>
          {/* <Datepicker calendarType="week" calendarSize={1} /> */}
          <input
            className="InputFormPointages"
            type="date"
            name="jourPointage"
            id="jourPointages"
          />
        </div>
        <div className="form-example">
          <label className="LabelPointages">
            Horaires planifié a la semaine
          </label>
          <input
            className="InputFormPointages"
            type="horairesPointages"
            name="horairesPointages"
            id="horairesPointages"
            value="A modifier avec les horaires de planning"
          />
        </div>
        <div className="form-example">
          <label className="LabelPointages">Total heures travailler</label>
          <input
            className="InputFormPointages"
            type="totalHorairesPointages"
            name="totalHorairesPointages"
            id="totalHorairesPointages"
            value="A modifier avec les horaires de planning"
          />
        </div>
        <div className="verifHoraires">
          <div className="verifHorairesPlanning">
            <p>Planning de la journée</p>
            <div className="form-example-horaires">
              <label className="LabelVerifHoraires">Matin</label>
              <input
                className="InputVerifHoraires"
                type="time"
                name="verifHorairesMatin"
                id="verifHorairesMatin"
              />
            </div>

            <div className="form-example-horaires">
              <label className="LabelVerifHoraires">Après-midi</label>
              <input
                className="InputVerifHoraires"
                type="time"
                name="verifHorairesApresMidi"
                id="verifHorairesApresMidi"
              />
            </div>
          </div>
          <div className="PointagesHoraires">
            <p>Pointages</p>
            <div className="form-example-horaires">
              <label className="LabelPointagesHoraires">Matin</label>
              <input
                className="InputPointagesHoraires"
                type="time"
                name="pointagesHorairesMatin"
                id="pointagesHorairesMatin"
              />
            </div>

            <div className="form-example-horaires">
              <label className="LabelPointagesHoraires">Après-midi</label>
              <input
                className="InputPointagesHoraires"
                type="time"
                name="pointagesHorairesApresMidi"
                id="pointagesHorairesApresMidi"
              />
            </div>
          </div>
          <div className="PointagesHoraires">
            <p>Correction</p>
            <div className="form-example-horaires">
              <label className="LabelCorrectionHoraires">Matin</label>
              <input
                className="InputCorrectionHoraires"
                type="time"
                name="correctionHorairesMatin"
                id="correctionHorairesMatin"
              />
            </div>

            <div className="form-example-horaires">
              <label className="LabelCorrectionHoraires">Après-midi</label>
              <input
                className="InputCorrectionHoraires"
                type="time"
                name="correctionHorairesApresMidi"
                id="correctionHorairesApresMidi"
              />
            </div>
          </div>
          <div className="MotifPointages">
            <p>Motif: </p>
            <select id="motifs" name="motifs">
              <option value="medicale">Médicale</option>
              <option value="familiale">Familiale</option>
              <option value="administratif">Administratif</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default pointages;
