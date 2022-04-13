import type { NextPage } from "next";
import LoginIcon from "@mui/icons-material/Login";
const Home: NextPage = () => {
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
};

export default Home;
