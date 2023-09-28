import { Button, Card, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import React, { useState } from 'react';
import AnswerSheet from '../../../../assets/AnswerSheet.png';
import Exams from '../../../../assets/Examss.png';
import Revaluation from '../../../../assets/Revaluation.png';
import { default as Submitted } from '../../../../assets/check-circle.png';
import Clock from '../../../../assets/clock.png';
import ServiceForm from './ServiceForm';
import KenGrid from '../../../../global_components/KenGrid';

const useStyles = makeStyles({
  card: {
    padding: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
  selectedCard: {
    padding: '20px',
    cursor: 'pointer',
    backgroundColor: '#090F69',
    color: 'white',
    transition: 'background-color 0.3s, color 0.3s',
  },
  image: {
    width: '10%',
    height: '10%',
    marginLeft: '16px',
    filter: 'brightness(1)',
  },
  selectedImage: {
    width: '10%',
    height: '10%',
    marginLeft: '16px',
    filter: 'brightness(0) invert(1)',
  },
  Grid: {
    marginTop: '30px',
  },
  label: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#090F69',
  },
  body: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#090F69',
  },
  boxflex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '10%',
  },
  bold: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '5px',
  },
  notbold: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '15px',
  },
  GridMargin: {
    marginTop: '20px',
  },
});

const StudentService = ({ setShowTabs }) => {
  const classes = useStyles();

  const [selectedService, setSelectedService] = useState(null);
  const [isApplyClicked, setIsApplyClicked] = useState(false);

  const handleServiceChange = service => {
    setSelectedService(prevService =>
      prevService === service ? null : service
    );
    setIsApplyClicked(false);
  };

  const handleApplyClick = () => {
    setIsApplyClicked(true);
    setShowTabs(true);
  };

  const services = [
    { image: AnswerSheet, label: 'Answer Sheet' },
    { image: Revaluation, label: 'Revaluation' },
    { image: Exams, label: 'Exams' },
  ];

  const nonSelectedColumns = [
    { Header: 'Request Type', accessor: 'requestType' },
    { Header: 'Course', accessor: 'course' },
    { Header: 'Exam', accessor: 'exam' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Date of Request', accessor: 'dateOfRequest' },
    {
      Header: 'Approval Status',
      accessor: 'approvalStatus',
      Cell: ({ value }) => (
        <div className={classes.statusCell}>
          <img
            src={value === 'Approved' ? Submitted : Clock}
            alt={value}
            width={20}
            height={20}
            style={{ marginRight: '5px' }}
          />
          {value === 'Approved' ? 'Approved' : 'Pending'}
        </div>
      ),
    },
  ];

  const answerSheetColumns = [
    { Header: 'Term', accessor: 'term' },
    { Header: 'Course', accessor: 'course' },
    { Header: 'Exam', accessor: 'exam' },
    { Header: 'Type', accessor: 'type' },
    {
      Header: 'Date of Request',
      accessor: 'dateOfRequest',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <div className={classes.statusCell}>
          <img
            src={value === 'Approved' ? Submitted : Clock}
            alt={value}
            width={20}
            height={20}
            style={{ marginRight: '5px' }}
          />
          {value === 'Approved' ? 'Approved' : 'Pending'}
        </div>
      ),
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ value, row }) =>
        row.original.status === 'Approved' ? (
          <div>
            <GetAppOutlinedIcon style={{ color: '#090F69' }} />
          </div>
        ) : (
          'N.A'
        ),
    },
  ];

  const examsColumns = [
    { Header: 'Term', accessor: 'term' },
    { Header: 'Course', accessor: 'course' },
    { Header: 'Exam', accessor: 'exam' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Date of Request', accessor: 'dateOfRequest' },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <div className={classes.statusCell}>
          <img
            src={value === 'Approved' ? Submitted : Clock}
            alt={value}
            width={20}
            height={20}
            style={{ marginRight: '5px' }}
          />
          {value === 'Approved' ? 'Approved' : 'Pending'}
        </div>
      ),
    },
  ];

  const revaluationColumns = [
    { Header: 'Term', accessor: 'term' },
    { Header: 'Course', accessor: 'course' },
    { Header: 'Exam', accessor: 'exam' },
    { Header: 'Type', accessor: 'type' },
    { Header: 'Date of Request', accessor: 'dateOfRequest' },
    { Header: 'Current Marks', accessor: 'CurrentMarks' },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => (
        <div className={classes.statusCell}>
          <img
            src={value === 'Approved' ? Submitted : Clock}
            alt={value}
            width={20}
            height={20}
            style={{ marginRight: '5px' }}
          />
          {value === 'Approved' ? 'Approved' : 'Pending'}
        </div>
      ),
    },
    { Header: 'Final Marks', accessor: 'FinalMarks' },
  ];

  const columns =
    selectedService === 'Answer Sheet'
      ? answerSheetColumns
      : selectedService === 'Exams'
      ? examsColumns
      : selectedService === 'Revaluation'
      ? revaluationColumns
      : nonSelectedColumns;

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
    },
    {
      requestType: 'Answer Sheet',
      term: 'Fall 2022',
      course: 'Physics',
      exam: 'Final',
      type: 'Special',
      dateOfRequest: '2023-07-15',
      approvalStatus: 'Pending',
    },
    {
      requestType: 'Revaluation',
      course: 'Chemistry',
      exam: 'Quiz 1',
      type: 'Regular',
      dateOfRequest: '2023-09-05',
      approvalStatus: 'Approved',
      examType: 'In-Class',
    },
    {
      requestType: 'Revaluation',
      course: 'History',
      exam: 'Final',
      type: 'Special',
      dateOfRequest: '2023-09-10',
      approvalStatus: 'Pending',
      examType: 'Take-Home',
    },
  ];

  const selectedServiceData = selectedService
    ? data.filter(item => item.requestType === selectedService)
    : [];

  return (
    <div>
      {isApplyClicked ? (
        <ServiceForm
          selectedServiceData={selectedServiceData}
          selectedService={selectedService}
          isApplyClicked={isApplyClicked}
          setShowTabs={setShowTabs}
          setIsApplyClicked={setIsApplyClicked}
          onClose={() => {
            setIsApplyClicked(false);
            setShowTabs(false);
          }}
        />
      ) : (
        <div>
          <Grid container spacing={2} className={classes.Grid}>
            {services.map((service, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card
                  className={
                    selectedService === service.label
                      ? classes.selectedCard
                      : classes.card
                  }
                  onClick={() => handleServiceChange(service.label)}
                >
                  <img
                    src={service.image}
                    alt={service.label}
                    className={
                      selectedService === service.label
                        ? classes.selectedImage
                        : classes.image
                    }
                  />
                  <CardContent>
                    <div
                      className={
                        selectedService === service.label
                          ? classes.selectedLabel
                          : classes.label
                      }
                    >
                      {service.label}
                    </div>
                    <div
                      className={
                        selectedService === service.label
                          ? classes.selectedBody
                          : classes.body
                      }
                    >
                      Apply for {service.label}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {selectedService !== null && selectedServiceData?.length > 0 && (
              <Grid item xs={12} md={3} style={{ alignSelf: 'end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ float: 'right' }}
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  onClick={handleApplyClick}
                >
                  Apply
                </Button>
              </Grid>
            )}
          </Grid>

          {selectedService !== null && selectedServiceData?.length > 0 && (
            <Grid container spacing={2} className={classes.Grid}>
              <Grid item xs={12} md={12}>
                <KenGrid
                  toolbarDisabled={true}
                  columns={columns}
                  data={selectedServiceData}
                  rowClick={row => {
                    setShowTabs(false);
                  }}
                />
              </Grid>
            </Grid>
          )}

          {selectedService === null && data?.length > 0 && (
            <div className={classes.GridMargin}>
              <KenGrid
                toolbarDisabled={true}
                columns={nonSelectedColumns}
                data={data}
                rowClick={row => {
                  setShowTabs(false);
                }}
              />
            </div>
          )}

          {selectedService === null && data?.length === 0 && (
            <div>
              <h2>Select a Service</h2>
            </div>
          )}

          {selectedService !== null && selectedServiceData?.length === 0 && (
            <div className={classes.boxflex}>
              <div className={classes.bold}>No request found. </div>
              <div className={classes.notbold}>
                No Pending Request at the moment. You’re all caught up!{' '}
              </div>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={handleApplyClick}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentService;
