import React, { useState, useEffect } from 'react';
import KenGrid from '../../../../global_components/KenGrid';
import { Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Grid, Card } from '@material-ui/core';
import { getFeedBackSpecificData } from '../../../../utils/ApiService';
import KenLoader from '../../../../components/KenLoader';
import KenSnackbar from '../../../../components/KenSnackbar';
import FeedbackForm from '../FeedbackForm';
import KenCard from '../../../../global_components/KenCard';
import { useTheme } from '@material-ui/core';
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

export default function Faculty(props) {
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
  const [tabDataS, setTabData] = useState([]);
  const [formData, setFormData] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [type, setType] = useState('Faculty');
  const [cardData, setCardData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedTabRow, setSelectedTabRow] = useState({});
  const [loading, setLoading] = useState(false);
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
      Header: 'Name',
      accessor: 'facultyName',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course',
      accessor: 'courseName',
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
      Cell: ({ row }) => {
        return <VisibilityIcon onClick={() => viewFeedback(row?.original)} />;
      },
    },
  ];

  useEffect(() => {
    console.log('tabData', tabData);
    setData(tabData?.faculty);
    setTabData(tabData);
  }, [tabData]);
  const viewFeedback = row => {
    setLoading(true);
    setSelectedTabRow(row);
    setSelectedRow(tabDataS);
    let scheduleid = tabDataS.feedBackSchedulerId;
    let contactid = contactId;
    let courseid = row.facultyId;
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
                key: 'Faculty',
                value: row?.facultyName,
              },
              {
                key: 'Course',
                value: row?.courseName,
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
                isCollasable={false}
              />
            </Card>
          ) : (
            <>
              {data.length === 0 ? (
                <Typography style={{ padding: '10px' }}>
                  No data found
                </Typography>
              ) : (
                <Grid
                  container
                  style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}
                >
                  {data.map((item, index) => (
                    <Grid key={index} xs={12} style={{ marginBottom: '10px' }}>
                      <KenCard
                        paperStyles={{ padding: 10, borderRadius: '4px' }}
                      >
                        <Grid container>
                          <Grid
                            item
                            xs={6}
                            className={classes.cardResp}
                            style={{ marginBottom: '10px' }}
                          >
                            <Typography>
                              <b>Faculty Name</b>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            className={classes.cardResp}
                            style={{ marginBottom: '10px' }}
                          >
                            <Typography>{item.facultyName}</Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            className={classes.cardResp}
                            style={{ marginBottom: '10px' }}
                          >
                            <Typography>
                              <b>Course</b>
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            className={classes.cardResp}
                            style={{ marginBottom: '10px' }}
                          >
                            <Typography>{item.courseName}</Typography>
                          </Grid>
                          <Grid container>
                            <Grid container xs={6}>
                              <Grid item xs={12} className={classes.cardResp}>
                                <Typography>
                                  <b>Status</b>
                                </Typography>
                              </Grid>
                              <Grid item xs={12} className={classes.cardResp}>
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
                                  style={{marginTop:"5px"}}
                                >
                                  {item.status}
                                </Typography>
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
                                  onClick={() => viewFeedback(item)}
                                />
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
        </>
      ) : (
        <div>
          {feedbackData && feedbackData.length > 0 ? (
            <FeedbackForm
              data={feedbackData}
              row={selectedTabRow}
              selected={selectedRow}
              selected2={selected}
              setFormData={setFormData}
              cardData={cardData}
              setTabView={setTabView}
              secondScreen={secondScreen}
              tabView={tabView}
              tabData={tabData}
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
