import type { GetServerSideProps, NextPage } from "next";
import LoginIcon from "@mui/icons-material/Login";
import { Card, Button, Row, Col } from "react-bootstrap";
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

const Home: NextPage = (props:any) => {
  if (props.profileUser === "Manager") {
    return (
      <>
        {/* ======= HOMEPAGE NO CONNECTED START ======== */}

        <section className="home-no-connected">
          <div className="info-card">
            <div className="container-home-image">
              <Card.Img
                src="/undraw_Time_management_re_tk5w (2).png"
                alt="home image"
              />
            </div>
          </div>

          <div className="rigth-side">
            <h2>Bienvenue, sur le nouveau Tac-Tic.</h2>
            <form action="/api/auth/login" method="GET">
              <Button type="submit" className="home-btn">
                <LoginIcon />
              </Button>
            </form>
          </div>
        </section>

        {/* ======= HOMEPAGE NO CONNECTED END ======== */}
      </>
    );
  } else {
    return <PageNotFound/>
  }
};

export default Home;
