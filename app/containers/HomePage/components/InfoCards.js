import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KEY_USER_TYPE } from '../../../utils/constants';
import Attendance from '../../../assets/icons/Card/Clock.svg';
import kpiBackgroundImg from '../../../assets/icons/Card/kpiBgimg.png';
import Students from '../../../assets/icons/Card/studentsCard.svg';
import AssignmentIcon from '../../../assets/icons/Card/Assignments.svg';
import GradeIcon from '../../../assets/icons/Card/Grades.svg';
import AssessmentIcon from '../../../assets/icons/Card/Assesments.svg';
import Routes from '../../../utils/routes.json';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import {
  getAttendanceClassConducted,
  getAttendanceInfo,
  getAttendancePercentage,
  getStudentsCount,
} from '../../../utils/ApiService';
import KenDialog from '../../../global_components/KenDialog';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { getUserDetails } from '../../../utils/helpers/storageHelper';

const useStyles = makeStyles(theme => ({
  paperStats: {
    padding: '8px 12px',
    borderRadius: 3,
    boxShadow: `0px 0px 9px ${theme.palette.KenColors.shadowColor}`,
    background: theme.palette.KenColors.kpiBackground,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
    backgroundSize: '100%',
    [theme.breakpoints.only('xs')]: {
      padding: 8,
      minHeight: 80,
    },
  },
  statsTextItem: {
    flexGrow: 1,
  },
  statsText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#3F4A59',
    [theme.breakpoints.only('xs')]: {
      fontSize: '24px',
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: '36px',
    },
  },
  statsSubText: {
    fontSize: '12px',
    color: '#3F4A59',
  },

  statsHeaderBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsImageBox: {
    height: '45px',
    width: '45px',
    background: '#F5F6FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '25px',
  },

  statsImage: {
    height: 20,
    width: 20,
    [theme.breakpoints.down('sm')]: {
      height: 20,
      width: 20,
    },
    [theme.breakpoints.down('xs')]: {
      height: 20,
      width: 20,
    },
  },

  link: {
    textDecoration: 'none',
  },
  contentDisbled: {
    textDecoration: 'none',
    pointerEvents: 'none',
  },

  breakdownTitle: { fontWeight: 'bold' },
  hover: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function InfoCards(props) {
  const { grade, assessments, assignments } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const [stats, setStats] = React.useState();

  const user = getUserDetails();
  const [attendanceBreakdown, setAttendanceBreakdown] = useState([]);
  const [
    attendanceBreakdownModal,
    setAttendanceBreakdownModal,
  ] = React.useState(false);
  const [attendance, setAttendance] = useState();
  const [classConducted , setClassConducted]=useState();
  const [student, setStudent] = useState();
  const ContactId = JSON.parse(localStorage.getItem('userDetails'))
  React.useEffect(() => {
    const params = `?facultyId=${user.ContactId}`;

      if (user.Type == KEY_USER_TYPE.faculty) {
        getAttendanceClassConducted(params)
          .then(res => {
            console.log('check', res);
            let classConducted = res?.data?.conducted;
            setClassConducted(classConducted);
          })
          .catch(err => {
            console.log(err);
          });
          getStudentsCount(user.ContactId)
          .then(res => {
            console.log('check', res);
            let student = res?.data?.studentCount;
            setStudent(student);
          })
          .catch(err => {
            console.log(err);
          });

      }else if(user.Type == KEY_USER_TYPE.student){
        getAttendanceInfo(user.ContactId)
        .then(res => {
          setAttendance(
            res?.AttendancePercentageForAll ? res.AttendancePercentageForAll : 0
          );
          console.log('attendanceDetails', res);
        })
        .catch(e => {
          console.log('eeeeeeeeee', e);
        });
      }
  }, []);

  useEffect(() => {
    if (
      user &&
      (user?.Type === KEY_USER_TYPE?.student ||
        user?.Type === KEY_USER_TYPE?.parent)
    ) {
      const studentStats = [
        {
          text: `${attendance === undefined ? '--' : attendance} %`,
          subLine: t('Attendance'),
          image: `${Attendance}`,
          backImage: `${kpiBackgroundImg}`,
        },
        {
          text: `0`,
          subLine: 'GPA',
          image: `${GradeIcon}`,
          backImage: `${kpiBackgroundImg}`,
        },
        {
          text: `${
            assignments === undefined ? '--' : assignments?.length || 0
          }`,
          subLine: t('Assignments'),
          image: `${AssignmentIcon}`,
          backImage: `${kpiBackgroundImg}`,
        },
        {
          text: `${
            assessments === undefined ? '--' : assessments?.length || 0
          }`,
          subLine: t('Assessments'),
          image: `${AssessmentIcon}`,
          backImage: `${kpiBackgroundImg}`,
        },
      ];
      setStats(studentStats);
    } else if (user && user.Type === KEY_USER_TYPE.faculty) {
      const facultyStats = [
        {
          text: `${student === undefined ? '--' : student}`,
          subLine: t('headings:Students'),
          image: `${Students}`,
          backImage: `${kpiBackgroundImg}`,
        },
        {
          text: `${classConducted === undefined ? '--' : classConducted}`,
          subLine: t('Classes_Conducted'),
          image: `${Attendance}`,
          backImage: `${kpiBackgroundImg}`,
          data: attendanceBreakdown,
        },
        {
          text: `${assignments === undefined ? '--' : assignments.length || 0}`,
          subLine: t('Assignments'),
          image: `${AssignmentIcon}`,
          backImage: `${kpiBackgroundImg}`,
        },
        {
          text: `${assessments === undefined ? '--' : assessments.length || 0}`,
          subLine: t('Assessments'),
          image: `${AssessmentIcon}`,
          backImage: `${kpiBackgroundImg}`,
        },
      ];
      setStats(facultyStats);
    }
  }, [
    user,
    attendance,
    grade,
    assignments,
    assessments,
    student,
    attendanceBreakdown,
  ]);
  return (
    <>
      {stats &&
        stats.map(el => (
          <Grid item xs={6} sm={6} md={3}>
            <div
              className={clsx({
                [classes.hover]: el?.data?.length > 0,
              })}
              onClick={() => {
                if (el?.data?.length > 0) {
                  setAttendanceBreakdownModal(true);
                }
              }}
            >
              <Link
                className={
                    (el.subLine === t('Attendance') || el.subLine === t('headings:Students') ) 
                    ? classes.link
                    : classes.contentDisbled
                }
                { ...((el.subLine === t('Attendance')) ? { to: `/${Routes.attendance}`} : 
                       el.subLine === t('headings:Students') ? { to: `/${Routes.studentsByOffering}`} :null)
                }
              
                //   ? {
          
              >
                <Paper
                  className={classes.paperStats}
               
                  style={{ background: '#fff', borderRadius: 12 }}
                >
                  <Grid container spacing={1} style={{ textAlign: 'center' }}>
                    <Grid item className={classes.statsHeaderBox}>
                      <Box className={classes.statsImageBox}>
                        <img src={el.image} className={classes.statsImage} />
                      </Box>
                    </Grid>
                    <Grid item md={8} sm={8} xs={8}>
                      <Grid className={classes.statsTextItem}>
                        <Typography
                          className={clsx(
                            classes.statsText,
                            classes[el.className]
                          )}
                        >
                          {el.text}
                        </Typography>
                      </Grid>
                      <Grid>
                        <Typography
                          className={classes.statsSubText}
                          color="textSecondary"
                        >
                          {el.subLine}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                </Paper>
              </Link>
            </div>
          </Grid>
        ))}
      {attendanceBreakdown.length > 0 && (
        <KenDialog
          open={attendanceBreakdownModal}
          handleClose={() => {
            setAttendanceBreakdownModal(false);
          }}
          dialogActionFlag={false}
        >
          <Box p={1}>
            <Grid container justify="space-between">
              <Grid item>
                <Typography className={classes.breakdownTitle}>
                  {t('headings:Class_Name')}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.breakdownTitle}>
                  {t('Classes_Conducted')}
                </Typography>
              </Grid>
            </Grid>
            {attendanceBreakdown.map(elem => {
              return (
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography>{elem.courseName}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography style={{ marginRight: 12 }}>
                      {elem.classesAttended}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Box>
        </KenDialog>
      )}
    </>
  );
}
