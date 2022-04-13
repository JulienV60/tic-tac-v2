import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../../components/LayoutCollab";
import jwt_decode from "jwt-decode";
import {
  Eventcalendar,
  getJson,
  setOptions,
  CalendarNav,
  SegmentedGroup,
  SegmentedItem,
  CalendarPrev,
  CalendarToday,
  CalendarNext,
  MbscCalendarEvent,
  MbscEventcalendarView,
  localeFr,
} from "@mobiscroll/react";
import React from "react";
import { userProfil } from "../../src/userInfos";
import PageNotFound from "../../components/PageNotFound";

setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }
  if (profile === "Collaborateur") {
    return {
      props: {
        profileUser: profile,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};
export default function Home(props: any) {
  const [view, setView] = React.useState("month");
  const [myEvents, setEvents] = React.useState<MbscCalendarEvent[]>([]);

  return (
    <Layout>
      <div className="parent">
        <div className="div1">Anomalie</div>
        <div className="div2"></div>
        <div className="div3">Message </div>
        <div className="div4"></div>
        <div className="div5"> Horaires</div>
        <div className="div6"></div>
        <div className="div7">Compteurs </div>
        <div className="div8">Ecarts </div>
        <div className="div9"></div>
        <div className="div10"></div>
        <div className="div11">Demandes de congés </div>
        <div className="div12"></div>
      </div>
    </Layout>
  );
}
