import React, { useState, useEffect } from 'react';
import KenGrid from '../../../../global_components/KenGrid';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Grid, Card } from '@material-ui/core';
import { getFeedBackSpecificData } from '../../../../utils/ApiService';
import FeedbackForm from '../FeedbackForm';
import KenLoader from '../../../../components/KenLoader';
import KenSnackbar from '../../../../components/KenSnackbar';
import KenCard from '../../../../global_components/KenCard';
import { useMediaQuery, useTheme } from '@material-ui/core';
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
    top: theme.spacing(1),
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
  // tableResp: {
  //   [theme.breakpoints.down('md')]: {
  //     '&>div>div>table': {
  //       width: '165%',
  //     },
  //     '&>div>div': {
  //       Overflow: 'auto',
  //     },
  //   },
  // },
}));

export default function Course(props) {
  const classes = useStyles();
  const {
    tabData,
    setShowForm,
    setTabView,
    termDetails,
    selected,
    tabView,
    secondScreen,
  } = props;
  const [data, setData] = useState([]);
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [tabDataS, setTabData] = useState([]);
  const [formData, setFormData] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedTabRow, setSelectedTabRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState([]);
  const [type, setType] = useState('Course');
  const contactId = JSON.parse(localStorage.getItem('userDetails')).ContactId;

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
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
      Header: '#',
      accessor: 'courseId',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return <Typography>{row.index + 1}</Typography>;
      },
    },
    {
      Header: 'Course Name',
      accessor: 'courseName',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course Code',
      accessor: 'courseCode',
      disableGlobalFilter: true,
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
                : value === 'Submitted'
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
      Cell: ({ value, row }) => {
        return (
          <VisibilityIcon onClick={() => getFeedbackFormData(row?.original)} />
        );
      },
    },
  ];

  useEffect(() => {
    console.log('tabData', tabData);
    setData(tabData?.course);
    setTabData(tabData);
  }, [tabData]);

  const getFeedbackFormData = row => {
    setSelectedTabRow(row);
    setLoading(true);
    setSelectedRow(tabDataS);
    let scheduleid = tabDataS.feedBackSchedulerId;
    let contactid = contactId;
    let courseid = row.courseId;
    getFeedBackSpecificData(scheduleid, contactid, type, courseid)
      .then(res => {
        setLoading(false);
        if (res.length > 0) {
          if (res[0]?.feeedbackOption !== null) {
            setFeedbackData(res);
            const array = [];
            array.push(
              {
                key: 'Program',
                value: tabDataS?.academicProgramName,
              },
              {
                key: 'Term',
                value: tabDataS?.termName,
              },
              {
                key: 'Course Name',
                value: row?.courseName,
              },
              {
                key: 'Course Code',
                value: row?.courseCode,
              }
            );
            setCardData(array);
            setFormData(true);
            setShowForm(true);
          } else {
            handleSnackbarOpen('info', 'No feedbacks available');
          }
        } else {
          handleSnackbarOpen('info', 'No feedbacks available');
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <>
      {loading ? <KenLoader /> : null}
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      {!formData ? (
        <>
          {!isMobileScreen ? (
            <Card style={{ background: '#fff' }} className={classes.tableResp}>
              <KenGrid
                columns={columns}
                data={data}
                pagination={{ disabled: false }}
                toolbarDisabled={true}
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
                isCollasable={false}
              />
            </Card>
          ) : (
            <Grid
              container
              style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}
            >
              {data && Array.isArray(data) && data.length === 0 ? (
                <Typography style={{ padding: '10px' }}>
                  No data found
                </Typography>
              ) : (
                data &&
                Array.isArray(data) &&
                data.map((item, index) => (
                  <Grid key={index} xs={12} style={{ marginBottom: '10px' }}>
                    <KenCard paperStyles={{ padding: 10, borderRadius: '4px' }}>
                      <Grid container>
                        <Grid item xs={6} className={classes.cardResp}>
                          <Typography>
                            <b>Course Name</b>
                          </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.cardResp}>
                          <Typography>{item.courseName}</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.cardResp}
                          style={{ marginTop: '10px' }}
                        >
                          <Typography>
                            <b>Course Code</b>
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          className={classes.cardResp}
                          style={{ marginTop: '10px' }}
                        >
                          <Typography>{item.courseCode}</Typography>
                        </Grid>
                        <Grid container style={{ marginTop: '10px' }}>
                          <Grid container xs={6}>
                            <Grid item xs={12} className={classes.cardResp}>
                              <Typography>
                                <b>Status</b>
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              className={classes.cardResp}
                              style={{ marginTop: '5px' }}
                            >
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
                              >
                                {item.status}
                              </Typography>{' '}
                            </Grid>
                          </Grid>
                          <Grid container xs={6}>
                            <Grid item xs={12} className={classes.cardResp}>
                              <Typography>
                                <b>Action</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.cardResp}>
                              <VisibilityIcon
                                onClick={() => getFeedbackFormData(item)}
                                style={{ cursor: 'pointer' }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </KenCard>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </>
      ) : (
        <div>
          {feedbackData && feedbackData.length > 0 ? (
            <FeedbackForm
              data={feedbackData}
              row={selectedTabRow}
              selected={selectedRow}
              selected2={selected}
              cardData={cardData}
              setFormData={setFormData}
              setTabView={setTabView}
              tabView={tabView}
              tabData={tabData}
              secondScreen={secondScreen}
              setShowForm={setShowForm}
              termDetails={termDetails}
              type={type}
            />
          ) : null}
        </div>
      )}
    </>
  );
}
