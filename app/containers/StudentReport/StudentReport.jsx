import React, { useEffect, useState } from 'react';
import {
  getGradingDetailsByStudentId,
  getStudentsMarksByCourseOffering,
  GetStudentDetailTermWiseByStudentId,
  GetfetchEnrollmentAffliationByContactId,
  getTermDetails,
} from '../../utils/ApiService';
import { withRouter } from 'react-router-dom';
import { Newtable } from './NewTable';
// import KenLoader from '../../components/KenLoader';
// import KenGrid from '../../global_components/KenGrid';
import TabPanel from './TabPanel';
// import KenCard from '../../global_components/KenCard';
import {
  Grid,
  AppBar,
  makeStyles,
  Box,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  Card,
  CardContent,
  Paper,
  useTheme,
} from '@material-ui/core';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KenLoader from '../../components/KenLoader';
import KenCard from '../../global_components/KenCard';
import useMediaQuery from '@material-ui/core/useMediaQuery';

function StudentReport(props) {
  props.setHeading('Result');
  const useStyles = makeStyles(theme => ({
    breadCrumbWrapper: {
      margin: '15px 0',
    },
    header: {
      background: '#ffffff',
      color: theme.palette.KenColors.primary,
      marginTop: '20px',
    },
    title: {
      fontSize: 18,
      fontWeight: 600,
    },
    holidayButton: {
      textTransform: 'none',
      fontWeight: 'bold',
      marginRight: '5px',
    },
    fitlerButton: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
    sortingSection: {
      display: 'grid',
      gap: '10px',
      gridTemplateColumns: 'repeat(7, 1fr)',
    },
    mainActions: {
      textAlign: 'right',
    },
    popOverHeading: {
      width: '100%',
      fontSize: '14px',
      fontWeight: '400',
      color: '#02195E',
    },
    tableBodyStyle: {
      fontSize: '12px',
      color: '#7A869A',
    },
    tableBodyStyleIgnoreHoliday: {
      fontSize: '12px',
      color: '#7A869A',
      padding: '0px',
    },
    textInputFieldDropDown: {
      background: 'transparent',
      borderRadius: '4px',
      color: '#000',
    },
    textInputField: {
      background: 'transparent',
      borderRadius: '4px',
      color: '#000',
    },
    kenDateTimePickerColor: {
      backgroundColor: '#fff',
    },
    tabs: {
      '& .MuiPaper-root': {
        padding: '0px',
        backgroundColor: 'red',
      },
    },
  }));

  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const userDetails = localStorage.getItem('userDetails');
  const [termName, setTermName] = React.useState('');

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    console.log('index', index);
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      {loading && <KenLoader />}
      <Box>
        {/* <p>Attendance</p> */}
        <div className="cardlsitbox">
          <KenCard
            elevation={0}
            paperStyles={{
              padding: 16,
              paddingLeft: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Box>
              <Box
                sx={{ borderBottom: 1, borderColor: 'divider' }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // padding: '0 25px',
                }}
              >
                <Tabs
                  style={{
                    padding: '0px',
                  }}
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  className={classes.tabs}
                >
                  <Tab
                    label="Current"
                    {...a11yProps(0)}
                    style={{ fontSize: '12px' }}
                  />
                  <Tab
                    label="History"
                    {...a11yProps(1)}
                    style={{ fontSize: '12px' }}
                  />
                </Tabs>
              </Box>
            </Box>
          </KenCard>
        </div>
        <TabPanel
          value={value}
          index={0}
          style={{ background: '#fff', minHeight: 320 }}
        >
          <CurrentTerms
          // studentId={studentId}
          />
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          style={{ background: '#fff', minHeight: 320 }}
        >
          <TermsHistory />
        </TabPanel>
      </Box>
    </div>
  );
}

export default withRouter(StudentReport);

const ComponentsMarksTable = ({ data }) => {
  console.log('component', data.componentList);
  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <AiFillCaretDown /> : <AiFillCaretRight />}
          </span>
        ),
      },
      {
        Header: 'Component',
        accessor: 'componentName',
      },
      {
        Header: 'Weightage',
        accessor: 'weightage',
      },
      {
        Header: 'Max Marks',
        accessor: 'maximumMarks',
      },
      {
        Header: 'Marks Obtained',
        accessor: 'marksObtained',
      },
      {
        Header: 'Marks In course',
        accessor: 'marksObtainedCourseLevel',
      },
    ],
    []
  );

  const renderRowSubComponent = React.useCallback(({ row }) => {
    return <SubComponentsMarksTable data={row.original} />;
  }, []);

  return (
    <>
      {data?.componentList?.length && (
        <Newtable
          columns={columns}
          data={data?.componentList}
          renderComponents={renderRowSubComponent}
        />
      )}
    </>
  );
};

function SubComponentsMarksTable({ data }) {
  const [newData, setNewData] = useState([]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sub Component',
        accessor: 'name',
        // render:(({value,row})=>(<a href={`${routes.studentsMarksBySubComponent}/${row?.original?.id}`} target="_blank">{value}</a>))
      },
      {
        Header: 'Weightage',
        accessor: 'weightage',
      },
      {
        Header: 'Max Marks',
        accessor: 'maximumMarks',
      },
      {
        Header: 'Marks Obtained',
        accessor: 'marksObtained',
      },
      {
        Header: 'Component Marks',
        accessor: 'marksComponent',
      },
      // {
      //   id: 'scoresFinalized',
      //   Header: 'Scores Finalized',
      //   accessor: (d) => d.scoresFinalized.toString(),
      //   disableGlobalFilter: false,
      // },
    ],
    []
  );
  useEffect(() => {
    const newData = [];
    let maximumMarks = data.maximumMarks;
    data?.subCompList.map(item => {
      newData.push({ ...item, ['marksComponent']: maximumMarks });
    });
    setNewData(newData);
  }, []);
  return (
    <>{data?.subCompList && <Newtable data={newData} columns={columns} />}</>
  );
}

function TermsHistory() {
  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    activeBox: {
      borderBottom: '2px solid #00218D',
    },
  }));
  const classes = useStyles();

  const [terms, setTerms] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [formerTermVal, setFormerTerm] = useState({});
  const userDetails = localStorage.getItem('userDetails');
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = useState('');
  const handleClick = value => {
    setTrigger(!trigger);
    setFormerTerm(value);
    setActiveTab(value?.termId);
  };

  useEffect(() => {
    setLoading(true);
    const userData = JSON.parse(userDetails);
    const id = userData?.ContactId;
    getTermDetails(id).then(res => {
      if (res?.success === 'true') {
        if (res?.data.length > 0) {
          let formerTerm = res?.data.filter(
            item => String(item.status).toLocaleLowerCase() === 'former'
          );
          console.log('formerTerm', formerTerm);
          setTerms(formerTerm);
        }
      }
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {loading && <KenLoader />}
      <div style={{ paddingLeft: '20px' }}>
        <Grid container spacing={3}>
          {terms.length > 0
            ? terms.map(value => {
                console.log('va', value);
                return (
                  <Grid item md={3}>
                    <Card onClick={() => handleClick(value)}>
                      <CardContent
                        className={
                          activeTab === value?.termId
                            ? classes.activeBox
                            : classes.normalBox
                        }
                      >
                        <Typography style={{ textAlign: 'center' }}>
                          {value?.termName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            : null}
        </Grid>
      </div>
      {trigger && formerTermVal && <CurrentTerms formerTerm={formerTermVal} />}
    </div>
  );
}

function CurrentTerms({ formerTerm }) {
  const [data, setData] = React.useState([]);
  const userDetails = localStorage.getItem('userDetails');
  const [loading, setLoading] = React.useState(false);
  const [termName, setTermName] = React.useState({});

  useEffect(() => {
    const userData = JSON.parse(userDetails);
    const id = userData?.ContactId;
    setLoading(true);
    getTermDetails(id).then(res => {
      if (res?.success === 'true') {
        let formerTermId;
        let currentTerm;
        if (res?.data.length > 0) {
          if (formerTerm != undefined) {
            formerTermId = formerTerm?.termId;
          } else {
            currentTerm = res?.data.filter(
              item => String(item.status).toLocaleLowerCase() === 'current'
            );
          }
          let term =
            formerTermId != undefined ? formerTermId : currentTerm[0]?.termId;
          if (term) {
            setLoading(true);
            GetStudentDetailTermWiseByStudentId(id, term)
              .then(res => {
                if (res.length > 0) {
                  setTermName(res[0]);
                  setData(res[0].subjectScore);
                }
                setLoading(false);
              })
              .catch(err => {
                console.log(err);
                setLoading(false);
              });
          }
        }
      }
    });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <AiFillCaretDown /> : <AiFillCaretRight />}
          </span>
        ),
      },
      {
        Header: 'Subject',
        accessor: 'courseName',
      },
      {
        Header: 'Subject Code',
        accessor: 'courseCode',
      },
      {
        Header: 'Course Credits',
        accessor: 'courseCredits',
      },
      {
        Header: 'Max',
        accessor: 'maximumMarks',
      },
      {
        Header: 'Obtained',
        accessor: 'marksObtained',
      },
      {
        Header: 'Percentage',
        accessor: 'percentage',
      },
      {
        Header: 'GPA',
        accessor: 'gradePoint',
      },
      {
        Header: 'Grade',
        accessor: 'calculatedLetterGrade',
      },
      {
        Header: 'Final Grade',
        accessor: 'finalLetterGrade',
      },
      {
        Header: 'Status',
        accessor: 'passFailStatus',
      },
    ],
    []
  );

  const renderComponents = React.useCallback(
    ({ row }) => <ComponentsMarksTable data={row.original} />,
    []
  );

  const termDetails = [
    {
      Header: 'Term Name',
      accessor: termName.termName,
    },
    {
      Header: 'Type of Grade',
      accessor: termName.gradeType,
    },
    {
      Header: 'GPA',
      accessor: termName.gpa,
    },
    {
      Header: 'Number of backlogs',
      accessor: termName.noOfbacklogs,
    },
    {
      Header: 'Total credits Earned',
      accessor: termName.totalCredsEarned,
    },
    {
      Header: 'Mandatory credits earned',
      accessor: termName.mandCredsEarned,
    },
    {
      Header: 'Elective credits earned',
      accessor: termName.eleCredsEarned,
    },
    {
      Header: 'Specialization credits earned',
      accessor: termName.specCredsEarned,
    },
    {
      Header: '% Obtained',
      accessor: termName.ObtainedPercentage,
    },
    {
      Header: 'Attendance %',
      accessor: termName.attendancePercentage,
    },
  ];
  const useStyles = makeStyles(theme => ({
    resultResp: {
      [theme.breakpoints.down('md')]: {
        '&>div>div>table': {
          width: '220%',
        },
      },
    },
  }));

  const classes = useStyles();
  const kenTheme = useTheme();
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));

  return (
    <div style={{ padding: isMobileScreen ? '10px' : '20' }}>
      {loading && <KenLoader />}
      <div style={{ marginBottom: '20px' }}>
        <Paper>
          {isMobileScreen ? (
            <Grid container style={{ padding: '20px' }}>
              {termDetails.map(term => (
                <Grid container xs={6} style={{ marginBottom: '10px' }}>
                  <Grid item xs={12}>
                    <Typography
                      style={{ fontSize: '12px', paddingBottom: '10px' }}
                      color="textSecondary"
                    >
                      {term.Header}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography style={{ fontSize: '14px' }}>
                      {term.accessor}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={1}>
              {termDetails.map(term => (
                <Grid item md={2}>
                  <Box style={{ padding: '15px' }}>
                    <Typography
                      style={{ fontSize: '12px', paddingBottom: '10px' }}
                      color="textSecondary"
                    >
                      {term.Header}
                    </Typography>
                    <Typography style={{ fontSize: '14px' }}>
                      {term.accessor}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </div>
      <div className={classes.resultResp}>
        <Newtable
          columns={columns}
          data={data}
          renderComponents={renderComponents}
        />
      </div>
    </div>
  );
}
