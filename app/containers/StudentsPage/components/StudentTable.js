import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Hidden,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getConsolidatedMarks, getStudents } from '../../../utils/ApiService';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';
import 'firebase/analytics';
import PopupState, { bindTrigger } from 'material-ui-popup-state';
import ExportIcon from '../../../assets/icons/ExportIcon.svg';
import GreyExportIcon from '../../../assets/icons/ExportIconGrey.svg';
import mystudent from '../../../assets/landingpage.png';
import { getStudentsCount } from '../../../utils/ApiService';
import configContext from '../../../utils/helpers/configHelper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import KenLoader from '../../../components/KenLoader';

const CircularProgressWithLabel = React.lazy(() =>
  import('../../../components/ChartWidgets/CircularProgressWithLabel')
);
const KenSwitch = React.lazy(() => import('../../../components/KenSwitch'));
const KenTabs = React.lazy(() => import('../../../components/KenTabs/index'));
const KenButton = React.lazy(() =>
  import('../../../global_components/KenButton')
);
const KenCard = React.lazy(() => import('../../../global_components/KenCard'));
const KenDrawer = React.lazy(() =>
  import('../../../global_components/KenDrawer')
);
const KenGrid = React.lazy(() => import('../../../global_components/KenGrid'));
const KenHeader = React.lazy(() =>
  import('../../../global_components/KenHeader/index')
);
const KenColors = React.lazy(() => import('../../../utils/themes/KenColors'));
const StudentTableGrid = React.lazy(() => import('./StudentTableGrid'));

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 300,
    minHeight: '100%',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  courseCardGrid: {
    maxHeight: 375,
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: 20,
    margin: '0 -20px',
  },
  border: {
    boxShadow: `inset 6px 0px 0px ${theme.palette.KenColors.primary}`,
  },
  bottomDivider: {
    border: `1px solid ${theme.palette.KenColors.kenWhite}`,
    background: theme.palette.KenColors.kenWhite,
    padding: 10,
    marginBottom: 12,
  },
  tableContainer: {
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '10px'
    },

  },
  btnLabels: {
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'none',
  },
  headerBtn: {
    marginLeft: '10px',
    minWidth: '100px',
  },
  heading: {
    color: theme.palette.KenColors.neutral900,
    fontWeight: '600',
  },
  subHeading: {
    color: theme.palette.KenColors.neutral900,
    fontWeight: '400',
  },
  closeIcon: {
    height: 'max-content',
  },
  switchLabel: {
    padding: '0px 5px',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '100%',
    textTransform: 'uppercase',
    color: theme.palette.KenColors.neutral400,
  },
  accordianDetails: {
    '& >div > div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '& > div >div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '200%',
      },
    },
    '& > div >div>table>thead>tr>th': {
      [theme.breakpoints.down('sm')]: {
        textAlign: "start",
        paddingLeft : "10px"
      },
    },
  },
  dropdown: {
    fontSize: '20px',
  },
  statusGreen: {
    fontWeight: 600,
    fontSize: 12,
    background: 'rgba(82, 193, 90, 0.27)',
    borderRadius: 4,
    padding: 4,
    width: 'fit-content',
  },
}));

const progressBarTheme = createMuiTheme({
  palette: {
    // Style sheet name ⚛️
    primary: {
      // Name of the rule
      main: '#008000',
    },
    secondary: {
      main: '#FF5630',
    },
    inherite: {
      main: '#483D8B',
    },
  },
});

const StudentTable = props => {
  const { t } = useTranslation();
  const { history } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [studentdata, setStudentdata] = useState([]);
  const [courseDetails, setcourseDetails] = useState([]);

  const [CourseOfferingID, setCourseOfferingId] = useState();
  const [consolidated, setConsolidated] = React.useState(false);
  const [sectionObj, setSectionObj] = React.useState({});
  const [consolidatedDetails, setConsolidatedDetails] = React.useState([]);

  const [expanded, setExpanded] = useState(true);

  const handleAccordionChange = (event, isExpanded) => {
    console.log('event', event);
    console.log('isExpanded', isExpanded);
    setExpanded(isExpanded);
  };
  const [consolidatedFinalData, setConsolidatedFinalData] = React.useState([]);
  const [
    openConsolidatedGradesDrawer,
    setOpenConsolidatedGradesDrawer,
  ] = useState(false);

  const { config } = useContext(configContext);

  const tableTitle = `${t('My_Students')}`;

  const disabledBtn = true;

  const profile = getUserDetails();

  const [datas, setDatass] = useState([]);


  function handleClick(rowData, courseData) {
    console.log(rowData, courseData);
    setStudentdata(courseData?.studentArray);
    setcourseDetails(courseData);
  }

  const columns = [
    {
      Header: 'Term',
      accessor: 'termName',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography
            style={{ fontSize: '12px', cursor: 'pointer' }}
            onClick={() => {
              handleClick(row?.original?.studentArray, row?.original);
              setExpanded(false);
            }}
          >
            {value}
          </Typography>
        );
      },
    },
    {
      Header: 'Subject Code',
      accessor: 'SubjectCode',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography style={{ fontSize: '12px', cursor: 'pointer' }}>
            {value}
          </Typography>
        );
      },
    },
    {
      Header: 'Subject',
      accessor: 'subject',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography style={{ fontSize: '12px', cursor: 'pointer' }}>
            {value}
          </Typography>
        );
      },
    },
    {
      Header: 'Section',
      accessor: 'section',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography style={{ fontSize: '12px', cursor: 'pointer' }}>
            {value}
          </Typography>
        );
      },
    },
    {
      Header: 'Students List',
      accessor: 'totalAttendance',
      Cell: ({ value, row }) => {
        return (
          <div
            style={{ marginLeft: 30, cursor: 'pointer' }}
            onClick={() => {
              handleClick(row?.original?.studentArray, row?.original);
              setExpanded(false);
            }}
          >
            <VisibilityIcon />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const handleSubmit = studentId => {
    history.push({
      pathname: `/studentDetails/${studentId}`,
    });
  };
  const handleMarks = e => {
    setConsolidated(e.target.checked);
  };
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
  
    const fetchData = async () => {
      try {
  
        if (studentdata) {
          const res = await getStudentsCount(profile?.ContactId);
          
          if (isMounted) {
            let data = [];
            console.log('data', data);
  
            if (res?.message !== 'No Data Found') {
              let details = Object.entries(res?.data?.courseOffering);
  
              for (let [index, el] of details.entries()) {
                let courseDetailsArray = el[0]?.split('_');
                console.log('courseDetailsArray', courseDetailsArray);
                let totalAttendance = 0;
  
                if (el[1] !== null && Array.isArray(el[1])) {
                  let sumAttendance = el[1]?.reduce(
                    (acc, currentValue) => acc + currentValue?.Attendacne,
                    0
                  );
                  totalAttendance = sumAttendance / el[1]?.length;
                }
  
                let StudentArray = el[1] === null ? [] : [...el[1]];
  
                data.push({
                  sessionName: index + 1,
                  courseName: courseDetailsArray[3],
                  termName: courseDetailsArray[2],
                  subject: courseDetailsArray[3],
                  section: courseDetailsArray[4],
                  SubjectCode: courseDetailsArray[5],
                  totalAttendance: totalAttendance.toFixed(1),
                  studentArray: StudentArray,
                });
              }
            } else {
              setNoData('You are up to date!');
            }
  
            data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setDatass(data);
            console.log('data11', data);
            setLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setDatass([]);
          setNoData(t('No_Records'));
          setLoading(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [studentdata, profile?.ContactId]);
  
  // Rest of your code...
  

  return (
    <div>
     {loading && <KenLoader />}
      <Accordion
        style={{ borderRadius: '8px' }}
        expanded={expanded}
        onChange={handleAccordionChange}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Courses</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: '32px', display: 'block' }}>
          <Box className={classes.accordianDetails}>
            <KenGrid
              columns={columns}
              toolbarDisabled={true}
              data={datas}
              className={classes.dropdown}
              gridProps={{
                getHeaderProps: cell => ({
                  style: {
                    background: '#F1F5FA',
                    border: 'none',
                    color: '#092682',
                    fontSize: '12px',
                    fontWeight: '500',
                    width: '20%',
                  },
                }),
                getCellProps: cell => ({}),
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
      {/* </KenCard> */}
      <KenCard>
        <Hidden smDown>
          <div className={classes.tableContainer}>
            {studentdata && studentdata?.length > 0 ? (
              <Box mt={2}>
                <StudentTableGrid
                  title={tableTitle}
                  data={studentdata}
                  loading={loading}
                  courseDetails={courseDetails}
                />
              </Box>
            ) : (
              <Box style={{ textAlign: 'center', marginTop: '140px' }}>
                <img
                  src={mystudent}
                  alt="mystudent"
                  height="370px"
                  width="500px"
                />
                <Typography style={{ fontSize: '24px', color: ' #193389' }}>
                  No Course Selected !
                </Typography>
                <Typography
                  style={{
                    fontSize: '20px',
                    fontWeight: '500',
                    color: ' #000000',
                  }}
                >
                  Select the course to view the details of the students
                </Typography>
              </Box>
            )}
          </div>
        </Hidden>
        <Hidden smUp>
        <div className={classes.tableContainer}>
            {studentdata && studentdata?.length > 0 ? (
              <Box mt={2}>
                <StudentTableGrid
                  title={tableTitle}
                  data={studentdata}
                  loading={loading}
                  courseDetails={courseDetails}
                />
              </Box>
            ) : (
              <Box style={{ textAlign: 'center', marginTop: '50px' }}>
                <img
                  src={mystudent}
                  alt="mystudent"
                  height="170px"
                  width="100%"
                />
                <Typography style={{ fontSize: '14px', color: ' #193389' }}>
                  No Course Selected !
                </Typography>
                <Typography
                  style={{
                    fontSize: '10px',
                    fontWeight: '500',
                    color: ' #000000',
                  }}
                >
                  Select the course to view the details of the students
                </Typography>
              </Box>
            )}
          </div>


          
        </Hidden>
        <KenDrawer
          drawerWidth="70%"
          closeIconStyles={classes.closeIcon}
          title={
            <KenHeader
              title={
                <Typography className={classes.heading}>
                  {t('headings:Report_Card_View')}
                  <Typography
                    component="span"
                    className={classes.subHeading}
                    data-testid="academicYear"
                  />
                </Typography>
              }
            >
              <KenSwitch
                switchLabel={
                  <Typography className={classes.switchLabel}>
                    {t('labels:Consolidated_Marks')}
                  </Typography>
                }
                onChangeSwitch={e => {
                  handleMarks(e);
                }}
              />
              <KenButton
                disabled={true}
                variant="secondary"
                startIcon={<ShareIcon />}
                className={classes.headerBtn}
                label={
                  <Typography className={classes.btnLabels}>
                    {t('labels:Share')}
                  </Typography>
                }
              />
              <KenButton
                disabled={true}
                variant="secondary"
                startIcon={
                  disabledBtn ? (
                    <img src={GreyExportIcon} alt="GreyExporticon" />
                  ) : (
                    <img src={ExportIcon} alt="Exporticon" />
                  )
                }
                className={classes.headerBtn}
                label={
                  <Typography className={classes.btnLabels}>
                    {t('labels:Export')}
                  </Typography>
                }
              />
            </KenHeader>
          }
          open={openConsolidatedGradesDrawer}
          onClose={() => {
            setOpenConsolidatedGradesDrawer(false);
          }}
        >
          <Box p={2}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <KenTabs data={consolidatedFinalData} />
              </Grid>
            </Grid>
          </Box>
        </KenDrawer>
      </KenCard>
    </div>
  );
};

export default withRouter(StudentTable);
