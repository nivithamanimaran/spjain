import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  Typography,
  useTheme,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
//Global Components
import KenHeader from '../../../global_components/KenHeader/index';
import KenButton from '../../../global_components/KenButton/index';
import KenSnackBar from '../../../components/KenSnackbar';
import KenInputField from '../../../global_components/KenInputField';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';
import KenGridEditable from '../../../global_components/kenGridEditable/kenGridEditable';
import KenCheckbox from '../../../global_components/KenCheckbox/index';
import KenLoader from '../../../components/KenLoader';
import KenDialogBox from '../../../components/KenDialogBox';
import KenSelect from '../../../components/KenSelect';
import {
  AiOutlineMinusSquare,
  AiOutlinePlusSquare,
  AiOutlineFilter,
} from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { RiCheckFill } from 'react-icons/ri';
import { MdOutlineRefresh } from 'react-icons/md';
import '../style.scss';
import EnrollData from './data.json';
import { Link } from 'react-router-dom';
import Routes from '../../../utils/routes.json';
import {
  getCompletedEnrollment,
  getCourseEnrollment,
} from '../../../utils/ApiService';
import { useAppContext } from '../../../utils/contextProvider/AppContext';

const useStyles = makeStyles(theme => ({
  header: {
    color: theme.palette.KenColors.primary,
  },
  toolbar: {
    background: '#fff',
    borderRadius: '10px',
  },
  toolbar2: {
    background: '#F4F5F7',
    padding: 0,
  },
  title: {
    fontSize: '18px',
  },
  headerTitle: {
    fontSize: 12,
    padding: '0px 6px',
    marginRight: '5px',
    lineHeight: '36px',
    height: '37px',
  },
  highlightVal: {
    color: '#fff',
    background: theme.palette.KenColors.primary,
    padding: '2px 5px',
    marginRight: '5px',
  },
  headBody: {
    width: '450px',
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    lineHeight: '36px',
    height: '37px',
    marginRight: '10px',
    borderRadius: '8px',
  },
  creditText: {
    fontSize: 12,
    color: '#090F69',
    marginRight: '5px',
    lineHeight: '33px',
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
  gradeComp: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  totalBorder: {
    height: '35px !important',
    borderBottom: '1px solid #000',
    marginTop: '20px',
  },
  refreshBtn: {
    marginBottom: '8px',
    justifyContent: 'right',
    fontSize: '12px',
    background: '#00218D !important',
    color: '#fff',
    borderRadius: '5px',
  },
  enrolledTitle: {
    background: '#F4F5F7',
    color: '#00218D',
    margin: '10px 0px',
  },
}));
export default function Enroll(props) {
  const { history } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [termData, setTermData] = React.useState({});
  const [enrolledData, setEnrolledData] = React.useState([]);
  const [noData, setNoData] = React.useState('Fetching...');
  const [termMandatoryCredit, setTermMandatoryCredit] = React.useState(0);
  const [termElectiveCredit, setTermElectiveCredit] = React.useState(0);
  const [subjectMandatoryCredit, setSubjectMandatoryCredit] = React.useState(0);
  const [subjectElectiveCredit, setSubjectElectiveCredit] = React.useState(0);
  const [accordienCheck, setAccordienCheck] = useState(false);
  const [studentEnrolled, setStudentEnrolled] = useState(true);
  const [searchInput, setSearchInput] = React.useState('');
  const [creditDialog, setCreditDialog] = useState(false);
  const {
    state: { userDetails },
  } = useAppContext();

  const columns2 = [
    {
      Header: 'Subject Code',
      accessor: 'CourseCode',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course',
      accessor: 'CourseName',
      disableGlobalFilter: true,
    },
    {
      Header: 'Credits',
      accessor: 'credit',
      disableGlobalFilter: true,
    },
    {
      Header: 'Section',
      accessor: 'courseOfferingSectionId',
      disableGlobalFilter: true,
    },
    {
      Header: 'Discipline',
      accessor: 'Discipline',
      disableGlobalFilter: true,
    },
    {
      Header: 'Pre-Requisite/CO-Requisite',
      accessor: 'PreRequisite',
      disableGlobalFilter: true,
    },
  ];

  const confirmEnroll = () => {};
  const filterBtn = () => {};
  React.useEffect(() => {
    setLoading(true);
    let contactID = userDetails.ContactId;
    getCourseEnrollment(contactID)
      .then(res => {
        setTermData(res);
      })
      .catch(err => {
        console.log(err);
      });
    getCompletedEnrollment(contactID)
      .then(res => {
        const enrolledData = [];
        setNoData('Fetching...');
        if (!res.message) {
          Object.entries(res)?.map(item => {
            enrolledData.push({
              courseType:
                item[0] === 'mandatoryCourses'
                  ? 'Mandatory Courses'
                  : 'Elective Courses',
              data: item[1],
            });
          });
          console.log('enrolledData', enrolledData);
          setEnrolledData(enrolledData);
          enrolledData.map(item => {
            if (item?.courseType === 'Mandatory Courses') {
              let credit = item?.data.map(item1 => {
                return item1.credit;
              });
              let creditVal = credit.reduce((a, b) => a + b);
              setSubjectMandatoryCredit(creditVal);
            } else {
              let credit = item?.data.map(item1 => {
                return item1.credit;
              });
              let creditVal = credit.reduce((a, b) => a + b);
              setSubjectElectiveCredit(creditVal);
            }
          });
        } else {
          setEnrolledData([]);
          setNoData('No Data');
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  const creditDialogCancel = () => {
    setCreditDialog(false);
  };
  const creditDialogSubmit = () => {
    setCreditDialog(false);
  };
  return (
    <Grid container xs={12}>
      {loading && <KenLoader />}
      <div
        position="static"
        elevation={0}
        className={classes.header}
        style={{ width: '100%' }}
      >
        <Toolbar className={classes.toolbar}>
          <Grid container>
            <Grid item xs={12} className={classes.headerLeft}>
              <Typography variant="h6" className={classes.title}>
                Open Enrollments for {termData?.TermName}
              </Typography>
            </Grid>
            {/* <Grid item xs={6} className={classes.headerRight}>
             <Typography
                className={classes.creditText}
                style={{ marginRight: '30px' }}
              >
                Credit Wallet Balance: {creditBalance}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ height: '33px' }}
              >
                Buy Credits
              </Button> 
            </Grid>*/}
          </Grid>
        </Toolbar>
        <Toolbar className={classes.toolbar2}>
          <Grid container xs={12}>
            <Grid container className={classes.headBody}>
              <Typography className={classes.headerTitle}>
                Term Requirement:
              </Typography>
              <Typography className={classes.creditText}>
                Mandatory Credit:{' '}
                <span className={classes.highlightVal}>
                  {termData?.MandatoryCredits != null
                    ? termData?.MandatoryCredits
                    : 0}
                </span>
                Elective Credit:{' '}
                <span className={classes.highlightVal}>
                  {termData?.ElectiveCredits != null
                    ? termData?.ElectiveCredits
                    : 0}
                </span>
              </Typography>
              <Typography className={classes.creditText} />
            </Grid>
            <Grid container className={classes.headBody}>
              <Typography className={classes.headerTitle}>
                Course Selected:
              </Typography>
              <Typography className={classes.creditText}>
                Mandatory Credit:{' '}
                <span className={classes.highlightVal}>
                  {subjectMandatoryCredit}
                </span>
                Elective Credit:{' '}
                <span className={classes.highlightVal}>
                  {subjectElectiveCredit}
                </span>
              </Typography>
              <Typography className={classes.creditText} />
            </Grid>
          </Grid>
        </Toolbar>
      </div>
      <Grid container xs={12}>
        {enrolledData.length > 0 ? (
          enrolledData.map((elem, index) => {
            return (
              <>
                <Typography className={classes.enrolledTitle}>
                  {elem.courseType}
                </Typography>
                {/* <div className="kencard-div">
                  <KenCard
                    container
                    xs={12}
                    className="kencard-enroll"
                    style={{ marginTop: '10px' }}
                  >
                    <div
                      className="enroll-kenGrid2"
                      style={{ width: '100%', background: '#fff' }}
                    >
                      <KenGrid
                        columns={columns2}
                        data={elem?.data}
                        noDataText={noData}
                        pagination={{ disabled: true }}
                        toolbarDisabled={true}
                        isCollasable={false}
                      />
                    </div>
                  </KenCard>
                </div> */}
                <Grid container xs={12}>
                  <Grid className={classes.RightBox}>
                    <KenCard paperStyles={{ padding: 0, borderRadius: '4px' }}>
                      <KenGrid
                        columns={columns2}
                        data={elem?.data}
                        noDataText={noData}
                        pagination={{ disabled: true }}
                        toolbarDisabled={true}
                        isCollasable={false}
                      />
                    </KenCard>
                  </Grid>
                </Grid>
              </>
            );
          })
        ) : (
          <Grid container xs={12}>
            <Grid className={classes.RightBox}>
              <KenCard paperStyles={{ padding: 0, borderRadius: '4px' }}>
                <KenGrid
                  columns={columns2}
                  data={[]}
                  noDataText={noData}
                  pagination={{ disabled: true }}
                  toolbarDisabled={true}
                  isCollasable={false}
                />
              </KenCard>
            </Grid>
          </Grid>
          // <div className="kencard-div">
          //   <KenCard
          //     container
          //     xs={12}
          //     className="kencard-enroll"
          //     style={{ marginTop: '10px' }}
          //   >
          //     <div
          //       className="enroll-kenGrid2"
          //       style={{ width: '100%', background: '#fff' }}
          //     >
          //       <KenGrid
          //         columns={columns2}
          //         data={[]}
          //         noDataText={noData}
          //         pagination={{ disabled: true }}
          //         toolbarDisabled={true}
          //         isCollasable={false}
          //       />
          //     </div>
          //   </KenCard>
          // </div>
        )}
      </Grid>
      <Box style={{ width: '100%' }}>
        <>
          <Link
            to={`/${Routes.openEnroll}`}
            className={classes.actionBtn}
            style={{ textDecoration: 'none' }}
          >
            <KenButton
              label="Go to Open Enrollments"
              variant="primary"
              className={classes.refreshBtn}
              style={{
                float: 'right',
                marginRight: '10px',
                marginTop: '20px',
              }}
            />
          </Link>
        </>
      </Box>
    </Grid>
  );
}
