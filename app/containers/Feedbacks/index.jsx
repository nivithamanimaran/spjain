import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Course from './components/Course';
import Faculty from './components/Faculty';
import { useTheme } from '@material-ui/core';
import Technology from './components/Technology';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import KenCardWithoutpadding from '../../components/KenCard/KenCard2';
import KenCard from '../../global_components/KenCard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Grid, Card } from '@material-ui/core';
import './style.css';
import KenGrid from '../../global_components/KenGrid';
import KenLoader from '../../components/KenLoader';
import FeedbackForm from './components/FeedbackForm';
import KenSnackbar from '../../components/KenSnackbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  getFeedBackScheduleData,
  getFeedBackScheduleDividedData,
  getFeedbackNew,
  getTermDetails,
  getFeedBackData,
} from '../../utils/ApiService';
import moment from 'moment';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0} style={{ borderRadius: '8px' }}>
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
  back: {
    color: '#193389',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Work Sans',
    position: 'absolute',
    right: theme.spacing(2),
    top: '5px',
  },
  Pending: {
    padding: '5px 10px',
    background: '#FFEFB645',
    border: '1px solid #FFEFB61A',
    borderRadius: '4px',
    fontSize: '12px',
    textAlign: 'center',
    width: '82px',
    fontWeight: 500,
  },
  Submitted: {
    padding: '5px 10px',
    background: '#D0EED2',
    border: '1px solid #D0EED2',
    borderRadius: '4px',
    fontSize: '12px',
    textAlign: 'center',
    width: '86px',
    fontWeight: 500,
  },
  Rejected: {
    padding: '5px 10px',
    borderRadius: '4px',
    background: '#DD4B3961',
    border: '1px solid #DD4B39',
    textAlign: 'center',
    fontSize: '12px',
    width: '86px',
    fontWeight: 500,
  },
  dueDate: {
    fontSize: '12px',
    [theme.breakpoints.down('md')]:{
      fontSize:"14px"
    }
  },
  feedbackResp:{
    padding:"10px",
    [theme.breakpoints.down('md')]:{
      maxHeight:"560px",
      overflowY:"auto"
    }
  }
}));

export default function SimpleTabs(props) {
  props.setHeading('Feedback');
  const classes = useStyles();
  const kenTheme = useTheme();
  const [value, setValue] = React.useState(0);
  const [Detail, setDetail] = React.useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [tabView, setTabView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [fetchingData, setFetchingData] = useState('Fetching...');
  const [selectedRow, setSelectedRow] = useState({});
  const [secondScreen, setSecondScreen] = useState(false);
  const [feedbackFormData, setFeedbackFormData] = useState([]);
  const [termDetails, setTermDetails] = useState({});
  const contactId = JSON.parse(localStorage.getItem('userDetails')).ContactId;
  const [reloadAPI, setReloadAPI] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  // responsiveness
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const columns = [
    {
      Header: 'Feedback Type',
      accessor: 'feedbackType',
      disableGlobalFilter: true,
    },
    {
      Header: 'Term',
      accessor: 'termName',
      disableGlobalFilter: true,
    },
    {
      Header: 'Due Date',
      accessor: 'dueDate',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography className={classes.dueDate}>
            {moment(value).format('DD-MM-YYYY')}
          </Typography>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value, row }) => {
        return (
          <Typography
            className={
              value === 'Pending'
                ? classes.Pending
                : value === 'Completed'
                ? classes.Submitted
                : value === 'Rejected'
                ? classes.Rejected
                : '-'
            }
          >
            {value}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'Action',
      disableGlobalFilter: true,
      Cell: ({ row }) => {
        return <VisibilityIcon onClick={() => viewFeedback(row?.original)} />;
      },
    },
  ];
  const [data, setData] = useState([]);
  const [tabData, setTabData] = useState({});
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const viewFeedback = row => {
    const scheduleid = row?.feedBackSchedulerId;
    const contactid = contactId;
    const secondScreen = row.feedbackType === 'Interim Feedback' ? true : false;
    setSecondScreen(secondScreen);
    setSelectedRow(row);
    if (secondScreen) {
      if (scheduleid && contactid) {
        setLoading(true);
        getFeedBackScheduleDividedData(scheduleid, contactid)
          .then(res => {
            setTabView('tabs');
            setLoading(false);
            setTabData(res);
          })
          .catch(err => {
            setLoading(false);
            console.log(err, 'res');
          });
      }
    } else {
      setLoading(true);
      getFeedBackData(scheduleid, contactid)
        .then(res => {
          if (res.length > 0) {
            const array = [];
            array.push(
              {
                key: 'Program',
                value: row?.academicProgramName,
              },
              {
                key: 'Term',
                value: row?.termName,
              }
            );
            setCardData(array);
            setTabView('form');
            setLoading(false);
            let resp = res.map(item => {
              item.feeedbackOption.map(item2 => {
                item2.changed = false;
              });
              return item;
            });
            setFeedbackFormData(resp);
          } else {
            handleSnackbarOpen('info', 'No feedbacks available');
          }
        })
        .catch(err => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    getTermDetails(contactId)
      .then(resp => {
        console.log(resp);
        let termData = resp.data;
        let currentTerm = null;
        if (termData.length > 0) {
          for (let i = 0; i < termData.length; i++) {
            if (termData[i]?.status === 'Current') {
              currentTerm = termData[i];
              break;
            }
          }
          setFetchingData('No Data');
          if (currentTerm !== null) {
            let termid = currentTerm?.termId;
            let contactid = contactId;
            setTermDetails(currentTerm);
            getFeedbackNew(contactid)
              .then(res => {
                const resp = res.data;
                if (resp.length > 0) {
                  let arr = [];
                  resp.map(val => {
                    arr.push({
                      CourseName:
                        val?.Course_Offering__r?.hed__Course__r?.Name || '-',
                      courseOfferingSectionId:
                        val?.Course_Offering__r?.hed__Section_ID__c || '-',
                      CourseCode:
                        val?.Course_Offering__r?.hed__Course__r
                          ?.hed__Course_ID__c || '-',
                      termName: val?.Feedback_Scheduler__r?.Term__r.Name || '-',
                      termId: val?.Feedback_Scheduler__r?.Term__c || '-',
                      status: val?.Feedback_Status__c || '-',
                      academicProgramName:
                        val?.Course_Offering__r?.hed__Course__r?.hed__Course_ID__c.split(
                          ' '
                        )[0] || '-',
                      dueDate: val?.End_Date__c,
                      feedbackType:
                        val?.Feedback_Scheduler__r?.Feedback_Master__r
                          ?.Feedback_Type__c,
                      feedBackSchedulerId: val?.Feedback_Scheduler__c,
                      val,
                    });
                  });
                  setData(arr);
                } else {
                  setFetchingData('No Data');
                }
                setLoading(false);
              })
              .catch(err => {
                setLoading(false);
                console.log('tre', err);
              });
          } else {
            setLoading(false);
            setData([]);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [reloadAPI]);

  return (
    <div className={classes.root}>
      {loading ? <KenLoader /> : null}
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      {tabView === 'tabs' ? (
        <>
          <Grid container>
            {!showForm ? (
              <KenCardWithoutpadding>
                <AppBar
                  position="static"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    borderRadius: '8px',
                    boxshadow: '0px 0px 0px 0px',
                  }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    sx={{ boxshadow: '0px 0px 0px 0px' }}
                  >
                    <Tab
                      label="Course"
                      {...a11yProps(0)}
                      style={{ textTransform: 'capitalize' }}
                    />
                    <Tab
                      label="Faculty"
                      {...a11yProps(1)}
                      style={{ textTransform: 'capitalize' }}
                    />
                    <Tab
                      label="Technology"
                      {...a11yProps(2)}
                      style={{ textTransform: 'capitalize' }}
                    />
                    <Grid item md={6}>
                      <Button
                        onClick={() => {
                          setTabView('table');
                        }}
                        className={classes.back}
                        style={{
                          background: 'white',
                          color: '#193389',
                          fontWeight: 'bold',
                          border: '1px solid #193389',
                        }}
                      >
                        Back
                      </Button>
                    </Grid>
                  </Tabs>
                </AppBar>
              </KenCardWithoutpadding>
            ) : null}
          </Grid>
          <div style={{ marginTop: '30px' }}>
            <TabPanel value={value} index={0}>
              <Course
                tabData={tabData}
                setShowForm={setShowForm}
                setTabView={setTabView}
                termDetails={termDetails}
                selected={selectedRow}
                secondScreen={secondScreen}
                tabView={tabView}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Faculty
                tabData={tabData}
                setShowForm={setShowForm}
                setTabView={setTabView}
                termDetails={termDetails}
                selected={selectedRow}
                secondScreen={secondScreen}
                tabView={tabView}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Technology
                tabData={tabData}
                setShowForm={setShowForm}
                setTabView={setTabView}
                termDetails={termDetails}
                selected={selectedRow}
                secondScreen={secondScreen}
                tabView={tabView}
              />
            </TabPanel>
          </div>
        </>
      ) : tabView === 'table' ? (
        <Card style={{ background: '#fff' }}>
          <Grid xs={12} spacing={2} >
            {!isMobileScreen ? (
              <KenGrid
                columns={columns}
                data={data}
                pagination={{ disabled: true }}
                gridProps={{
                  getHeaderGroupProps: column => ({
                    style: { border: '1px solid #D2E1E9' },
                  }),
                  getHeaderProps: column => ({
                    style: {
                      background: '#F1F5FA',
                      boxSizing: 'border-box',
                      color: '#092682',
                      fontSize: 16,
                    },
                  }),
                }}
                toolbarDisabled={true}
                noDataText={fetchingData}
                isCollasable={false}
              />
            ) : (
              <>
                {data.length === 0 ? (
                  <Typography style={{ padding: '10px' }}>
                    No data found
                  </Typography>
                ) : (
                  <Grid container className={classes.feedbackResp}>
                    {data.map((item, index) => (
                      <Grid container key={index} xs={12} style={{marginBottom:"10px" }}>
                        <KenCard>
                          <Grid container>
                            <Grid item xs={12}>
                              <Typography style={{ fontWeight: 'bold' }}>
                                Feedback Type
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>{item.feedbackType}</Typography>
                            </Grid>

                            <Grid item xs={12}  style={{marginTop:"10px"}}>
                              <Typography style={{ fontWeight: 'bold' }}>
                                Term
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography>{item.termName}</Typography>
                            </Grid>
                            <Grid container style={{marginTop:"10px"}}>
                              <Grid container xs={6}>
                                <Grid item xs={12}>
                                  <Typography style={{ fontWeight: 'bold' }}>
                                    Due Date
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography className={classes.dueDate}>
                                    {moment(item.dueDate).format('DD-MM-YYYY')}
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Grid container xs={6}>
                                <Grid item xs={12}>
                                  <Typography style={{ fontWeight: 'bold' }}>
                                    Status
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography
                                    className={
                                      item.status === 'Pending'
                                        ? classes.Pending
                                        : item.status === 'Submitted'
                                        ? classes.Submitted
                                        : item.status === 'Rejected'
                                        ? classes.Rejected
                                        : '-'
                                    }
                                    onClick={() => viewFeedback(item)}
                                    style={{ cursor: 'pointer',marginTop:"5px" }}
                                  >
                                    {item.status}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </KenCard>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Card>
      ) : tabView === 'form' ? (
        <div>
          {feedbackFormData && feedbackFormData.length > 0 ? (
            <FeedbackForm
              data={feedbackFormData}
              selected={selectedRow}
              setTabView={setTabView}
              setFormData={setFormData}
              setShowForm={setShowForm}
              reloadAPI={reloadAPI}
              setReloadAPI={setReloadAPI}
              secondScreen={secondScreen}
              cardData={cardData}
              tabData={tabData}
              tabView={tabView}
              termDetails={termDetails}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
