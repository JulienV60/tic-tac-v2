import { Layout } from "../../components/LayoutCollab";
import { GetServerSideProps } from "next";
import { getDatabase } from "../../src/database";
const milestones: any[] = [];
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
import jwt_decode from "jwt-decode";
import { userProfil } from "../../src/userInfos";

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const accessTokken = req.cookies.IdToken;
  let profile;
  let decoded: any;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  if (profile === "Collaborateur") {
    const mongodb = await getDatabase();
    //list of collaborateurs
    const listCollaborateurs = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ profile: "Collaborateur" })
      .toArray();

    //return prenom id and img of collaborateurs
    const listPrenom = listCollaborateurs.map((element) => {
      return { prenom: element.prenom, _id: element._id, img: element.img };
    });

    //list of horaires of this semaine for all collaborateurs
    const data = await Promise.all(
      listPrenom.map(async (element) => {
        return await fetch(
          `${
            process.env.AUTH0_LOCAL
          }/api/manager/planning/db/loadPlanningDb?semaine=${parseInt(
            moment().locale("fr").format("w")
          )}&id=${element._id}`
        ).then((result) => result.json());
      })
    );

    return {
      props: {
        prenoms: JSON.stringify(listPrenom),
        dataPlanningInit: JSON.stringify(data),
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default function IndexManager(props: any) {
  const [dataPlanning, setDataPlanning] = React.useState(
    JSON.parse(props.dataPlanningInit)
  );
  const prenoms = JSON.parse(props.prenoms);
  const [myEvents, setEvents] = React.useState<MbscCalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(moment().format("L"))
  );

  function onSelectedDateChange() {
    setSelectedDate(new Date(moment().format("L")));
  }

  function setDate() {
    setSelectedDate(new Date(moment().format("L")));
  }

  const view = React.useMemo<MbscEventcalendarView>(() => {
    return {
        schedule: {
        type: "day",
        allDay: false,
        size:15,
        startTime: "06:00",
        endTime: "21:00",
      },
    };
  }, []);

  const myResources = React.useMemo(() => {
    return prenoms.map((element: any, index: number) => {
      return {
        id: element._id,
        name: element.prenom,
        color: "#f7c4b4",
        img: element.img,
      };
    });
  }, []);

  React.useEffect(() => {
    const dataPlanningDbFilter: any = [];
    fetch("/api/manager/planning/deleteJson");
    const dataPlanningDb = dataPlanning.forEach(
      (element: any, index: number) => {
        element.planningData.forEach((ele: any) => {
          if (
            ele.horaires !== "" &&
            moment().format("DD/MM/YYYY").toString() === ele.date
          ) {
            dataPlanningDbFilter.push({ id: element.id, event: ele });
          } else {
            null;
          }
        });
      }
    );

    const eventsPlanning = dataPlanningDbFilter.map(
      (element: any, index: number) => {
        const colorRandom =
          "#" + ((Math.random() * 0xffffff) << 0).toString(16);
        const splitHoraires = element.event.horaires.split("/");

        fetch("/api/manager/planning/addSlot", {
          method: "POST",
          body: JSON.stringify({
            id: index,
            collaborateur: element.id,
            start: splitHoraires[0],
            end: splitHoraires[1],
          }),
        });

        return {
          id: index,
          color: colorRandom,
          start: formatDate(
            "YYYY-MM-DDTHH:mm:ss.000Z",
            new Date(splitHoraires[0])
          ),
          end: formatDate(
            "YYYY-MM-DDTHH:mm:ss.000Z",
            new Date(splitHoraires[1])
          ),
          busy: true,
          description: "Weekly meeting with team",
          location: "Office",
          resource: `${element.id}`,
        };
      }
    );

    setEvents(eventsPlanning);
  }, []);

  const renderDay = (args:any) => {
    const date = args.date;

    const dayNr = date.getDay();
    const task =
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
          className="header-resource-avatar pictures_creationPlanning"
          src={resource.img}
        />
        <div className="header-resource-name">{resource.name}</div>
      </div>
    );
  };

  return (
    <Layout>
      <Eventcalendar
        theme="ios"
        themeVariant="light"
        locale={localeFr}
        view={view}
        data={myEvents}
        resources={myResources}
        groupBy="date"
        renderDay={renderDay}
        selectedDate={selectedDate}
        onSelectedDateChange={onSelectedDateChange}
        renderResource={renderCustomResource}
      />
    </Layout>
  );
}
