import Head from "next/head";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import {
  Button,
  Container,
  Dropdown,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
const Layout: React.FC<any> = ({ children }) => {
  const [user, setUser] = React.useState<any>([{}]);

  React.useEffect(() => {
    async function apiToken() {
      const info = await fetch(`/api/infoUser`).then((data) => data.json());
      setUser(info);
    }
    apiToken();
  }, []);

  return (
    <div>
      <Navbar bg="#2f9dac" expand={false}>
        <Container fluid>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            style={{
              backgroundColor: "white",
              marginLeft: "0.2rem",
              color: "2f9dac",
            }}
          />{" "}
          <Navbar.Brand
            href="/manager"
            style={{
              color: "white",
              width: "20rem",
              display: "flex",
              margin: "1rem",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              fontFamily: "Bebas Neue",
            }}
          >
            {user.profile}
            <span></span>
            {user.nom}
            <span></span>
            {user.prenom}
            <span></span>
            <HomeIcon />
            <Link href="/api/auth/logout" passHref={true}>
              <LogoutIcon />
            </Link>
          </Navbar.Brand>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            style={{
              backgroundColor: "#2f9dac",
              textAlign: "center",
              lineHeight: "4rem",
            }}
          >
            <Offcanvas.Header
              closeButton
              style={{
                backgroundColor: "white",
              }}
            >
              <Offcanvas.Title
                id="offcanvasNavbarLabel"
                style={{
                  color: "#2f9dac",
                  fontFamily: "Bebas Neue",
                  marginBottom: "1.6rem",
                  paddingTop: "0.5rem",
                  fontSize: "3.4rem",
                  lineHeight: "2rem",
                  paddingLeft: "8.7rem",
                  height: "1.5rem",
                }}
              >
                Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body
              style={{
                paddingTop: "5rem",
                color: "#2f9dac",
                fontFamily: "Bebas Neue",

                lineHeight: "6rem",
              }}
            >
              <Nav className="justify-content-start flex-grow-3 pe-3">
                <Dropdown style={{ lineHeight: "7rem" }}>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "3rem",
                      marginLeft: "0.5rem",
                    }}
                    href="/manager"
                  >
                    Accueil
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "3rem",
                      marginLeft: "0.5rem",
                    }}
                    href="/manager/planning"
                  >
                    Plannings
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      fontFamily: "Bebas Neue",
                      color: "#333",
                      fontSize: "3rem",
                      marginLeft: "0.5rem",
                    }}
                    href="/manager/creationPlanning"
                  >
                    Création Plannings
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "3rem",
                    }}
                    href="/manager/conges"
                  >
                    Congés
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "3rem",
                      marginLeft: "0.5rem",
                    }}
                    href="/manager/kikela"
                  >
                    Kikéla
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{
                      borderRadius: "10px",
                      color: "#333",
                      fontFamily: "Bebas Neue",
                      fontSize: "3rem",
                      marginLeft: "0.5rem",
                    }}
                    href="/api/auth/logout"
                  >
                    Déconnexion{" "}
                  </Dropdown.Item>
                </Dropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {children}
    </div>
  );
};
export default Layout;