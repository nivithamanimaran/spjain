import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Button,
  Typography,
  makeStyles,
  IconButton,
  useTheme,
  Tooltip,
  Divider,
} from '@material-ui/core';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { GiTeacher } from 'react-icons/gi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { withStyles } from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import 'tui-calendar/dist/tui-calendar.css';
// import './Schedule.css';
import { Link } from 'react-router-dom';
import KenSnackbar from '../../../../components/KenSnackbar';
import {
  generateLink,
  onStartClass,
  onJoinClass,
  getDatesFromRrule,
  transFormRrule,
} from '../../../../utils/helpers/scheduleHelper';
import configContext from '../../../../utils/helpers/configHelper';
import { useTranslation } from 'react-i18next';
import { KEY_DATE_FORMAT } from '../../../../utils/constants';
import FullCalendar from '@fullcalendar/react';
import TimeTable from '../../../Timetable/Timetable';
import Calendar from '../../../FullCalendar/Calendar';
import {
  getSessionData,
  getHolidayData,
  getStudentSessionData,
} from '../../../../utils/ApiService';
import timeGridPlugin from '@fullcalendar/timegrid';
import ViewSession from '../../../Timetable/ViewSession';
import KenPopover from '../../../../components/KenPopover';
import '../../../FullCalendar/calendar.css';
import './Schedule.css';

const useStyles = makeStyles(theme => ({
  scheduler: {
    overflowY: 'auto',
    zIndex: 5000,
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 6px #F1F1F1`,
      webkitBoxShadow: `inset 0 0 6px #F1F1F1`,
      backgroundColor: `inset 0 0 6px #F1F1F1`,
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `#7F7F7F`,
      opacity: '0.7',
      borderRadius: 4,
      outline: `1px solid #7F7F7F`,
    },
    [theme.breakpoints.down('md')]: {
      '&>div':{
        height:"30em"
      }
    },
  },
  iconButtons: {
    padding: 0,
  },
  headerItem: {
    flexGrow: 1,
    padding: '-16px !important',
  },
  textCenter: {
    textAlign: 'center',
  },
  popDetailsIcon: {
    width: 40,
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    margintop: 10,
  },
  popDetailsItem: {
    padding: '5px 0',
    alignItems: 'center',
  },
  popup: {
    position: 'absolute',
    zIndex: 2000,
    background: 'white',
    borderRadius: 5,
    maxWidth: 350,
    maxHeight: 350,
    right: 0,
    boxShadow:
      '0px 8px 5px rgba(23, 43, 77, 0.04), 0px 15px 12px rgba(23, 43, 77, 0.08)',
    [theme.breakpoints.only('xs')]: {
      left: '0 !important',
      maxWidth: 'none',
      margin: 'auto',
      heigh: '50vh',
    },
  },
  cardHeader: {
    [theme.breakpoints.only('sm')]: {
      fontSize: '13px !important',
    },
  },

  scheduleDay: {
    padding: '6px !important',
    [theme.breakpoints.only('sm')]: {
      padding: '3px 2px !important',
    },
  },
  scheduleLabel: {
    textAlign: 'end',
    margin: '-10px 0px 0px 0px',
  },

  schedule: {
    color: 'yellow',
  },
  someClass: {},
  lessonLink: {
    color: theme.palette.KenColors.primary,
    fontSize: '16px',
  },
  title: { fontSize: 16, fontWeight: 600, margin: '-5px 0px 0px 0px ' },
}));
const useItemStyles = makeStyles(theme => ({
  root: {
    '& > .MuiTreeItem-content': {
      height: '35px',
    },
    '& > .MuiTreeItem-content > .MuiTreeItem-label': {
      display: 'flex',
      alignItems: 'center',
      padding: '4px 0',
      background: 'transparent !important',
      pointerEvents: 'none',
      fontSize: '12px',
      lineHeight: '12px',
      padding: '0 15px 15px',
    },
    '& > .MuiTreeItem-content  > .MuiTreeItem-label::before': {
      content: "''",
      display: 'inline-block',
      minWidth: 15,
      minHeight: 15,
      marginRight: 8,
      border: '1px solid #ccc',
      background: 'white',
    },
  },
  iconContainer: {
    marginRight: 3,
    marginLeft: 0,
    '& > svg': {
      '&:hover': {
        opacity: 0.6,
      },
    },
  },
  label: {
    padding: 0,
  },
  selected: {
    '& > .MuiTreeItem-content  > .MuiTreeItem-label::before': {
      background: theme.palette.primary.main,
      // content: '\f095',
      border: '1px solid #ccc',
      // fontFamily: 'Font Awesome 5 Free',
    },
  },
  tooltipTable: {
    minWidth: ' 250px',
    maxWidth: '100%',
    padding: '30px',
    borderCollapse: ' collapse',
    background: '#ffffff',
    padding: '10px',
  },
  tooltipTable_Tr: {
    height: '25px',
    color: '#7A869A',
    fontSize: '12px',
    background: '#fff',
  },
  tooltipTable_td: {
    height: '25px',
    paddingLeft: '10px',
    color: 'rgba(0, 0, 0, 0.87)',
    // background: '#f4f6fc',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    // borderLeft: '1px solid #303030',
    fontSize: '12px',
  },
  tooltipTable_th: {
    height: '25px',
    paddingLeft: '10px',
    color: 'rgb(9, 38, 130)',
    background: '#ffffff',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  resourceItem: {
    '&:hover': {
      color: theme.palette.KenColors.primary,
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  },
}));
export default function Schedule(props) {
  const classesItem = useItemStyles();
  const { toggleLoader, activityUrls } = props;
  const calRef = useRef();
  const popupRef = useRef();
  const classes = useStyles();
  const theme = useTheme();
  const { config } = useContext(configContext);
  const { t } = useTranslation();

  const schedulesRaw = props.data;
  //console.log('schedule: ', props.data);
  const [currentDate, setCurrentDate] = useState(
    moment().format(KEY_DATE_FORMAT)
  );
  const [schedules, setschedules] = useState();
  const [todayDate, setTodayDate] = useState();
  const [popupStyles, setpopupStyles] = useState({});
  const [currentSchedule, setCurrentSchedule] = useState();
  const [title, setTitle] = useState('TODAY');
  // let schedules = [];
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [bbbLink, setbbbLinks] = useState();
  const [activityUrl, setActivityUrl] = useState();
  const [eventData, setEventData] = useState([]);
  const [courseName, setCourseName] = React.useState('');
  const [modeOfDelivery, setModeOfDelivery] = React.useState('');
  const [activityType, setActivityType] = React.useState('');
  const [sessionName, setSessionName] = React.useState('');
  const [sessionID, setSessionID] = React.useState('');
  const [facultyName, setFacultyName] = React.useState('');
  const [facilityName, setFacilityName] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'apps-popover' : undefined;
  const handleSnackbarOpen = (severity, message) => () => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  const getActivityUrl = courseConnectionId => {
    let activity;
    if (Array.isArray(activityUrls) && activityUrls.length > 0) {
      activity = activityUrls.find(act => act.id === courseConnectionId);
      return activity.url || null;
    } else {
      return null;
    }
  };

  const handleEventClick = event => {
    console.log(
      'event.event._def.extendedProps',
      event.event._def.extendedProps
    );
    setAnchorEl(event);
    setCourseName(event.event._def.extendedProps.courseName);
    setModeOfDelivery(event.event._def.extendedProps.modeOfDelivery);
    setSessionName(event.event._def.extendedProps.sessionName);
    setSessionID(event.event._def.extendedProps.sessionID);
    setFacultyName(event.event._def.extendedProps?.facultyName);
    setFacilityName(event.event._def.extendedProps.facilityName);
    setStartTime(event.event._def.extendedProps.startTimes);
    setEndTime(event.event._def.extendedProps.endTimes);
    setActivityType(event.event._def.extendedProps.activityType);
  };
  const BlueOnGreenTooltip = withStyles({
    tooltip: {
      color: 'black',
      // backgroundColor: "green",
      // padding: 0,
      border: '1px solid #fff',
      borderRadius: '4px',
      background: '#ffffff',
      boxShadow: '-2px 1px 8px 1px #737f8d',
    },
  })(Tooltip);

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    return previous;
  }
  const handleDateToday = arg => {
    const dates = moment(arg.start.toString()).format('YYYY-MM-DD');
    let Caltoday = new Date(dates);
    let today = new Date();
    if (Caltoday.getDate() == today.getDate()) {
      setTodayDate('Today');
    } else if (Caltoday.getDate() + 1 == today.getDate()) {
      setTodayDate('YesterDay');
    } else if (Caltoday.getDate() - 1 == today.getDate()) {
      setTodayDate('Tomorrow');
    } else {
      setTodayDate(moment(arg.start.toString()).format('YYYY-MM-DD'));
    }
  };
  const renderEventContent = (event = {}) => {
    const toopTiptext = (
      <Box>
        <div className="mainDiv" aria-describedby={id}>
          <div className="childDiv">
            {event.event._def.extendedProps.courseName} -{' '}
            {event.event._def.extendedProps.activityType}
          </div>
        </div>
        <div className="mainDiv">
          <AiOutlineClockCircle
            color="#00218D"
            size={20}
            // style={{ paddingRight: '10px' }}
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

    const eventTime = moment(event?.event?._def?.extendedProps?.endDate);
    const currentTime = moment();

    return (
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent={'space-between'}
            alignItems="center"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Grid item xs={2}>
              <Avatar style={{ width: '22px', height: '22px' }} />
            </Grid>
            <Grid item xs={10}>
              <Typography
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  paddingLeft: 8,
                  color: eventTime.diff(currentTime) >= 0 ? '' : 'grey',
                }}
              >
                {`${event.event?.title}`.trim()}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };
  const formatSchedule = (sch, start, end) => {
    return {
      calendarId: '1',
      category: 'time',
      isVisible: true,
      title: sch.hed__Course__cName,
      start: start || sch.hed__Start_Date__c + 'T' + sch.hed__Start_Time__c,
      end: end || sch.hed__End_Date__c + 'T' + sch.hed__End_Time__c,
      body: sch.meeting_link,
      raw: {
        ...sch,
      },
    };
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  // check for recurrence rule
  useEffect(() => {
    setCurrentDate(moment().format(KEY_DATE_FORMAT));
  }, []);
  useEffect(() => {
    if (schedulesRaw && schedulesRaw.length) {
      let finalSchedules = [];
      // console.log(schedulesRaw)
      schedulesRaw.forEach(el => {
        if (el.RRULE) {
          const rRule = getDatesFromRrule(
            transFormRrule(el.RRULE),
            new Date(currentDate)
          );
          console.log(rRule, transFormRrule(el.RRULE));
          if (rRule.length > 0) {
            const start =
              moment(rRule[0]).format(KEY_DATE_FORMAT) +
              'T' +
              el.hed__Start_Time__c.substring(0, 8);
            const end =
              moment(rRule[0]).format(KEY_DATE_FORMAT) +
              'T' +
              el.hed__End_Time__c.substring(0, 8);
            finalSchedules.push(formatSchedule(el, start, end));
          }
        } else {
          finalSchedules.push(formatSchedule(el));
        }
      });

      setschedules(finalSchedules);
      // schedules = finalSchedules;
      console.log(finalSchedules);
    }
  }, [currentDate, schedulesRaw]);
  let calendarRef = useRef();
  const nextMethod = () => {
    let calendarApi = calendarRef.current.getApi();
    console.log(calendarRef.current.getApi().title);
    calendarApi.next();
  };

  const preMethod = () => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  };

  const todayMethod = () => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  useEffect(() => {
    toggleLoader(true);
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
            e.recordTypeName === 'Recess' ? e.recordTypeName : e.courseName,
          startTimes: moment(e.startDate).format('hh:mm A'),
          endTimes: moment(e.endDate).format('hh:mm A'),
          start: e.startDate,
          end: e.endDate,
          editable: true,
          sessionID: e.id,
          allDay: false,
          backgroundColor:
            moment(e?.endDate).diff(moment()) >= 0 ? '#F4F6FC' : '#E0E0E0',
        }));
      }
      let holidayEvents = [];
      const holidayData = await getHolidayData(contactId);
      if (holidayData?.success === 'true' && holidayData.length > 0) {
        holidayEvents = holidayData?.map(e => ({
          ...e,
          title: `${e?.holidayName} - ${e?.holidayType}`,
          start: e?.startDate,
          end: e?.endDate,
          editable: false,
          allDay: true,
          display: 'background',
          backgroundColor: 'rgb(127, 183, 126, 1)',
        }));
      }
      toggleLoader(false);
      setEventData([...transformed, ...holidayEvents]);
    };
    getUsers().catch(err => {
      console.log(err);
      toggleLoader(false);
    });
  }, []);

  // TODO: replace with redux
  const user = getUserDetails();
  const onClickSchedule = e => {
    setActivityUrl(prev => {
      let courseId = e?.schedule?.raw?.Id;
      if (courseId) {
        return getActivityUrl(courseId);
      } else {
        return null;
      }
    });
    setbbbLinks(generateLink(e.schedule.raw, config));
    setCurrentSchedule(e.schedule);
    window.innerHeight <
    e.event.clientY + document.getElementById('popup').offsetHeight
      ? setpopupStyles({
          ...popupStyles,
          left: e.event.pageX,
          top: e.event.pageY - document.getElementById('popup').offsetHeight,
        })
      : setpopupStyles({
          ...popupStyles,
          left: e.event.pageX,
          top: e.event.pageY,
        });
  };

  const getCalendar = () => {
    return calRef && calRef.current ? calRef.current.getInstance() : null;
  };

  const updateCalendarDate = () => {
    const cDate = getCalendar()
      .getDate()
      .toDate();
    setschedules([]);
    setCurrentDate(moment(cDate).format(KEY_DATE_FORMAT));
    if (
      moment(cDate).format(KEY_DATE_FORMAT) ===
      moment()
        .subtract(1, 'days')
        .format(KEY_DATE_FORMAT)
    )
      setTitle('YESTERDAY');
    else if (
      moment(cDate).format(KEY_DATE_FORMAT) ===
      moment()
        .add(1, 'days')
        .format(KEY_DATE_FORMAT)
    )
      setTitle('TOMORROW');
    else if (
      moment(cDate).format(KEY_DATE_FORMAT) ===
      moment()
        .add(0, 'days')
        .format(KEY_DATE_FORMAT)
    )
      setTitle('TODAY');
    else {
      setCurrentDate(moment(cDate).format(KEY_DATE_FORMAT));
      setTitle('');
    }
  };

  const startClass = () => {
    toggleLoader(true);
    onStartClass(anchorEl, toggleLoader, config, handleSnackbarOpen);
  };

  const joinClass = () => {
    toggleLoader(true);
    onJoinClass(anchorEl, toggleLoader, config, handleSnackbarOpen);
  };

  useOutsideAlerter(popupRef, currentSchedule, setCurrentSchedule);
  return (
    <>
      <Grid container spacing={2} alignItems="left" direction="column">
        <Grid
          item
          alignItems="left"
          className={classes.headerItem}
          sm={5}
          md={12}
        >
          <Typography
            style={{ marginBottom: '-6px', width: '100%' }}
            className={classes.title}
          >
            Today's Schedule
          </Typography>
        </Grid>
        <Grid item>
          <Divider style={{ marginBottom: '9px' }} />
        </Grid>
        <Grid item sm={7} md={7} className={classes.scheduleLabel} />
      </Grid>
      <div className={classes.scheduler}>
        <Calendar
          customButtons={{
            myCustomButton: {
              text: 'My Schedular',
            },
          }}
          buttonText={{
            today: 'title',
            day: 'My Schedule',
            month: 'My Schedule',
          }}
          reference={calendarRef}
          titleFormat={'string'}
          plugins={[timeGridPlugin]}
          headerToolbar={false}
          initialView={'timeGridDay'}
          handleEventClick={handleEventClick}
          eventData={eventData}
          eventContent={renderEventContent}
          allDaySlot={false}
          dayHeaders={false}
          datesSet={handleDateToday}
        />
      </div>

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
          modeOfDelivery={modeOfDelivery}
          activityType={activityType}
          sessionName={sessionName}
          sessionID={sessionID}
          startTime={startTime}
          fromTimeTable={false}
          endTime={endTime}
          facultyName={facultyName}
          facilityName={facilityName}
          user={user}
          startClass={startClass}
          joinClass={joinClass}
        />
      </KenPopover>
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
    </>
  );
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref, schedule, setCurrentSchedule) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && schedule) {
        console.log('outside: ', schedule);
        setCurrentSchedule(null);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, schedule]);
}
