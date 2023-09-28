import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Box,
  Accordion,
  AccordionDetails,
  Tab,
  Tabs,
  Typography,
  AccordionSummary,
  Paper,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  getCompletedEnrollment,
  getStudentsCount,
} from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';

const KenCard = React.lazy(() => import('../../global_components/KenCard'));
const Current = React.lazy(() => import('./components/current/index'));
const AttendanceHistory = React.lazy(() =>
  import('./components/attendanceHistory/index')
);
const CircularProgressWithLabel = React.lazy(() =>
  import('../../components/ChartWidgets/CircularProgressWithLabel')
);

const useStyles = makeStyles(theme => ({

  tabbot: {
    borderBottom: 'none',
  },
  tabhead: {
    fontWeight: 'bold',
    color: '#092682',
    fontSize: '13px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },

  },

  accord: {
    padding: '8px 16px 45px 16px',
  },
 

  tabs: {
    '& .MuiPaper-root': {
      padding: '0px',
      backgroundColor: 'red',
    },
  },

  summary: {
    borderRadius: '8px !important',
    boxShadow: '0px 1px 20px 0px #0000000D',
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
    },
  },
  RightBox: {
    '& div> div > div  > table > thead > tr': {
      background: '#F1F5FA',
    },
    '& div> div > div  > table > thead > tr > th': {
      fontSize: '13px',
      color: '#092682',
      fontWeight: 'bold',
    },
    '&> div': {
      border: '1px solid #D2E1E9',
      boxShadow: 'none',
    },
    '&> div > div': {
      boxShadow: 'none !important',
    },
    '&>div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
       
      },
    },
    '&>div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: "200%"
      },
    },
    '&>div>div>table>thead>tr>th:nth-child(3)': {
      [theme.breakpoints.down('sm')]: {
        width: "120px"
      },
    },
    '&>div>div>table>thead>tr>th:nth-child(4)': {
      [theme.breakpoints.down('sm')]: {
        width: "77px"
      },
    },
    '&>div>div>table>thead>tr>th:nth-child(5)': {
      [theme.breakpoints.down('sm')]: {
        width: "150px"
      },
    },
  },
  tabText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#000000',
    textTransform: 'capitalize',
    '&.selected': {
      color: '#193389 !important',
    },
  },
  toolbar: theme.mixins.toolbar,
  // responsiveness
  mobBack: {
    [theme.breakpoints.down('sm')]: {
      background: 'none !important',
    },
  },
  mobPadd: {
    [theme.breakpoints.down('sm')]: {
      padding: '0px !important',
    },
  },
  selected: {
    color: '#193389',
    fontSize: 14,
    fontWeight: 500,
  },
}));

function TabPanels(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={classes.mobBack}
    >
      {value === index && (
        <Box sx={{ p: '0px 25px' }} className={classes.mobPadd}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const Attendance = props => {
  props.setHeading("Attendance")
  const classes = useStyles();
  const { t } = useTranslation();
  const initialValue = sessionStorage.getItem("Attendancevalue") || 0;
  const [value, setValue] = React.useState(parseInt(initialValue)); 
  const [data, setData] = useState([]);
  const [currentSubject, setCurrentSubject] = useState();

  useEffect(() => {
    const userDetails = getUserDetails();
    const ContactId = userDetails.ContactId;
    getCompletedEnrollment(ContactId)
      .then(res => {
        let data = [];
        if (res?.message !== 'No Data Found') {
          let courses = res?.mandatoryCourses;
          courses.map(el => {
            data.push({
              label: el.CourseName + ' ' + el.courseOfferingSectionId,
              value: el.courseOfferingId,
            });
          });
        }
        setCurrentSubject(data[0]?.value);
      })
      .catch(err => {
        console.error('err', err);
      });
  }, []);

  useEffect(() => {
    if (currentSubject) {
      onSessionList(currentSubject);
    }
  }, [currentSubject]);

  const onSessionList = val => {
    const userDetails = getUserDetails();
    getStudentsCount(userDetails?.ContactId)
      .then(res => {
        let data = [];
        if (res?.message !== 'No Data Found') {
          let details = Object.entries(res?.data?.courseOffering);
          details.forEach((el, index) => {
            let courseDetailsArray = el[0]?.split('_');
            let totalAttendance = 0;
            if (el[1] !== null && Array.isArray(el[1])) {
              let sumAttendance = el[1]?.reduce(
                (acc, currentValue) => acc + currentValue?.Attendacne,
                0
              );
              totalAttendance = sumAttendance / el[1]?.length;
            }
            data.push({
              sessionName: index + 1,
              courseName: courseDetailsArray[3],
              termName: courseDetailsArray[2],
              subject: courseDetailsArray[3],
              section: courseDetailsArray[4],
              subjectCode: courseDetailsArray[5],
              totalAttendance: totalAttendance.toFixed(2),
            });
          });
        } else {
        }
        data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setData(data);
      })
      .catch(err => {
        setData([]);
      });
  };

  const handleChange = (event, newValue) => {
    sessionStorage.setItem("Attendancevalue", newValue);
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box>
      <div className={classes.cardlsitbox}>
        <Accordion
          elevation={0}
          className={`${classes.summary} ${{ root: classes.MuiAccordionroot }}`}
          classes={{
            root: classes.MuiAccordionroot,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography style={{ fontWeight: 'bold', fontSize: '16px' }}>
              Attendance Summary
            </Typography>
          </AccordionSummary>

          <AccordionDetails className={classes.accord}>
            <Grid container xs={12} style={{ display: 'block' }}>
              <Grid className={classes.RightBox}>
                <KenCard
                  paperStyles={{
                    padding: 0,
                    borderRadius: '4px',
                    border:
                      '1px solid; border-image-source: linear-gradient(270deg, rgba(210, 225, 233, 0.34) 1.11%, #D2E1E9 100%)',
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 650, border: '1px solid #D2E1E9' }}
                      aria-label="simple table"
                    >
                      <TableHead style={{ background: '#f1f5fa' }}>
                        <TableRow style={{ padding: '0px 10px' }}>
                          <TableCell
                            className={classes.tabhead}
                            style={{ paddingLeft: '35px' }}
                          >
                            Term
                          </TableCell>
                          <TableCell align="center" className={classes.tabhead}>
                            Subject Name
                          </TableCell>
                          <TableCell align="center" className={classes.tabhead}>
                            Subject Code
                          </TableCell>
                          <TableCell align="center" className={classes.tabhead}>
                            Section
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.tabhead}
                            style={{ paddingRight: '35px' }}
                          >
                            Total Attendance
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map(data => (
                          <TableRow
                            key={data.termName}
                            sx={{
                              '&:last-child td, &:last-child th': { border: 0 },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              className={classes.tabbot}
                              style={{ paddingLeft: '35px' }}
                            >
                              {data.termName}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tabbot}
                            >
                              {data.subject}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tabbot}
                            >
                              {data.subjectCode}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tabbot}
                            >
                              {data.section}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tabbot}
                              style={{ paddingRight: '35px' }}
                            >
                              <CircularProgressWithLabel
                                value={data.totalAttendance}
                                label={
                                  data.totalAttendance == '0.00'
                                    ? 'NA'
                                    : data.totalAttendance
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </KenCard>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <KenCard
          elevation={0}
          paperStyles={{
            padding: 0,
            borderRadus: 8,
            marginBottom: 10,
          }}
        >
          <Box>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Tabs
                style={{
                  padding: '0px 0px 0px 12px',
                }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                className={classes.tabs}
              >
                <Tab
                  label="Mark Attendance"
                  {...a11yProps(0)}
                  className={classes.tabText}
                  classes={{ selected: classes.selected }}
                />
                <Tab
                  label="Attendance History"
                  {...a11yProps(1)}
                  className={classes.tabText}
                  classes={{ selected: classes.selected }}
                />
              </Tabs>
            </Box>
          </Box>
        </KenCard>
      </div>
      <TabPanels
        value={value}
        index={0}
        style={{
          background: '#fff',
          minHeight: 400,
          position: 'relative',
          borderRadius: '8px',
        }}
      >
        <Current setValue={setValue} />
      </TabPanels>
      <TabPanels
        value={value}
        index={1}
        style={{
          background: '#fff',
          minHeight: 400,
          position: 'relative',
          borderRadius: '8px',
        }}
      >
        <AttendanceHistory />
      </TabPanels>
    </Box>
  );
};

export default Attendance;
