import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { useState, useEffect } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {  Card } from '@material-ui/core';
import './style.css';
import KenGrid from '../../global_components/KenGrid';
import KenLoader from '../../components/KenLoader';
import FeedbackForm from './components/FeedbackForm';
import KenSnackbar from '../../components/KenSnackbar';

import {
  getFeedbackNew,
  getFeedBackData,
} from '../../utils/ApiService';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    '&>div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '&>div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '260%',
      },
    },
    '&>div>div>table>thead>tr>th':{
      [theme.breakpoints.down('sm')]: {
        textAlign: 'start',
        paddingLeft: "11px"
      },
    },
    '&>div>div>table>tbody>tr:nth-child(5)>td:nth-child(5)>span>span>p':{
      [theme.breakpoints.down('sm')]: {
       fontSize: "11px"
      },
    }
  },
  back: {
    color: '#193389',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Work Sans',
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(1),
  },
  Pending: {
    padding: '5px 10px',
    background: '#FFEFB645',
    border: '1px solid #FFEFB61A',
    borderRadius: '4px',
    fontSize: '12px',
    textAlign: 'center',
    width: '82px',
    fontWeight: 500,
  },
  Submitted: {
    padding: '5px 10px',
    background: '#D0EED2',
    border: '1px solid #D0EED2',
    borderRadius: '4px',
    fontSize: '12px',
    textAlign: 'center',
    width: '86px',
    fontWeight: 500,
  },
  Rejected: {
    padding: '5px 10px',
    borderRadius: '4px',
    background: '#DD4B3961',
    border: '1px solid #DD4B39',
    textAlign: 'center',
    fontSize: '12px',
    width: '86px',
    fontWeight: 500,
  },
}));

export default function FacultyFeedback(props) {
  props.setHeading("Feedback")

  const classes = useStyles();
  const [tabView, setTabView] = useState('table');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState('Fetching...');
  const [selectedRow, setSelectedRow] = useState({});
  const [feedbackFormData, setFeedbackFormData] = useState([]);
  const [termDetails, setTermDetails] = useState({});
  const [cardData, setCardData] = useState([]);
  const contactId = JSON.parse(localStorage.getItem('userDetails')).ContactId;

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  const columns = [
    {
      Header: 'Course Name',
      accessor: 'CourseName',
      disableGlobalFilter: true,
    },
    {
      Header: 'Section',
      accessor: 'courseOfferingSectionId',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course Code',
      accessor: 'CourseCode',
      disableGlobalFilter: true,
    },
    {
      Header: 'Term',
      accessor: 'termName',
      disableGlobalFilter: true,
    },
    {
      Header: 'Status',
      accessor: 'feedbackStatus',
      Cell: ({ value, row }) => {
        return (
          <Typography
            className={
              value === 'Pending'
                ? classes.Pending
                : value === 'Completed'
                ? classes.Submitted
                : value === 'Rejected'
                ? classes.Rejected
                : '-'
            }
          >
            {value}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'Action',
      disableGlobalFilter: true,
      Cell: ({ row }) => {
        return <VisibilityIcon onClick={() => viewFeedback(row?.original)} />;
      },
    },
  ];
  const [data, setData] = useState([]);
  const [tabData, setTabData] = useState({});

  const viewFeedback = row => {
    const scheduleid = row?.val?.Feedback_Scheduler__c;
    if (scheduleid) {
      const contactid = contactId;
      const array = [];
      array.push(
        {
          key: 'Program',
          value: row?.academicProgramName,
        },
        {
          key: 'Term',
          value: row?.termName,
        },
        {
          key: 'Course Name',
          value: row?.CourseName,
        },
        {
          key: 'Course Code',
          value: row?.CourseCode,
        },
        {
          key: 'Section',
          value: row?.courseOfferingSectionId,
        }
      );
      setCardData(array);
      setSelectedRow(row);
      setTermDetails({ label: row.termName, value: row.termId });
      setLoading(true);
      getFeedBackData(scheduleid, contactid)
        .then(res => {
          setLoading(false);
          if (res[0]?.feeedbackOption !== null) {
            const resp = res.map(item => {
              item.feeedbackOption.map(item2 => {
                item2.changed = false;
              });
              return item;
            });
            setFeedbackFormData(resp);
            setTabView('form');
          } else {
            handleSnackbarOpen('info', 'No feedbacks available');
          }
        })
        .catch(err => {
          setLoading(false);
        });
    } else {
      handleSnackbarOpen('info', 'No feedbacks available');
    }
  };

  useEffect(() => {
    setLoading(true);
    const contactid = contactId;
    getFeedbackNew(contactid)
      .then(res => {
        const resp = res.data;
        if (resp.length > 0) {
          let arr = [];
          resp.map(val => {
            arr.push({
              CourseName: val?.Course_Offering__r?.hed__Course__r?.Name || '-',
              courseOfferingSectionId:
                val?.Course_Offering__r?.hed__Section_ID__c || '-',
              CourseCode:
                val?.Course_Offering__r?.hed__Course__r?.hed__Course_ID__c ||
                '-',
              termName: val?.Feedback_Scheduler__r?.Term__r.Name || '-',
              termId: val?.Feedback_Scheduler__r?.Term__c || '-',
              feedbackStatus: val?.Feedback_Status__c || '-',
              academicProgramName:
                val?.Course_Offering__r?.hed__Course__r?.hed__Course_ID__c.split(
                  ' '
                )[0] || '-',
              dueDate: val?.End_Date__c,
              val,
            });
          });
          setData(arr);
        } else {
          setFetchingData('No Data');
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('tre', err);
      });
  }, [tabView]);

  return (
    <div className={classes.root}>
      {loading ? <KenLoader /> : null}
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      {tabView === 'table' ? (
        <Card style={{ background: '#fff' }}>
          <Box className={classes.table}>
            <KenGrid
              columns={columns}
              data={data}
              pagination={{ disabled: true }}
              toolbarDisabled={true}
              gridProps={{
                getHeaderGroupProps: column => ({
                  style: { border: '1px solid #D2E1E9' },
                }),
                getHeaderProps: column => ({
                  style: {
                    background: '#F1F5FA',
                    boxSizing: 'border-box',
                    color: '#092682',
                    fontSize: 16,
                  },
                }),
              }}
              noDataText={fetchingData}
              isCollasable={false}
            />
          </Box>
        </Card>
      ) : tabView === 'form' ? (
        <div>
          {feedbackFormData && feedbackFormData.length > 0 ? (
            <FeedbackForm
              data={feedbackFormData}
              selected={selectedRow}
              cardData={cardData}
              tabView={tabView}
              setTabView={setTabView}
              setShowForm={setShowForm}
              tabData={tabData}
              termDetails={termDetails}
              fromFaculty={true}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
