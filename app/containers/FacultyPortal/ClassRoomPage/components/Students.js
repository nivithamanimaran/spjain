import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Checkbox,
  Typography,
  Grid,
  Button,
  makeStyles,
} from '@material-ui/core';
import {
  getAttendanceByCourseOffering,
  getStudentListByCourseOffering,
  getStudents,
  postAttendance,
  postAttendanceByCourseOffering,
} from '../../../../utils/ApiService';
import classNames from 'classnames';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import moment from 'moment';
import ArrowForwardIosIcon from '../../../../assets/icons/Chevronright.svg';
import { Link } from 'react-router-dom';
import KenSnackbar from '../../../../components/KenSnackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTranslation } from 'react-i18next';
import { KEY_STATUS } from '../../../../utils/constants';
import Routes from '../../../../utils/routes.json';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

const GreenCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.KenColors.neutral60,
    '&$checked': {
      color: theme.palette.KenColors.tertiaryGreen300,
    },
  },
  checked: {},
}))(props => <Checkbox color="default" {...props} />);
const array = [1, 2, 3, 4];

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  header: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.palette.KenColors.neutral100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerModify: {
    maxHeight: '55vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '5px',
      height: '5px',
    },
    '&::-webkit-scrollbar-track': {
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#C4C4C4',
      borderRadius: '10px',
      opacity: '0.1',
      outline: `1px solid ${theme.palette.KenColors.neutral100}`,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: ` ${theme.palette.KenColors.neutral100}`,
    },
  },

  Name: {
    fontSize: '14px',
    color: theme.palette.KenColors.primary,
  },
  NameID: {
    fontSize: '12px',
    lineHeight: '14px',
    color: theme.palette.KenColors.neutral400,
  },
  NameID2: {
    fontSize: '12px',
    color: theme.palette.KenColors.neutral400,
    textAlign: 'right',
    margin: '10px 0px',
  },
  circle: {
    width: '36px',
    height: '36px',
    lineHeight: '33px',
    borderRadius: '55%',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
  },
  subHeading: {
    fontSize: 14,
    color: theme.palette.KenColors.neutral100,
    textAlign: 'center',
  },
  SelectAll: {
    marginRight: '10px',
    color: '#505F79',
    fontSize: '14px',
  },
  studentSubHeading: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  headerBorder: {
    borderBottom: `0.06px solid ${theme.palette.KenColors.neutral400}`,
  },
}));

export default function Students(props) {
  const { t } = useTranslation();
  const { courseId, date, id, courseData } = props;
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allCheck, setAll] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState(KEY_STATUS.success);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [orderType, setOrderType] = useState('ascending');
  const [checkBoxDisabled, setCheckBoxDisabled] = useState(false);

  const userDetails = getUserDetails();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  useEffect(() => {
    if (students?.length > 0) {
      let s = students?.sort((a, b) => a?.name.localeCompare(b?.name));
      if (orderType === 'ascending') {
        setStudents(s);
      } else {
        setStudents(s.reverse());
      }
    }
  }, [orderType, students]);

  useEffect(() => {
    setLoading(true);
    setCheckBoxDisabled(false);
    setAll(false);
    async function fetchData() {
      if (courseId) {
        try {
          getStudentListByCourseOffering(courseId).then(res => {
            if (res?.length > 0) {
              res?.forEach(item => {
                item.isChecked = false;
              });
              getAttendanceByCourseOffering(
                courseId,
                courseData?.startTime,
                courseData?.endTime,
                moment().format('MM/DD/YYYY')
              )
                .then(resp => {
                  console.log(resp);
                  if (resp?.success == 'true' && resp?.data?.length > 0) {
                    resp?.data?.map(el => {
                      if (el?.attendanceStatus === 'Present') {
                        let index = res?.findIndex(student => {
                          return student?.contactId === el?.contactId;
                        });
                        res[index].isChecked = true;
                        setCheckBoxDisabled(true);
                        setAll(false);
                      }
                    });
                  } else {
                    setCheckBoxDisabled(false);
                  }
                  const s = res?.sort((a, b) => a.name.localeCompare(b.name));
                  setStudents(s);
                  setLoading(false);
                })
                .catch(err => {
                  console.log(err);
                  const s = res?.sort((a, b) => a.name.localeCompare(b.name));
                  setStudents(s);
                  setLoading(false);
                });
            } else {
              setLoading(false);
              setCheckBoxDisabled(true);
              setStudents([]);
            }
          });
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [courseId, courseData]);

  const handleSelect = async (e, student) => {
    if (e.target.name === 'checkAll') {
      var list = [];
      student.forEach(element => {
        element.isChecked = e.target.checked;
        list.push(element);
      });
      if (e.target.checked) {
        setSelectedStudents(list);
      } else {
        setSelectedStudents([]);
      }

      setAll(e.target.checked);
    } else {
      students.find(item => item.contactId === student.contactId).isChecked =
        e.target.checked;
      if (e.target.checked) {
        setSelectedStudents([...selectedStudents, student]);
      } else {
        setSelectedStudents(
          selectedStudents.filter(el => el.contactId !== student.contactId)
        );
      }
      setStudents(students);
      const All = students.every(item => {
        return item.isChecked === true;
      });
      setAll(All);
    }
  };

  const handleSubmit = async () => {
    if (selectedStudents.length) {
      setLoading(true);
      const parsedData = students.map(el => {
        return {
          couseOfferingId: el.couseOfferingId,
          contactId: el.contactId,
          dateval: moment().format('MM/DD/YYYY'),
          startTime: courseData.startTime,
          endTime: courseData.endTime,
          courseConnectionId: el.courseConnectionId,
          attendanceStatus: el.isChecked === true ? 'Present' : 'Absent',
        };
      });
      parsedData.push({
        couseOfferingId: courseId,
        contactId: userDetails.ContactId,
        dateval: moment().format('MM/DD/YYYY'),
        startTime: courseData.startTime,
        endTime: courseData.endTime,
        courseConnectionId: id,
        attendanceStatus: 'Present',
      });

      postAttendanceByCourseOffering({
        attendanceRequest: [...parsedData],
      })
        .then(res => {
          if (res) {
            handleSnackbarOpen(
              KEY_STATUS.success,
              t('messages:Attendance_Added_Successfully')
            );
            setCheckBoxDisabled(true);
            setLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          handleSnackbarOpen(KEY_STATUS.failed, t('messages:Error_Attendance'));
          setLoading(false);
        });
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.headerBorder} p={1}>
        <Grid container justify="space-around">
          <Grid item xs={7}>
            {' '}
            <Typography align="center" color="primary">
              {t('headings:Attendance')} - {moment(date).format('DD MMM')}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            {loading == false && (
              <Box display="flex" justifyContent="flex-end">
                {selectedStudents && selectedStudents.length ? (
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={checkBoxDisabled}
                  >
                    {t('labels:Submit')}
                  </Button>
                ) : (
                  <Button variant="text" size="small" disabled>
                    {t('labels:Submit')}
                  </Button>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box /* style={{borderBottom:' 0.06px solid #505F79'}} */ px={1}>
        <Grid container justify="space-around" alignItems="center">
          <Grid item xs={2}>
            <Typography>
              <FormControlLabel
                control={
                  <GreenCheckbox
                    icon={<CheckBoxOutlineBlankOutlinedIcon />}
                    checkedIcon={<CheckBoxOutlinedIcon />}
                    onClick={e => handleSelect(e, students)}
                    name="checkAll"
                    checked={allCheck}
                    disabled={checkBoxDisabled}
                  />
                }
              />
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={10}
            className={classes.studentSubHeading}
            onClick={() => {
              orderType === 'ascending'
                ? setOrderType('descending')
                : setOrderType('ascending');
            }}
          >
            <Typography>
              {t('headings:Students')}{' '}
              {students && loading === false ? `(${students.length})` : ''}
            </Typography>
            {orderType === 'ascending' ? (
              <ArrowUpwardIcon />
            ) : (
              <ArrowDownwardIcon />
            )}
          </Grid>
        </Grid>
      </Box>
      {loading ? (
        <Grid container justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Box>
          <Box className={classes.root}>
            <KenSnackbar
              message={snackbarMessage}
              severity={snackbarSeverity}
              autoHideDuration={2000}
              open={openSnackbar}
              handleSnackbarClose={handleSnackbarClose}
              position="Bottom-Right"
            />
          </Box>
          {/* <Grid container spacing={2} container alignItems="center">
            <Grid item xs>
              <Typography className={classes.NameID}>
                {t('headings:Name')}
              </Typography>
            </Grid>
            <Grid item xs>
              <Typography>
                <span className={classes.SelectAll}>
                  {t('headings:Select_All')}
                </span>
                <FormControlLabel
                  control={
                    <GreenCheckbox
                      icon={<CheckBoxOutlineBlankOutlinedIcon />}
                      checkedIcon={<CheckBoxOutlinedIcon />}
                      onClick={e => handleSelect(e, students)}
                      name="checkAll"
                      checked={allCheck}
                    />
                  }
                />
              </Typography>
            </Grid>
          </Grid> */}

          {students.length > 0 ? (
            <div className={classes.containerModify}>
              {students.map(student => (
                <Box
                  p={1}
                  className={'bottomDivider'}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justify="space-between"
                  >
                    <Grid item xs={1}>
                      <Typography>
                        <FormControlLabel
                          control={
                            <GreenCheckbox
                              icon={<CheckBoxOutlineBlankOutlinedIcon />}
                              checkedIcon={<CheckBoxOutlinedIcon />}
                              onClick={e => handleSelect(e, student)}
                              name="single"
                              checked={student.isChecked}
                              disabled={checkBoxDisabled}
                            />
                          }
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={2} p={1}>
                      <div className={classes.circle}>
                        {student.name.charAt(0)}
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={7}
                      sm={7}
                      md={7}
                      lg={7}
                      container
                      alignItems="center"
                    >
                      <Link
                        style={{ textDecoration: 'none' }}
                        to={{
                          pathname: `/${Routes.classroom}/${
                            Routes.studentDetails
                          }`,
                          state: {
                            student: student,
                          },
                        }}
                      >
                        <Typography color="primary" className={classes.Name}>
                          {student.name}
                        </Typography>

                        <Typography>
                          <Box fontSize={12} color="text.secondary">
                            {student.regnumber}
                          </Box>
                        </Typography>
                      </Link>
                    </Grid>
                    <Grid
                      item
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      xs={2}
                      sm={2}
                      md={2}
                      lg={2}
                    >
                      <Link
                        style={{ textDecoration: 'none' }}
                        to={{
                          pathname: `/${Routes.classroom}/${
                            Routes.studentDetails
                          }`,
                          state: {
                            student: student,
                          },
                        }}
                      >
                        <img src={ArrowForwardIosIcon} />
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </div>
          ) : (
            <Typography className={classes.subHeading}>
              {t('No_Students_Found')}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
