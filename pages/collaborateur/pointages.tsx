import { Button, Datepicker, Input } from "@mobiscroll/react";
import { setOptions, localeFr } from "@mobiscroll/react";
import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});
import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/LayoutCollab";
import { userProfil } from "../../src/userInfos";
import jwt_decode from "jwt-decode";

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

  if (profile === "Collaborateur") {
    return {
      props: {
        prenoms: "",
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default function Pointages(props: any) {

  const [semaine, setMySemaine] = React.useState();
  const [jour, setMyJour] = React.useState();
  const [afficheFormJour, setAfficheFormJour] = React.useState(false);
  const [heurePlanif, setHeurePlanif] = React.useState(0);
   const [heuresRea, setHeuresRea] = React.useState(0);

  const pickerChangeSemaine = async (ev: any) => {
    setMySemaine(ev.value);

    if (ev.value !== null) {
      setAfficheFormJour(true);
    } else {
      setAfficheFormJour(false);
    }
  };
   const pickerChangeJour = async (ev: any) => {
     setMyJour(ev.value);
     if (semaine !== null && jour !== null) {
       const dataHoraires = await fetch("/api/collaborateur/pointages",
         {
           method: "POST",
           body: JSON.stringify({semaine:semaine,jour:jour})
         }).then((result) => result.json())
         .then((response)=>response);

       setHeurePlanif(parseInt(dataHoraires.heuresPlanif.toString()));
       setHeuresRea(parseInt(dataHoraires.heuresrea.toString()));
     }
  };

  return (
    <div>
      <Layout />

      <form  className="form-example-pointages">
        <div className="container p-5 my-5 border">
          <div className="form-example-semaines">
            <label className="LabelPointages">
              Semaine
              <Datepicker
                controls={["calendar"]}
                select="preset-range"
                firstSelectDay={1}
                selectSize={7}
                display="anchored"
                endIcon="calendar"
                onChange={pickerChangeSemaine}
              />
            </label>
          </div>
          {afficheFormJour === true ? <div className="form-example-jour">
            <label className="LabelPointagesHoraires">
              Jour
              <Datepicker
                calendarType="week"
                calendarSize={1}
                display="anchored"
                endIcon="calendar"
                onChange={pickerChangeJour}
              />
            </label>
          </div> : <></>}
          <div className="form-example-planifie">
            <label className="LabelPointagesHoraires">Horaires planifié:</label>{" "}
            <input
              className="InputFormPointages"
              type="horairesPointages"
              name="horairesPointages"
              id="horairesPointages"
              value={`${heurePlanif}`}
            />
          </div>
          <div className="form-example-total">
            <label className="LabelPointages">Total travaillé:</label>{" "}
            <input
              className="InputFormPointages"
              type="horairesPointages"
              name="horairesPointages"
              id="horairesPointages"
              value={`${heuresRea}`}
            />
          </div>
          <div className="form-example-absence">
            <label className="LabelPointages">Absences ou Congés en H:</label>{" "}
            <input
              className="InputFormPointages"
              type="horairesPointages"
              name="horairesPointages"
              id="horairesPointages"
              value="A modifier avec les horaires de planning"
            />
          </div>
          <div className="horairesPlanning">
            <p>Planning de la journée</p>
            <div className="form-example-horaires">
              <label className="LabelVerifHoraires">
                Matin
                <Datepicker
                  controls={["time"]}
                  display="bottom"
                  themeVariant="light"
                  select="range"
                  showRangeLabels={true}
                  touchUi={true}
                  endIcon="clock"
                />
              </label>
            </div>

            <div className="form-example-horaires">
              <label className="LabelVerifHoraires">
                Après-midi
                <Datepicker
                  controls={["time"]}
                  themeVariant="dark"
                  display="bottom"
                  select="range"
                  showRangeLabels={true}
                  touchUi={true}
                  endIcon="clock"
                />
              </label>
            </div>
          </div>
          <div className="PointagesHoraires">
            <p>Pointages</p>
            <div className="form-example-horaires">
              <label className="LabelPointagesHoraires">
                Matin
                <Datepicker
                  controls={["time"]}
                  display="bottom"
                  select="range"
                  showRangeLabels={true}
                  touchUi={true}
                  endIcon="clock"
                />
              </label>
            </div>

            <div className="form-example-horaires">
              <label className="LabelPointagesHoraires">
                Après-midi
                <Datepicker
                  controls={["time"]}
                  display="bottom"
                  select="range"
                  showRangeLabels={true}
                  touchUi={true}
                  endIcon="clock"
                />
              </label>
            </div>
          </div>
          <div className="correctionHoraires">
            <p>Correction</p>
            <div className="form-example-horaires">
              <label className="LabelCorrectionHoraires">
                Matin
                <Datepicker
                  controls={["time"]}
                  display="bottom"
                  select="range"
                  showRangeLabels={true}
                  touchUi={true}
                  endIcon="clock"
                />
              </label>
            </div>

            <div className="form-example-horaires">
              <label className="LabelCorrectionHoraires">
                Après-midi
                <Datepicker
                  controls={["time"]}
                  display="bottom"
                  select="range"
                  showRangeLabels={true}
                  touchUi={true}
                  endIcon="clock"
                />
              </label>
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
