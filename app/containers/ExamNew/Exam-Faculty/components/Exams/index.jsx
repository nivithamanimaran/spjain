import { Typography, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenLoader from '../../../../../components/KenLoader';
import KenGrid from '../../../../../global_components/KenGrid';
import { default as Submitted } from '../../../../../assets/check-circle.png';
import Clock from '../../../../../assets/clock.png';
import Info from '../../../../../assets/info.png';
import landingpage from '../../../../../assets/landingpage.png';
import ExamPreview from './preview';

import { getExamsData } from '../../../../../utils/ApiService';

const useStyles = makeStyles(theme => ({
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statusImage: {
    width: '16px',
    height: '16px',
  },
  kengrid: {
    marginTop: '20px',
  },
  content: {
    fontWeight: 600,
    fontSize: '24px',
    marginTop: '16px',
  },
  actionButton: {
    color: '#090F69',
    fontSize: '14px',
    textTransform: 'capitalize',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}));

const ExamsFacultyMain = ({ setShowTabs }) => {
  const classes = useStyles();
  const [showExamPreview, setShowExamPreview] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const columns = [
    { Header: 'Batch', accessor: 'program' },
    { Header: 'Term', accessor: 'term' },
    { Header: 'Course', accessor: 'course' },
    { Header: 'Exam', accessor: 'exam' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Due Date', accessor: 'dueDate' },
    {
      Header: 'Status',
      accessor: 'questionPaperStatus',
      Cell: ({ value }) => {
        let statusImage;
        let statusText;

        if (value === 'Assigned') {
          statusImage = Submitted;
          statusText = 'Submitted';
        } else if (value === 'Submitted') {
          statusImage = Submitted;
          statusText = 'Submitted';
        } else if (value === 'Pending') {
          statusImage = Clock;
          statusText = 'Pending';
        } else if (value === 'Alteration Requested') {
          statusImage = Info;
          statusText = 'Alteration Requested';
        }

        return (
          <div className={classes.statusContainer}>
            <img
              src={statusImage}
              alt={statusText}
              className={classes.statusImage}
            />
            {statusText}
          </div>
        );
      },
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ row }) => {
        const value = row.original.questionPaperStatus;

        if (value === 'Pending') {
          return (
            <div
              className={classes.actionButton}
              onClick={() => {
                setSelectedRowData(row.original);
                setShowExamPreview(true);
              }}
            >
              Upload
            </div>
          );
        } else if (
          value === 'Submitted' ||
          value === 'Alteration Requested' ||
          value === 'Assigned'
        ) {
          return (
            <div
              className={classes.actionButton}
              onClick={() => {
                setSelectedRowData(row.original);
                setShowExamPreview(true);
              }}
            >
              View
            </div>
          );
        }
        return null;
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    console.log('Fetching data...');
    try {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if (userDetails?.ContactId) {
        const examsData = await getExamsData(userDetails.ContactId);
        const modifiedData = examsData.data.map(exam => ({
          program: exam.programName,
          batch: exam.termName,
          term: exam.termName,
          course: exam.courseName,
          exam: exam.examName,
          type: exam.examType,
          dueDate: new Date(exam.dueDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          questionPaperStatus: exam.approvalStatus,
          examRecordId: exam.examRecordId,
          examFormat: exam.examFormat,
          examPattern: exam.examPattern,
          examMode: exam.examMode,
          courseCode: exam.courseCode,
        }));
        setData(modifiedData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching exams data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExamPreviewClose = async () => {
    setShowExamPreview(false);
    setSelectedRowData(null);
    setShowTabs(false);
    await fetchData();
  };

  return (
    <div className={classes.kengrid}>
      {loading && <KenLoader />}
      {showExamPreview ? (
        <ExamPreview
          examRecordId={selectedRowData?.data?.examRecordId}
          data={data}
          rowData={selectedRowData}
          onClose={handleExamPreviewClose}
        />
      ) : (
        <>
          {data.length === 0 ? (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <img src={landingpage} />
              <Typography className={classes.content}>
                No Data Available!{' '}
              </Typography>{' '}
            </div>
          ) : (
            <KenGrid
              columns={columns}
              data={data}
              searchEnabled={false}
              title="Exams Faculty"
              toolbarDisabled={true}
              rowClick={row => {
                setSelectedRowData(row.original);
                setShowExamPreview(true);
                setShowTabs(true);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExamsFacultyMain;
