import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid, Paper, Radio, Card } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import KenGrid from '../../global_components/KenGrid';
import KenCard from '../../global_components/KenCard';
import moment from 'moment';
import TableData from './data.json';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import KenButton from '../../global_components/KenButton';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import KenLoader from '../../components/KenLoader';
import './style.scss';
import RatingTable from '../../components/RatingTable';
import {
  getStudentFeedbackDetails,
  getProgramFeedbackDetails,
  postProgramFeedbackDetails,
  getStudentSessionFeedbackDetails,
} from '../../utils/ApiService';
import KenSnackBar from '../../components/KenSnackbar';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.white,
    width: '100%',
  },
  base: {
    backgroundColor: 'white',
    display: 'flex',
  },
  breadCrumbWrapper: {
    margin: '15px 0',
    fontFamily: "'Open Sans'",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '22px',
    color: '#505F79',
    opacity: '0.6',
  },
  amtTable: {
    width: '100%',
    height: 10,
  },
  cartBody: {
    padding: '20px',
    position: 'relative',
    backgroundColor: '#edeff1',
  },
  amtTable: {
    width: '100%',
    height: 10,
  },
  tableData1: {
    width: '80%',
    textAlign: 'left',
  },
  studentInfo: {
    // color: "#00218D",
    fontSize: '14px',
    width: '25%',
    textAlign: 'left',
  },
  tableData: {
    width: '20%',
    textAlign: 'left',
  },
  wrapper: {
    fontFamily: "'Open Sans'",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '19px',
    color: '#00218D',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
    },
  },
  headText: {
    fontSize: '11px',
  },
  Tcontent: {
    fontSize: '13px',
    color: '#000000',
    fontWeight: 700,
    marginTop: '8px',
  },
  headerText: {
    fontSize: '11px',
  },
  names: {
    fontSize: '13px',
    fontWeight: 'bold',
  },
}));
const ActionCell = row => {
  const { id } = row.row.values;
  return (
    <Box>
      <Button
        size="small"
        variant="contained"
        color="primary"
        style={{ borderRadius: 15 }}
      >
        Submitted
      </Button>
    </Box>
  );
};
const ButtonForMobile = row => {
  return (
    <div>
      <KenButton
        className={classes.btnLabels}
        onClick={() => {
          handleSessionForm(row?.original);
        }}
        variant="primary"
        style={{
          height: '25px',
          marginRight: '10px',
          borderRadius: '25px',
          fontSize: '12px',
          width: '120px',
          background: `${
            row?.values?.Feedback !== 'Pending' ? '#27AE60' : '#F2994A'
          }`,
        }}
        label={row?.values?.Feedback}
      />
    </div>
  );
};
export default function studentFeedback() {
  const classes = useStyles();
  const profile = getUserDetails();
  const theme = useTheme();
  const today = new Date();
  const [value, setValue] = useState(0);
  const ContactId = JSON.parse(localStorage.getItem('userDetails'))?.ContactId;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [reload, setReload] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [description, setDescription] = useState('');
  const [recordTypeIDs, setRecordTypeID] = useState('');
  const [programItem, setProgramItem] = useState([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [breadValue, setBreadValue] = useState('EXAM SCHEDULE');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sessionData, setSessionData] = useState([]);
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [radioVal, setRadioVal] = useState([
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: 10 },
  ]);
  const handleSessionForm = values => {
    if (values.item?.feedbackSetupStatus === 'Active') {
      history.push({
        pathname: `/sessionFeedBackForm`,
        state: { data: values },
      });
    } else {
      handleSnackbarOpen('info', 'This feedback session has expired.');
    }
  };
  const columns = [
    {
      Header: 'Faculty',
      accessor: 'Faculty',
      disableGlobalFilter: true,
    },
    {
      Header: 'Subject',
      accessor: 'Subject',
      disableGlobalFilter: true,
    },
    {
      Header: 'Subject Code',
      accessor: 'SubjectCode',
      disableGlobalFilter: true,
    },
    {
      Header: 'Feedback',
      accessor: 'Feedback',
      //   Cell:ActionCell,
      Cell: ({ row }) => {
        return (
          <div>
            <KenButton
              className={classes.btnLabels}
              onClick={() => {
                handleForm(row?.values?.Feedback, row?.original);
              }}
              variant="primary"
              style={{
                height: '25px',
                marginRight: '10px',
                borderRadius: '25px',
                fontSize: '12px',
                width: '120px',
                background: `${
                  row?.values?.Feedback !== 'Pending' ? '#27AE60' : '#F2994A'
                }`,
              }}
              label={row?.values?.Feedback}
            />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const columnsForFeedBack = [
    {
      Header: 'Faculty',
      accessor: 'Faculty',
      disableGlobalFilter: true,
    },
    {
      Header: 'Subject',
      accessor: 'Subject',
      disableGlobalFilter: true,
    },
    {
      Header: 'Subject Code',
      accessor: 'SubjectCode',
      disableGlobalFilter: true,
    },
    {
      Header: 'Session name',
      accessor: 'Sessionname',
      disableGlobalFilter: true,
    },
    {
      Header: 'Date',
      accessor: 'Date',
      disableGlobalFilter: true,
    },
    {
      Header: 'Start Time',
      accessor: 'time',
      disableGlobalFilter: true,
    },
    {
      Header: 'End Time',
      accessor: 'endTime',
      disableGlobalFilter: true,
    },
    {
      Header: 'Feedback',
      accessor: 'Feedback',
      //   Cell:ActionCell,
      Cell: ({ row }) => {
        console.log('rowrowrow', row);
        return (
          <div>
            <KenButton
              className={classes.btnLabels}
              onClick={() => {
                handleSessionForm(row?.original);
              }}
              variant="primary"
              style={{
                height: '25px',
                marginRight: '10px',
                borderRadius: '25px',
                fontSize: '12px',
                width: '120px',
                background: `${
                  row?.values?.Feedback !== 'Pending' ? '#27AE60' : '#F2994A'
                }`,
              }}
              label={row?.values?.Feedback}
            />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const arrayBreadCrumb = [
    {
      head: 'My Feedback',
    },
  ];
  const handleForm = (params, data) => {
    if (params === 'Pending') {
      if (data.item.feedbackSetupStatus === 'Active') {
        history.push({
          pathname: `/studentFeedBackForm`,
          state: { data: data },
        });
      } else {
        handleSnackbarOpen('info', 'This feedback session has expired.');
      }
    } else {
      return null;
    }
  };
  const handleFormmobile = params => {
    console.log(params);
    // if (params === 'Pending') {
    //   history.push({
    //     pathname: `/studentFeedBackForm`,
    //     state: { data: data },
    //   });
    // } else {
    //   return null;
    // }
  };
  const radioChange = (e, i, item) => {};
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = index => {
    setValue(index);
  };
  const handleChangeDiscription = event => {
    setDescription(event.target.value);
  };
  const handleProgramChange = (event, dataS, index) => {
    const newData = programData;
    newData.forEach(item => {
      if (item.FeedbackTitle === dataS.FeedbackTitle) {
        item.rating = event.target.value;
      }
    });
    setProgramData([...newData]);
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
  const isTabletView = useMediaQuery(theme.breakpoints.down('sm'));
  const onProgramSubmit = () => {
    setLoading(true);
    const payload = [];
    programData.map(item => {
      payload.push({
        parameter: item.FeedbackTitle,
        rating: item.rating,
        programId: programItem.programId,
        studentId: profile.ContactId,
        recordType: item.recordType,
      });
    });
    payload.push({
      parameter: 'Feedback',
      descFeedback: description,
      programId: programItem.programId,
      studentId: profile.ContactId,
      recordType: recordTypeIDs,
    });
    console.log('payload', payload);
    postProgramFeedbackDetails({ requestData: payload })
      .then(res => {
        setLoading(false);
        handleSnackbarOpen('success', 'Feedback Submitted.');
        setValue(0);
        setReload(true);
        console.log(res);
      })
      .catch(err => {
        setLoading(false);
        handleSnackbarOpen('error', 'Something went wrong.');
        console.log(err);
      });
  };
  useEffect(() => {
    setLoading(true);
    getProgramFeedbackDetails(ContactId)
      .then(res => {
        const params = res[0].feedbackParameter.split(';');
        let data = [];
        params.map(item => {
          data.push({
            FeedbackTitle: item,
            rating: item.rating,
            recordType: res[0].recordType,
          });
        });
        setProgramItem(res[0]);
        setRecordTypeID(res[0].recordType)
        if (res[0].feedbackStatus !== 'Submitted') {
          setFeedbackSubmitted(false);
        } else {
          setFeedbackSubmitted(true);
        }

        setProgramData(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [reload]);
  useEffect(() => {
    setLoading(true);
    getStudentFeedbackDetails(ContactId)
      .then(res => {
        console.log('res', res);
        let data = [];
        res.map(item => {
          data.push({
            Faculty: item.facultyName,
            Subject: item.subjectName,
            SubjectCode: item.subjectCode,
            Feedback: item.feedbackStatus,
            Date: item.startDate,
            Sessionname: item.facultyName,
            time: moment(item.sessionStartDate).format('hh:mm'),
            endTime: moment(item.sessionStartEnd).format('hh:mm'),
            item: item,
          });
        });
        setdata(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
    getStudentSessionFeedbackDetails(ContactId)
      .then(res => {
        let dataSession = [];
        Object.entries(res.data).map(([key, value]) => {
          const subjectName = value.courseOfferingName.substring(
            value.courseOfferingName.lastIndexOf('-') + 1,
            value.courseOfferingName.length
          );
          const subjectCode = Array.from(
            new Set(value.courseOfferingName.split('-'))
          ).toString();

          if (value.status === 'Pending') {
            dataSession.push({
              Faculty: value.facultyName,
              Subject: subjectName,
              SubjectCode: subjectCode.replace(',', '-'),
              Feedback: value.status,
              Date: moment(value.sessionStartDate).format('YYYY-MM-DD'),
              Sessionname: value.sessionName,
              time: moment(value.sessionStartDate).format('hh:mm'),
              item: value,
            });
          }
        });
        setSessionData(dataSession);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      <Box>
        {loading && <KenLoader />}
        <KenSnackBar
          message={snackbarMessage}
          severity={snackbarSeverity}
          autoHideDuration={5000}
          open={openSnackbar}
          handleSnackbarClose={handleSnackbarClose}
          position="Bottom-Right"
        />
        <div className="cardlsitbox">
          <KenCard
            elevation={0}
            paperStyles={{
              padding: 16,
              paddingLeft: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Box>
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // padding: '0 25px',
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab
                    label="Faculty Feedback"
                    {...a11yProps(0)}
                    classes={{ wrapper: classes.wrapper }}
                  />
                  <Tab
                    label="Program Feedback"
                    {...a11yProps(1)}
                    classes={{ wrapper: classes.wrapper }}
                  />
                  <Tab
                    label="Session Feedback"
                    {...a11yProps(2)}
                    classes={{ wrapper: classes.wrapper }}
                  />
                  {/* <Tab
                  label="Institute Feedback"
                  {...a11yProps(2)}
                  classes={{ wrapper: classes.wrapper }}
                /> */}
                </Tabs>
              </Box>
            </Box>
          </KenCard>
        </div>
        <div className={classes.root}>
          <Paper elevation={3}>
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                {isMobileScreen ? (
                  <>
                    {data.map((item, i, row) => {
                      return (
                        <Card style={{ marginTop: '15px', padding: '10px' }}>
                          <Grid container spacing={2}>
                            {columns.map(headText => {
                              return (
                                <>
                                  {headText?.accessor === 'Feedback' ? (
                                    <Grid
                                      item
                                      xs={12}
                                      style={{ marginTop: '10px' }}
                                    >
                                      <>
                                        <KenButton
                                          className={classes.btnLabels}
                                          onClick={() => {
                                            handleForm(
                                              data[i].Feedback,
                                              data[i]
                                            );
                                          }}
                                          variant="primary"
                                          style={{
                                            height: '20px',
                                            marginRight: '10px',
                                            borderRadius: '25px',
                                            fontSize: '12px',
                                            width: '100%',
                                            background: `${
                                              data[i].Feedback !== 'Pending'
                                                ? '#27AE60'
                                                : '#F2994A'
                                            }`,
                                          }}
                                          label={data[i].Feedback}
                                        />
                                      </>
                                    </Grid>
                                  ) : (
                                    <Grid
                                      item
                                      xs={6}
                                      style={{ marginTop: '10px' }}
                                    >
                                      <>
                                        {headText?.Header !== 'Feedback' && (
                                          <Typography
                                            className={classes.headText}
                                          >
                                            {String(
                                              headText?.Header
                                            ).toUpperCase()}{' '}
                                          </Typography>
                                        )}
                                        {
                                          <Typography
                                            className={classes.Tcontent}
                                          >
                                            {item?.[headText?.accessor]}
                                          </Typography>
                                        }
                                      </>
                                    </Grid>
                                  )}
                                </>
                              );
                            })}
                          </Grid>
                        </Card>
                      );
                    })}
                  </>
                ) : (
                  <div className="KenDiv">
                    <KenGrid
                      columns={columns}
                      data={data}
                      pagination={{ disabled: true }}
                      tableTotal={{ disabled: true, checkbox: true }}
                      getRowProps={{ selected: true }}
                      toolbarDisabled={true}
                    />
                  </div>
                )}
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                {programData?.length > 0 ? (
                  !feedbackSubmitted ? (
                    <RatingTable
                      parameters={programData}
                      handleChange={handleProgramChange}
                      onSubmit={onProgramSubmit}
                      description={description}
                      handleChangeDiscription={handleChangeDiscription}
                    />
                  ) : (
                    <div style={{ height: 'calc(100vh - 50vh)' }}>
                      <Typography
                        style={{
                          textAlign: 'center',
                          top: '50%',
                          position: 'relative',
                        }}
                      >
                        Your Feedback is already submitted.
                      </Typography>
                    </div>
                  )
                ) : (
                  <div style={{ height: 'calc(100vh - 50vh)' }}>
                    <Typography
                      style={{
                        textAlign: 'center',
                        top: '50%',
                        position: 'relative',
                      }}
                    >
                      No Program Feedbacks
                    </Typography>
                  </div>
                )}
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <div className="KenDiv">
                  {isTabletView ? (
                    <div>
                      {sessionData.map((item, i) => {
                        return (
                          <Card
                            style={{
                              minWidth: 275,
                              marginTop: '15px',
                              padding: '10px',
                              backgroundColor: 'white',
                            }}
                          >
                            <Grid container style={{ marginTop: '10px' }}>
                              {columnsForFeedBack.map(headText => {
                                return (
                                  <>
                                    {headText?.accessor === 'Feedback' ? (
                                      <Grid
                                        item
                                        xs={12}
                                        style={{ marginTop: '10px' }}
                                      >
                                        <>
                                          <KenButton
                                            className={classes.btnLabels}
                                            // onClick={() => {
                                            //   handleForm(sessionData[i].Feedback, data[i]);
                                            // }}
                                            onClick={() => {
                                              handleSessionForm(sessionData[i]);
                                            }}
                                            variant="primary"
                                            style={{
                                              height: '20px',
                                              marginRight: '10px',
                                              borderRadius: '25px',
                                              fontSize: '12px',
                                              width: '100%',
                                              background: `${
                                                sessionData[i].Feedback !==
                                                'Pending'
                                                  ? '#27AE60'
                                                  : '#F2994A'
                                              }`,
                                            }}
                                            label={sessionData[i].Feedback}
                                          />
                                        </>
                                      </Grid>
                                    ) : (
                                      <Grid
                                        item
                                        xs={6}
                                        style={{ marginTop: '10px' }}
                                      >
                                        <>
                                          {headText?.Header !== 'Feedback' && (
                                            <Typography
                                              className={classes.headText}
                                            >
                                              {String(
                                                headText?.Header
                                              ).toUpperCase()}{' '}
                                            </Typography>
                                          )}
                                          {
                                            <Typography
                                              className={classes.Tcontent}
                                            >
                                              {item?.[headText?.accessor]}
                                            </Typography>
                                          }
                                        </>
                                      </Grid>
                                    )}
                                    {/* <Grid item xs={6} style={{ marginTop: '10px' }}>
                                  {
                                    <>
                                      {headText?.Header !== 'MARK ATTENDANCE' && <Typography className={classes.headerText} >
                                        {String(headText?.Header).toUpperCase()}
                                        {<Typography className={classes.names}>{item?.[headText?.accessor] ? item?.[headText?.accessor] : "-"}</Typography>}
                                      </Typography>}
                                    </>

                                  }
                                </Grid> */}
                                  </>
                                );
                              })}
                            </Grid>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <KenGrid
                      columns={columnsForFeedBack}
                      data={sessionData}
                      pagination={{ disabled: true }}
                      tableTotal={{ disabled: true, checkbox: true }}
                      getRowProps={{ selected: true }}
                      toolbarDisabled={true}
                    />
                  )}
                </div>
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                <RatingTable parameters={['', '', '', '', '']} />
              </TabPanel>
            </SwipeableViews>
          </Paper>
        </div>
      </Box>
    </>
  )
}