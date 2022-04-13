import { NextPage } from "next";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import { GetServerSideProps } from "next";
import LayoutManager from "../../components/LayoutManager";
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

  if (profile === "Manager") {
    const mongodb = await getDatabase();
    const userInfo = await mongodb
      .db()
      .collection("Users")
      .findOne({ email: decoded.email })
      .then((result) => result);

    return {
      props: {
        category: profile,
        user: JSON.stringify(userInfo),
      },
    };
  } else {
    return {
      props: {
        category: null,
      },
    };
  }
};

export default function Kikela(props: any) {
  if (props.category !== null) {
    const data = JSON.parse(props.user);
    return (
      <LayoutManager>
        <div>
          <div>
            <form className="form-inline" action="/action_page.php">
              <label>Matricule:</label>
              <input
                type="text"
                id="matricule"
                placeholder="Entrer votre matricule"
                name="matricule"
                value={data.matricule}
              />
              <label>Nom/Prenom:</label>
              <input
                type="text"
                id="name"
                placeholder="Entrer votre Nom/Prenom"
                name="name"
              />
              <label>Secteur:</label>

              <select name="pets" id="pet-select">
                <option value="">--Choisissez un secteur--</option>
                <option value="bois">Menuiserie</option>
                <option value="sol">Sol</option>
                <option value="paint">Peinture</option>
                <option value="elect">Éléctricité</option>
                <option value="sanitaire">Sanitaire</option>
              </select>
              <button type="submit">Submit</button>
            </form>
          </div>

          <div>
            <h3>Nom:</h3>
            <h3>Prénom:</h3>
            <h3>Magasin:</h3>
            <h3>Secteur:</h3>
            <h3>Horaire:</h3>
          </div>
        </div>
      </LayoutManager>
    );
  } else {
    return <PageNotFound />
  }
}
