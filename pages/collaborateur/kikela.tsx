import { NextPage } from "next";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context;
  console.log("======================ACCESSTOKKEN==================="+ accessTokken);

  let profile;

  if (context.req.cookies.idToken === undefined) {
    profile = null;
  }

  // const decoded: any = jwt_decode(accessTokken);
  // profile = await userProfil(decoded.email);
  console.log("===================PROFILE===================="+profile);

  // const mongodb = await getDatabase();
  // // const userInfo = await mongodb
  //   .db()
  //   .collection("users")
  //   .findOne({ email: decoded.email })
  //   .then((result) => result);

  return {
    props: {
      category: profile,
      user: JSON.stringify("userInfo"),
    },
  };
};

export default function Kikela(props: any) {
  const data = JSON.parse(props.user);
  return (
    <div className="kikelaInfo">
      <div className="div1">
        <form>
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Entrer votre matricule"
                name="matricule"
              />
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Entrer votre nom"
                name="name"
              />
            </div>
            <div className="col">
              <select
                className="form-select"
                aria-label="Selectionnez un secteur"
              >
                <option selected>Selectionnez un secteur</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="col">
              <button type="button" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="container p-5 my-5 border">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Matricule:</li>
          <li className="list-group-item">Nom:</li>
          <li className="list-group-item">Magasin:</li>
          <li className="list-group-item">Secteur:</li>
        </ul>
      </div>
    </div>
  );
}
