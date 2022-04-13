import { GetServerSideProps, NextPage } from "next";
import LayoutManager from "../../components/LayoutManager";
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";
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
    return {
      props: {
        category: profile,

      },
    };
  } else {
        return {
      notFound: true,
    }
  }
};

const conges: NextPage = (props:any) => {

    return <LayoutManager></LayoutManager>;


};

export default conges;
