import AppBar from '@material-ui/core/AppBar';
import {
  StylesProvider,
  jssPreset,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Suspense, lazy } from 'react';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import MenuAppBar from '../../components/Header/MenuAppBar';
import KenLoader from '../../components/KenLoader/index';
import KenSnackbar from '../../components/KenSnackbar/index';
import SideNavigation from '../../components/SideNavigation/SideNavigation';
import firebase from 'firebase';
import Routes from '../../utils/routes.json';
//RTL
import { Grid, Toolbar, useMediaQuery } from '@material-ui/core';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { ErrorBoundary } from 'react-error-boundary';
import { getCon } from '../../init-fcm';
import { ErrorFallback } from '../../utils/ErrorBoundary';
import {
  KEY_LOGIN_ACCESS_TOKEN,
  KEY_STATUS,
  KEY_USER_DETAILS,
} from '../../utils/constants';
import { useAppContext } from '../../utils/contextProvider/AppContext';
import context from '../../utils/helpers/context';
import { getUserDetails, logOut } from '../../utils/helpers/storageHelper';
import ProtectedRoute from '../../utils/rbac/ProtectedRoute';
const HomePage = React.lazy(() => import('containers/HomePage/Loadable'));
const ClassroomPage = React.lazy(() =>
  import('../FacultyPortal/ClassRoomPage/Loadable')
);
const StudentsPage = React.lazy(() =>
  import('containers/StudentsPage/Loadable')
);

const EvaluationPlan = React.lazy(() =>
  import('../../containers/EvalutionPlan/index')
);
const EvaluationPlanAdd = React.lazy(() =>
  import('../../containers/EvalutionPlan/Addd')
);
const FacultyOnboard = React.lazy(() =>
  import('../FacultyPortal/Facultyonboard/facultyOnboard')
);
const documentUpload = React.lazy(() =>
  import('../FacultyPortal/Facultyonboard/documentUpload')
);

const EventsPage = React.lazy(() => import('containers/EventsPage/Loadable'));
const ParentResources = React.lazy(() =>
  import('containers/ParentResources/Loadable')
);
const StudentClassroomDetails = React.lazy(() =>
  import('../StudentClassroomDetails/Loadable')
);
const ParentService = React.lazy(() =>
  import('../CommonPortal/Service/Loadable')
);
const EventDetails = React.lazy(() =>
  import('../EventsPage/components/EventDetails')
);

const FacultyDirectory = React.lazy(() =>
  import('../FacultyPortal/FacultyDirectory/index')
);
const FacultyDetails = React.lazy(() =>
  import('../FacultyPortal/FacultyDirectory/components/faculityDetails')
);
const Footer = React.lazy(() => import('../../components/Footer'));
const Thankyou = React.lazy(() => import('../../components/Footer'));
const ContentCreationPage = React.lazy(() =>
  import('../FacultyPortal/ContentCreationPage')
);
const IdeaHubPage = React.lazy(() => import('../IdeaHubPage'));
const ClassroomStudentPage = React.lazy(() =>
  import('../StudentPortal/ClassroomPage')
);
const VisitorsPass = React.lazy(() => import('../ParentPortal/VisitorsPass'));
const Timetable = React.lazy(() => import('../Timetable/Timetable'));
const AssessmentPage = React.lazy(() => import('../AssessmentPage'));
const Feedbackstudents = React.lazy(() => import('../Feedbacks'));
//Routes

const PaymentSuccess = React.lazy(() =>
  import('../ParentPortal/PaymentSuccessful/index')
);
const AccountDetail = React.lazy(() => import('../AccountDetails/index'));
const Reports = React.lazy(() =>
  import('../../containers/ProgressReports/ReportsPage')
);
const SubjectTeacherGradesView = React.lazy(() =>
  import('../../containers/ProgressReports/SubjectTeacherGradesView/index')
);
const CourseContentCreation = React.lazy(() =>
  import('../../containers/CourseContentCreation')
);
const Assessment = React.lazy(() => import('../Assessment/index'));
const QuestionBank = React.lazy(() =>
  import('../Assessment/QuestionPage/index')
);
const Profile = React.lazy(() => import('../Profile/Profile'));
const EditProfile = React.lazy(() => import('../Profile/EditProfile'));
const StudentsFeedbackNew = React.lazy(() =>
  import('../studentFeedback/StudentFeedBackNew')
);
const StudentsFeedbackForm = React.lazy(() =>
  import('../studentFeedback/studentFeedbackForm/studentFeedbackform')
);
const StudentDetails = React.lazy(() =>
  import('../MyStudents/components/StudentDetails')
);
const FacultyFeedbackForm = React.lazy(() =>
  import(
    '../../../app/containers/facultyFeedback/facultyFeedbackForm/facultyFeedbackform'
  )
);
const FacultyFeedbackNew = React.lazy(() =>
  import('../../../app/containers/facultyFeedback/facultyFeedBackNew')
);
const Facultyfeedbacks = React.lazy(() => import('../Feedbacks/facultyIndex'));
const Students = React.lazy(() => import('../Students/index'));
const MyCart = React.lazy(() => import('../ParentPortal/FeeManagement/MyCart'));
const FeeSchedule = React.lazy(() =>
  import('../ParentPortal/FeeManagement/FeeSchedule')
);
const FeesPayment = React.lazy(() =>
  import('../ParentPortal/FeeManagement/FeePayment')
);
const MyTransactions = React.lazy(() =>
  import('../ParentPortal/FeeManagement/MyTransactions')
);
const RaiseRequest = React.lazy(() => import('../StudentServices/index'));
const ServiceList = React.lazy(() =>
  import('../StudentServices/ServiceList/index')
);
const facultyProfile = React.lazy(() =>
  import('../FacultyPortal/FacultyProfiles/facultyProfile')
);
const ManualPayments = React.lazy(() =>
  import('../ParentPortal/FeeManagement/ManualPayment/index')
);
const SubjectDocumnet = React.lazy(() =>
  import('../FacultyPortal/SubjectDocument')
);
const SubjectDocumentUpload = React.lazy(() =>
  import('../FacultyPortal/SubjectDocument/SubjectDocumentUpload')
);
const Enroll = React.lazy(() => import('../Enroll'));
const FacultyPortal = React.lazy(() => import('../Faculty'));
const ExamPageFaculty = React.lazy(() =>
  import('../Faculty/ExamPage/examPageFaculty')
);
const ExamPage = React.lazy(() => import('../StudentExam/ExamPage/examPage'));
const FeeModule = React.lazy(() => import('../ParentPortal/FeeModule/index'));
const Gradebook = React.lazy(() => import('../Gradebook'));
const IndicateAvailability = React.lazy(() =>
  import('../FacultyPortal/SubjectDocument/IndicateAvailability')
);
const Exams = React.lazy(() => import('../Exams'));
const FacultySubject = React.lazy(() =>
  import('../Faculty/ExamPage/FacultySubject')
);
const EventsModified = React.lazy(() => import('../EventsModified'));
const AcademicDashboard = React.lazy(() =>
  import('../AcademicDashboard/index')
);
const FacultyAcademics = React.lazy(() =>
  import('../AcademicDashboard/FacultyDashboard/index')
);
const CompleteEnroll = React.lazy(() =>
  import('../Enroll/complete-enrollment')
);
const OpenEnroll = React.lazy(() => import('../Enroll/open-enroll'));
const MyClasses = React.lazy(() => import('../MyClasses'));
const ClassDetails = React.lazy(() =>
  import('../MyClasses/components/classDetails')
);
const StudentPerformance = React.lazy(() =>
  import('../MyClasses/components/studentPerformace')
);
const MyStudents = React.lazy(() => import('../MyStudents'));
const ScoreSheet = React.lazy(() =>
  import('../MyStudents/components/ScoreSheet')
);
const StudentAttendance = React.lazy(() => import('../Attendance/index'));
const FacultyAttendance = React.lazy(() =>
  import('../FacultyAttendance/index')
);
const StudentReport = React.lazy(() =>
  import('../StudentReport/StudentReport')
);
const FacultyReport = React.lazy(() =>
  import('../FacultyReport/FacultyReport')
);
const StudentsBySubComponent = React.lazy(() =>
  import('../FacultyReport/StudentsBySubComponent')
);
const GradeBookview = React.lazy(() =>
  import('../../containers/Attendance/components/DetailsPopup/index')
);
const My360 = React.lazy(() => import('../My360'));
const Examinations = React.lazy(() => import('../Examinations/Examinations'));
const Test = React.lazy(() => import('../My360/components/Test'));
const Detail = React.lazy(() => import('../Feedbacks/Detail'));
const hostEvent = React.lazy(() => import('../HostEvent/index'));
const EventDetails1 = React.lazy(() => import('../Events/index'));
const ExamFaculty = React.lazy(() =>
  import('../ExamNew/Exam-Faculty/index.jsx')
);
const MarksUploadPreview = React.lazy(() =>
  import('../ExamNew/Exam-Faculty/components/Marks Upload/preview.jsx')
);
const MarksBreakDownPre = React.lazy(() =>
  import('../ExamNew/Exam-Student/MarksBreak/MarksBreakDownPre.jsx')
);
const ExamStudent = React.lazy(() =>
  import('../ExamNew/Exam-Student/ExamStudent.jsx')
);
const StudentService = React.lazy(() =>
  import('../ExamNew/StudentService/studentService')
);
const Support = React.lazy(() => import('../Student Service/Support'));
const AddRequest = React.lazy(() => import('../Student Service/AddRequest'));
const SupportDetails = React.lazy(() =>
  import('../Student Service/SupportDetails')
);
const Tasks = React.lazy(() => import('../Student Service/Filterdata'));
const AddAchievements = React.lazy(() =>
  import('../My360/components/Achievements/AddAchivements')
);
const ExaminationsFaculty = React.lazy(() =>
  import('../ExaminationsFaculty/ExaminationsFaculty')
);
const SpecificEvent = React.lazy(() => import('../Events/index'));
const Greivance = React.lazy(() => import('../Student Service/Greivance'));
const RaiseTicket = React.lazy(() => import('../Student Service/RaiseTicket'));
// lazy loading of components
const SmartContent = lazy(() =>
  import('../StudentPortal/ClassroomPage/SmartContent/index')
);
const SubjectClass = lazy(() =>
  import(
    '../StudentPortal/ClassroomPage/SmartContent/Components/subjectName/index'
  )
);
const SubjectContent = lazy(() =>
  import(
    '../StudentPortal/ClassroomPage/SmartContent/Components/subjectContent/index'
  )
);

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.KenColors.neutral400,
    minHeight: '100vh',
    background: theme.palette.KenColors.background,
    position: 'relative',
  },


  appBar: {
    zIndex: theme.zIndex.drawer + 2,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
 

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  contentTrue: {
    flexGrow: 1,
    background: theme.palette.background.default,
    marginBottom: 10,
    minHeight: '80vh',
  },
  wrapper: {
    display: 'flex',
  },
  contentFalse: {
    flexGrow: 1,
    background: theme.palette.background.default,
    marginBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    width: '100%',
  },
  newSideNav: {
    maxWidth: '100%',
    padding: '70px 24px',
  },

  mainWrap: {
    width: 'calc(100% - 70px)',
    padding: 24,
    background: theme.palette.KenColors.neutral20,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

export default function MainLayout(props) {
  const { history } = props;
  const classes = useStyles();
  const theme = useTheme();

  const {
    state: { config, userDetails, sideNavigation },
    dispatch,
  } = useAppContext();
  const { drawer: { open: drawerOpen = true } = {} } = config || {};
  const [openDrawer, setOpenDrawer] = React.useState(
    sideNavigation || drawerOpen
  );
  //for global snackbar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState(
    KEY_STATUS.success
  );
  const [heading, setHeading] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [showDrawer] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false); //for responsive drawer
  const [webOpen, setWebOpen] = React.useState(true);
 // for global loader
 const [loading, setLoading] = React.useState(false);
  const mobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

  window.addEventListener('storage', () => {
    const userDetails = localStorage.getItem(KEY_USER_DETAILS);
    const tokenCheck = localStorage.getItem(KEY_LOGIN_ACCESS_TOKEN);
    if (!userDetails) {
      logOut(config, history);
      history.push('/');
    }
    if (!tokenCheck) {
      logOut(config, history);
    }
  });

  const onDrawerChanges = () => {
    setMobileOpen(!mobileOpen);
  };
  const onWebDrawerChanges = isOpen => {
    setWebOpen(!webOpen);
  };

  const handleDrawer = text => {
    switch (text) {
      case 'show':
        setWebOpen(true);
        break;

      case 'hide':
        setWebOpen(false);
        break;

      default:
        setWebOpen(!webOpen);
    }
  };
 
  const handleLoader = val => {
    if (val !== undefined) {
      setLoading(val);
    } else {
      setLoading(!loading);
    }
  };


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };


 // Validate if userDetails are available and logout if not present
 React.useEffect(() => {
  const uD = getUserDetails();
  if (uD) {
    dispatch({ type: 'updateUserDetails', value: uD });
  } else {
    // Logout
    logOut(config, history);
  }

  if (config) {
    dispatch({
      type: 'updateSideNavigation',
      value: drawerOpen,
    });
  }
}, []);


React.useEffect(() => {
  // Collapse sidebar in mobile screens
  if (mobileScreen) {
    setOpenDrawer(false);
  } else {
    setOpenDrawer(sideNavigation);
  }
}, [sideNavigation, mobileScreen]);



  React.useEffect(() => {
    if (config && firebase.messaging.isSupported()) {
      getCon(config);
      if ('serviceWorker' in navigator && config) {
        navigator.serviceWorker
          .register('./firebase-messaging-sw.js')
          .then(function(registration) {
            // firebase
            //   .messaging()
            //   .getToken({ serviceWorkerRegistration: registration });

            console.log(
              'Registration successful, scope is:',
              registration.scope
            );
          })
          .catch(function(err) {
            console.log('Service worker registration failed, error:', err);
          });
      }
    }
  }, [config]);


  if (!userDetails) return <KenLoader />;

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
        window.location.reload();
      }}
    >
      <StylesProvider jss={jss}>
        <context.Provider
          value={{
            handleLoader: handleLoader,
            handleSnackbarOpen: handleSnackbarOpen,
          }}
        >
          <Router history={history}>
            <div className={classes.root}>
              {/* global loader */}
              {loading && <KenLoader />}

              <main
                className={webOpen ? classes.contentTrue : classes.contentFalse}
              >
                <KenSnackbar
                  message={snackbarMessage}
                  severity={snackbarSeverity}
                  autoHideDuration={4000}
                  open={openSnackbar}
                  handleSnackbarClose={handleSnackbarClose}
                  position="Bottom-Right"
                />
                <div className={classes.wrapper}>
                  <div className={classes.sideNavWrap}>
                    {mobileScreen ? (
                      <SideNavigation
                        openDrawer={openDrawer}
                        setOpenDrawer={setOpenDrawer}
                        showDrawer={showDrawer}
                        mobileScreen={mobileScreen}
                        drawerChanges={onWebDrawerChanges}
                        open={webOpen}
                        setHeading={setHeading}
                        variant={'temporary'}
                      />
                    ) : (
                      <SideNavigation
                        openDrawer={openDrawer}
                        setOpenDrawer={setOpenDrawer}
                        showDrawer={showDrawer}
                        open={webOpen}
                        drawerChanges={onWebDrawerChanges}                 
                        mobileScreen={mobileScreen}
                        setHeading={setHeading}
                        variant={'permanent'}

                   
                      />
                    )}
                    {/* </Hidden> */}
                  </div>
                  <Grid
                    xs={12}
                    sm={12}
                    className={webOpen ? classes.mainWrap : classes.newSideNav}
                  >
                    <AppBar
                      position="fixed"
                      className={clsx(classes.appBar, {
                        [classes.appBarShift]: openDrawer,
                      })}
                    >
                      <MenuAppBar
                        drawerChanges={onDrawerChanges}
                        openDrawer={openDrawer}
                        setOpenDrawer={setOpenDrawer}
                        className={clsx(classes.appBar, {
                          [classes.appBarShift]: openDrawer,
                        })}
                        heading={heading}
                      />
                    </AppBar>
                    <Toolbar />
                    {/* Routes */}
                    <Suspense fallback={<div>Loading...</div>}>
                      <Route
                        exact
                        path="/"
                        render={() => <Redirect to={`/${Routes.home}`} />}
                      />
                      <Route
                        exact
                        path={`/${Routes.home}`}
                        render={routerProps => (
                          <HomePage
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        path={`/${Routes.contentCreation}`}
                        component={ContentCreationPage}
                      />
                      <Route
                        path={`/${Routes.courseContentCreation}`}
                        component={CourseContentCreation}
                      />
                      <Route
                        path={`/${Routes.hostEvent}`}
                        component={hostEvent}
                      />
                      <Route
                        path={`/${Routes.eventDetails1}`}
                        component={EventDetails1}
                      />
               
                      <Route
                        path={`/${Routes.facultyExams}`}
                        render={routerProps => (
                          <ExamFaculty
                            {...routerProps}
                            setHeading={setHeading}
                          />
                        )}
                      />
                      <Route
                        path={`/${Routes.MarksUploadPreview}`}
                        component={MarksUploadPreview}
                      />
                  
                      <Route
                        path={`/${Routes.ExamStudent}`}
                        render={routerProps => (
                          <ExamStudent
                            {...routerProps}
                            setHeading={setHeading}
                          />
                        )}
                      />
                          <Route
                        path={`/${Routes.studentService}`}
                        render={routerProps => (
                          <StudentService
                            {...routerProps}
                            setHeading={setHeading}
                          />
                        )}
                      />
                                     
                      <Route
                        path={`/${Routes.MarksBreakDownPre}`}
                        component={MarksBreakDownPre}
                      />
                      <Route
                        exact
                        path={`/${Routes.Profile}/:contactId`}
                        render={routerProps => (
                          <Profile
                            {...routerProps}
                            drawerChanges={onWebDrawerChanges}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.editProfile}`}
                        render={routerProps => (
                          <EditProfile
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.classroom}`}
                        component={ClassroomPage}
                      />
                      <Route
                        exact
                        path={`/${Routes.students}`}
                        render={routerProps => (
                          <StudentsPage
                            {...routerProps}
                            drawerChanges={handleDrawer}
                            drawerFlag={webOpen}
                          />
                        )}
                      />

                      <Route
                        exact
                        path={`/${Routes.evaluationPlan}`}
                        render={routerProps => (
                          <EvaluationPlan
                            {...routerProps}
                            drawerChanges={handleDrawer}
                            setHeading={setHeading}

                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.evaluationPlanAdd}`}
                        render={routerProps => (
                          <EvaluationPlanAdd
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
             
                      <Route
                        exact
                        path={`/${Routes.facultyDirectory}`}
                        render={routerProps => (
                          <FacultyDirectory
                            {...routerProps}
                            drawerChanges={handleDrawer}
                            drawerFlag={webOpen}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultyDetails}`}
                        render={routerProps => (
                          <FacultyDetails
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.thankyou}`}
                        render={routerProps => (
                          <Thankyou
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.studentDetailsInterview}`}
                        render={routerProps => (
                          <StudentDetails
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        path={`/${Routes.FacultyOnboard}`}
                        component={FacultyOnboard}
                      />
                      <Route
                        path={`/${Routes.documentUpload}`}
                        component={documentUpload}
                      />
                      <Route
                        exact
                        path={`/${Routes.events}`}
                        render={routerProps => (
                          <EventsPage
                            {...routerProps}
                            drawerChanges={onDrawerChanges}
                          />
                        )}
                      />
              
                      <Route
                        exact
                        path={`/${Routes.details}`}
                        render={routerProps => (
                          <Detail
                            {...routerProps}
                            drawerChanges={onDrawerChanges}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.eventDetails}/:eventId`}
                        render={routerProps => (
                          <EventDetails
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.ideaHub}`}
                        component={IdeaHubPage}
                      />
                      <Route
                        exact
                        path={`/${Routes.classroom}/${Routes.studentDetails}`}
                        component={StudentClassroomDetails}
                      />
                      <Route
                        exact
                        path={`/${Routes.service}`}
                        component={ParentService}
                      />
                      <Route
                        exact
                        path={`/${Routes.parentResources}`}
                        component={ParentResources}
                      />
                      <Route
                        exact
                        path={`/${Routes.parentResources}`}
                        component={ParentResources}
                      />
                      <Route
                        exact
                        path={`/${Routes.feePayment}`}
                        render={routerProps => (
                          <FeeModule
                            {...routerProps}
                            setHeading={setHeading}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.academics}`}
                        render={routerProps => (
                          <AcademicDashboard
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.attendance}`}
                        render={routerProps => (
                          <StudentAttendance
                            {...routerProps}
                            setHeading={setHeading}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultyAttendance}`}
                        render={routerProps => (
                          <FacultyAttendance
                            {...routerProps}
                            drawerChanges={handleDrawer}
                            setHeading={setHeading}

                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultyAcademics}`}
                        render={routerProps => (
                          <FacultyAcademics
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.classroomStudent}`}
                        component={ClassroomStudentPage}
                      />
                      <Route
                        exact
                        path={`/${Routes.GradeBookview}`}
                        component={GradeBookview}
                      />
                      <Route
                        exact
                        path={`/${Routes.visitorsPass}`}
                        component={VisitorsPass}
                      />
                      <Route
                        exact
                        path={`/${Routes.smartContent}`}
                        render={routerProps => (
                          <SmartContent
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.subjectClass}/:sub`}
                        render={routerProps => (
                          <SubjectClass
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.subjectContent}/:topicName`}
                        render={routerProps => (
                          <SubjectContent
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.paymentSucces}`}
                        render={routerProps => (
                          <PaymentSuccess
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.accountDetail}`}
                        render={routerProps => (
                          <AccountDetail
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.gradeBook}`}
                        render={routerProps => (
                          <Gradebook
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.enroll}`}
                        render={routerProps => (
                          <Enroll
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <ProtectedRoute
                        exact
                        path={`/${Routes.grades}`}
                        component={SubjectTeacherGradesView}
                        drawerChanges={handleDrawer}
                        feature="grades"
                        action="view"
                      />
                      <Route
                        exact
                        path={`/${Routes.timetable}`}
                        render={routerProps => (
                          <Timetable
                            {...routerProps}
                            setHeading={setHeading}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.assessment}`}
                        render={routerProps => (
                          <Assessment
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.questionBank}`}
                        render={routerProps => (
                          <QuestionBank
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.reports}`}
                        render={routerProps => (
                          <Reports
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.myClasses}`}
                        render={routerProps => (
                          <MyClasses
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.class}`}
                        render={routerProps => (
                          <ClassDetails
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.studentPerformance}`}
                        render={routerProps => (
                          <StudentPerformance
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.studentAssessment}`}
                        render={routerProps => (
                          <AssessmentPage
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.studentAssessment}`}
                        render={routerProps => (
                          <StudentDetails
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.feedBack}`}
                        render={routerProps => (
                          <StudentsFeedbackNew
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.Support}`}
                        render={routerProps => (
                          <Support
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.AddRequest}`}
                        render={routerProps => (
                          <AddRequest
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.RaiseTicket}`}
                        render={routerProps => (
                          <RaiseTicket
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.Greivance}`}
                        render={routerProps => (
                          <Greivance
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.addAchievements}`}
                        render={routerProps => (
                          <AddAchievements
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.filterdata}`}
                        render={routerProps => (
                          <Tasks
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.SupportDetails}`}
                        render={routerProps => (
                          <SupportDetails
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.studentFeedBackForm}`}
                        render={routerProps => (
                          <StudentsFeedbackForm
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultFeedBack}`}
                        render={routerProps => (
                          <FacultyFeedbackNew
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultFeedBackForm}`}
                        render={routerProps => (
                          <FacultyFeedbackForm
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
          
                      <Route
                        exact
                        path={`/${Routes.Feedbacks}`}
                        render={routerProps => (
                          <Feedbackstudents
                            {...routerProps}
                            setHeading={setHeading}
                            drawerChanges={onDrawerChanges}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.FacultyFeedbacks}`}
                        render={routerProps => (
                          <Facultyfeedbacks
                            {...routerProps}
                            drawerChanges={onDrawerChanges}
                            setHeading={setHeading}

                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.myCart}`}
                        render={routerProps => (
                          <MyCart
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.feeSchedule}`}
                        render={routerProps => (
                          <FeeSchedule
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.feesPayment}`}
                        render={routerProps => (
                          <FeesPayment
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.manualPayment}`}
                        render={routerProps => (
                          <ManualPayments
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.my360}`}
                        render={routerProps => (
                          <My360
                            {...routerProps}
                            setHeading={setHeading}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />{' '}
                      <Route
                        exact
                        path={`/${Routes.examination}`}
                        render={routerProps => (
                          <Examinations
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />{' '}
                      <Route
                        exact
                        path={`/${Routes.testpage}`}
                        render={routerProps => (
                          <Test {...routerProps} drawerChanges={handleDrawer} />
                        )}
                      />{' '}
                      <Route
                        exact
                        path={`/${Routes.examinationsFaculty}`}
                        render={routerProps => (
                          <ExaminationsFaculty
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.myTransactions}`}
                        render={routerProps => (
                          <MyTransactions
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.raiseRequest}`}
                        render={routerProps => (
                          <RaiseRequest
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.serviceList}`}
                        render={routerProps => (
                          <ServiceList
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.myStudents}`}
                        render={routerProps => (
                          <MyStudents
                            {...routerProps}
                            drawerChanges={handleDrawer}
                            setHeading={setHeading}

                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.scoresheet}`}
                        render={routerProps => (
                          <ScoreSheet
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultyProfile}`}
                        component={facultyProfile}
                        drawerChanges={handleDrawer}
                        feature="facultyProfile"
                        action="view"

                        // render={routerProps => (
                        //   <facultyProfile
                        //   // {...routerProps}
                        //   // drawerChanges={handleDrawer}
                        //   />
                        // )
                        // }
                      />
                      <Route
                        exact
                        path={`/${Routes.subjectDocument}`}
                        component={SubjectDocumnet}
                        drawerChanges={handleDrawer}
                        feature="subjectDocument"
                        action="view"
                      />
                      <Route
                        exact
                        path={`/${Routes.indicateAvailability}`}
                        component={IndicateAvailability}
                        drawerChanges={handleDrawer}
                        feature="indicateAvailability"
                        action="view"
                      />
                      <Route
                        exact
                        path={`/${Routes.SubjectDocumentUpload}/:id`}
                        component={SubjectDocumentUpload}
                        drawerChanges={handleDrawer}
                        feature="subjectDocument"
                        action="view"
                      />
                      <Route
                        exact
                        path={`/${Routes.faculty}`}
                        component={ExamPageFaculty}
                        drawerChanges={handleDrawer}
                        feature="faculty"
                        action="view"
                      />
                      <Route
                        exact
                        path={`/${Routes.facultySubject}`}
                        component={FacultySubject}
                        drawerChanges={handleDrawer}
                        feature="facultySubject"
                        action="view"
                      />
                      <Route
                        exact
                        path={`/${Routes.student_exam}`}
                        component={ExamPage}
                        drawerChanges={handleDrawer}
                        feature="faculty"
                        action="view"

                        // render={routerProps => (
                        //   <facultyProfile
                        //   // {...routerProps}
                        //   // drawerChanges={handleDrawer}
                        //   />
                        // )
                        // }
                      />
                      <Route
                        exact
                        path={`/${Routes.exams}`}
                        render={routerProps => (
                          <Exams
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.eventsModified}`}
                        render={routerProps => (
                          <EventsModified
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.eventDetails1}/:eventId`}
                        render={routerProps => (
                          <SpecificEvent
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <ProtectedRoute
                        exact
                        path={`/${Routes.studentsByOffering}`}
                        component={Students}
                        drawerChanges={handleDrawer}
                        feature="studentsByOffering"
                        action="view"
                        setHeading={setHeading}

                      />
              
                      <Route
                        exact
                        path={`/${Routes.completeEnroll}`}
                        render={routerProps => (
                          <CompleteEnroll
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.openEnroll}`}
                        render={routerProps => (
                          <OpenEnroll
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.result}`}
                        render={routerProps => (
                          <StudentReport
                            {...routerProps}
                            setHeading={setHeading}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.facultyresult}`}
                        render={routerProps => (
                          <FacultyReport
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                      <Route
                        exact
                        path={`/${Routes.studentByComponent}/:id`}
                        render={routerProps => (
                          <StudentsBySubComponent
                            {...routerProps}
                            drawerChanges={handleDrawer}
                          />
                        )}
                      />
                    </Suspense>
                  </Grid>
                </div>
              </main>
              <div className={classes.footer}>
                <Footer />
              </div>
            </div>
          </Router>
        </context.Provider>
      </StylesProvider>
    </ErrorBoundary>
  );
}
