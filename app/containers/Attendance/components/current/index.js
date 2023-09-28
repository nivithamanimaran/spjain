import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  Typography,
  useTheme,
  Box,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import {
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
//Global Components
import KenHeader from '../../../../global_components/KenHeader/index';
import KenButton from '../../../../global_components/KenButton/index';
import KenSnackBar from '../../../../components/KenSnackbar';
import KenCard from '../../../../global_components/KenCard';
import KenGrid from '../../../../global_components/KenGrid';
import KenDateTimePicker from '../../../../global_components/KenDateTimePicker';
import KenGridEditable from '../../../../global_components/kenGridEditable/kenGridEditable';
import KenLoader from '../../../../components/KenLoader';
import CurrentData from './data.json';
//  import '../style.css';
import KenSelect from '../../../../global_components/KenSelect';
import { KEY_ATTENDANCE_PROGRESS_VALUES } from '../../../../utils/constants';
import KenDialogBox from '../../../../components/KenDialogBox/index';
import DetailsPopup from '../DetailsPopup/index';
import { getAttendanceInfo } from '../../../../utils/ApiService';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import './current.css';
import { useHistory } from 'react-router-dom';
import Routes from '../../../../utils/routes.json';
import SessionCards from '../sessionCards';
import moment from 'moment';
import KenDatePicker from '../../../../components/KenDatePicker';
import { AiFillEye } from 'react-icons/ai';
import { red } from '@material-ui/core/colors';
import { WindowScrollController } from '@fullcalendar/react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
    padding: '10px',
    [theme.breakpoints.down('sm')]: {
      padding: '0px !important',
    },
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      background: 'none !important',
    },
    '& div > div > table > thead': {
      background: '#F1F5FA',
    },
    '& div > div > table > thead > tr > th': {
      color: '#092682',
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'none !important',
      borderBottom: 'none !important',
      ['@media (max-width:600px)']: {
        fontSize: '9px',
      },
    },
    '& > div ': {
      boxShadow: 'none',
      border: '1px solid #D2E1E9',
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
    // color: '#0077FF',
    fontSize: '12px',
  },
  textContent: {
    color: '#092682',
    fontSize: '12px',
  },
  sessionBoxes__wrap: {},
  sessionBoxes: {
    width: '150px',
    height: 69,
    border: '1px solid #092682',
    marginRight: 20,
    textAlign: 'left !important',
  },
  session__subtext: {
    margin: 0,
  },
  root: {
    // minHeight: '100vh',
    width: '100%',
    paddingLeft: 20,
    [theme.breakpoints.only('xs')]: {
      padding: '0px 0px 20px 0px',
    },
  },
  maskWrap: {
    position: 'relative',
    height: '100%',
    paddingTop: '8px',
  },
  grid: {
    [theme.breakpoints.only('xs')]: {
      margin: '0px 0px 0px -8px',

      '& > .MuiGrid-item': {
        padding: '8px 2px !important',
      },
    },

    '& div > div> div > div > div > div': {
      textAlign: 'left',
      fontWeight: 'bold',
    },
  },
  datepickertext: {
    '& div > div > p': {
      fontWeight: 'bold',
      color: '#808080',
      fontSize: '11px',
      ['@media (max-width:600px)']: {
        fontSize: '10px',
      },
    },
  },
  datePickInput: {
    '& > div': {
      paddingRight: '0px',
    },
  },
  sessioncard: {
    padding: '0px 5px 0px 15px',
    ['@media (max-width:600px)']: {
      paddingLeft: '0px !important',
    },
  },
  wrapper_content: {
    padding: '0 10px',
    [theme.breakpoints.down('xs')]: {
      padding: '0px',
    },
    '& > div ': {
      justifyContent: 'space-around',
    },
  },
  headerValue: {
    fontSize: 14,
    fontWeight: 400,
  },
  addButton: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  resp: {
    [theme.breakpoints.down('md')]: {
      marginTop: '2em',
    },
  },
}));
export default function GradeBook(props) {
  const classes = useStyles();
  const kenTheme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [currentMonth, setCurrentMonth] = React.useState('Select');
  const [open, setOpen] = React.useState(false);
  const [courseData, setCourseData] = React.useState([]);
  const [courseDataSingle, setCourseDataSingle] = React.useState([]);
  const [totalAtnd, setTotalAtnd] = React.useState(0);
  const [absentSession, setAbsenceAttendance] = React.useState(0);
  const [courseOfferingId, setCourseOfferingId] = React.useState();
  const [sessions, setSessions] = React.useState(0);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [selectedData, setSelectedData] = React.useState();
  const [noData, setNoData] = useState(t('messages:Fetching_Data'));
  const userDetails = getUserDetails();
  console.log('user==========', userDetails);
  // const getWindowWidth = window.innerWidth;
  // console.log(getWindowWidth);
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));
  const navigate = useHistory();
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

  const getCircleColor = value => {
    if (!Number(value)) return kenTheme.palette.KenColors.kenBlack;
    if (
      value >= KEY_ATTENDANCE_PROGRESS_VALUES.RANGE_MIN &&
      value <= KEY_ATTENDANCE_PROGRESS_VALUES.RANGE_MAX
    ) {
      return kenTheme.palette.KenColors.orange;
    } else if (value <= KEY_ATTENDANCE_PROGRESS_VALUES.RANGE_MIN) {
      return kenTheme.palette.KenColors.red;
    } else {
      return kenTheme.palette.KenColors.green;
    }
  };

  const columns = [
    {
      Header: 'Subject Name',
      accessor: 'subjectName',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Section',
      accessor: 'section',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Total Attendance',
      accessor: 'totalAttendance',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={value}
                size={40}
                //   thickness={6}
                circle={getCircleColor(+value)}
              />
              <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="textSecondary"
                >
                  {value}%
                </Typography>
              </Box>
            </Box>
          </div>
        );
      },
    },
    {
      Header: 'View',
      accessor: 'view',
      Cell: ({ value, row }) => {
        return (
          <>
            <div
              variant="contained"
              color="primary"
              style={{
                marginRight: '15px',
                width: '20px',
                height: '13px',
                background: 'none',
                boxShadow: 'none',

                // fontSize: 12,
                // width: 120,
              }}
              className={classes.addButton}
              onClick={async () => {
                //onDailogOpen(value, row)
                navigate.push('/GradeBookview', {
                  selectedData: { index: row.index },
                  dataSingleCourse: courseDataSingle,
                  courseOfferingId: value,
                  startDate: startDate,
                  endDate: endDate,
                });
                // window.location.href=Routes?.GradeBookview;
              }}
            >
              {/* {'VIEW DETAILS'} */}
              <AiFillEye
                style={{ color: '#000000', fontSize: '20px', width: 28 }}
              />
            </div>
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const handleChangedStartDate = date => {
    let startDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setStartDate(startDate);
  };

  const handleChangedEndDate = date => {
    let endDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setEndDate(endDate);
  };

  React.useEffect(() => {
    setNoData(t('messages:Fetching_Data'));
    setCourseData([]);
    const selectedStartDate = startDate ? `${startDate}.000Z` : '';
    const selectedEndDate = endDate ? `${endDate}.000Z` : '';
    getAttendanceInfo(userDetails.ContactId, selectedStartDate, selectedEndDate)
      .then(res => {
        setLoading(true);
        setTotalAtnd(
          res?.AttendancePercentageForAll ? res?.AttendancePercentageForAll : 0
        );
        setAbsenceAttendance(
          res?.AbsentClassesForAll ? res?.AbsentClassesForAll : 0
        );
        setSessions(res?.TotalClassesForAll ? res?.TotalClassesForAll : 0);
        // setAttendance(res?.AttendancePercentageForAll);
        setCourseDataSingle(res.courseLevelAttendanceList);
        setCourseData(
          res.courseLevelAttendanceList.map(item => {
            console.log('item.CourseOfferingId', item.CourseOfferingId);
            return {
              subjectName: item.CourseName,
              section: item.SectionId,
              view: item.CourseOfferingId,
              totalAttendance: item.AttendancePercentage,
            };
          })
        );
        setNoData(t('No_Records'));
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        setNoData(t('No_Records'));
      });
  }, [startDate, endDate]);

  const changeLang = e => {
    setCurrentMonth(e.target.value);
  };

  const onDailogOpen = (id, row) => {
    setCourseOfferingId(id);
    console.log('id===============', id, row);
    setSelectedData(row);

    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <Grid container xs={12}>
      {loading && <KenLoader />}
      <Grid
        container
        xs={12}
        className={classes.wrapper_content}
        style={{
          //   padding: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Grid container xs={12} md={12} sm={12} className="box">
          {isMobileScreen ? (
            <Grid
              container
              xs={12}
              md={12}
              sm={12}
              spacing={2}
              className={
                classes.datepickertext + ' main-date-part' + classes.mobDate
              }
            >
              <Grid
                item
                md={6}
                xs={6}
                sm={6}
                style={{ padding: '0px 4px 0px 0px' }}
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Start Date</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <KenDatePicker
                      name={'startDate'}
                      // label="START DATE"
                      value={startDate}
                      inputBaseRootClass={classes.datePickInput}
                      sx={{ fontWeight: 'bold' }}
                      // required={true}
                      onChange={e => handleChangedStartDate(e)}
                      maxDate={endDate ? new Date(endDate) : null}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
              {/* <Grid
                item
                md={6}
                xs={6}
                sm={6}
                style={{ padding: '0px 0px 0px 4px' }}
              >
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>End Date</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <KenDatePicker
                      name={'endDate'}
                      // label="END DATE"
                      inputBaseRootClass={classes.datePickInput}
                      value={endDate}
                      // required={true}
                      onChange={e => handleChangedEndDate(e)}
                      minDate={new Date(startDate)}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid> */}
            </Grid>
          ) : (
            <Grid
              container
              xs={12}
              md={6}
              sm={12}
              className={
                classes.datepickertext + ' main-date-part' + classes.deskdate
              }
            >
              <Grid item md={6} xs={6} sm={6}>
                <KenDatePicker
                  name={'startDate'}
                  label="START DATE"
                  placeholder={'dd-mm-yyyy'}
                  value={startDate}
                  inputBaseRootClass={classes.datePickInput}
                  sx={{ fontWeight: 'bold' }}
                  required={false}
                  onChange={e => handleChangedStartDate(e)}
                  maxDate={endDate ? new Date(endDate) : null}
                  className={classes.deskDate}
                />
              </Grid>
              {/* <Grid item md={6} xs={6} sm={6}>
                <div style={{ marginLeft: 15 }}>
                  <KenDatePicker
                    name={'endDate'}
                    label="END DATE"
                    placeholder={'dd-mm-yyyy'}
                    inputBaseRootClass={classes.datePickInput}
                    value={endDate}
                    required={false}
                    onChange={e => handleChangedEndDate(e)}
                    minDate={new Date(startDate)}
                    className={classes.deskDate}
                  />
                </div>
              </Grid> */}
            </Grid>
          )}
          <Grid xs={12} md={6} sm={12} className={classes.sessioncard}>
            {/* cards */}
            <div className={classes.maskWrap}>
              <Grid container spacing={3} classes={{ root: classes.grid }}>
                <SessionCards
                  session={sessions}
                  absentSession={absentSession}
                  totalAttendance={totalAtnd}
                />
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Grid>

      <Grid container xs={12}>
        <Grid className={classes.RightBox}>
          {isMobileScreen ? (
            courseData &&
            courseData.map((s, i) => (
              <KenCard>
                <Grid container>
                  <Grid container xs={6}>
                    <Grid item xs={12}>
                      <Typography>
                        <span style={{ fontWeight: 'bold' }}>Sub Name:</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>{s.subjectName}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={6}>
                    <Grid item xs={12}>
                      <Typography>
                        <span style={{ fontWeight: 'bold' }}>Section:</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>{s.section}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={6} className={classes.resp}>
                    <Grid item xs={12}>
                      <Typography>
                        <span style={{ fontWeight: 'bold' }}>
                          Total Attendance:
                        </span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography>{s.totalAttendance}%</Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={6} className={classes.resp}>
                    <Grid item xs={12}>
                      <Typography>
                        <span style={{ fontWeight: 'bold' }}>Attendance</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <KenButton
                        variant="contained"
                        color="primary"
                        style={{
                          marginRight: '15px',
                          width: '30px',
                          height: '13px',
                          background: '#193389',
                          boxShadow: 'none',
                          fontSize: 10,
                        }}
                        className={classes.addButton}
                        onClick={async () => {
                          navigate.push('/GradeBookview', {
                            selectedData: { index: i },
                            dataSingleCourse: courseDataSingle,
                            courseOfferingId: s.view,
                            startDate,
                            endDate,
                          });
                        }}
                      >
                        {'VIEW'}
                      </KenButton>
                    </Grid>
                  </Grid>
                </Grid>
              </KenCard>
            ))
          ) : (
            <KenCard paperStyles={{ padding: 0, borderRadius: '4px' }}>
              <KenGrid
                columns={columns}
                data={courseData}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
                noDataText={noData}
              />
            </KenCard>
          )}
        </Grid>
      </Grid>

      <KenDialogBox
        open={open}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
        maxWidth="md"
        title=""
        titleStyle={classes.titleHead}
        dialogActionFlag={false}
      >
        <div style={{ padding: 20 }}>
          <DetailsPopup
            selectedData={selectedData}
            dataSingleCourse={courseDataSingle}
            courseOfferingId={courseOfferingId}
            sta={startDate}
            endDates={endDate}
          />
        </div>
      </KenDialogBox>
    </Grid>
  );
}
