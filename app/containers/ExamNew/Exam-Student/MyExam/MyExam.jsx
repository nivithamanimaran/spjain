import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import KenLoader from '../../../../components/KenLoader';
import KenGrid from '../../../../global_components/KenGrid';
import { getCurrentExam, getHallTicket } from '../../../../utils/ApiService';
import ReExam from './ReExam';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  button: {
    fontSize: 14,
    textAlign: 'left',
    padding: '10px 18px',
    color: '#090F69',
    background: '#fff',
    display: 'flex',
    justifyContent: 'flex-start',
    textTransform: 'capitalize',
    '&.active': {
      color: '#fff',
      background: '#090F69',
    },
  },
  viewBttn: {
    color: '#fff',
    background: '#090F69',
    float: 'right',
    textTransform: 'capitalize',
    padding: '6px 8px',
    '&:hover': {
      color: '#fff',
      background: '#090F69',
    },
  },

  pdfContainer: {
    marginTop: '15px',
  },
  buttonContainer: {
    marginTop: '30px',
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
  courseCode: {
    fontWeight: 500,
    fontSize: '14px',
  },
  eligibilityContainer: {
    padding: '5px',
    borderRadius: '5px',
    width: 'fit-content',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 18,
    color: '#090F69',
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
  },
}));

const MyExam = () => {
  const classes = useStyles();
  const pdfUrl =
    'https://inazstgpfs3001.blob.core.windows.net/assets/flame/pdf/Hall%20ticket%20(draft).pdf';
  const [currentExamMessage, setCurrentExamMessage] = useState('Hi');
  const [reExamMessage, setReExamMessage] = useState('');
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [currentExamData, setCurrentExamData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');
    const contactId = userDetails ? JSON.parse(userDetails)?.ContactId : null;
    if (contactId) {
      setLoading(true);
      getCurrentExam(contactId)
        .then(data => {
          setCurrentExamData(data);
          setLoading(false);
          console.log('set', data);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching current exam data:', error);
        });
    }
  }, []);

  const handleButtonClick = buttonType => {
    if (buttonType === 'currentExam') {
      setCurrentExamMessage('Hi');
      setReExamMessage('');
      setIsPdfOpen(false);
    } else if (buttonType === 'reExam') {
      setReExamMessage('');
      setCurrentExamMessage('Bye');
      setIsPdfOpen(false);
    }
  };
  const handleViewHallTicket = async () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const contactId = userDetails ? userDetails.ContactId : null;

      if (contactId) {
        setLoading(true);
        const hallTicketResponse = await getHallTicket(contactId);
        if (hallTicketResponse && hallTicketResponse.data) {
          setPdfData(hallTicketResponse.data);
          setIsPdfOpen(true);
          setLoading(false);
        } else {
          console.error('Error fetching hall ticket data.');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching hall ticket:', error);
      setLoading(false);
    }
  };
  const handleBackButton = () => {
    setIsPdfOpen(false);
  };
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
        <div className={classes.courseCode}>
          {
            row.original?.Exam_Name__r?.Course_Evaluation_Component__r
              ?.Course_Offering__r?.hed__Course__r?.hed__Course_ID__c
          }
        </div>
      ),
    },
    {
      Header: 'Course',
      accessor: 'course',
      Cell: ({ value, row }) => (
        <div>
          {
            row.original?.Exam_Name__r?.Course_Evaluation_Component__r
              ?.Course_Offering__r?.hed__Course__r?.Name
          }
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

    {
      Header: 'Eligibility',
      accessor: 'Eligibility_Status__c',
      Cell: ({ value, row }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div
            className={classes.eligibilityContainer}
            style={{
              backgroundColor: value === 'Eligible' ? '#52C15A45' : '#DD4B3945',
            }}
          >
            {value}
          </div>
          <div>
            {value === 'Not Eligible' && (
              <Tooltip
                title={
                  row.original?.Ineligibility_Reason__c || 'No reason available'
                }
                arrow
              >
                <InfoOutlinedIcon className={classes.infoIcon} />
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
  ];

  const YourComponent = item => (
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
      <Grid container spacing={2} className={classes.buttonContainer}>
        <Grid item xs={12} md={2}>
          <Button
            style={{ width: '100%' }}
            className={`${classes.button} ${
              currentExamMessage === 'Hi' ? 'active' : ''
            }`}
            onClick={() => handleButtonClick('currentExam')}
          >
            Upcoming Exam
          </Button>
        </Grid>
        <Grid item xs={12} md={8} style={{ marginBottom: '20px' }}>
          <Button
            style={{ width: '25%' }}
            className={`${classes.button} ${
              currentExamMessage === 'Bye' ? 'active' : ''
            }`}
            onClick={() => handleButtonClick('reExam')}
          >
            Completed Exam
          </Button>
        </Grid>
        {currentExamMessage === 'Hi' && (
          <Grid item xs={12} md={2}>
            {isPdfOpen ? (
              <Button className={classes.viewBttn} onClick={handleBackButton}>
                Back
              </Button>
            ) : (
              <Button
                className={classes.viewBttn}
                onClick={handleViewHallTicket}
              >
                Download Hall Ticket
              </Button>
            )}
          </Grid>
        )}
      </Grid>
      {isPdfOpen ? (
        <div className={classes.pdfContainer}>
          {pdfData ? (
            <iframe
              src={`data:application/pdf;base64,${pdfData}`}
              width="100%"
              height="500px"
              id="pdf-iframe"
              display="initial"
              position="relative"
            />
          ) : (
            <p>No hall ticket data available.</p>
          )}
        </div>
      ) : (
        <>
          {loading && <KenLoader />}
          {currentExamMessage === 'Hi' && (
            <KenGrid
              columns={columns}
              data={currentExamData}
              toolbarDisabled={true}
              isCollasable={true}
              component={YourComponent}
            />
          )}
          {currentExamMessage === 'Bye' && <ReExam />}
        </>
      )}
    </div>
  );
};

export default MyExam;
