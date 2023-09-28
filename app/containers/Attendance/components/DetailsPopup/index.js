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
import { useLocation, useHistory } from 'react-router-dom';
//  import '../style.css';
import KenSelect from '../../../../global_components/KenSelect';
import { getAttendanceEvent } from '../../../../utils/ApiService';
import moment from 'moment';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import SessionCards from '../sessionCards';
import '../current/current.css';
import KenDatePicker from '../../../../components/KenDatePicker';
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
    padding: '10px 30px 40px 30px',
    [theme.breakpoints.down('xs')]: {
      padding: '10px !important',
      background: 'none !important',
    },
    position: 'relative',
    '& div > div > table > thead': {
      background: '#F1F5FA',
    },
    '& div > div > table > thead > tr > th': {
      color: '#092682',
      fontSize: '14px',
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
    textAlign: 'center',
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
    '& > div': {
      ['@media (min-width:600px)']: {
        paddingRight: '21px',
      },
    },
  },
  grid: {
    [theme.breakpoints.only('xs')]: {
      margin: '-12px',

      '& > .MuiGrid-item': {
        padding: 8,
      },
    },
  },
  datepickertext: {
    padding: '0px 16px',
    ['@media (max-width:600px)']: {
      padding: '0px !important',
      margin: '0px',
    },
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
    ['@media (max-width:600px)']: {
      paddingLeft: '0px',
    },
  },
  attBoxpad: {
    padding: '30px',
    ['@media (max-width:600px)']: {
      padding: '20px 0px',
    },
  },
  coursebox: {
    ['@media (max-width:600px)']: {
      background: 'none',
      boxShadow: 'none',
    },
  },
  wrapper_content: {
    '&>div': {
      background: '#fff !important',
      [theme.breakpoints.down('sm')]: {
        background: 'none !important',
        padding: '16px 0px',
      },
      boxShadow: 'none !important',
    },
  },
  headerValue: {
    fontSize: 14,
    fontWeight: 400,
  },
}));
export default function GradeBookcview(props) {
  const values = useLocation();
  const {
    selectedData,
    dataSingleCourse,
    courseOfferingId,
    startDates,
    endDates,
  } = values.state;
  console.log(props);
  // const { selectedData, dataSingleCourse, courseOfferingId, startDates, endDates } = props;
  const classes = useStyles();
  const kenTheme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [eventAttend, setEventAttend] = React.useState([]);
  const [currentMonth, setCurrentMonth] = React.useState('Select');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [noData, setNoData] = useState(t('messages:Fetching_Data'));
  const [totalAtnd, setTotalAtnd] = React.useState(
    dataSingleCourse[selectedData.index]?.AttendancePercentage || 0
  );
  const [absentSession, setAbsenceSession] = React.useState(
    dataSingleCourse[selectedData.index]?.AbsentClasses || 0
  );
  const [sessions, setSessions] = React.useState(
    dataSingleCourse[selectedData.index]?.TotalClasses || 0
  );
  console.log('courseOfferingId', courseOfferingId);
  const navigate = useHistory();
  const userDetails = getUserDetails();

  useEffect(() => {
    if (props?.location?.state?.startDate && props?.location?.state?.endDate) {
      setStartDate(props?.location?.state?.startDate);
      setEndDate(props?.location?.state?.endDate);
    }
  }, [props]);

  // responsiveness
  // responsiveness
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));
  const columns = [
    {
      Header: 'Date Of Absence',
      accessor: 'date',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Reason Type',
      accessor: 'reason',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: 'Reason Description',
      accessor: 'reasontype',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
  ];

  React.useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setNoData(t('messages:Fetching_Data'));
      const users = await getAttendanceEvent(
        userDetails.ContactId,
        // 'a0B0w000004pFZmEAM',
        courseOfferingId,
        startDate ? `${startDate}.000Z` : '',
        endDate ? `${endDate}.000Z` : ''
      );
      let absentData = users.data?.filter(e => e.status === 'Absent');
      let session = users.data.length;
      let absentSession = absentData.length;
      let totalAtnd =
        Math.floor(((session - absentSession) * 100) / session) || 0;

      console.log('session', session);
      console.log('absentSession', absentSession);
      console.log('totalAtnd', totalAtnd);

      setEventAttend(
        absentData.map(item => {
          return {
            subjectName: item.courseName ? item.courseName : '',
            date: item.sessionStartDate
              ? moment(item.sessionStartDate).format('YYYY-MM-DD')
              : '',
            reason: item.reason ? item.reason : '',
            reasontype: item.resonDescription ? item.resonDescription : '',
          };
        })
      );
      setSessions(session);
      setAbsenceSession(absentSession);
      setTotalAtnd(totalAtnd);
      setLoading(false);
      setNoData(t('No_Records'));
    };
    getUsers();

    // const data = [];
    // CurrentData['Current Components'].map(item => {
    //   data.push({
    //     subjectName: item.subjectName,
    //     date: item.date,
    //     reason: item.reason,
    //   });
    // });
    // setData(data);
  }, [startDate, endDate]);
  const changeLang = e => {
    setCurrentMonth(e.target.value);
  };
  const handleChangedStartDate = date => {
    let startDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setStartDate(startDate);
  };

  const handleChangedEndDate = date => {
    let endDate = moment(date).format('YYYY-MM-DDTHH:mm:ss');
    setEndDate(endDate);
  };
  return (
    <Grid container xs={12}>
      {loading && <KenLoader />}
      <KenCard
        elevation={0}
        paperStyles={{
          paddingLeft: 0,
          borderBottomLeftRadius: 9,
          borderBottomRightRadius: 9,
        }}
      >
        {/* <Box
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // padding: '0 25px',
          }}
        > */}
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography
              style={{ padding: '5px 25px', fontSize: 16, fontWeight: 600 }}
            >
              {/* Subject Name : Subject Code */}
              {dataSingleCourse[selectedData.index]?.CourseName}
            </Typography>
          </Grid>
          <Grid item>
            {/* <KenButton
                variant="contained"
                color="primary"
                style={{
                  marginRight: '15px',
                  float: 'right',
                  width: '100px',
                  height: '13px',
                  background: 'none',
                  boxShadow: 'none',
                  color: '#193389',
                  // fontSize: 12,
                  // width: 120,
                }}
                className={classes.addButton}
              > */}
            {/* {'VIEW DETAILS'} */}
            {/* <Typography
                  style={{
                    fontSize: '14px',
                  }}
                  onClick={() => navigate.goBack()}
                >
                  Back
                </Typography> */}
            <KenButton variant="primary" onClick={() => navigate.goBack()}>
              Back
            </KenButton>
            {/* </KenButton> */}
          </Grid>
        </Grid>
        {/* </Box> */}
      </KenCard>
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
        <KenCard className={classes.attBoxpad}>
          <Grid container xs={12} md={12} sm={12} className="box">
            {isMobileScreen ? (
              <paper className={classes.mobback}>
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
                          label="Start Date"
                          inputBaseRootClass={classes.datePickInput}
                          value={startDate}
                          required={false}
                          placeholder={'dd-mm-yyyy'}
                          onChange={e => handleChangedStartDate(e)}
                          maxDate={endDate ? new Date(endDate) : null}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid
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
                          label="END DATE"
                          value={endDate}
                          inputBaseRootClass={classes.datePickInput}
                          required={false}
                          placeholder={'dd-mm-yyyy'}
                          onChange={e => handleChangedEndDate(e)}
                          minDate={new Date(startDate)}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </Grid>
              </paper>
            ) : (
              <Grid
                container
                xs={12}
                md={6}
                sm={12}
                className={classes.datepickertext + ' main-date-part'}
              >
                <Grid item md={6} xs={6} sm={6}>
                  <KenDatePicker
                    name={'startDate'}
                    label="Start Date"
                    inputBaseRootClass={classes.datePickInput}
                    value={startDate}
                    required={false}
                    placeholder={'dd-mm-yyyy'}
                    onChange={e => handleChangedStartDate(e)}
                    maxDate={endDate ? new Date(endDate) : null}
                  />
                </Grid>
                <Grid item md={6} xs={6} sm={6}>
                  <div style={{ marginLeft: 15 }}>
                    <KenDatePicker
                      name={'endDate'}
                      label="END DATE"
                      value={endDate}
                      inputBaseRootClass={classes.datePickInput}
                      required={false}
                      placeholder={'dd-mm-yyyy'}
                      onChange={e => handleChangedEndDate(e)}
                      minDate={new Date(startDate)}
                    />
                  </div>
                </Grid>
              </Grid>
            )}
            <Grid xs={12} md={6} sm={12}>
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
        </KenCard>
      </Grid>
      {/* mobile */}
      <Grid container xs={12}>
        <Grid className={classes.RightBox}>
          {isMobileScreen ? (
            <>
              {eventAttend.map(s => (
                <KenCard
                  paperStyles={{
                    padding: '10px 10px 20px 10px',
                    height: '90px',
                  }}
                >
                  <Typography>
                    <Grid container>
                      <Grid item xs={6} sm={3}>
                        Date of absence
                      </Grid>
                      <Grid item xs={6} sm={3} style={{ fontWeight: 'bold' }}>
                        {/* 28-02-2022 */}
                        {s.date}
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={6} sm={3}>
                        Type
                      </Grid>
                      <Grid item xs={6} sm={3} style={{ fontWeight: 'bold' }}>
                        {/* Family */}
                        {s.reasontype}
                      </Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={6} sm={3}>
                        Description
                      </Grid>
                      <Grid item xs={6} sm={3} style={{ fontWeight: 'bold' }}>
                        {/* Lore ipsum */}
                        {s.reason}
                      </Grid>
                    </Grid>
                  </Typography>
                </KenCard>
              ))}
            </>
          ) : (
            <KenCard paperStyles={{ padding: 0 }}>
              <KenGrid
                columns={columns}
                data={eventAttend}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
                noDataText={noData}
              />
            </KenCard>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
