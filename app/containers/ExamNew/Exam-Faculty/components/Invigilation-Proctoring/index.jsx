import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsDownload } from 'react-icons/bs';
import KenLoader from '../../../../../components/KenLoader';
import KenGrid from '../../../../../global_components/KenGrid';
import { useHistory } from 'react-router-dom';
import { default as Accepted } from '../../../../../assets/check-circle.png';
import Info from '../../../../../assets/info.png';
import landingpage from '../../../../../assets/landingpage.png';
import Routes from '../../../../../utils/routes.json';
import '../../styles.scss';
import {
  getExamInvigilator,
  getInvigilatorPostExam,
  getInvigilatorRequest,
  postInvigilationAction,
  postSubstitute,
} from '../../../../../utils/ApiService';
import KenSnackBar from '../../../../../components/KenSnackbar';
import KenInputField from '../../../../../global_components/KenInputField';
const useStyles = makeStyles(theme => ({
  activeBox: {
    padding: '20px',
    background: '#090F69',
    color: '#fff',
    fontSize: 14,
  },
  cardBox: {
    padding: '20px',
    fontSize: 14,
    color: '#090F69',
  },
  boxText: {
    fontSize: 24,
    fontWeight: 500,
    color: '#000',
  },
  actionAnchor: {
    fontSize: '14px',
    color: '#090F69',
    cursor: 'pointer',
    textTransform: 'capitalize',
    // textDecoration: 'underline',
  },
  underline: {
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: '#fff',
    },
  },
  content: {
    fontWeight: 600,
    fontSize: '24px',
    marginTop: '16px',
  },
  content1: {
    color: 'black',
    fontWeight: 500,
    fontSize: '18px',
  },
}));

export default function InvigilationProctoring() {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const [substituteDialogOpen, setSubstituteDialogOpen] = useState(false);
  const [substituteReason, setSubstituteReason] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);

  const openSubstituteDialog = row => {
    setSelectedItemId(row.item.Id);
    setSelectedRequest(row);
    setSubstituteDialogOpen(true);
    // setReason('');
  };

  const closeSubstituteDialog = () => {
    setSubstituteDialogOpen(false);
    setReason('');
  };

  const handleSubstituteRequest = () => {
    if (selectedRequest && selectedRequest.item && selectedRequest.item.Id) {
      setLoading(true);
      const payload = {
        Id: selectedItemId,
        status: 'Substitute Requested',
        reason: reason,
      };
      postInvigilationAction(payload)
        .then(res => {
          if (res.success) {
            handleSnackbarOpen('success', 'Substitute Requested');
          }
          setReason('');
          setLoading(false);
          setSubstituteDialogOpen(false);
          setSubstituteReason('');
          setReloadAPI(!reloadAPI);
        })
        .catch(error => {
          if (error) {
            handleSnackbarOpen(
              'error',
              error?.response?.data?.message?.errorCode ||
                'Something went wrong'
            );
          }
          setLoading(false);
        });
    }
  };

  const handleSubstituteRequested = async row => {
    try {
      const payload = {
        Id: row.item.Id,
        status: 'Assigned',
      };

      setLoading(true);
      const response = await postSubstitute(payload);

      if (response && response.success) {
        handleSnackbarOpen('success', 'Assigned');
        setReloadAPI(!reloadAPI);
      } else {
        handleSnackbarOpen('error', 'Failed to assign');
      }

      setLoading(false);
    } catch (error) {
      handleSnackbarOpen('error', 'Something went wrong');
      setLoading(false);
    }
  };

  const columns = [
    {
      Header: 'Term',
      accessor: 'term',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course',
      accessor: 'course',
      disableGlobalFilter: true,
    },
    {
      Header: 'Exam',
      accessor: 'exam',
      disableGlobalFilter: true,
    },
    {
      Header: 'Type',
      accessor: 'type',
      disableGlobalFilter: true,
    },
    {
      Header: 'Exam Date',
      accessor: 'examDate',
      disableGlobalFilter: true,
    },
    {
      Header: 'Start Time',
      accessor: 'start',
      disableGlobalFilter: true,
      Cell: ({ value }) => (
        <span>
          {value !== '-' ? moment(value, 'HH:mm:ss').format('hh:mm A') : '-'}
        </span>
      ),
    },
    {
      Header: 'Duration',
      accessor: 'duration',
      disableGlobalFilter: true,
    },
    {
      Header: 'Facility',
      accessor: 'facility',
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ value, row }) => {
        const buttonClassName = `${classes.actionAnchor} ${
          value === 'Accepted' ? classes.underline : ''
        }`;

        return (
          <Button
            className={buttonClassName}
            onClick={
              value === 'Accepted'
                ? () => openSubstituteDialog(row.original)
                : value === 'Request Substitute'
                ? () => downloadFormat(row.original)
                : value === 'Substitute Requested'
                ? () => handleSubstituteRequested(row.original)
                : null
            }
          >
            {value === 'Accepted'
              ? 'Request Substitute'
              : value === 'Substitute Requested'
              ? 'Substitute Requested'
              : ''}
          </Button>
        );
      },
      disableGlobalFilter: true,
    },

    {
      Header: '',
      accessor: 'format',
      Cell: ({ value, row }) => {
        return (
          <>
            {row?.original?.action !== 'Substitute Requested' ? (
              <IconButton
                disabled={
                  row?.original?.action !== null &&
                  row?.original?.action !== 'Rejected'
                    ? false
                    : true
                }
                onClick={() => downloadFormat(row.original)}
              >
                <BsDownload />
              </IconButton>
            ) : null}
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const columns2 = [
    {
      Header: 'Term',
      accessor: 'term',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course',
      accessor: 'course',
      disableGlobalFilter: true,
    },
    {
      Header: 'Exam',
      accessor: 'exam',
      disableGlobalFilter: true,
    },
    {
      Header: 'Type',
      accessor: 'type',
      disableGlobalFilter: true,
    },
    {
      Header: 'Exam Date',
      accessor: 'examDate',
      disableGlobalFilter: true,
    },
    {
      Header: 'Facility',
      accessor: 'facility',
      disableGlobalFilter: true,
    },
    {
      Header: 'Status',
      accessor: 'Status',
      Cell: ({ value, row }) => {
        const isAccepted = value === 'Accepted';
        const isSubstituteRequested = value === 'Substitute Requested';

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAccepted || isSubstituteRequested ? (
              <>
                <Typography style={{ fontSize: '13px' }}>
                  <img
                    src={Info}
                    alt="Accepted"
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '10px',
                    }}
                  />
                  Pending
                </Typography>
              </>
            ) : (
              <>
                <Typography style={{ fontSize: '13px' }}>
                  <img
                    src={Accepted}
                    alt="Info"
                    style={{
                      width: '16px',
                      height: '16px',
                      marginRight: '10px',
                    }}
                  />
                  Submitted
                </Typography>
              </>
            )}
          </div>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'action2',
      Cell: ({ value, row }) => {
        const isAccepted = value === 'Accepted';
        const isSubstituteRequested = value === 'Substitute Requested';
        return (
          <>
            {isAccepted || isSubstituteRequested ? (
              <Typography
                style={{ textDecoration: 'underline' }}
                className={classes.actionAnchor}
                onClick={e => {
                  handleEdit(e, row.original, 'record');
                }}
              >
                Record
              </Typography>
            ) : (
              <Typography
                style={{ textDecoration: 'underline' }}
                className={classes.actionAnchor}
                onClick={e => {
                  handleEdit(e, row.original, 'view');
                }}
              >
                View
              </Typography>
            )}
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const [data, setData] = useState([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [reloadAPI, setReloadAPI] = useState(false);
  const [approveDialog, setApproveDialog] = React.useState(false);
  const [rejectDialog, setRejectDialog] = React.useState(false);
  const [activeType, setActiveType] = React.useState(
    sessionStorage.getItem('activeType') || 'Request'
  );
  const [selectedRequest, setSelectedRequest] = React.useState({});
  const contactId = JSON.parse(localStorage.getItem('userDetails'))?.ContactId;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleClose = () => {
    setApproveDialog(false);
    setReason('');
  };
  const onHandleActiveType = type => {
    setActiveType(type);
    sessionStorage.setItem('activeType', type);
  };
  const handleEdit = (e, obj, type) => {
    history.push({
      pathname: Routes.InvigilationProctoringPreview,
      state: { obj, type },
    });
  };
  const downloadFormat = row => {
    let examId = row?.item?.Facility_Booking__r?.Exam__r?.Id;
    let facilityId = row?.item?.Facility_Booking__r?.FacilityID__r?.Id;
    if (examId && facilityId) {
      setLoading(true);
      getExamInvigilator(examId, facilityId)
        .then(res => {
          if (res.length > 0) {
            createPDF(row, res);
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          if (error) {
            handleSnackbarOpen(
              'error',
              error?.response?.data.message || 'Something went wrong'
            );
          }
        });
    }
  };
  const createPDF = async (selected, arrData) => {
    const unit = 'pt';
    const size = 'A4';
    const orientation = 'portrait';
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    const title = `Invigilation List`;
    const subTitle = `Course: ${selected?.course} - Term: ${selected?.term}`;
    doc.setFontSize(16);
    doc.text(title, marginLeft, 70);
    doc.setFontSize(14);
    doc.text(subTitle, marginLeft, 120);

    const headers = [
      ['Student Name', 'Student Roll Number', 'Facility Name', 'Seat Number'],
    ];
    let data = [];
    arrData.forEach(item => {
      data.push([
        item.Student_Name__r.Name,
        item.Student_Roll_Number__c,
        item.Facility__r ? item.Facility__r.Name : 'Facility',
        item.Seat_Number__c,
      ]);
    });

    var finalY = doc.lastAutoTable.finalY || 40;
    let content = {
      theme: 'grid',
      startY: finalY + 100,
      head: headers,
      body: data,
    };
    doc.autoTable(content);
    doc.save('Invigilation Format.pdf');
  };
  const handleRequest = type => {
    if (selectedRequest) {
      setLoading(true);
      let payload = {
        Id: selectedRequest?.item?.Id,
        status: type,
        reason: reason,
      };
      postInvigilationAction(payload)
        .then(res => {
          if (res.success) {
            handleSnackbarOpen('success', 'Successful');
            setReloadAPI(!reloadAPI);
          }
          setLoading(false);
          setApproveDialog(false);
          setRejectDialog(false);
        })
        .catch(error => {
          if (error) {
            handleSnackbarOpen('error', error.response);
          }
          setLoading(false);
        });
    }
  };
  useEffect(() => {
    setData([]);
    if (activeType === 'Request') {
      setLoading(true);
      getInvigilatorRequest(contactId)
        .then(res => {
          let arr = [];
          setLoading(false);
          if (res.done) {
            if (res.records.length > 0) {
              res.records.map(item => {
                arr.push({
                  term: item?.Term_Name__c ? item?.Term_Name__c : '-',
                  course: item?.Course_Name__c ? item?.Course_Name__c : '-',
                  exam: item?.Facility_Booking__r
                    ? item?.Facility_Booking__r?.Exam__r?.Exam_Name__c
                    : '-',
                  type: item?.Facility_Booking__r
                    ? item?.Facility_Booking__r?.Exam__r?.Exam_Type__c
                    : '-',
                  examDate: item?.Facility_Booking__r
                    ? moment(
                        item?.Facility_Booking__r?.Exam__r?.Exam_Date__c
                      ).format('DD-MM-YYYY')
                    : '-',
                  start: item?.Facility_Booking__r?.Exam__r?.Start_Time__c
                    ? item.Facility_Booking__r.Exam__r.Start_Time__c
                    : '-',
                  duration: item?.Facility_Booking__r
                    ? `${item?.Facility_Booking__r?.Exam__r?.Duration__c} mins`
                    : '-',
                  facility: item?.Facility_Booking__r
                    ? item?.Facility_Booking__r?.FacilityID__r?.Name
                    : '-',
                  program: item?.Programe_Name__c
                    ? item?.Programe_Name__c.split('-')[2]
                    : '-',
                  batch: item?.Programe_Name__c,
                  action: item?.Invigilator_Acceptance_Status__c,
                  item: item,
                });
              });
              console.log('arr', arr);
            }
            setData(arr);
          }
        })
        .catch(error => {
          setLoading(false);
          if (error) {
            handleSnackbarOpen(
              'error',
              error?.response?.data.message || 'Something went wrong'
            );
          }
        });
    } else {
      setLoading(true);
      getInvigilatorPostExam(contactId)
        .then(res => {
          let arr = [];
          setLoading(false);
          if (res.done) {
            if (res.records.length > 0) {
              res.records.map(item => {
                let currentDate = moment().format('YYYY-MM-DD');
                const dateTimeString = `${currentDate}T${
                  item?.Facility_Booking__r?.Exam__r?.Start_Time__c
                }`;
                arr.push({
                  term: item?.Term_Name__c || '-',
                  course: item?.Course_Name__c || '-',
                  exam: item?.Facility_Booking__r?.Exam__r?.Exam_Name__c || '-',
                  type: item?.Facility_Booking__r?.Exam__r?.Exam_Type__c || '-',
                  examDate:
                    moment(
                      item?.Facility_Booking__r?.Exam__r?.Exam_Date__c
                    ).format('DD-MM-YYYY') || '-',
                  start: item?.Facility_Booking__r?.Exam__r?.Start_Time__c
                    ? moment(dateTimeString).format('hh:mm A')
                    : '-',
                  duration: item?.Facility_Booking__r?.Exam__r?.Duration__c
                    ? `${item?.Facility_Booking__r?.Exam__r?.Duration__c} mins`
                    : '-',
                  facility:
                    item?.Facility_Booking__r?.FacilityID__r?.Name || '-',
                  Status: item?.Invigilator_Acceptance_Status__c,
                  action2: item?.Invigilator_Acceptance_Status__c,
                  item: item,
                });
              });
            }
            setData(arr);
          }
        })
        .catch(error => {
          setLoading(false);
          if (error) {
            handleSnackbarOpen(
              'error',
              error?.response?.data.message || 'Something went wrong'
            );
          }
        });
    }
  }, [activeType, reloadAPI]);
  return (
    <Box>
      {loading ? <KenLoader /> : null}
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={4000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      <Grid
        item
        xs={12}
        spacing={2}
        style={{ marginTop: 20, display: 'flex', gap: '22px' }}
      >
        <Paper
          className={
            activeType === 'Request' ? classes.activeBox : classes.cardBox
          }
          onClick={() => {
            onHandleActiveType('Request');
          }}
        >
          Upcoming Exams
        </Paper>
        <Paper
          className={
            activeType === 'Exam Review and Incidents'
              ? classes.activeBox
              : classes.cardBox
          }
          onClick={() => {
            onHandleActiveType('Exam Review and Incidents');
          }}
        >
          Exam Review and Incidents
        </Paper>
      </Grid>
      <Grid item xs={12} spacing={2} style={{ marginTop: 20 }}>
        {data.length === 0 ? (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <img src={landingpage} />
            <Typography className={classes.content}>
              No Data Available!
            </Typography>{' '}
          </div>
        ) : (
          <div className="invigilation-table">
            <KenGrid
              columns={activeType === 'Request' ? columns : columns2}
              data={data}
              pagination={{ disabled: false }}
              toolbarDisabled={true}
              isCollasable={false}
              gridProps={{
                getHeaderGroupProps: column => ({
                  style: { border: '1px solid #D2E1E9' },
                }),
                getHeaderProps: column => ({
                  style: {
                    background: '#090F690001A',
                    boxSizing: 'border-box',
                    color: '#090F6900099',
                    fontSize: 14,
                  },
                }),
                getColumnProps: column => ({
                  style: { background: '#fff', boxSizing: 'border-box' },
                }),
              }}
            />
          </div>
        )}
      </Grid>
      {/* Approve Button */}
      <Dialog
        open={approveDialog}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          style={{ color: '#193389', fontSize: '24px', fontWeight: 500 }}
          id="draggable-dialog-title"
        />
        <DialogContent>
          <DialogContentText className={classes.boxText}>
            Are you sure you want to accept?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleRequest('Accepted')}
            color="primary"
            style={{ textTransform: 'capitalize' }}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reject Button */}
      <Dialog
        open={substituteDialogOpen}
        className="reject-dialog-box"
        onClose={closeSubstituteDialog}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="draggable-dialog-title">
          <Typography
            style={{ color: '#193389', fontSize: '24px', fontWeight: 600 }}
          >
            Request For Substitute
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <KenInputField
              label="Reason"
              required
              className="weekNo-input"
              placeholder="Enter a Description"
              name="reason"
              rows={4}
              multiline={true}
              onChange={e => setReason(e.target.value)}
              value={reason}
              style={{ border: '1px solid #090F6900040', padding: 10 }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={closeSubstituteDialog}
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubstituteRequest}
            disabled={reason ? false : true}
            color="primary"
            style={{ textTransform: 'capitalize' }}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
