/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  makeStyles,
  AppBar,
  Toolbar,
  Button,
  Tab,
  Tabs,
} from '@material-ui/core';
import KenSelect from '../../components/KenSelect/index';
import DetailCard from './components/details';
import Tabes from './components/tabs';
import {
  getStudentDetails,
  getFacultyDetails,
  getAllCourses,
  getStudentInfo,
} from '../../utils/ApiService';
import HealthDetail from '../../components/CardWidgets/health';
import Robot from '../../assets/icons/Chem 3.svg';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import context from '../../utils/helpers/context';
import { KEY_SEVERITY } from '../../utils/constants';
import {
  getParentDetails,
  getUserDetails,
} from '../../utils/helpers/storageHelper';
import ParentDetails from './components/parentDetails';
import configContext from '../../utils/helpers/configHelper';
import fbAnalytics from '../../utils/Analytics';
import { useAppContext } from '../../utils/contextProvider/AppContext';
import ProfileDetails from './components/profileDetails';
import KenCard from '../../global_components/KenCard';
import PersonalDetails from './components/PersonalDetails';
import KenDialog from '../../global_components/KenDialog';
import CloseIcon from '@material-ui/icons/Close';
import StudentIDCard from '../../assets/student_template.png';
// import { exportComponentAsJPEG } from 'react-component-export-image';
import KenButton from '../../global_components/KenButton/index';
import DownloadIcon from '@material-ui/icons/GetApp';
import Cases from './components/cases/index';
import ProfileCardstudent from './ProfileCardstudent';
import BaseCard from '../../new_components/card';
import Conduct from './components 1/Conduct/index';
// import KenTabs from '../../components/KenTabs';
import ExtraActivites from './components 1/ExtraActivites/index';
// import Fees from './components 1/Fees/index';
import GradeBook from '../Attendance/components/attendanceHistory';

import PropTypes from 'prop-types';
import ProfileCard from '../../new_components/ProfileCard';
import Achievements from '../My360/components/Achievements';
const useStyles = makeStyles(theme => ({
  box1: {
    // maxWidth: 832,
    // minWidth: 400,
    position: 'relative',
  },
  healthGrid: {
    marginTop: theme.spacing(2),
  },
  grid: {
    minWidth: '13.8vw',
  },
  detailTitle1: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.KenColors.neutral100,
    textTransform: 'uppercase',
  },
  back: {
    fontSize: '12px',
    '&:hover': {
      cursor: 'pointer',
    },
    // marginLeft: '-8px',
  },
  iconBack: {
    height: 12,
  },
  loader: {
    minHeight: '100vh',
    minWidth: '100vh',
  },
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subHeaderTitle: {
    width: '100%',
  },
  addButton: {
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    textTransform: 'none',
    '&:hover': {
      color: 'white',
      borderBottom: '1px solid white',
    },
  },
  mainActions: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '2rem 0 1rem',
  },
  error: {
    color: '#FFFFFF',
    background: '#EB5757',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  normal: {
    color: '#FFFFFF',
    background: '#27AE60',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  publishGenerate: {
    color: '#FFFFFF',
    background: '#979797',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  publishView: {
    color: '#FFFFFF',
    background: '#F2994A',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  Blue: {
    color: '#FFFF',
    background: '#03248F',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  Green: {
    color: '#FFFF',
    background: '#27AE60',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  medium: {
    color: '#FFFFFF',
    background: '#F2994A',
    width: '102px',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
  },
  errorText: {
    color: '#F14B2D',
  },
  greenText: {
    color: '#27AE60',
  },
  gridKenClass: {
    '&  table tbody tr td ': {
      padding: '5px',
    },
    '&  table thead tr th ': {
      fontWeight: 'bold',
      color: '#061938',
    },
  },
  customOne: {
    padding: '3rem 15rem',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    fontFamily: 'Work Sans',
  },
  customTwo: {
    padding: '0rem',
    color: '#484848',
    backgroundColor: 'white',
    fontFamily: 'Work Sans',
    fontSize: '1rem',
  },
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#00218D',
      height: 3,
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#03248F',
    },
  },
  leftAligned: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headBox: {
    backgroundColor: theme.palette.KenColors.kenWhite,
  },
  studentCardMain: {
    textAlign: '-webkit-center',
    position: 'relative',
  },
  cardTexts: {
    position: 'absolute',
    left: 160,
    fontWeight: 600,
    fontSize: 9,
  },
  studentCard: {
    width: '85%',
    height: '100%',
  },
  cardHeader: {
    color: '#061938',
    width: '100%',
    borderBottom: '1px solid #E3E3E3',
    marginBottom: '10px',
    paddingBottom: '5px',
    position: 'relative',
  },
  cardText: {
    fontWeight: '400',
    lineHeight: '1.5',
  },
  downloadbtn: {
    position: 'absolute',
    right: 0,
    top: '-11px',
  },
  profilePicture: {
    top: 18,
    right: 9,
    height: 162,
    width: 152,
    position: 'absolute',
  },
  btnLabels: {
    position: 'absolute',
    right: '3%',
    marginTop: '6px',
    zIndex: '999',
    background: '#193389',
    color: '#ffffff',
    '&:hover': {
      background: '#193389 !important',
      color: '#ffffff',
    },
  },
  // tabs
  tabs: {
    backgroundColor: theme.palette.KenColors.kenWhite,
    borderRadius: '8px',
    [theme.breakpoints.only('xs')]: {
      width: '90vw',
    },
    [theme.breakpoints.only('sm')]: {
      width: '95vw',
    },
  },
  appBar: {
    borderBottom: `0.5px solid ${theme.palette.KenColors.gradeSectionBorder}`,
  },
  selected: {
    color: theme.palette.KenColors.link1,
  },
  tabRoot: {
    color: theme.palette.KenColors.kenBlack,
    fontWeight: 500,
    '& .MuiTab-wrapper': {
      textTransform: 'capitalize',
    },
  },
}));

const health = [
  {
    title: 'Blood Group',
    titleDetails: 'Normal',
    image: Robot,
  },
  {
    title: 'Mental Helath',
    titleDetails: 'Normal',
    image: Robot,
  },
  {
    title: 'Medication',
    titleDetails: 'Albuterol, Levalbuterol',
    image: Robot,
  },
  {
    title: 'Injuries',
    titleDetails: 'Broken Leg',
    image: Robot,
  },
  {
    title: 'Allergies',
    titleDetails: 'Pollen, Gluten',
    image: Robot,
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      style={{ padding: 16 }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}
function KenTabs(props) {
  const { tabPanelProps, dataPlaceHolder, contactId } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [toggle, setToggle] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleToggle = () => {
    if (toggle) {
      setToggle(false);
      setValue(0);
    } else {
      setToggle(true);
    }
  };

  return (
    <div className={{ ...classes.root }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          allowScrollButtonsMobile={true}
          classes={{ root: classes.tabs }}
        >
          <Tab
            label="Current"
            {...a11yProps(0)}
            classes={{
              selected: classes.selected,
              root: classes.tabRoot,
            }}
            style={{
              textTransform: 'none',
            }}
          />
          <Tab
            label="Achievements"
            {...a11yProps(1)}
            classes={{
              selected: classes.selected,
              root: classes.tabRoot,
            }}
            style={{
              textTransform: 'none',
            }}
          />
          <Tab
            label="Conduct"
            {...a11yProps(2)}
            classes={{
              selected: classes.selected,
              root: classes.tabRoot,
            }}
            style={{
              textTransform: 'none',
            }}
          />
        </Tabs>
        <Button
          onClick={() => {
            setValue(3);
            handleToggle();
          }}
          className={classes.btnLabels}
        >
          {toggle ? 'Back' : 'Attendance History'}
        </Button>
      </AppBar>
      <TabPanel value={value} index={0} {...tabPanelProps}>
        <ExtraActivites contactId={contactId} />{' '}
      </TabPanel>
      <TabPanel value={value} index={1} {...tabPanelProps}>
        <Achievements profile={{ ContactId: contactId, Type: 'Student' }} />
      </TabPanel>
      <TabPanel value={value} index={2} {...tabPanelProps}>
        <Conduct />
      </TabPanel>
      <TabPanel value={value} index={3} {...tabPanelProps}>
        <KenCard>
          <GradeBook />
        </KenCard>
      </TabPanel>
      {dataPlaceHolder && <Typography>{dataPlaceHolder}</Typography>}
    </div>
  );
}
// tabs end

function StudentDetailsPage(props) {
  const { t } = useTranslation();
  const {
    state: { config, sideNavigation },
    dispatch,
  } = useAppContext();
  const { handleLoader, handleSnackbarOpen } = React.useContext(context);
  const [layoutSize, setLayoutSize] = React.useState(true);
  const classes = useStyles();
  const [studentData, setStudentData] = React.useState();
  const [tabOptions, setTabOptions] = React.useState();
  const { contactId } = props.match.params;
  const [programid, setProgramId] = React.useState();
  const [getPrograms, setGetPrograms] = React.useState();
  // const [acedemicProgramId, setAcedemicProgramId] = React.useState();
  const [teacherDetails, setTeachersDetail] = React.useState();
  const [AcademicProgram, setAcademicProgram] = React.useState();
  const [value, setValue] = useState(0);
  const [profileUpdate, setProfileUpdate] = useState(true);
  const [profileBasicUpdate, setProfileBasicUpdate] = React.useState(true);
  const [educationUpdate, setEducationUpdate] = React.useState(true);
  const [addressUpdate, setAddressUpdate] = React.useState(true);
  const [relationship, setRelationShip] = React.useState(true);
  const [relationshipDetails, setRelationShipDetails] = React.useState([]);
  const [details, setDetails] = useState({});
  const [addressDetails, setAddressDetails] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [state, setState] = React.useState({});
  const [openDialog, setOpenDialog] = React.useState();
  const [profilePicture, setProfilePicture] = useState();
  const [studentDetails, setStudentDetails] = useState();
  const [profileData, setProfileData] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(false);
  const componentRef = useRef();

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  // React.useEffect(() => {
  //   const firebaseConfig = config && config.firebaseConfig;
  //   const ContactType = JSON.parse(localStorage.getItem('userDetails')).Type;
  //   if (firebaseConfig) {
  //     fbAnalytics(
  //       firebaseConfig,
  //       `${config.orgID}_${ContactType}_studentdetails`
  //     );
  //   }
  //   const userDetails = getUserDetails();
  //   const currentContactId = userDetails.ContactId;

  //   if (currentContactId === contactId) {
  //     setCurrentProfile(true);
  //   } else {
  //     setCurrentProfile(false);
  //   }
  // }, []);
  function TabPanels(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  // React.useEffect(() => {
  //   dispatch({ type: 'updateSideNavigation', value: false });
  // }, []);

  const getStudentData = async () => {
    handleLoader(true);
    try {
      const res = await getStudentDetails(contactId);
      if (res && res.Program_Enrollment) {
        const array = res.Program_Enrollment.map(item => {
          return {
            label: item.Academic_Program,
            value: item.Id,
          };
        });
        setStudentData(res);
        setGetPrograms(array);
        const current =
          res.Program_Enrollment.find(item => item.Status === 'Current') ||
          res.Program_Enrollment[0];
        setAcademicProgram(current.Academic_Program);
        setProgramId(current.Id);
        // setAcedemicProgramId(current.hed__Account__c);
        const faculty = await getFacultyDetails(current.hed__Account__c);
        if (faculty) {
          setTeachersDetail(faculty);
        } else {
          handleLoader(false);
          handleSnackbarOpen(KEY_SEVERITY.error, t('Faculty_Not_Found'));
          console.log('Faculty not found');
        }
        const course = await getAllCourses(contactId, current.Id);
        if (course) {
          setTabOptions(course);
          handleLoader(false);
        } else {
          handleLoader(false);
          handleSnackbarOpen(KEY_SEVERITY.error, t('Course_Not_Found'));
        }
      } else {
        handleLoader(false);
        handleSnackbarOpen(KEY_SEVERITY.error, t('Student_Not_Found'));
      }
    } catch (err) {
      console.log('Error in Fetching student data', err);
      handleLoader(false);
      handleSnackbarOpen(KEY_SEVERITY.error, t('Student_Not_Found'));
    }
  };

  const getStudentInfoData = async () => {
    getStudentInfo(contactId).then(res => {
      setProfileData(res);
    });
    // const profileDetails = {
    //   BirthDate: res.BirthDate,
    //   CountryOfResidence: res.CountryOfResidence,
    //   Email: res.Email,
    //   firstName: res.firstName,
    //   Gender: res.Gender,
    //   lastName: res.lastName,
    //   Phone: res.Phone,
    // };

    // // let a = res[1].map(e => e.edHis);
    // const arry = ['12th', 'Graduate', 'Post Graduate'];
    // setState(profileDetails);
    // const newEducationDetails = res.educationHistory.map(e => e.edHis);
    // const output = newEducationDetails.map(({ Name, ...rest }) => rest);
    // // const newArray = output.filter((eee, index) => {
    // //   return eee.Level__c == arry[index]
    // // })
    // let gData = [];
    // let realData = [];
    // [1, 2, 3].map((e, ind) => {
    //   gData = output.filter((eee, index) => {
    //     return eee.Level__c == arry[ind];
    //   });
    //   realData.push(gData[0]);
    // });
    // console.log('realData', realData);
    // // const newArray = [0,1,2].map((eData) => {
    // //   return  output.filter((ele, i) => {
    // //     return ele.Level__c == arry[i]
    // //     })
    // // })
    // // console.log('newArray', newArray);
    // setDetails(realData);
    // setRelationShipDetails(res.relationship);
    // setAddressDetails([]);
  };

  React.useEffect(() => {
    // getStudentData();
    getStudentInfoData();
  }, []);

  const onchange = async e => {
    const Id = e.target.value;
    setProgramId(Id);
    const obj = studentData.Program_Enrollment.find(o => o.Id === Id);
    setAcademicProgram(obj.Academic_Program);
    handleLoader(true);
    try {
      const faculty = await getFacultyDetails(obj.hed__Account__c);
      if (faculty) {
        setTeachersDetail(faculty);
      } else {
        handleLoader(false);
        handleSnackbarOpen(KEY_SEVERITY.error, t('Faculty_Not_Found'));
        console.log('Faculty not found');
      }
      const course = await getAllCourses(contactId, obj.Id);
      if (course) {
        setTabOptions(course);
        handleLoader(false);
      } else {
        handleLoader(false);
        handleSnackbarOpen(KEY_SEVERITY.error, t('Course_Not_Found'));
      }
    } catch (err) {
      console.log(err);
      handleLoader(false);
    }
  };

  const handleClick = () => {
    dispatch({ type: 'updateSideNavigation', value: true });
    props.history.goBack();
  };

  const userParent = getParentDetails();
  const handleProfileSave = () => {
    setProfileUpdate(prev => !prev);
    setProfileBasicUpdate(false);
    // setEducationUpdate(false);
    // setAddressUpdate(false);
    // setRelationShip(false);
  };

  const handleProfileUpdate = () => {
    // setProfileUpdate(true);
    setProfileBasicUpdate(true);
  };
  // const handleClickedEdit = () => {
  //   setProfileBasicUpdate(false)
  // }
  const handleClose = () => {
    setOpenDialog(false);
    setProfilePicture(null);
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleCancel = () => {
    setProfilePicture(null);
    // setAnchorEl(null);
    // setOpenDialog(false);
  };
  const closeSignPopup = () => {
    setProfilePicture(null);
  };
  const TabData = [
    // {
    //   title: 'My Path',
    //   content: <MyPath />,
    // },
    // {
    //   title: 'Fees',
    //   content: <Fees />,
    // },
    {
      title: 'Current',
      content: <ExtraActivites contactId={contactId} />,
    },
    {
      title: 'Achievements',
      content: (
        <Achievements profile={{ ContactId: contactId, Type: 'Student' }} />
      ),
    },
    {
      title: 'Conduct',
      content: <Conduct />,
    },
    // {
    //   title: 'Request & Complaints',
    //   content: <Request />,
    // },
    // {
    //   title: 'Personal Details',
    //   content: <PersonalDetails />,
    // },
    // {
    //   title: '',
    //   // content: <Conduct />,
    // },
    {
      title: '',
      disabled: true,
      content: <GradeBook />,
    },
  ];
  return (
    <>
      <Grid>
        <Grid item md={12}>
          <BaseCard>
            <ProfileCard
              profile={{ Type: 'Student' }}
              back={true}
              contactInfo={profileData}
            />
          </BaseCard>
        </Grid>
      </Grid>
      <Grid item md={12} style={{ marginTop: '20px' }}>
        <KenTabs
          tabPanelProps={{
            style: { background: '#F4F5F7' },
          }}
          rootStyles={{
            background: '#F4F5F7',
          }}
          contactId={contactId}
        />
      </Grid>
    </>
  );
}

export default withRouter(StudentDetailsPage);
