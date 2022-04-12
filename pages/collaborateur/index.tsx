import { GetServerSideProps, NextPage } from "next";

import Link from "next/link";
import { Layout } from "../../components/LayoutCollab";
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
import { getDatabase } from "../../src/database";
import LayoutManager from "../../components/LayoutManager";

setOptions({
  locale: localeFr,
  theme: "ios",
  themeVariant: "light",
});
export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const accesstoken = req.cookies.AccessToken;
  const mongodb = await getDatabase();
  const auth0searchUser = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/userinfo`,
    {
      method: "Post",
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    }
  )
    .then((data) => data.json())
    .then((result) => result.email);

  const searchDbUser = await mongodb
    .db()
    .collection("Users")
    .findOne({ email: auth0searchUser })
    .then((data: any) => data?._id);

  const byId = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ idUser: searchDbUser?.toString() })
    .then((data: any) => data?.horaires);
  const result = JSON.stringify(byId);
  return { props: { data: result } };
};
export default function Home({ data }: any) {
  const result = JSON.parse(data);
  const [view, setView] = React.useState("month");
  const [myEvents, setEvents] = React.useState<MbscCalendarEvent[]>([]);

  React.useEffect(() => {}, []);

  const [calView, setCalView] = React.useState<MbscEventcalendarView>({
    calendar: { labels: true },
  });

  const changeView = (event: any) => {
    let calView = {};

    switch (event.target.value) {
      case "year":
        calView = {
          calendar: { type: "year" },
        };
        break;
      case "month":
        calView = {
          calendar: { labels: true },
        };
        break;
      case "week":
        calView = {
          schedule: { type: "week" },
        };
        break;
      case "day":
        calView = {
          schedule: { type: "day" },
        };
        break;
      case "agenda":
        calView = {
          calendar: { type: "week" },
          agenda: { type: "week" },
        };
        break;
    }

    setView(event.target.value);
    setCalView(calView);
  };

  const customWithNavButtons = () => {
    return (
      <React.Fragment>
        <CalendarNav className="cal-header-nav" />
        <div className="cal-header-picker">
          <SegmentedGroup value={view} onChange={changeView}>
            <SegmentedItem value="year">Year</SegmentedItem>
            <SegmentedItem value="month">Month</SegmentedItem>
            <SegmentedItem value="week">Week</SegmentedItem>
            <SegmentedItem value="day">Day</SegmentedItem>
            <SegmentedItem value="agenda">Agenda</SegmentedItem>
          </SegmentedGroup>
        </div>
        <CalendarPrev className="cal-header-prev" />
        <CalendarToday className="cal-header-today" />
        <CalendarNext className="cal-header-next" />
      </React.Fragment>
    );
  };
  return (
    <Layout>
      <Eventcalendar
        renderHeader={customWithNavButtons}
        height={750}
        view={calView}
        data={myEvents}
        cssClass="md-switching-view-cont"
      />
    </Layout>
  );
}
