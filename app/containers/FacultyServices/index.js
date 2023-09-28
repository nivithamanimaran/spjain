import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  makeStyles,
  Button,
  Typography,
} from '@material-ui/core';
// import Schedule from './components/Schedule/index';
import clsx from 'clsx';
import {
  getSchedule,
  getStudentDetails,
  getAllCourses,
  getAccountDetails,
  getCourses,
  getStudents,
  facultyActivities,
  StudentActivities,
  getBookRequest,
} from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
// import '../App/styles.scss';
import KenLoader from '../../components/KenLoader';
import KenHeader from '../../global_components/KenHeader/index';
import KenButton from '../../global_components/KenButton';
import KenDialog from '../../global_components/KenDialog';
import KenGrid from '../../global_components/KenGrid';
import KenSelect from '../../components/KenSelect';
import KenCard from '../../global_components/KenCard';
import { KEY_USER_TYPE, KEY_SEVERITY, KEY_STATUS } from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import context from '../../utils/helpers/context';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import history from '../../utils/history';
import fbAnalytics from '../../utils/Analytics';
import configContext from '../../utils/helpers/configHelper';
// import MyTask from './components/MyTask';
// import UpcomingEvents from './components/UpcomingEvents';
// import MyAssessments from './components/MyAssessments';
// import InfoCards from './components/InfoCards';
import ServiceList from './ServiceList';
import ServiceTabs from './ServiceList/data.json';
// import bookRequestForm from './ServiceList/Components/bookRequestForm';
import DashboardCases from './DashboardCases';
import KenInputField from '../../components/KenInputField';
import BookFormCases from './BookForms';
import MarkSheetForm from './MarkSheetForms';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList'
import moment from 'moment';
const useStyles = makeStyles(theme => ({
  root: {
    // minHeight: '100vh',
    [theme.breakpoints.only('xs')]: {
      padding: '0px 0px 20px 0px',
    },
  },
  headBox: {
    backgroundColor: theme.palette.KenColors.kenWhite,
  },
  form: {
    position: 'relative',
  },
  grid: {
    [theme.breakpoints.only('xs')]: {
      margin: '0px 0px 0px -8px',

      '& > .MuiGrid-item': {
        padding: 8,
      },
    },
  },
  cardHandler: {
    position: 'relative',
    height: '187px',
    // width: '369px',
  },
  cardItem: {
    position: 'relative',
    height: '75px',
  },
  maskWrap: {
    position: 'relative',
    height: '100%',
  },
  heading: {
    color: theme.palette.KenColors.neutral900,
    fontWeight: '600',
  },
  subHead: {
    fontSize: 12,
    paddingRight: 15,
    color: theme.palette.KenColors.neutral900,
  },
  cardText: {
    color: theme.palette.KenColors.neutral400,
    fontWeight: '600',
    textTransform: 'uppercase',
    textAlign: 'center',
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    display: 'flex',
  },
  contactText: {
    width: '100%',
    padding: '16px',
    marginTop: '8px',
    borderRadius: '2px',
    textAlign: '-webkit-center',
  },
  statsText: {
    fontSize: 24,
    color: theme.palette.KenColors.kenWhite,
    [theme.breakpoints.only('xs')]: {
      fontSize: '24px',
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: '36px',
    },
  },
  headBtn: {
    marginRight: 20,
  },
  active: {
    borderColor: '#9ecaed',
    boxShadow: '0 0 10px #9ecaed',
  },
  deactive: {
    boxShadow: '0 0 0px #000',
  },
}));

export default function HomePage(props) {
  const { handleLoader, handleSnackbarOpen } = React.useContext(context);
  const { config } = React.useContext(configContext);
  const { t } = useTranslation();
  const classes = useStyles();
  const { drawerChanges } = props;
  const [schedule, setSchedule] = useState();
  const [user, setUser] = useState();
  const [selectOptions] = useState([
    'Fees',
    'Exam',
    'General',
    'Complaint',
    'Request',
  ]);
  const [serviceType, setServiceType] = useState('General');
  const [selectOptions2] = useState(['All']);
  const [addNewServiceItem, setAddNewServiceItem] = React.useState(false);
  const [grade, setGrade] = useState();
  const [serviceTabs] = useState(ServiceTabs?.DashboardTabs);
  const [assignments, setAssignments] = useState();
  const [assessments, setAssessments] = useState();
  const [student, setStudent] = useState();
  const [flag, setFlag] = useState(true);
  const [openCases, setOpenCases] = useState('');
  const [closeCases, setCloseCases] = useState('');
  const [activityUrls, setActivityUrls] = useState();
  const [selectedValue, setSelectedValue] = React.useState('books');
  const [selectedCase, setSelectedCase] = React.useState('Student Feedback');
  const [itemIndex, setItemIndex] = React.useState(1);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [tableData, setTableData] = useState([]);
  const requestOptions = [
    { label: 'Books', value: 'books' },
    { label: 'Mark Sheets', value: 'markSheets' },
  ];
  const columns = [
    {
      Header: 'Case Number',
      accessor: 'Case_Number',
      disableGlobalFilter: true,
    },
    // {
    //   Header: 'Service Type',
    //   accessor: 'Service_Type',
    //   disableGlobalFilter: true,
    // },
    {
      Header: 'Subject',
      accessor: 'Subject',
      disableGlobalFilter: true,
    },
    {
      Header: 'Description',
      accessor: 'Description',
      disableGlobalFilter: true,
    },
    {
      Header: 'Date',
      accessor: 'Date',
      disableGlobalFilter: true,
    },
    {
      Header: 'Status',
      accessor: 'Status',
      disableGlobalFilter: true,
    },
    {
      Header: 'Actions',
      accessor: 'Actions',
      disableGlobalFilter: true,
    },
  ];
  //state for loader
  const [loading, setLoading] = React.useState(false);

  const toggleLoader = val => {
    setLoading(val);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseLater = () => {
    setOpen(false);
  };

  const changedropDown = e => {
    setSelectedValue(e.target.value);
  };
  React.useEffect(() => {
    const contactId = getUserDetails().ContactId;
    setLoading(true);
    getBookRequest(contactId)
      .then(res => {
        let data = [];
        if(res.length > 0){
          res?.map(item => {
            data.push({
              hed__Category__c: item.hed__Category__c
                ? item.hed__Category__c
                : '-',
              Case_No: item.CaseNumber ? item.CaseNumber : '-',
              // Service_Type: item.hed__Category__c ? item.hed__Category__c : '-',
              Subject: item.Subject ? item.Subject : '-',
              Description: item.Description ? item.Description : '-',
              Date: item.CreatedDate
                ? moment(item.CreatedDate).format('DD/MM/YYYY')
                : '-',
              Status: item.Status ? item.Status : '-',
              Case_ID: item.Id ? item.Id : '-',
            });
          });
          setTableData(data);
        }else{
          setTableData([]);
        }
        setLoading(false);
        setDataUpdated(false);
      })
      .catch(err => {
        console.log('error in service list', err);
        setTableData([]);
      });
  }, [dataUpdated]);

  const cancelItem = () => {
    setAddNewServiceItem(false);
    setOpen(false);
    setDataUpdated(true);
  };
  const handleSubmit = () => {
    setAddNewServiceItem(false);
    setOpen(false);
    setDataUpdated(true);
  };
  const handleClose = () => {
    history.push('/accountDetail');
    window.location.reload();
  };
  React.useEffect(() => {
    const ContactType = JSON.parse(localStorage.getItem('userDetails'))?.Type;
    if (config?.firebaseConfig) {
      fbAnalytics(config?.firebaseConfig, `${ContactType}_homepage`);
    }
  }, []);
  React.useEffect(() => {
    drawerChanges('show');
  }, []);
  let profile = getUserDetails();

  useEffect(() => {
    if (profile) {
      handleLoader(true);
      setUser(profile);
      getSchedule(profile.ContactId)
        .then(res => {
          // let schedules = res?.filter(
          //   (ele, ind) =>
          //     ind ===
          //     res?.findIndex(
          //       elem =>
          //         elem.CourseOfferingID === ele.CourseOfferingID &&
          //         elem.Id === ele.Id
          //     )
          // );
          setSchedule(res);
          handleLoader(false);
        })
        .catch(err => {
          console.log('error from schedules', err);
          handleLoader(false);
          // handleSnackbarOpen(KEY_SEVERITY.info, t('Schedules_Not_Available'));
        });
    }
  }, []);

  useEffect(() => {
    if (profile) {
      const data = JSON.parse(sessionStorage.getItem('once'));
      if (data === null) {
        // getAccountDetails(profile.ContactId).then(res => {
        //   // console.log(res);
        //   if (
        //     res.data.fatherDetails ||
        //     res.data.motherDetails ||
        //     res.data.guardianDetails
        //   ) {
        //     return;
        //   } else {
        //     handleClickOpen();
        //     sessionStorage.setItem('once', JSON.stringify(true));
        //   }
        // });
      }
    }
  }, []);

  const getTotalStudentFacultyAttendanceById = async contactId => {
    let numberOfStudents = 0;
    let facultyAttendance = 0;
    try {
      const res = await getCourses(contactId);
      if (res.length > 0) {
        const promiseArray = res.map(item => {
          return getStudents(item.CourseOfferingID);
        });
        Promise.allSettled(promiseArray)
          .then(values => {
            values.forEach(item => {
              if (item?.status === 'fulfilled') {
                numberOfStudents = numberOfStudents + item?.value?.length;
              }
            });
            setStudent(numberOfStudents);
          })
          .catch(error => {
            console.error('Error from promise.all', error);
          });
        res.forEach(ele => {
          facultyAttendance =
            facultyAttendance +
            !Number.isNaN(
              Number.parseFloat(ele.Percentage_of_classes_attended__c)
            )
              ? ele.Percentage_of_classes_attended__c
              : 0;
        });
        // setAttendance(
        //   res?.length ? Math.ceil(facultyAttendance / res.length) : 0
        // );
      }
    } catch (err) {
      console.log('Error in getStudents', err);
    }
  };

  React.useEffect(() => {
    if (user) {
      if (user.Type === KEY_USER_TYPE.faculty) {
        getTotalStudentFacultyAttendanceById(user.ContactId);
      } else {
        handleLoader(true);
        const userDetails = getUserDetails();
        getStudentDetails(userDetails.ContactId)
          .then(res => {
            handleLoader(false);

            const current =
              res.Program_Enrollment.find(item => item.Status === 'Current') ||
              res.Program_Enrollment[0];
            getAllCourses(userDetails.ContactId, current.Id)
              .then(resp => {
                handleLoader(false);
                const a = { ...Object.values(resp) };
                console.log('a: === ', a);
                let total = 0;
                let gradeTotal = 0;
                if (a[0]) {
                  a[0].forEach(el => {
                    total =
                      total + el.Percentage_of_classes_attended__c ==
                      ('null' || 'undefined')
                        ? 0
                        : el.Percentage_of_classes_attended__c;
                    gradeTotal =
                      gradeTotal +
                      (el.hed__Grade__c == 'null' || 'undefined'
                        ? 0
                        : el.hed__Grade__c);
                  });
                }
                // setAttendance(
                //   a[0]?.length ? Math.ceil(total / a[0].length) : 0
                // );
                setGrade(
                  a[0]?.length ? Math.ceil(gradeTotal / a[0].length) : 0
                );
                handleLoader(false);
              })
              .catch(err => {
                console.log('All courses: ', err);
                handleLoader(false);
              });
          })
          .catch(err => {
            console.log('Student Details: ', err);
            handleLoader(false);
            // handleSnackbarOpen(
            //   KEY_SEVERITY.info,
            //   t('Attendance_Not_Available')
            // );
          });
      }
    }
  }, [user]);

  React.useEffect(() => {
    if (
      user &&
      user.Type === KEY_USER_TYPE.faculty &&
      (schedule && schedule.length > 0)
    ) {
      const promiseArray = schedule.map(item => {
        return facultyActivities(user.ContactId, item.Id);
      });
      const activityLinks = [];
      const newAssignment = [];
      const newAssesment = [];
      Promise.allSettled(promiseArray)
        .then(values => {
          if (values && values.length > 0) {
            values.forEach(item => {
              //   if (item.status == !KEY_STATUS.failed) {
              if (
                item?.value?.status != KEY_STATUS.failed &&
                item?.status === 'fulfilled'
              ) {
                item?.value?.courses?.forEach(el => {
                  let subject = el?.fullname;
                  if (el?.activities?.assignment) {
                    el?.activities?.assignment?.forEach(ele => {
                      newAssignment.push({ ...ele, subject });
                    });
                  }
                  if (el?.activities?.quizzes) {
                    el?.activities?.quizzes?.forEach(ele => {
                      newAssesment.push({ ...ele, subject });
                    });
                  }
                  if (el?.url) {
                    activityLinks.push({
                      subject: el?.fullname,
                      url: el?.url,
                      id: el?.connectionid,
                    });
                  }
                });
              }
              setActivityUrls(activityLinks);
              setAssignments(newAssignment);
              setAssessments(newAssesment);
            });
          } else {
            setActivityUrls([]);
            setAssignments([]);
            setAssessments([]);
          }
          setFlag(false);
        })
        .catch(err => {
          console.log('Error', err);
          setActivityUrls([]);
          setAssignments([]);
          setAssessments([]);
          setFlag(false);
        });
    } else if (user) {
      StudentActivities(user.ContactId, '')
        .then(res => {
          const activityLinks = [];
          let newAssignment = [];
          let newAssesment = [];
          res?.courses?.forEach(el => {
            let subject = el.fullname;
            if (el?.activities?.assignment) {
              el?.activities?.assignment.map(elem => {
                newAssignment.push({ ...elem, subject });
              });
            } else {
              newAssignment = [];
            }

            if (el?.activities?.quizzes) {
              el?.activities?.quizzes.map(elem => {
                newAssesment.push({ ...elem, subject });
              });
            } else {
              newAssesment = [];
            }

            if (el?.url) {
              activityLinks.push({
                subject: el.fullname,
                url: el.url,
                id: el.connectionid,
              });
            }
          });
          setActivityUrls(activityLinks);
          setAssignments(newAssignment);
          setAssessments(newAssesment);
          setFlag(false);
        })
        .catch(err => {
          setFlag(false);
          setAssignments([]);
          setAssessments([]);
          setActivityUrls([]);
          console.log('error in studentActivities', err);
        });
    }
  }, [user, schedule]);

  const addNewService = item => {
    setItemIndex(item.index);
    setSelectedCase(item.title);
  };
  const raiseRequest = () => {
    setAddNewServiceItem(true);
  };

  const handleServiceType = value => {
    setServiceType(value);
  };
  const toggleQuery = (open = !addNewServiceItem) => {
    console.log('Reports page: toggleQuery ', open, addNewServiceItem);
    setAddNewServiceItem(open);
  };
  const closeSignPopup = () => {
    setAddNewServiceItem(false);
  };
  return (
    <>
      <Box>
        <Grid item md={12} />
        {loading && <KenLoader />}
        <Grid item md={12}>
          <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
            <Box pt={2} pb={2} pl={2} pr={2}>
              <Grid container direction="column" spacing={3}>
                <Grid item container direction="row" md={12} spacing={3}>
                  {serviceTabs?.map(item => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={6}
                        onClick={() => addNewService(item)}
                      >
                        <div
                          className={
                            itemIndex === item.index
                              ? classes.active
                              : classes.deactive
                          }
                        >
                          <KenCard className={classes.cardItem}>
                            <Typography className={classes.cardText}>
                              {t(`headings:${item.title}`)}
                            </Typography>
                          </KenCard>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>

        {selectedCase === 'Raise A Query' ? (
          <>
            <Grid item md={12}>
              {/* <Box mt={1}>
                <Box mb={1}>
                  <KenHeader
                    title={
                      <Typography className={classes.heading}>
                        {t('headings:DASHBOARD')}{' '}
                      </Typography>
                    }
                  >
                    <div style={{ paddingRight: '10px' }}>
                      <KenButton
                        variant="primary"
                        className={[classes.headerBtn, classes.btnLabels].join(
                          ' '
                        )}
                        onClick={handleGradesSubmit}
                        label={t('labels:View_All_Cases')}
                      />
                    </div>
                    <KenButton
                      variant="secondary"
                      className={[classes.headerBtn, classes.btnLabels].join(
                        ' '
                      )}
                      onClick={handleGradesSubmit}
                      label={t(`labels:Open Cases ${openCases}`)}
                      style={{ marginRight: 20 }}
                    />

                    <KenButton
                      variant="secondary"
                      className={[classes.headerBtn, classes.btnLabels].join(
                        ' '
                      )}
                      onClick={handleGradesSubmit}
                      label={t(`labels:Close Cases ${closeCases}`)}
                    />
                  </KenHeader>
                </Box>
              </Box>  */}
              
              <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                <Box mb={1}>
                  <KenHeader
                    title={
                      <Typography className={classes.heading}>
                        {t('headings:RECENT CASES')}
                      </Typography>
                    }
                  >
                    <Typography className={classes.subHead}>
                      {t('headings: Service Type')}
                    </Typography>
                    <div
                      className="input-field-item"
                      style={{ paddingLeft: '10px' }}
                    >
                      <KenSelect
                        placeholder="Select"
                        inputBaseRootClass={classes.inputBaseClass}
                        className={classes.selectDrawer}
                        options={selectOptions}
                        onChange={event => {
                          handleServiceType(event.target.value);
                        }}
                        name="serviceType"
                        value={serviceType}
                        variant="outline"
                      />
                    </div>
                    {/* <Typography
                      className={classes.subHead}
                      style={{ paddingLeft: '10px' }}
                    >
                      {t('headings: Service Sub-Type')}
                    </Typography>
                    <div
                      className="input-field-item"
                      style={{ paddingLeft: '10px' }}
                    >
                      <KenSelect
                        placeholder="Select"
                        inputBaseRootClass={classes.inputBaseClass}
                        className={classes.selectDrawer}
                        options={selectOptions2}
                        name="serviceSubType"
                        value="All"
                        variant="outline"
                      /> 
                    </div>*/}
                    <div style={{ paddingLeft: '10px' }}>
                      <KenButton
                        variant="primary"
                        className={[classes.headerBtn, classes.btnLabels].join(
                          ' '
                        )}
                        onClick={() => raiseRequest()}
                        label={t(`labels: Raise Query`)}
                        style={{ marginRight: 20 }}
                      />
                    </div>
                  </KenHeader>
                </Box>
              </Box>
            </Grid>

            <Grid item md={12}>
              <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
                <Box pt={0} pb={0} pl={0} pr={0}>
                  <ServiceList homePage={true} tableData={tableData} />
                  {/* <KenGrid columns={columns} data={tableData} pagination={{ disabled: true }} tableTotal={{ disabled: true, checkbox: true }} getRowProps={{ selected: true }} toolbarDisabled={true} /> */}
                </Box>
              </Box>
            </Grid>
          </>
        ) : null}
        {selectedCase === 'Contact' ? (
          <>
            <Grid item md={12} className={classes.headBox}>
              <Grid>
                <Box className={classes.contactText}>
                  <h2>ALLIANCE UNIVERSITY EPGDM DEPARTMENT</h2>
                  <p>
                    19TH CROSS, 7TH MAIN, BTM 2ND STAGE, N S PALYA, BANGALORE –
                    560076
                  </p>

                  <p>TEL: +91 80 26786020 / 21, 26789749</p>

                  <p>
                    Timings: Monday to Saturday: 10:00 am to 4:00 pm (closed on
                    public holidays)
                  </p>
                </Box>
              </Grid>
            </Grid>
          </>
        ) : null}

        {selectedCase === 'Student Feedback' ? (
          <>
          <Grid item md={12}>
            <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
              <Box mb={1}>
                <KenHeader
                  title={
                    <Typography className={classes.heading}>
                      {t('headings:Feeback Form')}
                    </Typography>
                  }
                >
                </KenHeader>
              </Box>
            </Box>
            <Grid sm={12} x={12}>
              <form className={classes.feebackform}>
                <div className="formCaseWrap">
                  <FeedbackForm />
                </div>
              </form>
            </Grid> 
            <Grid item md={12}>
            <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
              <Box pt={0} pb={0} pl={0} pr={0}>
                <FeedbackList homePage={true} />
                <KenGrid columns={columns} data={tableData} pagination={{ disabled: true }} tableTotal={{ disabled: true, checkbox: true }} getRowProps={{ selected: true }} toolbarDisabled={true} />
              </Box>
            </Box>
          </Grid>
            
          </Grid>
        </>
        ) : null} 
        
        <KenDialog
          toggleOpen={setOpen}
          open={addNewServiceItem}
          // toggleOpen={toggleQuery}
          handleClose={() => {
            setAddNewServiceItem(false);
          }}
          onNegativeButtonClick={closeSignPopup}
          onPositiveButtonClick={closeSignPopup}
          dialogActionFlag={false}
          hidePositiveButton={true}
          hideNegativeButton={true}
          titleContainerStyles={{ padding: '0px' }}
        >
          <Grid item md={12}>
            <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
              <Box pt={0} pb={0} pl={0} pr={0}>
                <DashboardCases
                  selectedCase={selectedCase}
                  serviceType={serviceType}
                  cancelItem={cancelItem}
                  handleSubmit={handleSubmit}
                />
              </Box>
            </Box>
          </Grid>
        </KenDialog>
      </Box>
    </>
  );
}
