import { Breadcrumbs, Card, Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useState } from 'react';
import RequestDetails from './RequestDetails';
import KenGrid from '../../../../global_components/KenGrid';

const useStyles = makeStyles({
  backButton: {
    float: 'right',
    marginBottom: '20px',
  },
  marginTop: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  topMargin: {
    marginBottom: '20px',
  },
  Courses: {
    padding: '20px',
    marginBottom: '20px',
  },
  linkApply: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#090F69',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  Typooooooo: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#090F69',
  },
});

const ServiceForm = ({
  selectedServiceData,
  selectedService,
  onClose,
  isApplyClicked,
  setIsApplyClicked,
  setShowTabs,
}) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState();
  const [showRequestType, setShowRequestType] = useState(false);
  console.log('isApplyClicked', setShowTabs);
  const handleActionClick = row => {
    console.log('hellowrow', row);
    console.log('handleActionClick triggered with', row.original);
    setSelectedRow(row);
    setShowRequestType(true);
  };
  console.log('selectedRowaaaaa', selectedRow);
  const getColumnsBasedOnService = () => {
    switch (selectedService) {
      case 'Answer Sheet':
        return [
          { Header: 'Course', accessor: 'course' },
          { Header: 'Exams', accessor: 'exam' },
          { Header: 'Type', accessor: 'type' },
          { Header: 'Credits', accessor: 'credits' },
          { Header: 'Last Date', accessor: 'lastDate' },
          {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
              <div
                onClick={() => handleActionClick(row.original)}
                className={classes.linkApply}
              >
                {row.original.action}
              </div>
            ),
          },
        ];
      case 'Revaluation':
        return [
          { Header: 'Course', accessor: 'course' },
          { Header: 'Exam', accessor: 'exam' },
          { Header: 'Type', accessor: 'type' },
          { Header: 'Credits', accessor: 'credits' },
          { Header: 'Last Date', accessor: 'lastDate' },
          { Header: 'Current Exam', accessor: 'currentExam' },
          { Header: 'Final Exam', accessor: 'finalExam' },
          {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
              <div
                onClick={() => handleActionClick(row.original)}
                className={classes.linkApply}
              >
                {row.original.action}
              </div>
            ),
          },
        ];
      case 'Exams':
        return [
          { Header: 'Course', accessor: 'course' },
          { Header: 'Exam', accessor: 'exam' },
          { Header: 'Type', accessor: 'type' },
          { Header: 'Credits', accessor: 'credits' },
          { Header: 'Last Date', accessor: 'lastDate' },
          {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ row }) => (
              <div
                onClick={() => handleActionClick(row.original)}
                className={classes.linkApply}
              >
                {row.original.action}
              </div>
            ),
          },
        ];
      default:
        return [];
    }
  };

  const columns = getColumnsBasedOnService();

  const data = [
    {
      requestType: 'Answer Sheet',
      term: 'Spring 2023',
      course: 'Mathematics',
      exam: 'Midterm',
      type: 'Regular',
      dateOfRequest: '2023-08-01',
      approvalStatus: 'Approved',
      status: 'Approved',
      action: 'Apply',
    },
    {
      requestType: 'Answer Sheet',
      term: 'Fall 2022',
      course: 'Physics',
      exam: 'Final',
      type: 'Special',
      dateOfRequest: '2023-07-15',
      approvalStatus: 'Pending',
      action: 'Apply',
    },
    {
      requestType: 'Revaluation',
      course: 'Chemistry',
      exam: 'Quiz 1',
      type: 'Regular',
      dateOfRequest: '2023-09-05',
      approvalStatus: 'Approved',
      examType: 'In-Class',
      action: 'View',
    },
    {
      requestType: 'Revaluation',
      course: 'History',
      exam: 'Final',
      type: 'Special',
      dateOfRequest: '2023-09-10',
      approvalStatus: 'Pending',
      examType: 'Take-Home',
      action: 'View',
    },
  ];

  return (
    <div className={classes.marginTop}>
      {showRequestType ? (
        <RequestDetails
          setShowTabs={setShowTabs}
          isApplyClicked={isApplyClicked}
          setIsApplyClicked={setIsApplyClicked}
          selectedRow={selectedRow}
          onClose={() => setShowRequestType(false)}
          selectedService={selectedService}
        />
      ) : (
        <>
          <div className={classes.topMargin}>
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNextIcon fontSize="small" />}
              classes={{ separator: classes.separator }}
            >
              <Link
                color="inherit"
                onClick={onClose}
                style={{ cursor: 'pointer' }}
              >
                My Request
              </Link>
              <Typography color="textPrimary"> {selectedService}</Typography>
              <Typography color="textPrimary">Courses</Typography>
            </Breadcrumbs>
          </div>
          <Card className={classes.Courses}>
            <div className={classes.Typooooooo}>Courses</div>
          </Card>
          <KenGrid toolbarDisabled={true} columns={columns} data={data} />
        </>
      )}
    </div>
  );
};

export default ServiceForm;
