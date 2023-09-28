import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import './stylesC.css';
import './styles.scss';
import {
  getSessionData,
  getHolidayData,
  getStudentSessionData,
} from '../../utils/ApiService';
import KenCard from '../../global_components/KenCard';
import KenPopover from '../../components/KenPopover/index';
import Calendar from '../FullCalendar/Calendar';
import { Box, Tooltip } from '@material-ui/core';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { GiTeacher } from 'react-icons/gi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import KenLoader from '../../components/KenLoader';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import configContext from '../../utils/helpers/configHelper';
import KenSnackBar from '../../components/KenSnackbar';
import {
  generateLink,
  onStartClass,
  onJoinClass,
  getDatesFromRrule,
  transFormRrule, 
} from '../../utils/helpers/scheduleHelper';
const ViewSession = React.lazy(() => import('./ViewSession'))


export default function TimeTable(props) {
  props.setHeading("Calendar")
  // all state
  const [state, setState] = React.useState({
    weekendsVisible: true,
    currentEvents: [],
  });
  const[triger,setTriget]=useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = React.useState('');
  const [activityType, setActivityType] = React.useState('');
  const [modeOfDelivery, setModeOfDelivery] = React.useState('');
  const [sessionName, setSessionName] = React.useState('');
  const [sessionID, setSessionID] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [facultyName, setFacultyName] = React.useState('');
  const [facilityName, setFacilityName] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const open = Boolean(anchorEl);
  const id = open ? 'apps-popover' : undefined;
  const user = getUserDetails();
  const { config } = useContext(configContext);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const changeDateFormat = date => {
    const a = moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a');
    const rightTime = a.split(', ')[2];
    console.log('rightTime', rightTime);
    return rightTime;
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const toggleLoader = val => {
    setLoading(val);
  };
  const startClass = () => {
    onStartClass(anchorEl, toggleLoader, config, handleSnackbarOpen);
  };
  const joinClass = () => {
    onJoinClass(anchorEl, toggleLoader, config, handleSnackbarOpen);
  };
  const handleEventClick = event => {
    console.log(
      'event.event._def.extendedProps',
      event.event._def.extendedProps
    );
    setAnchorEl(event);
    setCourseName(event.event._def.extendedProps.courseName);
    setModeOfDelivery(event.event._def.extendedProps.modeOfDelivery);
    setActivityType(event.event._def.extendedProps.activityType);
    setSessionName(event.event._def.extendedProps.sessionName);
    setSessionID(event.event._def.extendedProps.sessionID);
    setFacultyName(event.event._def.extendedProps?.facultyName);
    setFacilityName(event.event._def.extendedProps.facilityName);
    setStartTime(event.event._def.extendedProps.startTimes);
    setEndTime(event.event._def.extendedProps.endTimes);
    setTriget(true)
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  // methods
// useEffect
useEffect(() => {
  setLoading(true);
  const getUsers = async () => {
    const userData = JSON.parse(localStorage.getItem('userDetails'));
    const contactId = userData.ContactId;
    let sessionData;
    if (userData.Type !== 'Student') {
      sessionData = await getSessionData(contactId ? contactId : '');
    } else {
      sessionData = await getStudentSessionData(contactId ? contactId : '');
    }
    let transformed = [];
    if (sessionData?.success === 'true') {
      transformed = sessionData?.data?.map(e => ({
        ...e,
        title:
          e.recordTypeName === 'Recess'
            ? e.recordTypeName
            : `${e.courseName === null ? '' : e.courseName} ${e.courseName === null ? '' : '-'
            } ${e.activityType}`,
        startTimes: moment(e.startDate).format('hh:mm A'),
        endTimes: moment(e.endDate).format('hh:mm A'),
        start: e.startDate,
        activityType: e.activityType,
        modeOfDelivery: e.modeOfDelivery,
        end: e.endDate,
        editable: true,
        sessionID: e.id,
        allDay: false,
        backgroundColor: e.recordTypeName === 'Recess' ? 'red' : '',
      }));
    }
    // const holidayData = await getHolidayData(contactId);
    let holidayEvents = [];
   
    setLoading(false);
    setEventData([...transformed, ...holidayEvents]);
  };
  getUsers().catch(err => {
    console.log(err);
    setLoading(false);
  });
}, [triger]);
  const BlueOnGreenTooltip = withStyles({
    tooltip: {
      color: 'black',
      border: '1px solid #fff',
      borderRadius: '4px',
      background: '#ffffff',
      boxShadow: '-2px 1px 8px 1px #737f8d',
    },
  })(Tooltip);
  const renderEventContent = (event = {}) => {
    const toopTiptext = (
      <Box>
        <div className="mainDiv">
          <div className="childDiv">
            {event.event._def.extendedProps.courseName} -{' '}
            {event.event._def.extendedProps.activityType}
          </div>
        </div>
        <div className="mainDiv">
          <GiTeacher color="#00218D" size={20} />
          <div className="childDiv">
            {event.event._def.extendedProps.modeOfDelivery || 'N/A'}
          </div>
        </div>
        <div className="mainDiv">
          <AiOutlineClockCircle
            color="#00218D"
            size={20}
          />
          <div className="childDiv">
            {event.event._def.extendedProps.startTimes} -{' '}
            {event.event._def.extendedProps.endTimes}
          </div>
        </div>
        <div className="mainDiv">
          <GiTeacher color="#00218D" size={20} />
          <div className="childDiv">
            {event.event._def.extendedProps.facultyName || 'N/A'}
          </div>
        </div>
        <div className="mainDiv">
          <FaChalkboardTeacher color="#00218D" size={20} />
          <div className="childDiv">
            {event.event._def.extendedProps?.facilityName || 'N/A'}
          </div>
        </div>
      </Box>
    );

    return (
      // <BlueOnGreenTooltip placement="bottom" title={toopTiptext}>
      // </BlueOnGreenTooltip>
      <div className="fc-event-title fc-sticky">
        {`${event.event?.title}`.trim()}
      </div>
    );
  };
  return (
    <>
      {loading && <KenLoader />}
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      <KenCard>
        <Calendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView={'dayGridMonth'}
          handleEventClick={handleEventClick}
          eventContent={renderEventContent}
          eventData={eventData}
          allDaySlot={false}
          dayHeaders={true}
        />
        <KenPopover
          disableScrollLock={true}
          id={id}
          open={open}
          anchorEl={anchorEl}
          handleClose={handlePopoverClose}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          <ViewSession
            courseName={courseName}
            activityType={activityType}
            modeOfDelivery={modeOfDelivery}
            sessionName={sessionName}
            sessionID={sessionID}
            startTime={startTime}
            fromTimeTable={true}
            endTime={endTime}
            facultyName={facultyName}
            facilityName={facilityName}
            user={user}
            startClass={startClass}
            joinClass={joinClass}
          />
        </KenPopover>
      </KenCard>
    </>
  );
}
