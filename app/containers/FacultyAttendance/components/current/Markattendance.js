import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  getCompletedEnrollment,
  getStudentList,
  postAttendanceEvent,
} from '../../../../utils/ApiService';
import { useAppContext } from '../../../../utils/contextProvider/AppContext';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import '../../styles.scss';
import { original } from 'immer';

const KenInputField = React.lazy(() => import('../../../../components/KenInputField'));
const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const KenSelect = React.lazy(() => import('../../../../components/KenSelect'));
const KenSnackbar = React.lazy(() => import('../../../../components/KenSnackbar'));
const KenButton = React.lazy(() => import('../../../../global_components/KenButton/index'));
const KenCard = React.lazy(() => import('../../../../global_components/KenCard'));
const KenCheckbox = React.lazy(() => import('../../../../global_components/KenCheckbox'));
const KenGrid = React.lazy(() => import('../../../../global_components/KenGrid'));

const useStyles = makeStyles(theme => ({
  header: {
    background: 'transparent',
    color: theme.palette.KenColors.primary,
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
      border: '1px solid #D2E1E9',
    },
  },
  seaField: {
    margin: '16px 0px 0px 0px',

    '& > div > div': {
      border: '1px solid #DFE1E6 ',
      height: '40px',
      borderRadius: '8px',
    },
  },
  filterBar: {
    [theme.breakpoints.only('lg')]: {
      width: '30%',
    },
    [theme.breakpoints.only('md')]: {
      width: '50%',
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  subjectBtn: {
    background: 'FAFBFC',
    [theme.breakpoints.only('md')]: {
      width: '100%',
    },
    [theme.breakpoints.only('xs')]: {
      width: '100%',
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
  },
  rad: {
    borderRadius: '8px',
  },
  tableValue: {
    fontSize: 14,
    fontWeight: 400,
  },
}));
export default function MarkAttendance1({ data, trigger, setTrigger,setValue }) {
  const classes = useStyles();

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [subject, setSubject] = useState([]);
  const [currentSubject, setCurrentSubject] = useState();
  const [open, setOpen] = useState(false);
  const [Opendialogue, setOpendialogue] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentView, setStudentView] = useState(true);
  const [sessionId, setSessionId] = useState();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [reasonTypeOptions, setReasonTypeOptions] = useState([]);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [noData, setNoData] = useState();
  const [cheackbox, setcheackbox] = useState();
  const {
    state: { userDetails },
  } = useAppContext();

  const handleOpen = () => {
    setOpendialogue(true);
  };

  const handleClose = () => {
    setOpendialogue(false);
  };

  const onclickMarkAttendance = (row, data, rowData) => {
    console.log(row?.original?.courseName);
    setStudentView(false);
    setSessionId(row['original']?.id);
    setLoading(true);
    setNoData(t('messages:Fetching_Data'));
    setCurrentSubject(row?.original?.courseName);
    getStudentList(row['original'].courseOfferingId)
      .then(res => {
        console.log(res?.data?.studentsList?.length);
        let data = [];
        let reasonsList = [];
        if (res?.message !== 'No Data Found') {
          let details = res?.data?.studentsList;
          details.map(el => {
            data.push({
              checked: true,
              idNumber: el?.contactRegNumber,
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
        if (res?.data?.studentsList?.length === 0) {
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

  console.log('cheackbox', cheackbox);
  const columns = [
    {
      Header: 'Subject',
      accessor: 'subject',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Section',
      accessor: 'section',
      disableGlobalFilter: true,
    },
    {
      Header: 'Start Time',
      accessor: 'startTime',
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'End Time',
      accessor: 'endTime',
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },

    {
      Header: 'Mark Attendance',
      accessor: 'attendance',
      Cell: ({ value, row }) => {
        return (
          <>
            <KenButton
              variant="contained"
              color="primary"
              style={{ marginRight: '15px' }}
              className={classes.addButton}
              onClick={() => onclickMarkAttendance(row, data, row.original)}
            >
              {'Mark Attendance'}
            </KenButton>
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const columns2 = [
    {
      Header: '',
      accessor: 'checked',
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KenCheckbox
              name={`checkbox`}
              className={classes.checkbox}
              value={value}
              onChange={event => selectedCheckBoxItem(event, row, students)}
              color="primary"
            />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'ID Number',
      accessor: 'idNumber',
      disableGlobalFilter: false,
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Student Name',
      accessor: 'contactName',
      disableGlobalFilter: false,
      Cell: ({ value }) => {
        return <Typography className={classes.tableValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Reason Type',
      accessor: 'Reasons',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <KenSelect
            value={value}
            options={reasonTypeOptions}
            placeholder={'Select'}
            onChange={e => {
              handleReasons(e, row, students);
            }}
            disabled={row.original.checked === false ? false : true}
          />
        );
      },
    },
    {
      Header: 'Description',
      accessor: 'Description',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <KenInputField
            value={value}
            placeholder={'Enter Description'}
            onChange={e => {
              handleAttendenceDescription(e, row, students);
            }}
            disabled={row.original.checked === false ? false : true}
          />
        );
      },
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
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setSubject([]);
        setLoading(false);
      });
  }, []);

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
        setOpendialogue(false);
        setTrigger(!trigger);
        setLoading(false);
        handleSnackbarOpen('success', 'Attendance added sucessfully');
        setValue(1)
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
  const selectedCheckBoxItem = (event, row, students) => {
    console.log('rowrowrowrowrowrow', row);
    let val = event.target.checked;
    students[row.index]['checked'] = val;
    setStudents([...students]);
    setcheackbox(val);
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
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          />
          <Grid container xs={12}>
            <Grid className={classes.RightBox} style={{ marginTop: '25px' }}>
              <KenCard
                elevation={0}
                paperStyles={{ padding: 0, boxShadow: 'none' }}
              >
                <div className="KenDiv">
                  <KenGrid
                    columns={columns}
                    data={data}
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
      ) : (
        <>
          {/* dialog box */}
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
                <KenButton onClick={handleSubmit} variant="primary">
                  {t('labels:Submit')}
                </KenButton>
              </DialogActions>
            </div>
          </Dialog>
          {/* end dialog */}
          <Grid className={classes.RightBox}>
            <Grid
              container
              spacing={2}
              xs={12}
              className={classes.wrapper_content}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                right: 25,
                width: '100%',
                border: 'none',
                marginLeft: '-1px',
              }}
            >
              <Grid item md={3}>
                <KenInputField
                  label="Subject"
                  value={currentSubject}
                  required={true}
                  disabled={true}
                />
              </Grid>
              <Grid item md={3}>
                <KenInputField
                  name={'date'}
                  label="Date"
                  value={moment(data[0]?.startDate).format('DD-MM-YYYY')}
                  required={true}
                  disabled={true}
                />
              </Grid>

              <Grid item style={{ width: '5%' }} />
              <Grid
                item
                className={classes.seaField}
                style={{ width: '25%' }}
              />
              <Grid
                item
                style={{
                  marginTop: '16px',
                  padding: '8px 0px 8px 8px',
                  width: '20%',
                }}
              >
                <Box display="flex" justifyContent="flex-end" my={1}>
                  <KenButton onClick={onBackStudentsView} variant="secondary">
                    {t('labels:Back')}
                  </KenButton>

                  <KenButton
                    onClick={handleOpen}
                    variant="primary"
                    style={{ marginLeft: '8px' }}
                  >
                    {t('labels:Submit')}
                  </KenButton>
                </Box>
              </Grid>
            </Grid>

            <Box style={{ padding: 0, boxShadow: 'none', marginTop: '25px' }}>
              <div className={'KenStudentsDiv ' + classes.posisear}>
                <KenGrid
                  columns={columns2}
                  data={students}
                  pagination={{ disabled: true }}
                  toolbarDisabled={false}
                  isCollasable={false}
                  noDataText={noData}
                  searchEnabled={true}
                />
              </div>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
}
