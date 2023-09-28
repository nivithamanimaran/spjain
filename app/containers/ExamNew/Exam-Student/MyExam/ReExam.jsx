import React, { useEffect, useState } from 'react';
import KenGrid from '../../../../global_components/KenGrid';
import { Grid, makeStyles } from '@material-ui/core';
import { getReExam } from '../../../../utils/ApiService';
import KenLoader from '../../../../components/KenLoader';

const useStyles = makeStyles(theme => ({
  button: {
    fontSize: 14,
    textAlign: 'left',
    padding: '10px 30px',
    color: '#090F69',
    background: '#fff',
    '&.active': {
      color: '#fff',
      background: '#090F69',
      fontSize: 14,
      textAlign: 'left',
      padding: '10px 30px',
    },
  },
  examDiv: {
    padding: '18px 0px 16px 0px',
    margin: '13px 30px',
    background: '#F8F8F8',
  },
  examMode: {
    fontSize: '16px',
    fontWeight: 400,
    color: 'darkgray',
  },
  lightDiv: {
    fontSize: '16px',
    fontWeight: 400,
  },
}));

const ReExam = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [currentExamData, setCurrentExamData] = useState();

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    const contactId = userDetails ? JSON.parse(userDetails)?.ContactId : null;

    if (contactId) {
      setLoading(true);
      getReExam(contactId)
        .then(data => {
          setCurrentExamData(data);
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching current exam data:', error);
        });
    }
  }, []);
  const formatTime = timeString => {
    const utcTime = new Date(`1970-01-01T${timeString}`);
    const localTime = new Date(
      utcTime.getTime() + utcTime.getTimezoneOffset() * 60000
    );
    return localTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date
      .getDate()
      .toString()
      .padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}-${month}-${year}`;
  };
  const columns = [
    {
      Header: '',
      accessor: 'courseCodeee',
      Cell: ({ value, row }) => (
        <div>
          {/* {
            row.original?.Exam_Name__r?.Course_Offering__r?.hed__Course__r
              ?.hed__Course_ID__c
          } */}
        </div>
      ),
    },
    {
      Header: 'Course Code',
      accessor: 'courseCode',
      Cell: ({ value, row }) => (
        <div>
          {
            row.original?.Exam_Name__r?.Course_Offering__r?.hed__Course__r
              ?.hed__Course_ID__c
          }
        </div>
      ),
    },
    {
      Header: 'Course',
      accessor: 'course',
      Cell: ({ value, row }) => (
        <div>
          {row.original?.Exam_Name__r?.Course_Offering__r?.hed__Course__r?.Name}
        </div>
      ),
    },
    {
      Header: 'Exam',
      accessor: 'exam',
      Cell: ({ value, row }) => (
        <div>{row.original?.Exam_Name__r?.Exam_Name__c}</div>
      ),
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ value, row }) => (
        <div>{row.original?.Exam_Name__r?.Exam_Type__c}</div>
      ),
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value, row }) => (
        <div>{formatDate(row.original?.Exam_Name__r?.Exam_Date__c)}</div>
      ),
    },
    {
      Header: 'Time',
      accessor: 'time',
      Cell: ({ value, row }) => (
        <div>{formatTime(row.original?.Exam_Name__r?.Start_Time__c)}</div>
      ),
    },
  ];

  const ReExamYourComponent = item => (
    <div className={classes.examDiv}>
      {loading && <KenLoader />}
      <Grid container spacing={2} style={{ padding: '0px 20px' }}>
        <Grid item xs={12} md={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <div className={classes.examMode}>Exam Mode:</div>
            </Grid>
            <Grid item xs={12} md={7}>
              <div className={classes.lightDiv}>
                {item?.original?.Exam_Name__r?.Mode_of_Exam__c}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <div className={classes.examMode}>Format:</div>
            </Grid>
            <Grid item xs={12} md={9}>
              <div className={classes.lightDiv}>
                {' '}
                {item?.original?.Exam_Name__r?.Exam_Format__c}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <div className={classes.examMode}>Exam Pattern:</div>
            </Grid>
            <Grid item xs={12} md={7}>
              <div className={classes.lightDiv}>
                {' '}
                {item?.original?.Exam_Name__r?.Exam_Pattern__c}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <div className={classes.examMode}>Duration:</div>
            </Grid>
            <Grid item xs={12} md={8}>
              <div className={classes.lightDiv}>
                {item?.original?.Exam_Name__r?.Duration__c} mins
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
  return (
    <div>
      {loading && <KenLoader />}
      <KenGrid
        columns={columns}
        data={currentExamData}
        isCollasable={true}
        toolbarDisabled={true}
        component={ReExamYourComponent}
        searchEnabled={false}
        getComponentProps={row => ({
          componentData: row.original?.YourComponentData,
        })}
      />
    </div>
  );
};

export default ReExam;
