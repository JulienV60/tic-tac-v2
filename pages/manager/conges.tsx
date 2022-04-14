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
          let arrayAllCongeTraited: any = [];
          if (element.conges.length !== 0) {
            return {
              firstName: element.prenom,
              lastName: element.nom,
              mail: element.email,
              soldes_cp: element.soldes_cp,
              conges: element.conges.map((element: any) => {
                if (element.traited === false) {
                  arrayAllCongeTraited.push(false);
                  return `${element.start}/${element.end}/${
                    element.nbrdays
                  }/${element.id.toString()}/${element.nbrdays}`;
                } else {
                  arrayAllCongeTraited.push(true);
                }
              }),
              allCongeTraited: arrayAllCongeTraited,
            };
          }
        })
      );

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
      <div className="">
        <div className="titreDemande">Demande de congés</div>

        {result.map((element: any) => {
          if (element !== null) {
            if (element.allCongeTraited.includes(false)) {
              return (
                <div className="row overflow-auto" key={element.id}>
                  <div className="col-2">
                    <div style={{ width: "18rem", marginLeft: "1rem" }}>
                      <div>
                        <h5 className="card-title">
                          nom : {element.firstName}
                        </h5>
                        <h5 className="card-title">
                          prenom : {element.lastName}
                        </h5>

                        <h5 className="card-title">
                          soldes cp : {element.soldes_cp}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {element.conges.map((e: any, index: number) => {
                    if (e !== null) {
                      return (
                        <div className="col-2">
                          <div style={{ width: "18rem" }}>
                            <div>
                              <div>
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
                              </div>{" "}
                              <form
                                action={`/api/manager/conges/validConges?${
                                  e.split("/")[3]
                                }&i=${index}&day=${e.split("/")[4]}`}
                                method="POST"
                              >
                                <button
                                  className="btn"
                                  style={{
                                    backgroundColor: "green",
                                    width: "3rem",

                                    color: "white",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <DoneIcon />
                                </button>
                              </form>
                              <form
                                action={`/api/manager/conges/deleteConges?${
                                  e.split("/")[3]
                                }&i=${index}&day=${e.split("/")[4]}`}
                                method="POST"
                              >
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
                              </form>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            }
          }
        })}
      </div>
    </LayoutManager>
  );
};

export default conges;
