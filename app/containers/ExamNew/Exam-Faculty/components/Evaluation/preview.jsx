import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImAttachment } from 'react-icons/im';
import { RxCross1 } from 'react-icons/rx';
import { useHistory, useLocation } from 'react-router-dom';
import { default as Submitted } from '../../../../../assets/check-circle.png';
import Clock from '../../../../../assets/clock.png';
import Info from '../../../../../assets/info.png';
import '../../styles.scss';
import {
  getExamConnection,
  postExamConnectionAttachment,
} from '../../../../../utils/ApiService';
import KenLoader from '../../../../../components/KenLoader';
import KenSnackBar from '../../../../../components/KenSnackbar';
import KenGrid from '../../../../../global_components/KenGrid';
const useStyles = makeStyles(theme => ({
  statusBox: {
    padding: '9px',
    textAlign: 'center',
    borderRadius: '4px',
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
}));
export default function EvaluationPreview(props) {
  const { previewData } = props;
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const mobileView = useMediaQuery(theme.breakpoints.only('xs'));
  const tabView = useMediaQuery(theme.breakpoints.only('md'));
  let locationData = location?.state?.obj;
  const [submitDialog, setSubmitDialog] = React.useState(false);
  const columns = [
    {
      Header: 'Student Roll No.',
      accessor: 'rollNo',
    },
    {
      Header: 'Student Name',
      accessor: 'name',
    },
    {
      Header: 'Upload File',
      accessor: 'file',
      Cell: ({ value, row }) => {
        const status = row.original.status;
        const isAssigned =
          previewData?.item?.Evaluator_Acceptance_Status__c === 'Assigned';
        console.log(previewData?.item?.Evaluator_Acceptance_Status__c);
        if (isAssigned && status !== 'Submitted') {
          return (
            <>
              <label htmlFor={`file-${row.index}`}>
                <Button
                  component="span"
                  variant="contained"
                  color="primary"
                  style={{
                    borderRadius: 8,
                    height: '32px',
                    textTransform: 'capitalize',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <ImAttachment
                    style={{
                      color: '#fff',
                      fontSize: '18px',
                      marginRight: 10,
                    }}
                  />
                  {row.original.fileName}
                </Button>
              </label>
              <input
                type="file"
                accept="application/pdf"
                name="uploadSheet"
                style={{ display: 'none' }}
                id={`file-${row.index}`}
                onChange={e => {
                  handleUploadDoc(e, row.original, row.index);
                }}
              />
            </>
          );
        } else if (status === 'Submitted' && value) {
          return (
            <div style={{ display: 'flex' }}>
              <Button
                variant="contained"
                color="primary"
                style={{ borderRadius: 8, textTransform: 'capitalize' }}
                onClick={() => {
                  window.open(
                    row.original.item.documentURL?.DistributionPublicUrl,
                    '_blank'
                  );
                }}
              >
                <ImAttachment
                  style={{ color: '#fff', fontSize: '18px', marginRight: 10 }}
                />
                {row.original.fileName}
              </Button>
              {!row.original.disableButton ? (
                <RxCross1
                  style={{
                    marginLeft: '10px',
                    cursor: 'pointer',
                    height: '37px',
                  }}
                  onClick={() => removeFile(row.original)}
                />
              ) : null}
            </div>
          );
        } else {
          return null;
        }
      },
    },

    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ value, row }) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              style={{ borderRadius: 8, textTransform: 'capitalize' }}
              disabled={row.original.disableButton}
              onClick={e => {
                submitEvaluation(e, row.original);
              }}
            >
              Submit
            </Button>
          </>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        let statusImage;
        let statusText;
        if (value === 'Submitted') {
          statusImage = Submitted;
          statusText = 'Submitted';
        } else if (value === 'Pending') {
          statusImage = Clock;
          statusText = 'Pending';
        } else if (value === 'Alteration Requested') {
          statusImage = Info;
          statusText = 'Alteration Requested';
        } else {
          statusImage = null;
          statusText = 'N/A';
        }
        return (
          <div className={classes.statusContainer}>
            {statusImage !== null ? (
              <img
                src={statusImage}
                alt={statusText}
                className={classes.statusImage}
              />
            ) : null}
            {statusText}
          </div>
        );
      },
    },
  ];
  const [data, setData] = useState([]);
  const [reloadAPI, setReloadAPI] = useState(false);
  const [base64String, updateBase64String] = useState();
  const [fileUpload, setFileUpload] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
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

  const handleClose3 = () => {
    setSubmitDialog(false);
  };
  const handleSubmitAnswersheet = () => {
    setLoading(true);
    let payload = {
      attachmentName: fileUpload.name,
      attachment: base64String,
      Id: selectedRow.idx,
    };
    postExamConnectionAttachment(payload)
      .then(res => {
        if (res.success) {
          setReloadAPI(!reloadAPI);
          setSubmitDialog(false);
          handleSnackbarOpen('success', 'Answersheet submitted successfully');
        }
        // setLoading(false);
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
  };

  const submitEvaluation = () => {
    setSubmitDialog(true);
  };
  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  const handleUploadDoc = async (e, row, ind) => {
    const file = e.target.files[0];
    if (file.type === 'application/pdf') {
      let convertedData = await toBase64(file);
      let splitString = convertedData.split('data:application/pdf;base64,')[1];
      updateBase64String(splitString);
      setFileUpload(file);
      setSelectedRow(row);
      const newData = [...data];
      newData.map((item, index) => {
        if (ind == index) {
          item.fileName = file.name;
          item.file = true;
          item.disable = false;
          item.disableButton = false;
          item.newUpload = true;
        } else {
          item.disable = true;
          item.disableButton = true;
        }
        return item;
      });
      setData(newData);
    } else {
      handleSnackbarOpen('error', 'Please upload a PDF');
    }
  };
  const removeFile = row => {
    row.fileName = null;
    row.item.documentURL = null;
    row.file = false;
    updateBase64String(null);
    setData(prev => {
      prev.forEach(item => {
        item.disableButton = true;
        item.disable = false;
      });
      return [...prev];
    });
    return row;
  };
  useEffect(() => {
    let examId = previewData?.item?.Exam_ID__r?.Id;
    if (examId) {
      setLoading(true);
      getExamConnection(examId)
        .then(res => {
          if (res.length > 0) {
            let data = [];
            res.map(item => {
              data.push({
                idx: item.Id,
                name: item.Student_Name__r.Name,
                rollNo: item.Student_Roll_Number__c,
                file: item.documentURL ? true : false, // if file is not available pass false
                disable:
                  previewData?.item?.Evaluator_Acceptance_Status__c ===
                    'Assigned' &&
                  item.documentURL?.DistributionPublicUrl !== null
                    ? true
                    : false,

                disableButton: true,
                newUpload: false,
                fileName: item.documentURL?.Name,
                action: '',
                status: item.documentURL?.Name ? 'Submitted' : 'N/A',
                item,
              });
            });
            setData(data);
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
  }, [reloadAPI]);
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
      <Grid item xs={12} spacing={2} style={{ marginTop: 30 }}>
        {data && data.length > 0 ? (
          <KenGrid
            columns={columns}
            data={data}
            pagination={{ disabled: false }}
            toolbarDisabled={true}
            isCollasable={false}
            // gridProps={{
            //   getHeaderGroupProps: column => ({
            //     style: { border: '1px solid #D2E1E9' },
            //   }),
            //   getHeaderProps: column => ({
            //     style: {
            //       boxSizing: 'border-box',
            //       fontSize: 14,
            //       color: '#00000099',
            //     },
            //   }),
            //   getColumnProps: column => ({
            //     style: { background: '#fff', boxSizing: 'border-box' },
            //   }),
            // }}
          />
        ) : null}
      </Grid>

      {/* Submit Answersheet */}
      <Dialog
        open={submitDialog}
        onClose={handleClose3}
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
            Are you sure you want to submit the answesheet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose3}
            variant="outlined"
            color="primary"
            style={{ textTransform: 'capitalize' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitAnswersheet}
            color="primary"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
