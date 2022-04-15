import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil, userRayon } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";
import { getDatabase } from "../../src/database";
import moment from "moment";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
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
                  }/${element.id.toString()}/${element.nbrdays}/${element.id}`;
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

function Conges(props: any) {
  const [message, setMessage] = React.useState("");
  const [index, setIndex] = React.useState<number>();
  const result = JSON.parse(props.conges);
  const [id, setId] = React.useState("");
  async function handleSubmit(event: any) {
    if (message !== "") {

      const test = await fetch("/api/manager/conges/message", {
        method: "POST",
        body: JSON.stringify({ message: message, id: id, index: index }),
      }).then((result) => result.json());
    }
  }
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
                              {element.soldes_cp - e.split("/")[2] < 0 ? (
                                <></>
                              ) : (
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
                              )}
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
                              <input
                                id={e.split("/")[5]}
                                className="form-control"
                                placeholder="Entrer votre message"
                                type="text"
                                onChange={(event) => {
                                  setId(e.split("/")[5]);
                                  setIndex(index);
                                  setMessage(event.target.value);
                                }}
                              ></input>
                              <button
                                id={e.split("/")[5]}
                                className="btn"
                                key={e.split("/")[5]}
                                style={{ backgroundColor: "#2f9dac" }}
                                type="button"
                                onClick={handleSubmit}
                              >
                                Valider le message
                              </button>
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
}

export default Conges;
