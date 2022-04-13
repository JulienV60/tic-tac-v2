import { Datepicker } from "@mobiscroll/react";
import { setOptions, localeFr } from "@mobiscroll/react";
import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});
import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/LayoutCollab"
import { userProfil } from "../../src/userInfos";
import jwt_decode from "jwt-decode";
import PageNotFound from "../../components/PageNotFound";

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
        profileUser: profile,
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

const pointages: NextPage = (props: any) => {
  if (props.profileUser === "Collaborateur") {
    return (
      <div>
        <Layout />
        <form action="" method="POST" className="form-example-pointages">
          <div className="form-example">
            <label className="LabelPointages">
              Semaine
              <Datepicker
                controls={["calendar"]}
                select="preset-range"
                firstSelectDay={1}
                selectSize={7}
                display="anchored"
              />
            </label>
            {/* <input
            className="InputFormPointages"
            type="week"
            name="semainePointages"
            id="semainePointage"
          /> */}
          </div>
          <div className="form-example">
            <label className="LabelPointagesHoraires">
              Jour
              <Datepicker
                calendarType="week"
                calendarSize={1}
                display="anchored"
              />
            </label>
            {/* <input
            className="InputFormPointages"
            type="date"
            name="jourPointage"
            id="jourPointages"
          /> */}
          </div>
          <div className="form-example">
            <label className="LabelPointagesHoraires">
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
                <label className="LabelVerifHoraires">
                  Matin
                  <Datepicker
                    controls={["time"]}
                    display="bottom"
                    touchUi={true}
                  />
                </label>
                {/* <input
                className="InputVerifHoraires"
                type="time"
                name="verifHorairesMatin"
                id="verifHorairesMatin"
              /> */}
              </div>

              <div className="form-example-horaires">
                <label className="LabelVerifHoraires">
                  Après-midi
                  <Datepicker
                    controls={["time"]}
                    display="bottom"
                    touchUi={true}
                  />
                </label>
                {/* <input
                className="InputVerifHoraires"
                type="time"
                name="verifHorairesApresMidi"
                id="verifHorairesApresMidi"
              /> */}
              </div>
            </div>
            <div className="PointagesHoraires">
              <p>Pointages</p>
              <div className="form-example-horaires">
                <label className="LabelPointagesHoraires">
                  Matin
                  {/* <input
                className="InputPointagesHoraires"
                type="time"
                name="pointagesHorairesMatin"
                id="pointagesHorairesMatin"
              /> */}
                  <Datepicker
                    controls={["time"]}
                    display="bottom"
                    touchUi={true}
                  />
                </label>
              </div>

              <div className="form-example-horaires">
                <label className="LabelPointagesHoraires">
                  Après-midi
                  {/* <input
                className="InputPointagesHoraires"
                type="time"
                name="pointagesHorairesApresMidi"
                id="pointagesHorairesApresMidi"
              /> */}
                  <Datepicker
                    controls={["time"]}
                    display="bottom"
                    touchUi={true}
                  />
                </label>
              </div>
            </div>
            <div className="PointagesHoraires">
              <p>Correction</p>
              <div className="form-example-horaires">
                <label className="LabelCorrectionHoraires">
                  Matin
                  {/* <input
                className="InputCorrectionHoraires"
                type="time"
                name="correctionHorairesMatin"
                id="correctionHorairesMatin"
              /> */}
                  <Datepicker
                    controls={["time"]}
                    display="bottom"
                    touchUi={true}
                  />
                </label>
              </div>

              <div className="form-example-horaires">
                <label className="LabelCorrectionHoraires">
                  Après-midi
                  {/* <input
                className="InputCorrectionHoraires"
                type="time"
                name="correctionHorairesApresMidi"
                id="correctionHorairesApresMidi"
              /> */}
                  <Datepicker
                    controls={["time"]}
                    display="bottom"
                    touchUi={true}
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
  } else {
    return <PageNotFound/>
  }
};

export default pointages;
