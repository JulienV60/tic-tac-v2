import type { NextPage } from "next";
import LoginIcon from "@mui/icons-material/Login";
import { Card, Button, Row, Col } from "react-bootstrap";
const Home: NextPage = () => {
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
          <h2>Welcome, to the new Tac-Tic.</h2>
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
};

export default Home;
