import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Box,
  Button,
  useMediaQuery,
  Fade,
  Modal,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import KenSelect from '../../components/KenSelect';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { HiCash } from 'react-icons/hi';
import { getEventsData, getEventsFiltersData } from '../../utils/ApiService';
import KenLoader from '../../components/KenLoader';
import moment from 'moment';
import { debounce } from 'lodash';
import Routes from '../../utils/routes.json';
import './Components/index.css';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenInputField from '../../components/KenInputField';

const userType = getUserDetails();

const TABLET_BREAKPOINT = 'tablet';
const style = {
  position: 'absolute',
  bottom: 0,
  right: '0%',
  width: 400,
  bgcolor: 'background.paper',
  border: 0,
  boxShadow: 24,
};
const style1 = {
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const useStyles = makeStyles(theme => ({
  containerWrapper: {
    height: '100%',
    width: 400,
    borderRadius: 8,
    padding: '15px 0px 0px 0px',
    boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    [theme.breakpoints.down('sm')]: {
      marginTop: '50px',
      width: '100%',
      'border-radius': '0',
      padding: '15px 0px 0px 0px',
      'box-shadow': 'none',
      overflow: 'auto',
    },
  },
  footer: {
    width: '100%',
    minHeight: '40px',
    position: 'absolute',
    textAlign: 'end',
    bottom: '0px',
    [theme.breakpoints.down('sm')]: {
      bottom: '13px',
      left: '0',
      'overscroll-behavior': 'none',
      position: 'fixed',
      right: '0',
      background: 'white',
      bottom: '20px',
    },
  },
  cancel: {
    textTransform: 'capitalize',
    fontSize: '16px',
    'font-weight': '500',
    'line-height': '100%',
    color: '#fff',
    marginRight: 16,
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '14px',
    },
  },
  add: {
    textTransform: 'capitalize',
    fontSize: '16px',
    background: '#092682',
    'font-weight': '500',
    'line-height': '100%',
    'margin-right': '35px',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#193389',
      color: 'white',
    },
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '14px',
    },
  },
  containerOverflow: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      height: 'calc(100vh - 120px)',
      overflow: 'scroll',
    },
  },
  inputField: {
    borderRadius: '3px',
    backgroundColor: 'white',
    border: '1px solid #E4E4E4',
    // height:'32px',
    paddingTop: '6px',
  },
  SubHeading1: {
    fontWeight: 600,
    fontSize: '11px',
    paddingTop: '16px',
    opacity: 0.5,
    color: '#000000',
    lineHeight: '100%',
    paddingBottom: '4px',
    textTransform: 'uppercase',
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '10px',
    },
  },
  modelHeading: {
    fontWeight: 600,
    textAlign: 'left',
    lineHeight: '200%',
    fontSize: '16px',
    color: '#000000',
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '15px',
    },
  },
  headingIcon: {
    float: 'right',
    color: '#23263B',
  },
  MoreFilter: {
    fontWeight: 500,
    textAlign: 'left',
    lineHeight: '200%',
    fontSize: '14px',
    color: '#092682',
  },
  Heading: {
    fontWeight: 600,
    color: '#000000',
    fontSize: '20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
      fontWeight: '600',
      lineHeight: '150%',
      color: '#000000',
      maarginBottom: '6px !important',
    },
  },
  container: {
    paddingTop: '16px',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '32px',
    },
  },
  RegisteButton: {
    backgroundColor: 'white',
    fontWeight: 500,
    fontSize: '14px',
    color: '#193389',
    textTransform: 'capitalize',
    padding: '5px 12px',
    [theme.breakpoints.down('sm')]: {
      padding: 'none',
      height: '30px',
      width: '37px',
    },
  },
  HostButton: {
    textTransform: 'capitalize',
    backgroundColor: '#193389',
    fontWeight: 500,
    fontSize: '14px',
    marginLeft: '15px',
    padding: '5px 12px',
    color: 'white',
    '&:hover': {
      backgroundColor: '#193389',
      color: 'white',
    },
    [theme.breakpoints.down('sm')]: {
      padding: 'none',
      height: '30px',
      width: '100px',
    },
  },

  alignButton: {
    float: 'right',
    marginTop: '-35px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '-29px',
    },
  },
}));

export default function EventsModified(props) {
  const history = useHistory();
  const classes = useStyles();
  const [showTask, setshowTask] = useState(false);
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [startDate, setStartDate] = React.useState(null);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [eventsList, setEventsList] = useState();
  const [initialEventsList, setInitialEventsList] = useState(null);

  const delaySearch = useCallback(
    debounce(val => {
      setSearchString(val);
    }, 1000),
    []
  );

  const searchEventsHandler = event => {
    let searchString = event.target.value;
    delaySearch(searchString);

  };

  const eventClass = (event, index) => {
    return (
      <div
        onClick={() => getEventDetails(event)}
        key={index}
        className={
          event.isRegistered ? classes.registeredEvent : classes.eventList
        }
      >
        <div>
          <span className={classes.eventDate}>
            <Typography variant="h5"> {event.day}</Typography>
            <Typography variant="subtitle1" className={classes.paddingLeft}>
              {' '}
              {event.month}
            </Typography>
          </span>
        </div>
        <Typography variant="subtitle1" className={classes.title}>
          {' '}
          {event.title}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {' '}
          {event.description}
        </Typography>
        {event.location != null && (
          <Typography variant="subtitle1" className={classes.description}>
            {t('Location')}:- {event.location}
          </Typography>
        )}
      </div>
    );
  };

  useEffect(() => {
    setEventsList(props.eventsList);
    setInitialEventsList(props.eventsList);
  }, [props.eventsList]);



  const toggleEventsHandler = event => {
    const registered = event.target.checked;
    setRegisteredEvents(registered);
    const filter = registered ? 1 : 0;
    props.getEventList(filter);
  };

  const getEventDetails = event => {
    history.push(`/${Routes.event}/` + event.id);
  };

  const handleCourseChange = value => {
    const currentSectionArray = [];
    setCurrentCourseItem(currentSectionArray);
  };

  const [locationArray, setLocationArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [typeArray, setTypeArray] = useState([]);
  const [state, setState] = useState({
    location: '',
    category: '',
    type: '',
  });
  const [date, setDate] = useState('');
  const [evntsCardDetails, setEvntsCardDetails] = React.useState(true);
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = React.useState(false);
  const { location, category, type } = state;
  const [noEvents, setNoEvents] = useState('Fetching Events..');

  const onCardClick = eventId => {
    setEventId(eventId);
    history.push(`/${Routes.eventDetails1}/` + eventId);
  };

  const handleChangedDate = e => {
    setDate(e.target.value);
  };
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  const handleClose = () => {
    setEvntsCardDetails(true);
  };

  useEffect(() => {
    getEventsFiltersData()
      .then(res => {
        console.log(res);
        let data = res?.data;
        const locations = [{ label: 'All', value: 'All' }];
        const category = [{ label: 'All', value: 'All' }];
        const type = [{ label: 'All', value: 'All' }];
        data?.locations.map(item =>
          locations.push({
            label: item,
            value: item,
          })
        );
        data?.categories.map(item =>
          category.push({
            label: item,
            value: item,
          })
        );
        data?.types.map(item =>
          type.push({
            label: item,
            value: item,
          })
        );
        console.log(locations);
        setLocationArray(locations);
        setCategoryArray(category);
        setTypeArray(type);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const handleChange = event => {
    const { name, value } = event.target;
    console.log('check value', value);
    setState({ ...state, [name]: value });
  };
  const handleClearFilter = event => {
    console.log('clear btn');
    const empty = {
      location: '',
      category: '',
      type: '',
    };

    setState(empty);
    setDate('');
  };
  useEffect(() => {
    const { location, category, type } = state;
    let formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';
    setLoading(true);
    setNoEvents('Fetching Events..');
    let event = `?location=${location == 'All' ? '' : location}&category=${category == 'All' ? '' : category
      }&type=${type == 'All' ? '' : type
      }&date=${formattedDate}&search=${searchString}`;
    getEventsData(event)
      .then(res => {
        setLoading(false);
        console.log(res);
        setEventsData(res.data);
        setNoEvents('No Events Found');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
        setNoEvents('No Events Found');
      });
  }, [searchString, state, date]);

  function handleClick() {
    history.push('/hostEvent');
  }
  function handleClicks() {
    history.push('/eventDetails1');
  }
  function modalopen() {
    setshowTask(true);
  }
  function modalclose() {
    setshowTask(false);
  }
  return (
    <>
      {loading && <KenLoader />}
      {showTask && (
        <Modal open={showTask} hideBackdrop={'sm'}>
          <Fade in={showTask}>
            <Box
              sx={isMobileScreen ? style1 : style}
              display="flex"
              flexDirection="column"
              className={classes.containerWrapper}
            >
              <Box padding={isMobileScreen ? '15px 15px 15px 15px' : '15px'}>
                <Typography className={classes.modelHeading}>
                  Filter By
                </Typography>
                <div style={{ float: 'right', marginTop: '-28px' }}>
                  <CloseIcon
                    className={classes.headingIcon}
                    onClick={() => {
                      modalclose();
                    }}
                  />
                </div>
                <Box style={{ paddingTop: '16px' }}>
                  <>
                    <Typography className={classes.SubHeading1}>
                      All Categories
                    </Typography>
                    <KenSelect
                      name="category"
                      onChange={handleChange}
                      options={categoryArray}
                      value={category}
                      className={classes.inputField}
                    />
                    <Typography className={classes.SubHeading1}>
                      Free & paid
                    </Typography>
                    <KenSelect
                      onChange={handleChange}
                      options={typeArray}
                      name="type"
                      value={type}
                      placeholder="Choose a Location"
                      className={classes.inputField}
                    />
                    <Typography className={classes.SubHeading1}>
                      Inside & Outside campus
                    </Typography>
                    <KenSelect
                      placeholder="Choose a Topic"
                      name="location"
                      id="Location"
                      value={location}
                      onChange={handleChange}
                      options={locationArray}
                      className={classes.inputField}
                    />
                    <Typography className={classes.SubHeading1}>
                      this quarter
                    </Typography>

                    <KenInputField
                      name={'date'}

                      type="date"
                      value={date}
                      onChange={e => handleChangedDate(e)}
                    />
                  </>

                </Box>
                <Box className={classes.footer}>

                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}


      <Box className={classes.headBox1}>
        <Typography className={classes.Heading}>
          All Events ({eventsData.length})
        </Typography>
        <div className={classes.alignButton}>
          {isMobileScreen ? (
            <>
              <Button variant="contained" color="primary" className={classes.cancel} onClick={handleClearFilter}>
                Reset
              </Button>
              <Button
                className={classes.RegisteButton}
                type="button"
                onClick={() => {
                  modalopen();
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1159/1159641.png"
                  width={isMobileScreen ? '14px' : '17px'}
                  height={isMobileScreen ? '14px' : '17px'}
                />
                {/* &nbsp;&nbsp;Filter */}
              </Button>
            </>
          ) : (
            <>
              {' '}
              <Button variant="contained" color="primary" className={classes.cancel} onClick={handleClearFilter}>
                Reset
              </Button>
              <Button
                className={classes.RegisteButton}
                type="button"
                onClick={() => {
                  modalopen();
                }}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1159/1159641.png"
                  width={'12px'}
                />
                &nbsp;&nbsp;Filter
              </Button>
            </>
          )}

        </div>
      </Box>
      {eventsData.length > 0 ? (
        <Box className={classes.container}>
          <Grid container spacing={2}>
            {eventsData.map(event => {
              return (
                <>
                  <Grid
                    className={classes.CardStyle}
                    item
                    md={6}
                    sm={6}
                    lg={4}
                    xs={12}
                    onClick={() => {
                      history.push(`/SpecificEvent?eventId=${event?.id}`);
                    }}
                  >
                    <div>
                      <Box className="container">
                        <Box>

                          <iframe
                            src={event?.attachmentUrl}
                            className="imageSize"
                            scrolling='no'
                          />
                        </Box>
                        <Box className="cardContainer">
                          <Typography className="Title">
                            {event.name}
                          </Typography>
                          <div className="containerContent">
                            <Grid container>
                              <Grid item xs={9}>
                                <Grid container spacing={2}>
                                  <Grid item xs={2}>
                                    <AccessTimeIcon className="IconStyle" />
                                  </Grid>
                                  <Grid item xs={8} className="alignItems">
                                    <Typography
                                      style={{ textOverflow: 'ellipsis' }}
                                      className="fontSize"
                                    >
                                      {moment(
                                        `${event.eventDate}T${event.eventTime}`
                                      )
                                        .utc()
                                        .format('hh:mm a')}
                                    </Typography>
                                  </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                  <Grid item xs={2}>
                                    <LocationOnOutlinedIcon className="IconStyle" />
                                  </Grid>
                                  <Grid item xs={8} className="alignItems">
                                    <Typography className="fontSize">
                                      {event.Location} , {event.COuntry}
                                    </Typography>
                                  </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                  <Grid item xs={2}>
                                    <HiCash className="IconStyle1" />
                                  </Grid>
                                  <Grid item xs={8} className="alignItems">
                                    <Typography className="fontSize">
                                      Free for all
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={3}>
                                <Box className="RightContainer">
                                  <Grid container className="RightArea">
                                    {event.eventDate ? (
                                      <Grid item xs={5.5}>
                                        <Typography className="Day">
                                          {moment(event.eventDate).format('DD')}
                                        </Typography>
                                      </Grid>
                                    ) : null}
                                    <Grid item xs={5} className="monthArea">
                                      <Typography className="month">
                                        {
                                          monthNames[
                                          new Date(event.eventDate).getMonth()
                                          ]
                                        }
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <Button
                                    className="button"
                                    type="button"
                                    onClick={e => onCardClick(event.id)}
                                  >
                                    Register
                                  </Button>
                                </Box>
                              </Grid>
                            </Grid>
                          </div>
                        </Box>
                      </Box>
                    </div>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </Box>
      ) : (
        <Box
          role="alert"
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="row"
          className={classes.annoucementTable}
        >
          <p className={classes.noRecord}>{noEvents}</p>{' '}
        </Box>
      )}
    </>
  );
}
