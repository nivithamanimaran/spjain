import {
  Grid,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import KenLoader from '../../components/KenLoader';
import KenSnackBar from '../../components/KenSnackbar';
import {
  deleteEvent,
  getEventById
} from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import './components/style.css';

const TABLET_BREAKPOINT = 'sm';

const useStyles = makeStyles(theme => ({
  resp:{
    [theme.breakpoints.up('md')]:{
      marginLeft:"0px"
    },
    [theme.breakpoints.down('md')]:{
      paddingLeft:"22%"
    }
  }
}));
const SpecificEvent = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { history } = props;
  const query = new URLSearchParams(props.location.search);
  const eventId = query.get('eventId');
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [registeredEvents, setRegisteredEvents] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [whatYouGet, setWhatYouGet] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [loader, setLoader] = React.useState();
  const [tabData, setTabData] = useState([]);
  const [applied, setApplied] = useState('false');
  const [eventDetails, setEventDetails] = useState(null);
  const [eventRegister, setEventRegister] = useState('false');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [trigger, setTrigger] = useState(true);
  const currentDate = moment();
  let userDetails = getUserDetails();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  console.log('evenet ID', eventId)

  useEffect(() => {
    setLoading(true);
    //const Id = `?eventId=${eventId}&contactId=${userDetails?.ContactId}`;
    getEventById(eventId)
      .then(res => {
        // console.log('1235',res[0])
        // let WYG = res?.data[0]?.whatYouGet?.split(';');
        setLoading(false);
        // setWhatYouGet(WYG);
        setEventsData(res);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
    //for table
    setLoading(true);

  }, [eventId, trigger]);

  const onEventsCall = eventId => { };


  // const onRegister = () => {
  //   setLoading(true);
  //   const eventPayloadData = [];
  //   const user = JSON.parse(localStorage.getItem('userDetails'));
  //   const ContactId = JSON.parse(localStorage.getItem('userDetails'))
  //     ?.ContactId;
  //   eventsData.map(ev => {
  //     eventPayloadData.push({
  //       eventRegistrationId: '',
  //       eventId: ev.id,
  //       contactId: ContactId,
  //       applied: true,
  //     });
  //   });
  //   // console.log("eventPayloadData",eventPayloadData)
  //   // postEventRegister(eventPayloadData)
  //   //   .then(res => {
  //   //     setSnackbarMessage('Thank you for Registering');
  //   //     setOpenSnackbar(true);
  //   //     setLoading(false);
  //   //     console.log(res);
  //   //     setTrigger(!trigger);
  //   //   })
  //   //   .catch(err => {
  //   //     setSnackbarMessage('Something_Wrong');
  //   //     setOpenSnackbar(true);
  //   //     setSnackbarSeverity('error');
  //   //     setLoading(false);
  //   //     console.log(err);
  //   //     alert('loosu');
  //   //   });
  // };

  const cancelEvent = data => {
    console.log('eventcancel', data);
    setLoading(true);
    deleteEvent(eventId, userDetails?.ContactId)
      .then(res => {
        setSnackbarMessage('Registration Cancelled');
        setOpenSnackbar(true);
        setLoading(false);
        console.log(res);
        setTrigger(!trigger);
      })
      .catch(err => {
        setSnackbarMessage('Something_Wrong');
        setOpenSnackbar(true);
        setSnackbarSeverity('error');
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div>
      {loading && <KenLoader />}
      <KenSnackBar
        severity={snackbarSeverity}
        message={snackbarMessage}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Top-Right"
      />
      {eventsData ? (
        eventsData?.map(event => {
          return (
            <div className="boxShadow">

              {/* <div> */}
              {/* <Grid
                container
                spacing={2}
                direction="row"
              // style={{ backgroundColor: '#090F69' }}
              > */}
                {/* <Grid item>
                  <>
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                    // style={{ padding: '10px 0px', alignItems: 'center' }}
                    > */}
                      {/* <Grid item md={12}>
                        <>
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Grid item>
                              <div className="DateFormat">
                                <div className="border1">
                                  {moment(event?.CreatedDate).format('DD')}
                                </div>
                                <div className="aug1">
                                  {moment(event?.CreatedDate).format('MMM')}
                                </div>
                                <div />
                              </div>
                            </Grid>
                            <Grid item>
                              <Typography className="annualTypo">
                                {event?.Name}
                              </Typography>
                            </Grid> */}
                            {/* {event.isRegistered && ( */}
                            {/* <Grid item>
                              {event?.isRegistered == false ? (
                                 
                                <Button
                                  className="RegisterButton"
                                  type="button"
                                >
                                  {event.eventPrice === 0 ? (
                                    <Typography
                                      className="ButtonText"
                                      onClick={() => onRegister()}
                                    >
                                      Register For Free
                                    </Typography>
                                  ) : (
                                    <Typography
                                      className="ButtonText"
                                      onClick={() => onRegister()}
                                      
                                    >
                                      Register for {event.eventPrice}
                                    </Typography>
                                  )}
                                </Button>
                              ) : (
                                <Button className="cancelButton" type="button">
                                  <Typography
                                    className="ButtonText"
                                    onClick={() => cancelEvent(eventId)}
                                  >
                                    Cancel Registration
                                  </Typography>
                                </Button>
                              )}
                            </Grid> */}
                            {/* <Grid item>
                              {event?.isRegistered === false ? (
                                moment(currentDate).isBefore(
                                  event.eventDate
                                ) ? (
                                  <Button
                                    className="RegisterButton"
                                    type="button"
                                    onClick={() => onRegister()}
                                  >
                                    {event.eventPrice === 0 ||event.eventPrice === null ? (
                                      <Typography className="ButtonText">
                                        Register For Free
                                      </Typography>
                                    ) : (
                                      <Typography className="ButtonText">
                                        Register for {event.eventPrice}
                                      </Typography>
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    // className="RegisterButton"
                                    variant="contained"
                                    type="button"
                                    disabled
                                  >
                                    <Typography className="ButtonText">
                                      Event Date is  Expired
                                    </Typography>
                                  </Button>
                                )
                              ) : (
                                <Button
                                  className="cancelButton"
                                  type="button"
                                  onClick={() => cancelEvent(eventId)}
                                >
                                  <Typography className="ButtonText">
                                    Cancel Registration
                                  </Typography>
                                </Button>
                              )}
                            </Grid> */}

                            {/* )} */}
                          {/* </Grid>
                        </>
                      </Grid> */}
                      {/* <Grid
                        item
                        alignContent="flex-start"
                        alignItems="flex-start"
                        style={{ textAlign: 'left' }}
                        md={12}
                      >
                        <Typography className="annualTypo">
                          {event?.Name}
                        </Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} md={2}>
                  
                </Grid> */}
                    {/* </Grid>
                  </>
                </Grid>
              </Grid> */}

              {/* </div> */}
              <Grid container spacing={6}
                alignItems="center" className={classes.resp}>
                <Grid item >
                  <div className="DateFormat">
                    <div className="border1">
                      {moment(event?.CreatedDate).format('DD')}
                    </div>
                    <div className="aug1">
                      {moment(event?.CreatedDate).format('MMM')}
                    </div>
                    <div />
                  </div>
                </Grid>
                <Grid item>
                  <Typography className="annualTypo">
                    {event?.Name}
                  </Typography>
                </Grid>
              </Grid>

              {isMobileScreen ? (
                <>
                  <div className="mid">
                    <Grid container spacing={2} >
                      <Grid item xs={6}>
                        <div className="midClild">
                          <Typography className="typo">Date & Time</Typography>
                          <Typography className="typo1">
                            {moment(event?.CreatedDate).format(
                              'MMMM DD YYYY, h:mm A'
                            )}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={6} style={{paddingRight:"10px"}}>
                        <div className="midClild">
                          <Typography className="typo">LOCATION</Typography>
                          <Typography className="typo1">
                            {event?.Location__c}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <div className="midClild">
                          <Typography className="typo">Duration</Typography>
                          <Typography className="typo1">
                            {event?.eventDuration}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="midClild">
                          <Typography className="typo">ATTENDEES</Typography>
                          <Typography className="typo1">
                            {event?.Attendes}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6} style={{ paddingTop: '16px' }}>
                        <Typography className="typo2">CATEGORIES</Typography>
                        <div className="flex">
                          <div className="border2Child">Festival</div>
                          <div className="border2">Cultural Events</div>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className="midClild">
                          <Typography className="typo">POSTED ON</Typography>
                          <Typography className="typo1">
                            {moment(event?.CreatedDate).format('DD/MM/YYYY')}
                          </Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </>
              ) : (
                <div className="mid">
                  <div className="midClild">
                    <Typography className="typo">Date & Time</Typography>
                    <Typography className="typo1">
                      {' '}
                      {moment(event?.CreatedDate).format('DD MMM YYYY')},{' '}
                      {moment(`${event?.CreatedDate}T${event?.End_Date_Time__c}`)
                        .utc()
                        .format('hh:mm a')}
                    </Typography>
                  </div>
                  <div className="midClild">
                    <Typography className="typo">LOCATION</Typography>
                    <Typography className="typo1">
                      {event?.Location__c}
                    </Typography>
                  </div>
                  <div className="midClild">
                    <Typography className="typo">Duration</Typography>
                    <Typography className="typo1">
                      {event?.eventDuration}
                    </Typography>
                  </div>
                  <div className="midClild">
                    <Typography className="typo">ATTENDEES</Typography>
                    <Typography className="typo1">{event?.Attendes}</Typography>
                  </div>
                  <div className="midClild">
                    <Typography className="typo">POSTED ON</Typography>
                    <Typography className="typo1">
                      {moment(event?.postedOn).format('DD/MM/YYYY')}
                    </Typography>
                  </div>
                  <div className="last">
                    <Typography className="typo2">CATEGORIES</Typography>
                    <div className="flex">
                      <div className="border2Child">Festival</div>
                      <div className="border2">Cultural Events</div>
                    </div>
                  </div>
                </div>
              )}

              {/* <div className='flex'> */}

              <Grid container spacing={isMobileScreen ? 0 : 2}>
                <Grid item xs={12} md={8}>
                  <div className="lastChild">
                    <Typography className="typoP">About the event</Typography>
                    <Typography className="typoContent">
                      {event?.Description__c}
                    </Typography>
                  </div>
                </Grid>
                {/* <Grid item xs={12} md={4}>
                  <div className="lastChild">
                    <Typography className="mapTypoP">What to expect</Typography>
                    {event?.Secondary_Description_What_to_Expect__c?.map(item => {
                      return (
                        <div className="map">
                          <DoneIcon className="icon" />
                          <Typography className="mapTypoC">{item}</Typography>
                        </div>
                      );
                    })}
                  </div>
                </Grid> */}
              </Grid>
            </div>
          );
        })
      ) : (
        <Typography>No Details found for this event</Typography>
      )}
    </div>
  );
};
export default SpecificEvent;
