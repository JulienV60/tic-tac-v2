import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, Draggable, Popup, Input, Textarea, Dropdown, setOptions, toast, localeFr } from '@mobiscroll/react';
import { getDatabase } from "../../src/database";

setOptions({
    locale: localeFr,
    theme: 'windows',
    themeVariant: 'light'
});

const tasks = [{
    title: '06:00-13:00',
    color: '#7a5886',
    start: '06:00',
    end: '13:00',
    length: '7 h'
}, {
    title: '07:00-14:00',
    color: '#7a5886',
    start: '07:00',
    end: '14:00',
    length: '7 h'
}, {
    title: '09:00-17:00',
    color: '#7a5886',
    start: '09:00',
    end: '17:00',
    length: '8 h'
}, {
   title: '13:00-20:00',
    color: '#7a5886',
    start: '13:00',
    end: '20:00',
    length: '7 h'
}, {
    title: 'CP',
    color: '#7a5886',
    start: '06:00',
    end: '20:00',
    length: '14 h'
}, {
     title: 'FP',
    color: '#7a5886',
    start: '06:00',
    end: '20:00',
    length: '14 h'
}, {
     title: 'AM',
    color: '#7a5886',
    start: '06:00',
    end: '20:00',
    length: '14 h'
}];

function Task(props) {
    const [draggable, setDraggable] = React.useState();

    const setDragElm = React.useCallback((elm) => {
        setDraggable(elm);
    }, []);

    return <div ref={setDragElm} style={{background: props.data.color}} className="external-event-task">
        <div>{props.data.title}</div>
        <div>{props.data.length}</div>
        <Draggable dragData={props.data} element={draggable} />
    </div>;
}
export const getServerSideProps = async (context) => {

    const mongodb = await getDatabase();
    const listCollaborateurs = await mongodb
      .db()
      .collection("Collaborateurs")
      .find({profile:"collaborateur"})
      .toArray();

    const listPrenom = listCollaborateurs.map((element) => {
      return element.prenom;
    });

  return {
      props: {
        prenoms: listPrenom
      },
    };


};
function App(props) {
    const [isOpen, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [technician, setTechnician] = React.useState('');
    const [anchor, setAnchor] = React.useState(null);

    const view = React.useMemo(() => {
        return {
            schedule: {
                type: 'week',
                allDay: false,
                startTime: '06:00',
                endTime: '20:00'
            }
        };
    }, []);

    const invalid = React.useMemo(() => {
        return [{
            recurring: {
                repeat: 'weekly',
                weekDays: 'SA,SU'
            }
        }];
    }, []);

    const fillDialog = React.useCallback((args) => {
        setTitle(args.event.title);
        setDetails(args.event.details);
        setTechnician(args.event.technician);
        setAnchor(args.target);
        setOpen(true);
    }, []);

    const onEventCreated = React.useCallback((args) => {
        fillDialog(args);
    }, [fillDialog]);

    const eventUpdateFail = React.useCallback(() => {
        toast({
            message: 'Can\'t create event on this date'
        });
    }, []);

    const onClose = React.useCallback(() => {
        setOpen(false);
        toast({
            message: 'New task added'
        });
    }, []);

    return (
        <div className="mbsc-grid mbsc-no-padding">
            <div className="mbsc-row">
                <div className="mbsc-col-sm-9 external-event-calendar">
                    <Eventcalendar
                        view={view}
                        invalid={invalid}
                        dragToMove={true}
                        externalDrop={true}
                        onEventCreated={onEventCreated}
                        onEventCreateFailed={eventUpdateFail}
                        onEventUpdateFailed={eventUpdateFail}
                    />
                </div>
                <div className="mbsc-col-sm-3">
                    <div className="mbsc-form-group-title">Available tasks</div>
                    {tasks.map((task, i) => <Task key={i} data={task} />)}
                </div>
                <Popup
                    display="anchored"
                    width={400}
                    contentPadding={false}
                    touchUi={false}
                    headerText="Assign task"
                    buttons={['ok']}
                    anchor={anchor}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <div className="mbsc-form-group">
                        <Input label="Task" defaultValue={title} readOnly></Input>
                        <Textarea label="Details" defaultValue={details} placeholder="Add description..."></Textarea>
                        <Dropdown label="Technician" defaultValue={technician}>
                            {props.prenoms.map((prenom) => {
                                return (<option key={`${prenom}`} value={`${prenom}`}>{prenom}</option>)
                            })}
                        </Dropdown>
                    </div>
                </Popup>
            </div>
        </div>
    );
}

export default App;
