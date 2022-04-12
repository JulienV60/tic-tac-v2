import { NextPage } from "next";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import { getDatabase } from "../../src/database";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.idTokken;
  let profile;
  if (context.req.cookies.idTokken === undefined) {
    profile = null;
  } else {
    const decoded: any = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  const decoded: any = jwt_decode(accessTokken);
  profile = await userProfil(decoded.email);
  const mongodb = await getDatabase();
  const userInfo = await mongodb
    .db()
    .collection("users")
    .findOne({ email: decoded.email })
    .then((result) => result);

  return {
    props: {
      category: profile,
      user: JSON.stringify(userInfo),
    },
  };
};

export default function Kikela(props: any) {
  const data = JSON.parse(props.user);
  return (
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
  );
}
