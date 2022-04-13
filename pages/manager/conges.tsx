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

const conges: NextPage = (props:any) => {
  if (props.profileUser === "Manager") {
    return <LayoutManager></LayoutManager>;
  } else {
    return <PageNotFound/>
  }

};

export default conges;
