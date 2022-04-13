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
      props: {
        profileUser: null,
      },
    };
  }
};
export default function Home(props: any) {
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

  if (props.profileUser === "Collaborateur") {
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
  } else {
    return <PageNotFound />;
  }
}
