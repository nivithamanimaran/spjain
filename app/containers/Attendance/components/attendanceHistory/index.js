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
import {
  getAttendanceEvent,
  getAttendanceInfo,
} from '../../../../utils/ApiService';
import moment from 'moment';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import './attendance.css';
import SessionCards from '../sessionCards';
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
    padding: '10px',
    [theme.breakpoints.down('sm')]: {
      padding: '0px !important',
    },
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      background: 'none !important',
    },
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
  m_0: {
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
        padding: 8,
      },
    },
  },
  datepickertext: {
    '& div > div > div > div > p': {
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
  absent: {
    fontSize: 14,
    background: 'rgba(221, 75, 57, 0.38)',
    padding: 4,
    width: 'fit-content',
    borderRadius: 4,
    fontWeight: 600,
  },
  present: {
    fontSize: 14,
    background: 'rgba(82, 193, 90, 0.27)',
    padding: 4,
    width: 'fit-content',
    borderRadius: 4,
    fontWeight: 600,
  },
}));
export default function GradeBook(props) {
  const userDetails = getUserDetails();
  const classes = useStyles();
  const kenTheme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [totalAtnd, setTotalAtnd] = React.useState(0);
  const [absentSession, setAbsenceAttendance] = React.useState(0);
  const [sessions, setSessions] = React.useState(0);
  const [currentMonth, setCurrentMonth] = React.useState('Select');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [eventAttend, setEventAttend] = React.useState([]);
  const [noData, setNoData] = useState(t('messages:Fetching_Data'));
  // responsiveness
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));

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

        setNoData(t('No_Records'));
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        setNoData(t('No_Records'));
      });
  }, [startDate, endDate]);

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
      Header: 'Date',
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
    {
      Header: 'Status',
      accessor: 'status',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return (
          <Typography
            className={value === 'Absent' ? classes.absent : classes.present}
          >
            {value}
          </Typography>
        );
      },
    },
  ];

  // mobile
  const columns1 = [
    {
      Header: 'Subject Name',
      accessor: 'subjectName',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },

    {
      Header: 'Status',
      accessor: 'status',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
  ];

  const months = [
    { label: 'Select', value: 'Select' },
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];
  const changeLang = e => {
    setCurrentMonth(e.target.value);
  };

  React.useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setEventAttend([]);
      const users = await getAttendanceEvent(
        userDetails.ContactId,

        '',
        startDate ? `${startDate}.000Z` : '',
        endDate ? `${endDate}.000Z` : ''
      );
      console.log('usersss', users.data.length);

      setEventAttend(
        users.data
          // ?.filter(e => e.status === 'Absent')
          .map(item => {
            return {
              subjectName: item?.courseName,
              section: item.SectionId,
              date: item.sessionStartDate
                ? moment(item.sessionStartDate).format('YYYY-MM-DD, h:mm A')
                : '',
              reason: item.reason ? item.reason : '',
              reasontype: item.resonDescription ? item.resonDescription : '',
              status: item.status ? item.status : '',
            };
            // }
          })
      );
      setLoading(false);
    };
    getUsers().catch(err => {
      setLoading(false);
      setNoData(t('No_Records'));
    });
  }, [startDate, endDate]);
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
                      label="START DATE"
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
                      label="END DATE"
                      inputBaseRootClass={classes.datePickInput}
                      value={endDate}
                      placeholder={'dd-mm-yyyy'}
                      required={false}
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
              className={classes.datepickertext + ' main-date-part'}
            >
              <Grid item md={6} xs={6} sm={6}>
                <KenDatePicker
                  name={'startDate'}
                  label="START DATE"
                  inputBaseRootClass={classes.datePickInput}
                  value={startDate}
                  required={false}
                  placeholder={'dd-mm-yyyy'}
                  onChange={e => handleChangedStartDate(e)}
                  maxDate={endDate ? new Date(endDate) : null}
                />
              </Grid>
              {/* <Grid item md={6} xs={6} sm={6}>
                <div style={{ marginLeft: 15 }}>
                  <KenDatePicker
                    name={'endDate'}
                    label="END DATE"
                    inputBaseRootClass={classes.datePickInput}
                    value={endDate}
                    required={false}
                    placeholder={'dd-mm-yyyy'}
                    onChange={e => handleChangedEndDate(e)}
                    minDate={new Date(startDate)}
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
                  borderRadius="4"
                />
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Grid>
      {isMobileScreen ? (
        <Grid container xs={12} style={{ padding: '0px' }}>
          <KenCard paperStyles={{ padding: 10, borderRadius: '4px' }}>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                  Sub Name:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                {eventAttend.map((s, index) => (
                  <Typography key={index}>{s.subjectName}</Typography>
                ))}
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: 'bold' }}
                >
                  Section:
                </Typography>
              </Grid>
              <Grid xs={6}>
                {eventAttend.map((s, index) => (
                  <Typography key={index}>{s.status}</Typography>
                ))}
              </Grid>
            </Grid>
          </KenCard>
        </Grid>
      ) : (
        <Grid container xs={12}>
          <Grid className={classes.RightBox}>
            <KenCard paperStyles={{ padding: 0, borderRadius: '4px' }}>
              <KenGrid
                columns={columns}
                data={eventAttend}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
                noDataText={noData}
              />
            </KenCard>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
