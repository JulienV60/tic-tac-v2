import { GetServerSideProps } from "next";
import React from "react";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";
import PageNotFound from "../../components/PageNotFound";
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

export default function Kikela(props:any) {

  const [prenom, setPrenom] = React.useState("");
  const [nom, setNom] = React.useState("");
  const [dispo, setDispo] = React.useState("");
  const handleSubmit = async (event: any) => {
    if (prenom !== "" || nom !== "") {
      const test = await fetch("/api/kikela", {
        method: "POST",
        body: JSON.stringify({ nom: nom, prenom: prenom }),
      }).then((result) => result.json());
      console.log(test);

      if (test === true) {
        setDispo("Present sur la base du planning");
      } else {
        setDispo("Absent sur la base du planning");
      }
    } else {
      setDispo("");
    }
  };

  if (props.profileUser === "Collaborateur") {
    return (
      <div>
        <Layout>
          <div className="kikelaInfo">
            <div className="div1">
              <form>
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrer votre nom"
                      name="nom"
                      onChange={(event) => {
                        setNom(event.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Entrer votre Prenom"
                      name="prenom"
                      onChange={(event) => {
                        setPrenom(event.target.value);
                      }}
                    />
                  </div>
                  <div className="col">
                    <button
                      onClick={handleSubmit}
                      type="button"
                      className="btn btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="container p-5 my-5 border">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Nom: {nom}</li>
                <li className="list-group-item">Prénom: {prenom}</li>
                <li className="list-group-item">Dispo: {dispo}</li>
              </ul>
            </div>
          </div>
        </Layout>
      </div>
    );
  } else {
    return <PageNotFound/>
  }
}
