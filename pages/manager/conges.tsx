import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";
import { getDatabase } from "../../src/database";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const mongodb = await getDatabase();
  const searchCongés = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ profile: "Collaborateur" })
    .then((data) => data);

  console.log(searchCongés);
  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }
  if (profile === "Manager") {
    return {
      props: {
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
  return (
    <LayoutManager>
      <div className="ManagerConges">
        <div className="titreDemande">Demande de congés</div>
        <div className="Demande">data</div>
        <div className="titreHistorique">Historique Demande de congés</div>
        <div className="Historique">data</div>
      </div>
    </LayoutManager>
  );
};

export default conges;
