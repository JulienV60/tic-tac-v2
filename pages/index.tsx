import type { GetServerSideProps, NextPage } from "next";
import LoginIcon from "@mui/icons-material/Login";
import jwt_decode from "jwt-decode";
import { userProfil } from "../src/userInfos";
import PageNotFound from "../components/PageNotFound";

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

const Home: NextPage = (props: any) => {
  if (props.profileUser) {
    return (
      <div>
        <div className="BodyHomePage">
          <div className="imgIndex">
            <img src="/undraw_Time_management_re_tk5w (2).png"></img>
          </div>
          <div className="AsideRight">
            <h1>Welcome, to the new Tac-Tic.</h1>
            <form action="/api/auth/login" method="GET">
              <button type="submit" className="btn btn-dark ">
                <LoginIcon />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } else {
    return <PageNotFound/>
  }
};

export default Home;
