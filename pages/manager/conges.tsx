import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil, userRayon } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";
import { getDatabase } from "../../src/database";
import moment from "moment";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();

  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded: any;
  let rayon;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
    rayon = await userRayon(decoded.email);
  }
  if (profile === "Manager") {
    const searchconges = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ rayon: rayon })
      .toArray()
      .then((result: any) => result)
      .then((data: any) =>
        data.map((element: any) => {
          return {
            firstName: element.prenom,
            lastName: element.nom,
            mail: element.email,
            conges: element.conges.map((element: any) => {
              if (element.approuved === false) {
                return `${element.start}/${element.end}/${element.nbrdays}`;
              }
            }),
          };
        })
      );
    console.log(searchconges.conges);

    return {
      props: {
        conges: JSON.stringify(searchconges),
        category: profile,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

const conges: NextPage = (props: any) => {
  const result = JSON.parse(props.conges);
  return (
    <LayoutManager>
      <div className="ManagerConges">
        <div className="titreDemande">Demande de congés</div>

        <div className="Demande">
          {" "}
          {result.map((element: any) => {
            return (
              <>
                {" "}
                <div className="leave-history">
                  <div className="start">
                    nom : {element.firstName}
                    <br></br>prenom : {element.lastName}
                  </div>

                  {element.conges.map((e: any) => {
                    if (e !== null) {
                      return (
                        <>
                          <div className="start">
                            Commence le <br></br>
                            {moment(e.split("/")[0]).format("L")}
                          </div>
                          <div className="end">
                            Fini le <br></br>{" "}
                            {moment(e.split("/")[1]).format("L")}
                          </div>
                          <div>
                            Nombre de jours <br></br>
                            {e.split("/")[2]}
                          </div>
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "green",
                              width: "3rem",
                              marginLeft: "4.4rem",
                              color: "white",
                              borderRadius: "10px",
                            }}
                          >
                            <DoneIcon />
                          </button>
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "red",
                              width: "3rem",
                              marginLeft: "4.4rem",
                              color: "white",
                              borderRadius: "10px",
                            }}
                          >
                            <CloseIcon />
                          </button>
                        </>
                      );
                    }
                  })}
                </div>
              </>
            );
          })}
        </div>
        <div className="titreHistorique">Historique Demande de congés</div>
        <div className="Historique">data</div>
      </div>
    </LayoutManager>
  );
};

export default conges;
