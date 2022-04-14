import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil, userRayon } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";
import { getDatabase } from "../../src/database";

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
            conges: element.conges.map((e: any) => {
              return {
                start: e.start,
              };
            }),
          };
        })
      );
    console.log(searchconges);

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
