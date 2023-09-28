import { Box, Button, Card, Grid, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import KenLoader from '../../components/KenLoader';
import { getSection } from '../../utils/ApiService';
import Routes from '../../utils/routes.json';
import KenGrid from '../../global_components/KenGrid';
import './add.css';
import { getUserDetails } from '../../utils/helpers/storageHelper';
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '20px',
    width: '100%',
    '&>div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '&>div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '300%',
      },
    },
    '&>div>div>table>thead>tr>th:nth-child(1)': {
      [theme.breakpoints.down('sm')]: {
        textAlign: 'start',
        paddingLeft: '11px',
      },
    },

    '&>div>div>table>thead>tr>th:nth-child(4)': {
      [theme.breakpoints.down('sm')]: {
        textAlign: 'start',
        width: '60px',
      },
    },
    '&>div>div>table>thead>tr>th:nth-child(5)': {
      [theme.breakpoints.down('sm')]: {
        textAlign: 'start',
        width: '170px',
      },
    },
    '&>div>div>table>thead>tr>th:nth-child(6)': {
      [theme.breakpoints.down('sm')]: {
        paddingRight: '11px',
      },
    },
  },
  container: {
    background: '#ffffff',
    borderRadius: '12px',
    height: '420px',
    paddingBottom: 30,
  },
  content: {
    color: '#193389',
    fontWeight: 600,
    fontSize: '24px',
    marginTop: '16px',
  },
  content1: {
    color: 'black',
    fontWeight: 500,
    fontSize: '20px',
  },
  line: {
    width: '100%',
    height: '2px',
    background:
      'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(210, 225, 233, 1))',
    marginTop: '10px',
  },
  title: {
    fontWeight: 600,
    fontSize: '24px',
    color: '#000000',
  },
  btn: {
    textTransform: 'capitalize',
    height: '32px',
    marginTop: '15px',
  },
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  examTable: {
    '& .MuiTableCell-root': {
      fontSize: '14px',
    },
  },
}));

const arrayBreadCrumb = [
  {
    head: 'Evalution Plan',
    url: Routes.evaluvationPlan,
  },
];
export default function EvaluationPlan(props) {
  props.setHeading("Evaluation Plan")
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const profile = getUserDetails();
  const [noDataText, setNoDataText] = useState('Fetching...');
  
  const pushtabs = data => {
    let details = data;
    history.push({
      pathname: Routes.evaluationPlanAdd,
      state: {
        coursedata: details || {},
        termData: {
          programName: data?.programName || '-',
          courseCode: data?.courseCode || '-',
          batchName: data?.intake || '-',
          termName: data?.termName || '-',
          section: data?.hed__Section_ID__c || '-',
        },
      },
    });
  };

  const masterHead = [
    // {
    //   Header: '#',
    //   accessor: 'sNo',
    //   disableGlobalFilter: false,
    // },
    {
      Header: 'Term',
      accessor: 'termName',
      disableGlobalFilter: false,
    },
    {
      Header: 'Course Code',
      accessor: 'courseCode',
      disableGlobalFilter: false,
    },
    {
      Header: 'Course',
      accessor: 'courseName',
      disableGlobalFilter: false,
    },
    {
      Header: 'Section',
      accessor: 'hed__Section_ID__c',
      disableGlobalFilter: false,
    },
    {
      Header: 'Evaluation Plan Status',
      accessor: 'Grade_Book_Status__c',
      Cell: ({ value, row }) => {
        return (
          <>
            {row?.original?.Grade_Book_Status__c === 'Received' ? (
              <div
                style={{
                  backgroundColor: '#D0EED2',
                  width: '100px',
                  textAlign: 'center',
                  padding: '5px',
                  borderRadius: '5px',
                }}
              >
                Submitted
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#f6cec9',
                  width: '100px',
                  textAlign: 'center',
                  padding: '5px',
                  borderRadius: '5px',
                }}
              >
                Pending
              </div>
            )}
          </>
        );
      },
      disableGlobalFilter: false,
    },
    {
      Header: 'Action',
      accessor: 'action',
      disableGlobalFilter: false,
      Cell: ({ value, row }) => {
        return (
          <div
            style={{ cursor: 'pointer' }}
            className="actionIcon"
            onClick={() => pushtabs(row?.original)}
          >
            <VisibilityIcon />
          </div>
        );
      },
    },
  ];

  // useEffect(() => {
  //   const data = JSON.parse(userDetails);
  //   const instituteId = data?.Id;
  //   setLoading(true);
  //   getDataForCourseEnrolment(instituteId).then((res) => {
  //     var AcademicOption = [];

  //     const dataKeys = Object.keys(res?.AcdemicProgramsForEachDepartment);
  //     let dataS = [];
  //     dataKeys.map((s) => {
  //       dataS = dataS.concat(res?.AcdemicProgramsForEachDepartment[s]);
  //     });
  //     dataS?.sort((a, b) => {
  //       if (a.AcademicProgramName < b.AcademicProgramName) {
  //         return -1; // a should be before b
  //       }
  //       if (a.AcademicProgramName > b.AcademicProgramName) {
  //         return 1; // b should be before a
  //       }
  //       return 0; // no changes in order
  //     });
  //     dataS?.map((items) => {
  //       AcademicOption.push({
  //         label: items.AcademicProgramName,
  //         value: items.AcademicProgramId,
  //       });
  //     });

  //     sessionStorage.setItem('progOption', JSON.stringify(AcademicOption));

  //     setProgramOptions(AcademicOption);
  //     setFilterData(res);
  //     setLoading(false);
  //   });
  // }, [userDetails]);
  // useEffect(() => {
  //   const preProgram = sessionStorage.getItem('program') || '';
  //   const prebatch = sessionStorage.getItem('batch') || '';
  //   const preTerm = sessionStorage.getItem('term') || '';
  //   const preProgOpt =
  //     sessionStorage.getItem('progOption') != undefined
  //       ? JSON.parse(sessionStorage.getItem('progOption'))
  //       : '';
  //   const preBatchOpt =
  //     sessionStorage.getItem('batchOption') != undefined
  //       ? JSON.parse(sessionStorage.getItem('batchOption'))
  //       : '';
  //   const preTermOpt =
  //     sessionStorage.getItem('termOption') != undefined
  //       ? JSON.parse(sessionStorage.getItem('termOption'))
  //       : '';
  //   if (preProgram && preBatchOpt && preTermOpt) {
  //     setProgram(preProgram);
  //     setBatchOptions(preBatchOpt);
  //     setTermOptions(preTermOpt);
  //     if (prebatch && preTerm) {
  //       if (preProgOpt.length > 0) {
  //         let programName = '';
  //         preProgOpt?.filter((s) => {
  //           if (s.value == preProgram) {
  //             programName = s.label;
  //           }
  //         });
  //         setProgramName(programName);
  //       }
  //       if (preBatchOpt.length > 0) {
  //         let batchName = '';
  //         preBatchOpt?.filter((s) => {
  //           if (s.value == prebatch) {
  //             batchName = s.label;
  //           }
  //         });
  //         setBatchName(batchName);
  //       }
  //       if (preTermOpt.length > 0) {
  //         let termName = '';
  //         preTermOpt?.filter((s) => {
  //           if (s.value == preTerm) {
  //             termName = s.label;
  //           }
  //         });
  //         setTermName(termName);
  //       }

  //       setBatch(prebatch);
  //       setTerm(preTerm);
  //       setFilterSelected(true);
  //     }
  //   }
  // }, [programOptions]);

  useEffect(() => {
    if (profile?.ContactId) {
      let id = profile?.ContactId;
      setLoading(true);
      setNoDataText('Fetching...');
      getSection(id)
        .then(res => {
          let tableData = [];
          res?.map((item, index) => {
            tableData.push({
              id: item?.hed__Course_Offering__r?.Id,
              Grade_Book_Status__c:
                item?.hed__Course_Offering__r?.Grade_Book_Status__c,
              hed__Section_ID__c:
                item?.hed__Course_Offering__r?.hed__Section_ID__c,
              courseName: item?.Course_Name__c,
              termName: item?.Term_Name__c,
              intake: item?.Programe_Name__c,
              courseCode:
                item?.hed__Course_Offering__r?.hed__Course__r
                  ?.hed__Course_ID__c,
              programName:
                item?.hed__Course_Offering__r?.hed__Term__r?.hed__Account__r
                  ?.Name,
            });
          });
          setData(tableData);
          if (tableData.length === 0) {
            setNoDataText('No Data');
          }
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          setNoDataText('No Data');
        });
    }
  }, [profile?.ContactId]);

  return (
    <div>
      {loading && <KenLoader />}
      {/* <Box className={`${classes.breadCrumbWrapper} ${'breadCrumbText'}`}>
        <BreadCrumb
          className="breadCrumbText"
          array={arrayBreadCrumb}
          history={navigate}
        />
      </Box> */}

      <Grid container xs={12}>
        <Grid xs={12} className={classes.examTable}>
          <Paper className={classes.root}>
            <KenGrid
              columns={masterHead}
              data={data}
              pagination={{ disabled: false }}
              toolbarDisabled={true}
              noDataText={noDataText}
              headerStyle={{ border: '1px solid #D2E1E9' }}
              gridProps={{
                getHeaderProps: column => ({
                  style: {
                    background: '#F1F5FA',
                    boxSizing: 'border-box',
                    color: '#092682',
                    fontSize: '12px',
                  },
                }),
                getHeaderGroupProps: column => ({
                  style: { borderRadius: '5px' },
                }),
                getCellProps: cell => ({
                  style: {
                    borderBottom: '0px',
                    color: '#222',
                  },
                }),
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
