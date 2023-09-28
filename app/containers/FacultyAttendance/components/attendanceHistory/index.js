import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Typography,
  useTheme,
  Box,
  Table,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import {
  createMuiTheme,
  createTheme,
  makeStyles,
} from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import '../../styles.scss';
import { KEY_DATE_FORMAT } from '../../../../utils/constants';
import {
  getCompletedEnrollment,
  getSessionListFilter,
  getSessionViaData,
  getattendancePerSession,
  postAttendanceEvent,
} from '../../../../utils/ApiService';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import moment from 'moment';
import SearchIcon from '@material-ui/icons/Search';
import { AiOutlineEdit } from 'react-icons/ai';
import { Tic } from '@material-ui/icons';
import { useMediaQuery } from '@material-ui/core';
import { AiFillEye } from 'react-icons/ai';

const KenSnackbar = React.lazy(() =>
  import('../../../../components/KenSnackbar')
);
const KenDatePicker = React.lazy(() =>
  import('../../../../components/KenDatePicker')
);
const KenInputField = React.lazy(() =>
  import('../../../../global_components/KenInputField')
);
const AttendanceHistory1 = React.lazy(() => import('./Attendancehistory'));
const KenButton = React.lazy(() =>
  import('../../../../global_components/KenButton/index')
);
const KenCard = React.lazy(() =>
  import('../../../../global_components/KenCard')
);
const KenGrid = React.lazy(() =>
  import('../../../../global_components/KenGrid')
);
const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const KenSelect = React.lazy(() =>
  import('../../../../global_components/KenSelect')
);

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
    padding: '40px 10px 10px 10px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '10px 0px',
      background: 'none !important',
    },
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
    '& div > div > div> div > div > table': {
      border: '1px solid #D2E1E9',
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
    textAlign: 'left !important',
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
    textAlign: 'center',
  },
  session__subtext: {
    margin: 0,
  },
  inputClass: {
    padding: '10px 26px 10px 12px !important',
    background: 'red',
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
  rad: {
    borderRadius: '8px',
    width: '98%',
    '&>div': {
      borderRadius: '8px',
      width: '98%',
    },
  },
}));
export default function AttendanceHistory(props) {
  const classes = useStyles();
  const kenTheme = useTheme();
  const isDesktopScreen = useMediaQuery(kenTheme.breakpoints.up('sm'));
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [subject, setSubject] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentSubjectName, setCurrentSubjectName] = useState('');
  const [startingId, setStartingId] = useState('');
  const [open, setOpen] = useState(false);
  const [detailsDialog, setdetailsDialog] = React.useState(false);
  const [students, setStudents] = useState([]);
  const [studentView, setStudentView] = useState(true);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [previous, setPrevious] = useState({});
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [sessionId, setSessionId] = useState();
  const [reasonTypeOptions, setReasonTypeOptions] = useState([]);
  const [noData, setNoData] = useState(t('messages:Fetching_Data'));

  const theme = createTheme({
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

  const onClickViewAttendance = (row, data) => {
    setStudentView(false);
    let id = row['original']?.id;
    setSessionId(id);
    setLoading(true);
    ongetAttendancePerSession(id);
  };

  const onChangeSubject = (val, subject) => {
    let subjectFilter = subject.filter(item => {
      if (item.value === val) {
        return item;
      }
    });
    setCurrentSubject(val);
    setStartingId(val);
    setCurrentSubjectName(subjectFilter[0].label);
  };

  // modal box
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // dialog edit
  const handleOpenEdit = () => {
    setdetailsDialogEdit(true);
  };

  const handleCloseEdit = () => {
    setdetailsDialogEdit(false);
  };

  // mob submit
  const handleOpenmob = () => {
    setdetailsDialog(true);
  };

  const handleClosemob = () => {
    setdetailsDialog(false);
  };

  const ongetAttendancePerSession = id => {
    setLoading(true);
    setNoData(t('messages:Fetching_Data'));
    getattendancePerSession(id)
      .then(res => {
        console.log('res', res);
        let data = [];
        let reasonsList = [];
        if (res?.message !== 'No Data Found') {
          let details = res?.data[0]?.attendance;
          if (details.length > 0) {
            details.map(el => {
              data.push({
                ...el,
                checked: el.attendanceStatus === 'Absent' ? false : true,
                contactName: el.contactName,
                reasonType: el?.reasonType,
                reasonDescription: el?.reasonDescription,
                id: el.contactId,
                contactEmail: el.contactEmail,
                attendanceId: el.attendanceEventId,
              });
            });
          } else {
            setNoData(t('No_Records'));
          }
          res?.data[0]?.reasonDropdownValues.map(item => {
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
        setNoData(t('No_Records'));
        setStudents([]);
        setLoading(false);
      });
  };

  let tableData2 = [
    {
      checked: <Checkbox />,
      idNumber: 'Ussr01',
      contactName: 'Ankit Kumar',
      action: <AiOutlineEdit style={{ fontSize: '20px' }} />,
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      contactName: 'jack jones',
      action: <AiOutlineEdit style={{ fontSize: '20px' }} />,
    },
  ];
  const columns2 = [
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
      accessor: 'contactName',
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
    {
      Header: 'ACTION',
      accessor: 'action',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <>{row ? <AiOutlineEdit style={{ fontSize: '20px' }} /> : <Tic />}</>
        );
      },
    },
  ];

  let tableData3 = [
    {
      checked: <Checkbox />,
      idNumber: 'Ussr01',
      studentname: 'Ankit Kumar',
      Description: (
        <AiFillEye style={{ fontSize: '20px' }} onClick={handleOpenmob} />
      ),
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'jack jones',
      Description: (
        <AiFillEye style={{ fontSize: '20px' }} onClick={handleOpenmob} />
      ),
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'jack jones',
      Description: <AiFillEye style={{ fontSize: '20px' }} />,
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'jack jones',
      Description: <AiFillEye style={{ fontSize: '20px' }} />,
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'jack jones',
      Description: <AiFillEye style={{ fontSize: '20px' }} />,
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'jack jones',
      Description: <AiFillEye style={{ fontSize: '20px' }} />,
    },
    {
      checked: <Checkbox />,
      idNumber: 'Ussr02',
      studentname: 'jack jones',
      Description: <AiFillEye style={{ fontSize: '20px' }} />,
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
    {
      Header: '',
      accessor: 'Description',
      disableGlobalFilter: true,
    },
  ];

  useEffect(() => {
    const userDetails = getUserDetails();
    const ContactId = userDetails.ContactId;
    setLoading(true);
    getCompletedEnrollment(ContactId)
      .then(res => {
        console.log('res', res);
        let data = [];
        if (res?.message !== 'No Data Found') {
          let courses = res?.mandatoryCourses;
          courses.map(el => {
            data.push({
              //  ...el,
              label: el.CourseName + ' ' + el.courseOfferingSectionId,
              value: el.courseOfferingId,
            });
          });
        }
        setSubject(data);
        setCurrentSubject(data[0]?.value);
        setCurrentSubjectName(data[0]?.label);
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setSubject([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (startingId !== '') {
      setLoading(true);
      let data = `courseOfferingId=${startingId}`;
      getSessionViaData(data)
        .then(res => {
          console.log('res', res);
          let data = [];
          let startDateList = [];
          let endDateList = [];
          if (res?.message !== 'No Data Found') {
            let details = res?.data;
            details.map((el, index) => {
              startDateList.push(moment(el.startDate).format(KEY_DATE_FORMAT));
              endDateList.push(moment(el.endDate).format(KEY_DATE_FORMAT));
              data.push({
                ...el,
                sessionName: index + 1,
                date: el.startDate,
                section: el.courseOfferingSectionId,
                StartTime: moment(el.startDate).format(KEY_DATE_FORMAT),
                endtime: moment(el.endDate).format(KEY_DATE_FORMAT),
                startTime: moment(el.startDate).format('LT'),
                endTime: moment(el.endDate).format('LT'),
              });
            });
            const earliestDate = startDateList.reduce(
              (minDate, currentDate) => {
                if (currentDate < minDate) {
                  return currentDate;
                }
                return minDate;
              }
            );
            setSelectedStartDate(earliestDate);
            const latestDate = startDateList.reduce((maxDate, currentDate) => {
              if (currentDate > maxDate) {
                return currentDate;
              }
              return maxDate;
            });
            setSelectedEndDate(latestDate);
          } else {
            setNoData(t('No_Records'));
          }
          data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          setData([]);
          setLoading(false);
          setNoData(t('No_Records'));
        });
    }
  }, [startingId, studentView]);

  console.log('historydata', data);

  const onBackStudentsView = () => {
    setStudentView(true);
  };

  const handleStartDateChange = date => {
    let startDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setSelectedStartDate(date.target.value);
  };

  const handleEndtDateChange = date => {
    let endDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setSelectedEndDate(date.target.value);
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value =
      e.target.name == 'checked' ? e.target.checked : e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newData = [...students];
    newData.forEach(row => {
      if (row.id === id) {
        row[name] = value;
      }
    });
    setStudents(newData);
  };

  const onToggleEditMode = (check, id, index) => {
    const newData = [...students];
    newData.forEach(row => {
      if (row.id === id) {
        row.isEditMode = true;
        if (check === 'done') {
          console.log('students', students);
          setLoading(true);
          const AttendanceEvent = [];
          students.forEach(student => {
            if (id === student.contactId) {
              AttendanceEvent.push({
                contactId: student.contactId,
                eventId: student.attendanceId,
                sessionId: sessionId,
                attendanceStatus:
                  student.checked === true ? 'Present' : 'Absent',
                reasonType: student.reasonType,
                reasonDescription: student.reasonDescription,
              });
            }
          });
          let payload = {
            Operation: 'Create',
            AttendanceEvent: AttendanceEvent,
          };
          postAttendanceEvent(payload)
            .then(res => {
              console.log(res);
              row.isEditMode = false;
              ongetAttendancePerSession(sessionId);
              setLoading(false);
              handleSnackbarOpen('success', 'Attendance added sucessfully');
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
              handleSnackbarOpen('error', 'Something went Wrong');
            });
        } else if (check === 'edit') {
          row.isEditMode = true;
          setStudents(newData);
        }
      }
    });
    // setEditIndex(index);
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
            {studentView ? (
              <>
                <Grid container xs={12}>
                  <Grid className={classes.RightBox}>
                    <AttendanceHistory1 />
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
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
                    <Grid item md={1} />
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
                    <Grid item xs={3} md={2} style={{ marginTop: '12px' }}>
                      <Box display="flex" justifyContent="flex-end" my={1}>
                        <KenButton
                          onClick={onBackStudentsView}
                          variant="secondary"
                          style={{ marginRight: '2em' }}
                        >
                          {t('labels:Back')}
                        </KenButton>
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
                  {subject.length > 0 && (
                    <KenSelect
                      value={currentSubject ? currentSubject : subject[0].value}
                      onChange={e => {
                        onChangeSubject(e.target.value, subject);
                      }}
                      options={subject}
                      placeholder={'Select'}
                      required={true}
                      label="Select Subject"
                      inputBaseRootClass={classes.rad}
                    />
                  )}
                </Grid>
                <Grid item xs={6} style={{ marginTop: '23px' }}>
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
                <Grid item xs={6} style={{ paddingRight: ' 0px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      color: '#7A7A7B',
                      display: 'block',
                      fontWeight: '300',
                      paddingBottom: '5px',
                    }}
                  >
                    <b> Start Date</b>
                  </label>
                  <TextField
                    id="startDate"
                    name="startDate"
                    type="date"
                    variant="outlined"
                    onChange={e => handleStartDateChange(e)}
                    value={selectedStartDate}
                    className={classes.rad}
                    InputLabelProps={{
                      borderColor: '#ced4da',
                    }}
                    size={'small'}
                  />
                </Grid>
                <Grid item xs={6} style={{ paddingRight: ' 0px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      color: '#7A7A7B',
                      display: 'block',
                      fontWeight: '300',
                      paddingBottom: '5px',
                    }}
                  >
                    <b> End Date</b>
                  </label>
                  <TextField
                    id="endDate"
                    name="endDate"
                    type="date"
                    variant="outlined"
                    onChange={e => handleEndtDateChange(e)}
                    value={selectedEndDate}
                    className={classes.rad}
                    InputLabelProps={{
                      borderColor: '#ced4da',
                    }}
                    size={'small'}
                  />
                </Grid>
              </Grid>
              <Box style={{ marginTop: '5px' }}>
                {data.map(s => (
                  <KenCard>
                    <Typography>
                      Date: <span style={{ fontWeight: 'bold' }}>{date}</span>
                    </Typography>
                    <Typography>
                      Total Attendance:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {s.totalAttendees}
                      </span>
                    </Typography>
                    <Grid container style={{ paddingTop: '3em' }}>
                      <Grid item xs={6}>
                        <Typography className={classes.mobCradfont}>
                          Start Time: {s.startDate}
                        </Typography>
                        <Typography className={classes.mobCradfont}>
                          End Time: {s.endDate}
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
                          onClick={() => onClickViewAttendance()}
                        >
                          {'View'}
                        </KenButton>
                      </Grid>
                    </Grid>
                  </KenCard>
                ))}
              </Box>
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
                    onClick={() => setStudentView(false)}
                    variant="secondary"
                    style={{ border: 'none' }}
                  >
                    {t('labels:Cancel')}
                  </KenButton>
                </Grid>
                <Grid item xs={4}>
                  <KenButton
                    onClick={() => setStudentView(false)}
                    variant="primary"
                  >
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
