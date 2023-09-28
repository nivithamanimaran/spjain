import React, { useState, useEffect, createRef } from 'react';
import {
  makeStyles,
  withStyles,
  Tooltip,
  Grid,
  Paper,
  Box,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DialogActions from '@material-ui/core/DialogActions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  Avatar,
  Typography,
  Modal,
  Button,
  Input,
  InputLabel,
} from '@material-ui/core';
import KenButton from '../../../global_components/KenButton';
import KenInputField from '../../../global_components/KenInputField';
import KenSnackbar from '../../../components/KenSnackbar/index';
import Toaster from './snackbar';
import KenGrid from '../../../global_components/KenGrid';
import information from '../../../assets/icons/information.svg';
import KenLoader from '../../../components/KenLoader';
import UploadIcon from '../../../assets/icons/UploadIconBlue.svg';
import {
  getPFSCourseDocumentList,
  postSaveCourseDocument,
} from '../../../utils/ApiService';
import { AiOutlineUpload } from 'react-icons/ai';

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    '&>div>div':{
      [theme.breakpoints.down('sm')]: {
        overflowX: "auto"
      },
    },
    '&>div>div>table':{
      [theme.breakpoints.down('sm')]: {
        width: "200%"
      },
    }
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  fonts: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '18px',
  },
  heading: {
    fontSize: '16px',
    padding: '20px 0px 30px 0px!important',
  },
  dialoguetitle: {
    textAlign: 'center',
    fontSize: '20px',
    padding: '30px 30px 10px 30px',
  },
  acceptbutton: {
    padding: '30px 20px 30px 30px',
  },
  rejecttitle: {
    textAlign: 'left',
    marginBottom: '20px',
    fontSize: '20px',
    color: '#193389',
    fontWeight: '600',
  },
  rejectdialogue: {
    padding: '0px 15px 30px 30px',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '9999',
    overflow: 'auto',
    outline: 'none',
  },
  areaWrap: {
    height: '100px !important',
  },
  des: {
    width: '100%',
  },
  uploadFiles: {
    background: '#EBEFFF',
    color: '#092682',
    fontSize: '12px',
    marginLeft: '70px',
  },
}));

const FacultyOnboard = () => {
  const classes = useStyles();
  const [showReferenceOutline, setShowReferenceOutline] = useState(true);
  const [showReferenceList, setShowReferenceList] = useState(false); //true
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogButtons, setDialogButtons] = useState([]);
  const [statusaccept, setStatusaccept] = useState(true);
  const [statusreject, setStatusreject] = useState(true);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [statusDet, setStatusDet] = useState();
  const [docData, setDocData] = useState([]);
  const [showCourse, setShowCourse] = useState(false);
  const [reloadAPI, setReloadAPI] = useState(false);
  const [docFile, showDocFile] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const inputFile = createRef();
  const ContactId = JSON.parse(localStorage.getItem('userDetails'))?.ContactId;
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('');
  const Columns = [
    {
      Header: 'Cohort',
      accessor: 'termName',
      disableGlobalFilter: false,
    },
    {
      Header: 'Course',
      accessor: 'courseName',
      disableGlobalFilter: false,
    },
    {
      Header: 'Submission Deadline',
      accessor: 'dueDate',
      disableGlobalFilter: false,
    },
    {
      Header: 'Submission Status',
      accessor: 'status',
      disableGlobalFilter: false,
      Cell: ({ row }) => {
        switch (row?.values?.status) {
          // case 'Modify':
          //   return (
          //     <KenButton
          //       style={{
          //         backgroundColor: '#EBEFFF',
          //         color: 'black',
          //         fontSize: '12px',
          //       }}
          //     >
          //       Modify
          //     </KenButton>
          //   );
          case 'Pending':
            return (
              <KenButton
                style={{
                  backgroundColor: '#FFFBEB',
                  color: 'black',
                  fontSize: '12px',
                }}
              >
                Pending
              </KenButton>
            );
          case 'Submitted':
            return (
              <KenButton
                style={{
                  backgroundColor: 'rgba(82, 193, 90, 0.27)',
                  color: 'black',
                  fontSize: '12px',
                }}
              >
                Submitted
              </KenButton>
            );
          // case 'Rejected':
          //   return (
          //     <>
          //       <KenButton
          //       style={{
          //         backgroundColor: '#F6CECA',
          //         color: 'black',
          //         fontSize: '12px',
          //       }}
          //     >
          //       Rejected
          //     </KenButton>
          //     </>
          //   );
          default:
            return <p>-</p>;
        }
      },
    },
    {
      Header: 'Action',
      accessor: 'Action',
      disableGlobalFilter: false,
      Cell: ({ row }) => {
        switch (row?.values?.status) {
          case 'Pending':
            switch (row?.values?.areaHeadStatus) {
              case null:
                return (
                  <AiOutlineUpload
                    size={25}
                    onClick={() => uploadCourse(row?.original)}
                  />
                );
              case 'Modify':
                return (
                  <AiOutlineUpload
                    size={25}
                    onClick={() => uploadCourse(row?.original)}
                  />
                );
              default:
                return (
                  <VisibilityIcon
                    onClick={() => {
                      viewcourse(row?.original);
                    }}
                  />
                );
            }
          case 'Submitted':
            switch (row?.values?.areaHeadStatus) {
              case 'Pending':
                return (
                  <>
                    <VisibilityIcon
                      onClick={() => {
                        viewcourse(row?.original);
                      }}
                    />
                    {/* <AiOutlineUpload
                      size={25}
                      onClick={() => uploadCourse(row?.original)}
                    /> */}
                  </>
                );
              case 'Approved':
                return (
                  <VisibilityIcon
                    onClick={() => {
                      viewcourse(row?.original);
                    }}
                  />
                );
              default:
                return (
                  <>
                    <VisibilityIcon
                      onClick={() => {
                        viewcourse(row?.original);
                      }}
                    />
                    <AiOutlineUpload
                      size={25}
                      onClick={() => uploadCourse(row?.original)}
                    />
                  </>
                );
            }
          case null:
            return <>-</>;
          default:
            return (
              <VisibilityIcon
                onClick={() => {
                  viewcourse(row?.original);
                }}
              />
            );
        }
      },
    },
    {
      Header: 'Areahead Approval',
      accessor: 'areaHeadStatus',
      disableGlobalFilter: false,
      Cell: ({ row }) => {
        switch (row?.values?.areaHeadStatus) {
          case 'Modify':
            return (
              <>
                <KenButton
                  style={{
                    backgroundColor: '#EBEFFF',
                    color: 'black',
                    fontSize: '12px',
                  }}
                >
                  Modify
                </KenButton>
                <LightTooltip
                  title={
                    row.original.comment != null
                      ? row.original.comment
                      : 'No reason stated'
                  }
                  placement="right-end"
                >
                  <img
                    src={information}
                    style={{ cursor: 'pointer', marginLeft: 10 }}
                  />
                </LightTooltip>
              </>
            );
          case 'Pending':
            return (
              <KenButton
                style={{
                  backgroundColor: '#FFFBEB',
                  color: 'black',
                  fontSize: '12px',
                }}
              >
                Pending
              </KenButton>
            );
          case 'Approved':
            return (
              <KenButton
                style={{
                  backgroundColor: 'rgba(82, 193, 90, 0.27)',
                  color: 'black',
                  fontSize: '12px',
                }}
              >
                Approved
              </KenButton>
            );
          case 'Rejected':
            return (
              <>
                <KenButton
                  style={{
                    backgroundColor: '#F6CECA',
                    color: 'black',
                    fontSize: '12px',
                  }}
                >
                  Rejected
                </KenButton>{' '}
                <LightTooltip
                  title={
                    row.original.comment != null
                      ? row.original.comment
                      : 'No reason stated'
                  }
                  placement="right-end"
                >
                  <img src={information} style={{ cursor: 'pointer' }} />
                </LightTooltip>
                &nbsp;
              </>
            );
          default:
            return <p>-</p>;
        }
      },
    },
  ];
  // fileupload
  const handleFileUpload = event => {
    const file = event.target.files[0];
    console.log(file);
  };
  const handleSnackBar = () => {
    setSnackbar(!snackbar);
  };

  const handleSubmit = () => {
    setStatusaccept(false);
    handleDialogClose();
  };
  const handleAcceptClick = () => {
    setDialogTitle('Are you sure you want to Accept?');
    setDialogButtons([
      <Grid container className={classes.acceptbutton}>
        <Grid item md={5} xs={0} />
        <Grid item md={3} xs={6}>
          <KenButton onClick={handleDialogClose} color="primary">
            Clear
          </KenButton>
        </Grid>
        <Grid item md={4} xs={6}>
          <KenButton
            onClick={() => {
              setSnackbarMessage('Thank you for Accepting the Document.');
              handleSnackBar();
              setStatusaccept(false);
              handleDialogClose();
              setStatusDet('Accepted');
            }}
            variant="primary"
          >
            Confirm
          </KenButton>
        </Grid>
      </Grid>,
    ]);
    setShowDialog(true);
  };
  console.log(statusDet);
  const handleRejectClick = () => {
    setDialogTitle(
      <>
        <Typography
          className={classes.rejecttitle}
          style={{ textAlign: 'left' }}
        >
          Rejected
        </Typography>
        {/* <Textarea
        placeholder={'Enter Description'}
        label={'Reason'}
        className={classes.areaWrap}
      /> */}
        <TextareaAutosize
          aria-label="minimum height"
          minRows={2}
          label={'Reason'}
          placeholder="Enter Description"
          className={classes.des}
        />
      </>
    );
    setDialogButtons([
      <Grid container className={classes.rejectdialogue}>
        <Grid item md={6} xs={0} />
        <Grid item md={3} xs={6}>
          <KenButton onClick={handleDialogClose} color="primary">
            Cancel
          </KenButton>
        </Grid>
        <Grid item md={3} xs={6}>
          <KenButton
            onClick={() => {
              setStatusaccept(false);
              handleDialogClose();
              setStatusDet('Rejected');
            }}
            variant="primary"
          >
            Submit
          </KenButton>
        </Grid>
      </Grid>,
    ]);
    setShowDialog(true);
  };
  const handleDialogClose = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    setLoading(true);
    getPFSCourseDocumentList(ContactId)
      .then(res => {
        console.log(res);
        setDocData(res?.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [reloadAPI]);

  const viewcourse = row => {
    if (row.documentUrl) {
      showDocFile(row);
      setShowCourse(true);
    } else {
      handleSnackbarOpen('info', 'No document available');
    }
  };
  const uploadCourse = row => {
    showDocFile(row);
    inputFile.current.click();
  };
  const fileSelected = (ev, i) => {
    console.log(ev.target.files);
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const base64Content = reader.result.split(',')[1];
      postDocument(base64Content);
    });
    reader.readAsDataURL(file);
    setUploadedFile(ev);
  };
  const postDocument = base64 => {
    if (docFile) {
      setLoading(true);
      let payload = {
        facultyCourseDocument: [
          {
            facultyCourseDocumentRecordId: docFile.facultyOnbordingRecordId,
            newCourseDocumentUpload: base64,
          },
        ],
      };
      postSaveCourseDocument(payload)
        .then(res => {
          console.log(res);
          if (res.success) {
            setReloadAPI(!reloadAPI);
            setSnackbarMessage('Uploaded Successfully');
            handleSnackBar();
          }
          setLoading(false);
        })
        .catch(err => {
          setSnackbarMessage('Upload Failed.');
          handleSnackBar();
          setLoading(false);
        });
    }
  };

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  return (
    <Paper style={{ padding: '20px 30px' }}>
      {/* modalbox */}
      {loading && <KenLoader />}
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      <Toaster
        severity={'sucess'}
        display={snackbar}
        message={snackbarMessage}
        close={handleSnackBar}
      />
      <div className={classes.root}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography className={`${classes.fonts} ${classes.heading}`}>
            Course Documents Submission
          </Typography>
          {showCourse ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowCourse(false);
              }}
              style={{
                height: '35px',
                marginTop: '18px',
              }}
            >
              Back
            </Button>
          ) : null}
        </div>
        <Grid container style={{ marginBottom: '30px' }}>
          {!showCourse ? (
            <Grid item xs={12}>
             <Box className={classes.table}>
             <KenGrid
                columns={Columns}
                data={docData}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
              />
             </Box>
              <input
                type="file"
                // accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="file"
                ref={inputFile}
                style={{ display: 'none', cursor: 'pointer' }}
                onChange={fileSelected}
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <iframe
                src={docFile?.documentUrl}
                style={{ height: '100vh', width: '100%' }}
              />
            </Grid>
          )}
        </Grid>
      </div>
    </Paper>
  );
};

export default FacultyOnboard;
