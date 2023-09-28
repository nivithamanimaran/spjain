import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { createMuiTheme, makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
//Global Components
import { useMediaQuery } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
import {
  getSessionDataViaContactId,
  getStudentList,
  postAttendanceEvent,
} from '../../../../utils/ApiService';
import { KEY_DATE_FORMAT } from '../../../../utils/constants';
import { useAppContext } from '../../../../utils/contextProvider/AppContext';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import '../../styles.scss';

const KenDatePicker = React.lazy(() =>
  import('../../../../components/KenDatePicker')
);
const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const KenSnackbar = React.lazy(() =>
  import('../../../../components/KenSnackbar')
);
const KenButton = React.lazy(() =>
  import('../../../../global_components/KenButton/index')
);
const KenCard = React.lazy(() =>
  import('../../../../global_components/KenCard')
);
const KenGrid = React.lazy(() =>
  import('../../../../global_components/KenGrid')
);
const KenInputField = React.lazy(() =>
  import('../../../../global_components/KenInputField')
);
const KenSelect = React.lazy(() =>
  import('../../../../global_components/KenSelect')
);
const MarkAttendance1 = React.lazy(() => import('./Markattendance'));

const useStyles = makeStyles(theme => ({
  header: {
    background: 'transparent',
    color: theme.palette.KenColors.primary,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'end',
  },
  headerBtn: {
    margin: '0 5px',
  },
  leftBox: {
    width: '100%',
    background: '#fff !important',
    padding: '10px',
    overflowY: 'auto',
  },
  RightBox: {
    background: '#fff',
    width: '100%',
    background: '#fff !important',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 0px',
      background: 'none !important',
    },
    position: 'relative',
    '& div > div > table > thead': {
      background: '#F1F5FA',
    },
    '& div > div > table > thead > tr > th': {
      color: '#092682',
      fontSize: '13px',
      fontWeight: 'bold',
      borderBottom: 'none !important',
      textTransform: 'none !important',
      ['@media (max-width:600px)']: {
        fontSize: '9px',
      },
    },
    '& > div ': {
      boxShadow: 'none',
    },
  },
  sideCardTitle: {
    marginTop: '0px',
    color: '#0077FF',
    fontSize: '14px',
    fontWeight: 600,
  },
  sideCardVal: {
    margin: '0px',
  },
  selectTableCell: {
    textAlign: 'right !important',
  },
  boxTable: {
    width: '100%',
    padding: 20,
    border: '0.6px solid #D7DEE9',
  },
  textContentSpan: {
    fontSize: '12px',
  },
  textContent: {
    color: '#092682',
    fontSize: '12px',
  },
  sessionBoxes__wrap: {},
  sessionBoxes: {
    width: ' 200px',
    height: 69,
    border: '1px solid #092682',
    marginRight: 20,
    textAlign: 'center',
  },
  session__subtext: {
    margin: 0,
  },
  // accordion table
  accDate: {
    width: '100%',
    margin: '12px 16px !important',
    boxShadow: 'none',
    '&::before': {
      background: 'none',
    },
  },
  seaField: {
    marginTop: '21px',
    '& > div ': {
      height: '40px',
    },
  },
  // responsiveness
  mobCradfont: {
    fontSize: '12px',
  },
}));
export default function MarkAttendance(setValue) {
  const classes = useStyles();
  const kenTheme = useTheme();
  const isDesktopScreen = useMediaQuery(kenTheme.breakpoints.up('sm'));
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log(data)
  const [subject, setSubject] = useState([]);
  const [currentSubject, setCurrentSubject] = useState();
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentView, setStudentView] = useState(true);
  const [sessionId, setSessionId] = useState();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [reasonTypeOptions, setReasonTypeOptions] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [detailsDialog, setdetailsDialog] = React.useState(false);
  const [noData, setNoData] = useState(t('messages:Fetching_Data'));
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
  const [page, setPage] = useState(1);
  const [trigger, setTrigger] = useState(true);
  const {
    state: { userDetails },
  } = useAppContext();

  const user = getUserDetails();

  const theme = createMuiTheme({
    overrides: {
      // Style sheet name ⚛️
      MuiInputBase: {
        // Name of the rule
        root: {
          // Some CSS
          display: 'block',
          paddingLeft: '5px',
          fontFamily: `'Work Sans', sans-serif`,
        },
      },
    },
  });
  // modal box
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // mob submit
  const handleOpenmob = () => {
    setdetailsDialog(true);
  };

  const handleClosemob = () => {
    setdetailsDialog(false);
  };

  const onclickMarkAttendance = (row, data) => {
    setStudentView(false);
    setSessionId(row['original']?.id);
    setLoading(true);
    setNoData(t('messages:Fetching_Data'));
    getStudentList(row['original'].courseOfferingId)
      .then(res => {
        console.log('res', res);
        let data = [];
        let reasonsList = [];
        if (res?.message !== 'No Data Found') {
          let details = res?.data?.studentsList;
          details.map(el => {
            data.push({
              checked: true,
              contactName: el?.contactName,
              contactId: el?.contactId,
              contactEmail: el?.contactEmail,
              attendanceId: el?.attendanceEventId,
            });
          });
          res?.data?.reasonDropdownValues.map(item => {
            reasonsList.push({ label: item, value: item });
          });
          setReasonTypeOptions(reasonsList);
        } else {
          setNoData(t('No_Records'));
        }
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setStudents([]);
        setLoading(false);
        setNoData(t('No_Records'));
      });
    // }
  };

  let tableData2 = [
    {
      checked: <Checkbox />,
      idNumber: 'Ussr01',
      studentname: 'Ankit Kumar',
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'Jack Jones',
    },
  ];
  const columns2 = [
    {
      Header: '',
      accessor: 'checked',
      disableGlobalFilter: false,
    },
    {
      Header: 'ID NUMBER',
      accessor: 'idNumber',
      disableGlobalFilter: true,
    },
    {
      Header: 'STUDENT NAME',
      accessor: 'studentname',
      disableGlobalFilter: true,
    },
    {
      Header: 'REASON OF ABSENCE',
      accessor: 'Reasons',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <KenSelect
            value={value}
            options={reasonTypeOptions}
            placeholder={'Select'}
            required={true}
            onChange={e => {
              handleReasons(e, row, students);
            }}
          />
        );
      },
    },
    {
      Header: 'DESCRIPTION',
      accessor: 'Description',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <KenInputField
            value={value}
            placeholder={'ENTER DESCRIPTION'}
            required={true}
            style={{ padding: '5px 26px 5px 12px' }}
            onChange={e => {
              handleAttendenceDescription(e, row, students);
            }}
          />
        );
      },
    },
  ];

  console.log(user);

  let tableData3 = [
    {
      checked: <Checkbox />,
      idNumber: 'Ussr01',
      studentname: 'Ankit Kumar',
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'Jack Jones',
    },
  ];

  const columns3 = [
    {
      Header: '',
      accessor: 'checked',
    },
    {
      Header: 'ID NUMBER',
      accessor: 'idNumber',
      disableGlobalFilter: true,
    },
    {
      Header: 'STUDENT NAME',
      accessor: 'studentname',
      disableGlobalFilter: true,
    },
  ];

  useEffect(() => {
    const userDetails = getUserDetails();
    console.log(userDetails);
    setLoading(true);
    setNoData(t('messages:Fetching_Data'));
    getSessionDataViaContactId(
      userDetails?.ContactId,
      moment(currentDate)
        .subtract(page * 7, 'days')
        .format('YYYY-MM-DD'),
      moment(currentDate)
        .add(1, 'days')
        .format('YYYY-MM-DD')
    )
      .then(res => {
        let data = [];
        for (let i = 0; i <= 7; i++) {
          data.push({
            date: moment(currentDate)
              .subtract(i, 'days')
              .format('DD-MM-YYYY'),
            data: [],
          });
        }
        if (res?.message !== 'No Data Found') {
          let details = res?.data;
          details.map((el, index) => {
            let dataIndex = data.findIndex(
              elem => elem?.date === moment(el?.startDate)?.format('DD-MM-YYYY')
            );
            data[dataIndex].data.push({
              ...el,
              sessionName: index + 1,
              courseName: el.courseName,
              termName: el.termName,
              subject: el.courseName,
              section: el.courseOfferingSectionId,
              startTime: moment(el.startDate).format('LT'),
              endTime: moment(el.endDate).format('LT'),
              startDate1: moment(el.startDate).format(KEY_DATE_FORMAT),
            });
          });
        } else {
          setNoData('You are upto date!');
        }
        data.sort((a, b) => new Date(a.startDate) > new Date(b.startDate));
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setData([]);
        setNoData(t('No_Records'));
        setLoading(false);
      });
  }, [trigger]);

  const handleSubmit = () => {
    setLoading(true);
    const AttendanceEvent = [];
    students.forEach(student => {
      AttendanceEvent.push({
        contactId: student.contactId,
        sessionId: sessionId,
        attendanceStatus: student.checked === true ? 'Present' : 'Absent',
        reasonType: student.Reasons,
        reasonDescription: student.Description,
      });
    });
    let payload = {
      Operation: 'Create',
      AttendanceEvent: AttendanceEvent,
    };
    postAttendanceEvent(payload)
      .then(res => {
        console.log(res);
        setStudentView(true);
        setdetailsDialog(false);
        onSessionList(currentSubject);
        setLoading(false);

        handleSnackbarOpen('success', 'Attendance added sucessfully');
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        handleSnackbarOpen('error', 'Something went Wrong');
      });
  };
  const onBackStudentsView = () => {
    setStudentView(true);
  };

  const handleReasons = (event, row, students) => {
    let val = event.target.value;
    students[row.index]['Reasons'] = val;
    setStudents([...students]);
  };
  const handleAttendenceDescription = (event, row, students) => {
    students[row.index]['Description'] = event.target.value;
  };

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  let today = new Date();
  let date =
    today.getDate() +
    '-' +
    parseInt(today.getMonth() + 1) +
    '-' +
    today.getFullYear();

  return (
    <div>
      {isDesktopScreen ? (
        <>
          <Grid container xs={12}>
            {loading && <KenLoader />}
            <KenSnackbar
              message={snackbarMessage}
              severity={snackbarSeverity}
              autoHideDuration={5000}
              open={openSnackbar}
              handleSnackbarClose={handleSnackbarClose}
              position="Bottom-Right"
            />
            {studentView == true ? (
              <>
                {data &&
                  data.map(el => {
                    return (
                      <div
                        style={{
                          width: '100%',
                          paddingRight: '16px',
                          display: studentView === false && 'none',
                        }}
                      >
                        {el.data.length > 0 ? (
                          <Accordion
                            className={classes.accDate}
                            style={{ padding: '0px' }}
                          >
                            <AccordionSummary
                              style={{ padding: '0px' }}
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Typography style={{ fontWeight: 'bold' }}>
                                {el.date}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails style={{ padding: '0px' }}>
                              <Grid container xs={12}>
                                <Grid className={classes.RightBox}>
                                  <KenCard
                                    elevation={0}
                                    paperStyles={{
                                      padding: 0,
                                      boxShadow: 'none',
                                    }}
                                  >
                                    <div className="KenDiv">
                                      <MarkAttendance1
                                        data={el.data}
                                        setTrigger={setTrigger}
                                        trigger={trigger}
                                        setValue={setValue}
                                      />
                                    </div>
                                  </KenCard>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ) : null}
                      </div>
                    );
                  })}
              </>
            ) : (
              <>
                <Grid
                  container
                  xs={12}
                  className={classes.wrapper_content}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    position: 'absolute',
                    top: 70,
                    right: 25,
                    width: '20%',
                  }}
                />
                <Grid container xs={12}>
                  <Grid
                    container
                    xs={12}
                    className={classes.wrapper_content}
                    spacing={2}
                    style={{
                      padding: '0px 3px',
                    }}
                  >
                    <Grid item xs={3} md={3} style={{ paddingLeft: 16 }}>
                      <KenSelect
                        placeholder={'Select'}
                        required={true}
                        label="Select Subject"
                      />
                    </Grid>
                    <Grid item xs={3} md={3} style={{ paddingRight: ' 16px' }}>
                      <KenDatePicker
                        name={'startDate'}
                        label="Date"
                        value={selectedStartDate}
                        required={true}
                        onChange={e => handleStartDateChange(e)}
                        maxDate={
                          selectedEndDate ? new Date(selectedEndDate) : null
                        }
                      />
                    </Grid>
                    <Grid item md={3}>
                      <TextField
                        className={classes.seaField}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              className="hi brother"
                              style={{ height: '40px' }}
                            >
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Search..."
                        fullWidth
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3} md={3} style={{ marginTop: '12px' }}>
                      <Box display="flex" justifyContent="flex-end" my={1}>
                        <KenButton
                          onClick={onBackStudentsView}
                          variant="secondary"
                          style={{ marginRight: '2em' }}
                        >
                          {t('labels:Back')}
                        </KenButton>

                        <KenButton
                          // onClick={handleSubmit}
                          onClick={handleOpen}
                          variant="primary"
                          style={{ marginLeft: 8 }}
                        >
                          {t('labels:Submit')}
                        </KenButton>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-title"
                          aria-describedby="modal-description"
                        >
                          <div style={{ padding: '20px' }}>
                            <DialogContent>
                              <DialogContentText
                                id="modal-description"
                                style={{ fontWeight: 'bold' }}
                              >
                                Are you sure you want to Submit?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <KenButton
                                onClick={handleClosemob}
                                variant="secondary"
                                style={{ border: 'none' }}
                              >
                                {t('labels:Cancel')}
                              </KenButton>
                              <KenButton
                                onClick={handleSubmit}
                                variant="primary"
                              >
                                {t('labels:Save')}
                              </KenButton>
                            </DialogActions>
                          </div>
                        </Dialog>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid className={classes.RightBox}>
                    <KenCard
                      elevation={0}
                      paperStyles={{ padding: 0, boxShadow: 'none' }}
                    >
                      <div className="KenStudentsDiv">
                        <KenGrid
                          columns={columns2}
                          data={tableData2}
                          pagination={{ disabled: true }}
                          toolbarDisabled={true}
                          isCollasable={false}
                          noDataText={noData}
                        />
                      </div>
                    </KenCard>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </>
      ) : (
        <>
          {studentView ? (
            <>
              <Grid container spacing={2} xs={12}>
                <Grid item xs={6}>
                  <KenSelect
                    // value={currentSubject ? currentSubject : subject[0].value}
                    // onChange={e => {
                    //   onChangeSubject(e.target.value, subject);
                    // }}
                    options={subject}
                    placeholder={'Select'}
                    required={true}
                    label="Select Subject"
                    inputBaseRootClass={classes.rad}
                  />
                </Grid>
                <Grid item xs={6} style={{ marginTop: '22px' }}>
                  <TextField
                    value={'2021-B.Tech In'}
                    variant="outlined"
                    // placeholder={'Select'}
                    InputLabelProps={{
                      borderColor: '#ced4da',
                    }}
                    size={'small'}
                    required={true}
                    inputBaseRootClass={classes.rad}
                  />
                </Grid>
              </Grid>
              {/* mobile */}
              {data.map(s => (
                <>
                  {s.data.length > 0 ? (
                    <KenCard>
                      <Typography>
                        Date:{' '}
                        <span style={{ fontWeight: 'bold' }}> {s.date}</span>
                      </Typography>
                      <Grid container style={{ paddingTop: '3em' }}>
                        <Grid item xs={6}>
                          <Typography className={classes.mobCradfont}>
                            Start Time: {s.data[0].startTime}
                          </Typography>
                          <Typography className={classes.mobCradfont}>
                            End Time: {s.data[0].endTime}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <KenButton
                            variant="contained"
                            color="primary"
                            style={{
                              float: 'right',
                              fontSize: '10px',
                            }}
                            onClick={e => {
                              onclickMarkAttendance({ original: s }, data);
                            }}
                          >
                            {'Mark'}
                          </KenButton>
                        </Grid>
                      </Grid>
                    </KenCard>
                  ) : null}
                </>
              ))}
            </>
          ) : (
            <>
              {tableData3.map(s => (
                <Dialog
                  open={detailsDialog}
                  onClose={handleClose}
                  aria-labelledby="modal-title"
                  aria-describedby="modal-description"
                >
                  <div style={{ padding: '50px' }}>
                    <DialogContent>
                      <Typography
                        style={{ padding: '2px', fontWeight: 'bold' }}
                      >
                        Details
                      </Typography>
                      <DialogContentText
                        id="modal-description"
                        style={{ fontWeight: 'bold' }}
                      >
                        <Typography>Id Number:</Typography>
                        <Typography>{s.idNumber}</Typography>
                        <Typography>Student Name</Typography>
                        <Typography>{s.studentname}</Typography>
                        <Typography>Reason of Absence</Typography>
                        <Typography>
                          <KenSelect placeholder="Select Subject" />
                        </Typography>
                        <Typography>Description</Typography>
                        <Typography>
                          <KenSelect placeholder="Select Subject" />
                        </Typography>{' '}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <KenButton
                        onClick={handleClosemob}
                        variant="secondary"
                        style={{ border: 'none' }}
                      >
                        {t('labels:Cancel')}
                      </KenButton>
                      <KenButton onClick={handleClosemob} variant="primary">
                        {t('labels:Save')}
                      </KenButton>
                    </DialogActions>
                  </div>
                </Dialog>
              ))}
              <Dialog
                open={open}
                onClose={handleClosemob}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <div style={{ padding: '20px' }}>
                  <DialogContent>
                    <DialogContentText
                      id="modal-description"
                      style={{ fontWeight: 'bold' }}
                    >
                      Are you sure you want to Submit?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <KenButton
                      onClick={handleClose}
                      variant="secondary"
                      style={{ border: 'none' }}
                    >
                      {t('labels:Cancel')}
                    </KenButton>
                    <KenButton onClick={handleClose} variant="primary">
                      {t('labels:Submit')}
                    </KenButton>
                  </DialogActions>
                </div>
              </Dialog>
              <Grid container spacing={3} xs={12}>
                <Grid item xs={12}>
                  <Typography>
                    Date:<span style={{ fontWeight: 'bold' }}>15-12-2022</span>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <KenSelect placeholder="Select Subject" />
                </Grid>
                <Grid item xs={6}>
                  <KenSelect />
                </Grid>
              </Grid>
              <Grid container xs={12}>
                <Grid className={classes.RightBox}>
                  <KenCard
                    elevation={0}
                    paperStyles={{ padding: 0, boxShadow: 'none' }}
                  >
                    <div className="KenStudentsDiv">
                      <KenGrid
                        columns={columns3}
                        data={tableData3}
                        pagination={{ disabled: true }}
                        toolbarDisabled={true}
                        isCollasable={false}
                        rowClick={() => {
                          console.log('init');
                          // handleOpen()
                          handleOpenmob();
                        }}
                        noDataText={noData}
                      />
                    </div>
                  </KenCard>
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: '4em' }}>
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <KenButton
                    onClick={handleClosemob}
                    variant="secondary"
                    style={{ border: 'none' }}
                  >
                    {t('labels:Cancel')}
                  </KenButton>
                </Grid>
                <Grid item xs={4}>
                  <KenButton onClick={handleOpen} variant="primary">
                    {t('labels:Submit')}
                  </KenButton>
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </div>
  );
}
