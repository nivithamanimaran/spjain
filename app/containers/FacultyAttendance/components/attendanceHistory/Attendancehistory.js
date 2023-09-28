import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useTranslation } from 'react-i18next';
import '../../styles.scss';
import { KEY_DATE_FORMAT } from '../../../../utils/constants';
import {
  getCompletedEnrollment,
  getSessionListFilter,
  getattendancePerSession,
  postAttendanceEvent,
  getSessionViaData,
} from '../../../../utils/ApiService';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import moment from 'moment';
import KenGridEditable from '../../../../global_components/kenGridEditable/kenGridEditable';
import { FaRegEdit } from 'react-icons/fa';
import KenSnackbar from '../../../../components/KenSnackbar';
import DoneIcon from '@material-ui/icons//Done';
import CloseIcon from '@material-ui/icons/Close';
import KenCheckbox from '../../../../global_components/KenCheckbox';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';

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
const KenSelect = React.lazy(() => import('../../../../components/KenSelect'));

const useStyles = makeStyles(theme => ({
  header: {
    background: 'transparent',
    color: theme.palette.KenColors.primary,
  },
  RightBox: {
    background: '#fff',
    width: '100%',
    background: '#fff !important',
    padding: '10px',
    position: 'relative',
  },
  selectTableCell: {
    textAlign: 'left !important',
  },
  sessionBoxes__wrap: {},
  sessionBoxes: {
    width: ' 200px',
    height: 69,
    border: '1px solid #092682',
    textAlign: 'center',
  },
  doneicon: {
    background: '#193389',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    '&:hover': {
      backgroundColor: '#193389',
    },
  },
  closeicon: {
    width: '20px',
    height: '20px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  seaField: {
    marginTop: '-6px',
    marginRight: '15px',
    '& > div > div': {
      border: '1px solid #DFE1E6 ',
      height: '40px',
      borderRadius: '8px',
    },
  },
  inputBaseClass: {
    border: '1px solid #DFE1E6 ',
    background: '#E4E4E4',
    borderRadius: '8px',
  },
  datebord: {
    background: '#E4E4E4',
    borderRadius: '8px',
    marginRight: '8px',
  },
  rad: {
    borderRadius: '8px',
    width: '98%',
    '&>div': {
      borderRadius: '8px',
      width: '98%',
    },
  },
  tableValue: {
    fontSize: 14,
    fontWeight: 400,
  },
  applyButton: {
    display: 'flex',
    alignItems: 'end',
    paddingBottom: '2px',
    fontSize: '12px',
    justifyContent:'center'
  },
}));
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export default function AttendanceHistory1(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [subject, setSubject] = useState([]);
  const [currentSubject, setCurrentSubject] = useState('');
  const [currentSubjectName, setCurrentSubjectName] = useState('');
  const [open, setOpen] = useState(false);
  const [Opendialogue, setOpendialogue] = useState(false);
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
  const [noData, setNoData] = useState();
  const [onclickdata, setOnclickdata] = useState(false);
  const [startingId, setStartingId] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const [searchTitle, setSearchTitle] = useState('');

  const handleOpen = () => {
    setOpendialogue(true);
  };

  const handleClose = () => {
    setOpendialogue(false);
  };

  const onClickViewAttendance = (row, data, rowData) => {
    setStudentView(false);
    let id = rowData?.id;
    setSessionId(id);
    setLoading(true);
    ongetAttendancePerSession(id);
  };

  const ongetAttendancePerSession = id => {
    setLoading(true);
    setNoData(t('messages:Fetching_Data'));
    getattendancePerSession(id)
      .then(res => {
        console.log('res', res);
        let data = [];
        let date = [];
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
  const columns = [
    {
      Header: 'Start Date',
      accessor: 'startDate',
      Cell: ({ value, row }) => {
        return (
          <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
            {moment(value).format('DD-MM-YY')}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'End Date',
      accessor: 'endDate',
      Cell: ({ value, row }) => {
        return (
          <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
            {moment(value).format('DD-MM-YY')}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Section',
      accessor: 'section',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Start Time',
      accessor: 'startTime',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
    },
    {
      Header: 'End Time',
      accessor: 'endTime',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Total Attendance',
      accessor: 'presentAttendees',
      Cell: ({ value, row }) => {
        return (
          <>
            <Typography>
              {row?.original?.presentAttendees +
                '/' +
                row?.original?.totalAttendees}
            </Typography>
          </>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ value, row }) => {
        return (
          <>
            <KenButton
              variant="contained"
              color="primary"
              style={{
                marginRight: '15px',
                fontSize: '12px',
              }}
              className={classes.addButton}
              onClick={() => onClickViewAttendance(row, data, row.original)}
            >
              {'View'}
            </KenButton>
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  useEffect(() => {
    const userDetails = getUserDetails();
    const ContactId = userDetails.ContactId;
    setLoading(true);
    getCompletedEnrollment(ContactId)
      .then(res => {
        let data = [];
        if (res?.message !== 'No Data Found') {
          let courses = [...res?.mandatoryCourses, ...res?.electiveCourses];
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
        setStartingId(data[0]?.value);
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setSubject([]);
        setLoading(false);
      });
  }, []);

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

  const handleApply = () => {
    if (selectedStartDate === null || selectedEndDate === null) {
      return enqueueSnackbar('Please select both start date and end date', {
        variant: 'error',
      });
    }

    if (selectedStartDate > selectedEndDate) {
      return handleSnackbarOpen(
        'error',
        'Start date should be earlier or same as end date'
      );
    }
    if (!currentSubject) {
      return;
    }
    setLoading(true);
    setData([]);
    setNoData(t('messages:Fetching_Data'));
    const startDateTz = `${selectedStartDate}T5:30:00.000Z`;
    let endDateTz = '';
    if (selectedStartDate == selectedEndDate) {
      endDateTz = `${moment(selectedEndDate)
        .add(1, 'day')
        .format('YYYY-MM-DD')}T5:30:00.000Z`;
    } else {
      endDateTz = `${selectedEndDate}T5:30:00.000Z`;
    }
    const courseOfferingId = currentSubject;
    getSessionListFilter(startDateTz, endDateTz, courseOfferingId)
      .then(res => {
        let data = [];
        if (res?.message !== 'No Data Found') {
          let details = res?.data;
          details.map((el, index) => {
            data.push({
              ...el,
              sessionName: index + 1,
              startDate: el.startDate,
              endDate: el.endDate,
              section: el.courseOfferingSectionId,
              StartTime: moment(el.startDate).format(KEY_DATE_FORMAT),
              endtime: moment(el.endDate).format(KEY_DATE_FORMAT),
              startTime: moment(el.startDate).format('LT'),
              endTime: moment(el.endDate).format('LT'),
            });
          });
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
  };
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

  const onBackStudentsView = () => {
    setStudentView(true);
  };

  const handleStartDateChange = date => {
    let startDate = moment(date.target.value).format('YYYY-MM-DDTHH:mm:ss');
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
    if (onclickdata) {
      setOnclickdata(false);
    } else {
      setOnclickdata(true);
    }
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
  };

  const handleClear = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
    setData([]);
  };

  const onRevert = (id, students, index) => {
    const newData = [...students];
    newData.map(row => {
      if (row.id === id) {
        return (row.isEditMode = false);
      }
    });
    setStudents(newData);
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
  return (
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
          <Grid
            container
            xs={12}
            className={classes.wrapper_content}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}
          >
            <Grid item container direction="row">
              <>
                <Grid item xs={3} style={{ paddingLeft: 10 }}>
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
                <Grid item xs={3} />
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
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
                    <Grid item xs={2} className={classes.applyButton}>
                      <KenButton
                        label="Apply"
                        variant="primary"
                        style={{ fontSize: '12px' }}
                        onClick={() => {
                          handleApply();
                        }}
                      />
                    </Grid>
                    <Grid item xs={1} className={classes.applyButton}>
                      <KenButton
                        label="Clear"
                        style={{ fontSize: '12px',background:"#fff", color:"#00218D",border:"1px solid rgba(0, 33, 141, 0.5)" }}
                        onClick={() => {
                          handleClear();
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>

          <Grid container xs={12}>
            <Grid className={classes.RightBox} style={{ marginTop: '25px' }}>
              <KenGrid
                columns={columns}
                data={data}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
                noDataText={noData}
                paperStyles={{ borderRadius: '9px' }}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <KenCard
            elevation={0}
            paperStyles={{ padding: 0, boxShadow: 'none' }}
          >
            <Grid container style={{ display: 'flex', alignItems: 'center' }}>
              <Grid
                item
                style={{
                  display: 'flex',
                  width: '50%',
                  justifyContent: 'space-between',
                }}
              >
                <KenSelect
                  value={currentSubject ? currentSubject : subject[0].value}
                  onChange={e => {
                    onChangeSubject(e.target.value, subject);
                  }}
                  options={subject}
                  placeholder={'Select'}
                  required={true}
                  label="Select"
                  disabled={true}
                  inputBaseRootClass={classes.datebord}
                />
                <Grid item>
                  <label
                    style={{
                      fontSize: '12px',
                      color: '#7A7A7B',
                      display: 'block',
                      fontWeight: '300',
                      paddingBottom: '5px',
                    }}
                  >
                    <b>Date</b>
                  </label>
                  <TextField
                    id="endDate"
                    name="date"
                    type="date"
                    variant="outlined"
                    value={selectedEndDate}
                    className={classes.rad}
                    disabled={true}
                    size={'small'}
                  />
                </Grid>
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  width: '50%',
                  justifyContent: 'flex-end',
                  marginTop: '10px',
                }}
              >
                <div className={classes.seaField}>
                  <TextField
                    variant="standard" // <== changed this
                    margin="normal"
                    placeholder="Search"
                    InputProps={{
                      startAdornment: <SearchIcon />, // <== adjusted this
                      disableUnderline: true, // <== added this
                    }}
                    onChange={e => {
                      console.log('some', e);
                      setSearchTitle(e.target.value);
                    }}
                  />
                </div>
                <>
                  {onclickdata ? (
                    <Box display="flex" justifyContent="flex-end" my={1}>
                      <KenButton
                        onClick={onBackStudentsView}
                        variant="Secondary"
                        style={{ height: 40, fontSize: '13px' }}
                      >
                        {t('Cancel')}
                      </KenButton>
                    </Box>
                  ) : (
                    <Box display="flex" justifyContent="flex-end" my={1}>
                      {/* prem */}
                      <KenButton
                        onClick={onBackStudentsView}
                        variant="primary"
                        style={{ height: 40 }}
                      >
                        {t('Back')}
                      </KenButton>
                    </Box>
                  )}
                </>
              </Grid>
            </Grid>
            <Table
              sx={{ minWidth: 700 }}
              aria-label="spanning table"
              style={{ marginTop: '25px' }}
            >
              <TableHead
                style={{
                  fontSize: 13,
                  background: '#f0f5fa',
                  fontWeight: 'bold',
                }}
              >
                <TableRow>
                  <TableCell align="left" style={{ width: '5%' }} />
                  <TableCell align="left" style={{ width: '15%' }}>
                    ID Number
                  </TableCell>
                  <TableCell align="left" style={{ width: '20%' }}>
                    Student Name
                  </TableCell>
                  <TableCell align="left" style={{ width: '25%' }}>
                    Reason Of Absence
                  </TableCell>
                  <TableCell align="left" style={{ width: '25%' }}>
                    Description
                  </TableCell>
                  <TableCell align="left" style={{ width: '10%' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ border: '0.6px solid #D7DEE9' }}>
                {students.length > 0 ? (
                  students
                    ?.filter(value => {
                      if (searchTitle === '') {
                        console.log('data', value);
                        return value;
                      } else if (
                        Object.values(value).some(val => {
                          if (typeof val === 'string') {
                            return val
                              .toLowerCase()
                              .includes(searchTitle.toLowerCase());
                          } else if (typeof val === 'number') {
                            return val === Number(searchTitle);
                          }
                          return false;
                        })
                      ) {
                        return value;
                      }
                    })
                    .map((row, index) => {
                      return (
                        <TableRow key={row.id} style={{ borderBottom: 'none' }}>
                          <KenGridEditable
                            style={{ borderBottom: 'none' }}
                            {...{
                              row,
                              onChange,
                              columns: [
                                {
                                  column_name: 'checked',
                                  is_inline_edit: false,
                                  inline_edit_type: 'kenCheckbox',
                                  disabled_check: row.isEditMode ? false : true,
                                  label: '',
                                },
                                {
                                  column_name: 'id',
                                  is_inline_edit: false,
                                  inline_edit_type: '',
                                  label: 'Id Number',
                                },
                                {
                                  column_name: 'contactName',
                                  is_inline_edit: false,
                                  inline_edit_type: '',
                                  label: 'Student Name',
                                },
                                {
                                  column_name: 'reasonType',
                                  is_inline_edit: false,
                                  inline_edit_type: 'kenSelect',
                                  dropdown: reasonTypeOptions,
                                },
                                {
                                  column_name: 'reasonDescription',
                                  is_inline_edit: false,
                                  inline_edit_type: 'kenInput',
                                  label: 'Description',
                                },
                              ],
                            }}
                          />
                          <TableCell
                            className={classes.selectTableCell}
                            style={{ textAlign: 'left', borderBottom: 'none' }}
                          >
                            {row.isEditMode ? (
                              <>
                                <Dialog
                                  open={Opendialogue}
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
                                        onClick={handleClose}
                                        variant="secondary"
                                        style={{ border: 'none' }}
                                      >
                                        {t('labels:Cancel')}
                                      </KenButton>
                                      <KenButton
                                        onClick={() =>
                                          onToggleEditMode(
                                            'done',
                                            row.id,
                                            index
                                          )
                                        }
                                        variant="primary"
                                      >
                                        {t('labels:Save')}
                                      </KenButton>
                                    </DialogActions>
                                  </div>
                                </Dialog>
                                {/* end dialogue box */}
                                <Grid container spacing={2}>
                                  <Grid item md={4}>
                                    <IconButton
                                      aria-label="revert"
                                      // onClick={() =>
                                      //     onToggleEditMode('done', row.id, index)
                                      // }
                                      onClick={handleOpen}
                                      className={classes.doneicon}
                                    >
                                      <DoneIcon style={{ fontSize: '18px' }} />
                                    </IconButton>
                                  </Grid>
                                  <Grid item md={4}>
                                    <IconButton
                                      aria-label="revert"
                                      onClick={() =>
                                        onRevert(row.id, students, index)
                                      }
                                      className={classes.closeicon}
                                    >
                                      <CloseIcon style={{ fontSize: '18px' }} />
                                    </IconButton>
                                  </Grid>
                                  <Grid item md={4} />
                                </Grid>
                              </>
                            ) : (
                              <>
                                {!row.saved && (
                                  <KenButton
                                    variant="contained"
                                    color="primary"
                                    onClick={() =>
                                      onToggleEditMode('edit', row.id, index)
                                    }
                                    style={{
                                      textTransform: 'none',
                                      background: 'none',
                                      color: '#000',
                                      boxShadow: 'none',
                                    }}
                                  >
                                    {/* Edit */}
                                    <span>
                                      <FaRegEdit style={{ fontSize: '20px' }} />
                                    </span>
                                  </KenButton>
                                )}
                                {row.saved && (
                                  <>
                                    <KenButton
                                      variant="contained"
                                      color="primary"
                                      onClick={() =>
                                        handleSubject('save', rows, index)
                                      }
                                    >
                                      Save
                                    </KenButton>
                                  </>
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    {' '}
                    <TableCell
                      className={classes.noDataFound}
                      colSpan={6}
                      align="center"
                    >
                      {noData}
                    </TableCell>{' '}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </KenCard>
        </>
      )}
    </Grid>
  );
}
