import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { default as Accepted } from '../../../../../assets/check-circle.png';
import Info from '../../../../../assets/info.png';
import landingpage from '../../../../../assets/landingpage.png';
import '../../styles.scss';
import KenGrid from '../../../../../global_components/KenGrid';
import EvaluationPreview from './preview';
import KenLoader from '../../../../../components/KenLoader';
import KenSnackBar from '../../../../../components/KenSnackbar';
import KenInputField from '../../../../../global_components/KenInputField';
import {
  getEvaluatorAnswersheet,
  postEvaluationAction,
} from '../../../../../utils/ApiService';

const useStyles = makeStyles(theme => ({
  actionAnchor: {
    fontSize: 14,
    color: '#090F69',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statusImage: {
    width: '16px',
    height: '16px',
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

export default function Evaluation({ setShowTabs }) {
  const classes = useStyles();
  const { t } = useTranslation();
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
      Header: 'Section',
      accessor: 'section',
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
      Header: 'Deadline',
      accessor: 'examDate',
      disableGlobalFilter: true,
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        let statusIcon;
        let statusText;

        if (value === 'Assigned') {
          statusIcon = (
            <img src={Info} alt="Assigned" className={classes.statusImage} />
          );
          statusText = 'Assigned';
        } else if (value === 'Submitted') {
          statusIcon = (
            <img
              src={Accepted}
              alt="Submitted"
              className={classes.statusImage}
            />
          );
          statusText = 'Submitted';
        } else {
          statusIcon = null;
          statusText = 'N/A';
        }

        return (
          <div className={classes.statusContainer}>
            {statusIcon}
            {statusText}
          </div>
        );
      },
    },
    {
      Header: 'Action',
      accessor: 'action2',
      Cell: ({ value, row }) => {
        return (
          <Typography
            className={classes.actionAnchor}
            onClick={() => {
              if (row.original.status === 'Assigned') {
                submitAnswersheet(row.original);
              } else if (row.original.status === 'Submitted') {
                handleView(row.original);
              }
            }}
          >
            {row.original.status === 'Assigned'
              ? 'Record'
              : row.original.status === 'Submitted'
              ? 'View'
              : ''}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const [data, setData] = useState([]);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [approveDialog, setApproveDialog] = React.useState(false);
  const [rejectDialog, setRejectDialog] = React.useState(false);
  const [activeType, setActiveType] = React.useState('Request');
  const [showPreview, setShowPreview] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState({});
  const [previewData, setPreviewData] = React.useState({});
  const [reloadAPI, setReloadAPI] = useState(false);
  //   SnackBar
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
  };
  const handleClose2 = () => {
    setRejectDialog(false);
  };

  const submitAnswersheet = rw => {
    setPreviewData(rw);
    setShowPreview(true);
  };

  const handleView = rw => {
    setPreviewData(rw);
    setShowPreview(true);
  };

  useEffect(() => {
    let contactId = JSON.parse(localStorage.getItem('userDetails'))?.ContactId;
    setData([]);
    setLoading(true);
    getEvaluatorAnswersheet(contactId, 'Accepted')
      .then(res => {
        console.log('API Response:', res);
        if (res && res.records && res.records.length > 0) {
          let response = res.records;
          let newArr = response.map(item => ({
            term: item.Term_Name__c,
            course: item.Course_Name__c,
            section:
              item?.Exam_ID__r?.Course_Evaluation_Component__r
                ?.Course_Offering__r?.hed__Section_ID__c,
            exam: item?.Exam_ID__r?.Exam_Name__c,
            type: item?.Exam_ID__r?.Exam_Type__c,
            examDate: moment(item?.Evaluation_Deadline__c).format('DD-MM-YYYY'),
            submission: item?.Evaluator_Acceptance_Status__c,
            format: item?.Exam_ID__r?.Exam_Format__c,
            status: item?.Evaluator_Acceptance_Status__c,
            action2:
              item?.Evaluator_Acceptance_Status__c === 'Accepted'
                ? 'View'
                : 'Record',
            item,
          }));
          setData(newArr);
        }
        setLoading(false);
      })
      .catch(error => {
        if (error) {
          handleSnackbarOpen(
            'error',
            error?.response?.data.message || 'Something went wrong'
          );
        }
        setLoading(false);
      });
  }, [activeType, reloadAPI]);
  console.log('checkkkkkkkk'.data);
  const handleRequest = type => {
    if (selectedRequest) {
      setLoading(true);
      let payload = {
        Id: selectedRequest?.item?.Id,
        status: type,
        reason: reason,
      };
      postEvaluationAction(payload)
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
            handleSnackbarOpen(
              'error',
              error?.response?.data.message || 'Something went wrong'
            );
          }
          setLoading(false);
        });
    }
  };

  const finalSubmission = () => {
    setApproveDialog(true);
  };
  const handleConfirmFinalSubmission = () => {
    setApproveDialog(false);
    setLoading(true);
    let payload = {
      Id: previewData?.item?.Id,
      status: 'Submitted',
    };
    postEvaluationAction(payload)
      .then(res => {
        if (res.success) {
          handleSnackbarOpen('success', 'Successful');
          setReloadAPI(!reloadAPI);
          setShowPreview(false);
        } else {
          handleSnackbarOpen('error', 'Submission failed');
        }
        setLoading(false);
      })
      .catch(error => {
        handleSnackbarOpen(
          'error',
          error?.response?.data.message || 'Something went wrong'
        );
        setLoading(false);
      });
  };

  const closePreview = () => {
    setShowPreview(false);
    setShowTabs(false);
  };
  return (
    <Box style={{ marginTop: '30px' }}>
      {loading ? <KenLoader /> : null}
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={4000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />

      {showPreview ? (
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{
            background: 'white',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          <>
            <Grid item xs={12} md={4}>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<NavigateNextIcon fontSize="small" />}
                classes={{ separator: classes.separator }}
              >
                <Link
                  color="inherit"
                  onClick={closePreview}
                  style={{ cursor: 'pointer' }}
                >
                  Evaluation
                </Link>
                <Typography color="textPrimary">Submission</Typography>
              </Breadcrumbs>
            </Grid>
            {previewData?.status !== 'Submitted' && (
              <Grid item xs={12} md={8}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={finalSubmission}
                  style={{
                    float: 'right',
                    textTransform: 'capitalize',
                  }}
                >
                  Final Submission
                </Button>
              </Grid>
            )}
          </>
        </Grid>
      ) : null}

      <Grid item xs={12} spacing={2}>
        {!showPreview && data.length === 0 ? (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <img src={landingpage} />
            <Typography className={classes.content}>
              No Data Available!{' '}
            </Typography>{' '}
          </div>
        ) : showPreview ? (
          <EvaluationPreview
            previewData={previewData}
            onClose={() => {
              setShowTabs(false);
            }}
          />
        ) : (
          <KenGrid
            columns={columns2}
            data={data}
            pagination={{ disabled: false }}
            toolbarDisabled={true}
            isCollapsible={false}
            rowClick={row => {
              setShowTabs(true);
            }}
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
          <DialogContentText
            style={{ color: '#000', fontSize: '24px', fontWeight: 500 }}
          >
            Are you sure you want to Submit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            color="primary"
            style={{ textTransform: 'capitalize' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmFinalSubmission}
            color="primary"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reject Button */}
      <Dialog
        open={rejectDialog}
        className="reject-dialog-box"
        onClose={handleClose2}
        aria-labelledby="draggable-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          style={{ color: '#193389', fontSize: '24px', fontWeight: 500 }}
          id="draggable-dialog-title"
        >
          Reject Request
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
            onClick={handleClose2}
            variant="outlined"
            color="primary"
            style={{ textTransform: 'capitalize' }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleRequest('Rejected')}
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
