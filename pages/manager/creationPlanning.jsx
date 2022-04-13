import React, { useEffect, useState } from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Eventcalendar, formatDate, localeFr } from "@mobiscroll/react";
import { getDatabase } from "../../src/database";
import LayoutManager from "../../components/LayoutManager";
const milestones = [];
import moment from "moment";
import jwt_decode from "jwt-decode";
import DoneIcon from "@mui/icons-material/Done";
import PageNotFound from "../../components/PageNotFound";

export const getServerSideProps = async (context) => {

  const accessTokken = context.req.cookies.IdToken;
  let profile;
  let decoded;
  if (accessTokken === undefined) {
    profile = null;
  } else {
    decoded = jwt_decode(accessTokken);
    profile = await userProfil(decoded.email);
  }

  if (profile === "Manager") {
    const mongodb = await getDatabase();
    const listCollaborateurs = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({ profile: "Collaborateur" })
      .toArray();

    const listPrenom = listCollaborateurs.map((element) => {
      return { prenom: element.prenom, _id: element._id, img: element.img };
    });

    const data = await Promise.all(
      listPrenom.map(async (element) => {
        return await fetch(
          `${process.env.AUTH0_LOCAL
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
    }
  }
};

function App(props) {
  const [myEvents, setEvents] = React.useState([]);
  const [dataPlanning, setDataPlanning] = React.useState(
    JSON.parse(props.dataPlanningInit)
  );
  const [semaineShow, setsemaineShow] = React.useState(0);
   const router = useRouter();
  const prenoms = JSON.parse(props.prenoms);

  const view = React.useMemo(() => {
    return {
      schedule: {
        type: "week",
        allDay: false,
        startDay: 1,
        endDay: 7,
        startTime: "06:00",
        endTime: "21:00",
      },
    };
  }, []);

  const myResources = React.useMemo(() => {
    return prenoms.map((element, index) => {
      return {
        id: element._id,
        name: element.prenom,
        color: "#f7c4b4",
        img: element.img,
      };
    });
  }, []);

  //à la creation d'un evenement
  const onEventCreated = React.useCallback((args) => {
    fetch("/api/manager/planning/addSlot", {
      method: "POST",
      body: JSON.stringify({
        id: args.event.id,
        collaborateur: args.event.resource,
        start: args.event.start.toString(),
        end: args.event.end.toString(),
      }),
    });
  }, []);

  //à la modification d'un evenement
  const eventUpdate = React.useCallback((args) => {
    fetch("/api/manager/planning/updateSlot", {
      method: "POST",
      body: JSON.stringify({
        id: args.event.id,
        collaborateur: args.event.resource,
        start: args.event.start.toString(),
        end: args.event.end.toString(),
      }),
    });
  }, []);

  //à la suppression d'un evenement
  const eventClose = React.useCallback((args) => {
    fetch("/api/manager/planning/deleteSlot", {
      method: "POST",
      body: JSON.stringify({
        id: args.event.id,
        collaborateur: args.event.resource,
        start: args.event.start.toString(),
        end: args.event.end.toString(),
      }),
    });
  }, []);

  //delete file JSON when refresh page
  useEffect(() => {
    fetch("/api/manager/planning/deleteJson");
  }, []);

  //update db whith JSON data
  function updateDb() {
    fetch("/api/manager/planning/db/updateDb");
    router.reload();
  }

  //function recuperation de la data mongo par semaine
  async function getDataPlanningDb(semaine) {
    const data = await Promise.all(
      prenoms.map(async (element) => {
        return await fetch(
          `/api/manager/planning/db/loadPlanningDb?semaine=${semaine}&id=${element._id}`
        ).then((result) => result.json());
      })
    );
    setDataPlanning(data);
  }

  //lorsque la semaine change
  useEffect(() => {
    getDataPlanningDb(parseInt(moment().locale("fr").format("w")) - 1);
    const dataPlanningDbFilter = [];
    const dataPlanningDb = dataPlanning.forEach((element, index) => {
      element.planningData.forEach((ele) => {
        if (ele.horaires !== "") {
          dataPlanningDbFilter.push({ id: element.id, event: ele });
        } else {
          null;
        }
      });
    });

    const eventsPlanning = dataPlanningDbFilter.map((element, index) => {
      const colorRandom = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      const splitHoraires = element.event.horaires.split("/");

      if (semaineShow !== 0) {
        fetch("/api/manager/planning/addSlot", {
          method: "POST",
          body: JSON.stringify({
            id: index,
            collaborateur: element.id,
            start: splitHoraires[0],
            end: splitHoraires[1],
          }),
        });
      }
      return {
        id: index,
        color: colorRandom,
        start: formatDate(
          "YYYY-MM-DDTHH:mm:ss.000Z",
          new Date(splitHoraires[0])
        ),
        end: formatDate("YYYY-MM-DDTHH:mm:ss.000Z", new Date(splitHoraires[1])),
        busy: true,
        description: "Weekly meeting with team",
        location: "Office",
        resource: `${element.id}`,
      };
    });

    setEvents(eventsPlanning);
  }, [semaineShow]);


    const renderDay = (args) => {
      const date = args.date;

      const dayNr = date.getDay();
      const task =
        milestones.find((obj) => {
          return +new Date(obj.date) === +date;
        }) || {};
      const numeroSemaine = parseInt(
        moment(args.date).locale("fr").format("w") - 1
      );
      setsemaineShow(numeroSemaine);

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

    const renderCustomResource = (resource) => {
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
      <LayoutManager>
        <div>
          <button className="bouton_validation_planning" onClick={updateDb}>
            <DoneIcon />
          </button>
        </div>
        <Eventcalendar
          className="planning"
          theme="ios"
          themeVariant="light"
          clickToCreate={true}
          dragToCreate={true}
          dragToMove={true}
          dragToResize={true}
          locale={localeFr}
          onEventCreated={onEventCreated}
          onEventUpdate={eventUpdate}
          onEventDelete={eventClose}
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

export default App;
