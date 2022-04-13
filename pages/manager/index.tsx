import LayoutManager from "../../components/LayoutManager";
import { GetServerSideProps } from "next";
import { getDatabase } from "../../src/database";
import moment from "moment";
import {
  Eventcalendar,
  getJson,
  formatDate,
  MbscCalendarEvent,
  MbscEventcalendarView,
  MbscResource,
  localeFr,
} from "@mobiscroll/react";
import React from "react";
const milestones = [
  {
    date: "2022-04-10T00:00",
    name: "Project review",
    color: "#f5da7b",
  },
  {
    date: "2022-04-11T00:00",
    name: "Product shipping",
    color: "#acf3a3",
  },
  {
    date: "2022-04-13T00:00",
    name: "Cycle finish",
    color: "#ff84a0",
  },
];

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
    .then((data) => data?._id);

  const byId = await mongodb
    .db()
    .collection("Collaborateurs")
    .findOne({ idUser: searchDbUser?.toString() })
    .then((data) => data);
  const result = JSON.stringify(byId);
  return { props: { data: result } };
};
export default function IndexManager({ data }: any) {
  const result = JSON.parse(data);

  const [myEvents, setEvents] = React.useState<MbscCalendarEvent[]>([]);

  const view = React.useMemo<MbscEventcalendarView>(() => {
    return {
      schedule: {
        type: "day",
        allDay: false,
        startDay: 1,
        endDay: 1,
        startTime: "06:00",
        endTime: "20:00",
      },
    };
  }, []);

  const myResources = React.useMemo<MbscResource[]>(() => {
    return [
      {
        id: 1,
        name: "Ryan",
        color: "#f7c4b4",
        img: "https://img.mobiscroll.com/demos/m1.png",
      },
      {
        id: 2,
        name: "Kate",
        color: "#c6f1c9",
        img: "https://img.mobiscroll.com/demos/f1.png",
      },
      {
        id: 3,
        name: "John",
        color: "#e8d0ef",
        img: "https://img.mobiscroll.com/demos/m2.png",
      },
    ];
  }, []);

  React.useEffect(() => {
    getJson(
      "https://trial.mobiscroll.com/resource-events/",
      (events: MbscCalendarEvent[]) => {
        setEvents(events);
      },
      "jsonp"
    );
  }, []);

  const renderDay = (args: any) => {
    const date = args.date;
    const task: any =
      milestones.find((obj) => {
        return +new Date(obj.date) === +date;
      }) || {};

    return (
      <div className="header-template-container">
        <div className="header-template-date">
          <div className="header-template-day-name">
            {formatDate("DDDD", date)}
          </div>
          <div className="header-template-day">
            {formatDate("MMMM DD", date)}
          </div>
        </div>
        <div
          className="header-template-task"
          style={{ background: task.color }}
        >
          {task.name}
        </div>
      </div>
    );
  };

  const renderCustomResource = (resource: MbscResource) => {
    return (
      <div className="header-resource-template-content">
        <img
          className="header-resource-avatar"
          src={resource.img}
          alt="Avatar"
        />
        <div className="header-resource-name">{resource.name}</div>
      </div>
    );
  };

  return (
    <LayoutManager>
      <Eventcalendar
        theme="ios"
        themeVariant="light"
        clickToCreate={true}
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        locale={localeFr}
        view={view}
        data={myEvents}
        resources={myResources}
        groupBy="date"
        renderDay={renderDay}
        renderResource={renderCustomResource}
      />
    </LayoutManager>
  );
}
