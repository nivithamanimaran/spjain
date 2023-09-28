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
  Table,
  TableBody,
  TableRow,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RxCross1 } from 'react-icons/rx';
import { useHistory, useLocation } from 'react-router-dom';
import KenLoader from '../../../../../components/KenLoader';
import KenSnackBar from '../../../../../components/KenSnackbar';
import KenInputField from '../../../../../global_components/KenInputField';
import KenGridEditable from '../../../../../global_components/kenGridEditable/kenGridEditable';
import {
  getExamInvigilatorAttachment,
  getExamInvigilatorMisconduct,
  getInvigilatorPostExam,
  postInvigilatorAttachment,
  postInvigilatorMisconduct,
} from '../../../../../utils/ApiService';
import Routes from '../../../../../utils/routes.json';
import '../../styles.scss';

const useStyles = makeStyles(theme => ({
  previewInfo: {
    background: '#fff',
    padding: 20,
    rowGap: '20px',
  },
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  previewInfo2: {
    background: '#fff',
    padding: 20,
  },
  infoCard: {
    display: 'flex',
    columnGap: 20,
  },
  mobileInfoCard: {
    display: 'flex',
  },
  tabInfoCard: {
    display: 'flex',
  },
  uploadText: {
    color: '#090F69',
    fontSize: '12px',
    lineHeight: '16px',
  },
  compType: {
    fontSize: 16,
    fontWeight: 700,
    color: '#000',
  },
  actionAnchor: {
    fontSize: 14,
    color: '#090F69',
    cursor: 'pointer',
  },
}));

export default function ExamsPreview() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  let locationData = location?.state?.obj;
  let locationDataType = location?.state?.type;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const mobileView = useMediaQuery(theme.breakpoints.only('xs'));
  const tabView = useMediaQuery(theme.breakpoints.only('md'));
  const [editPreview, setEditPreview] = useState(false);
  const [reloadAPI, setReloadAPI] = useState(false);
  const [reloadAPI2, setReloadAPI2] = useState(false);
  const [disableAdd, setDisableAdd] = useState(true);
  const [uploaded, setUploaded] = useState();
  const [base64String, updateBase64String] = useState();
  const [fileName, setFileName] = useState();
  const [viewAttachment, setViewAttachment] = useState();
  const [submitDialog, setSubmitDialog] = React.useState(false);
  const [noOfStudents, setNoOfStudents] = useState('');
  const [noOfAnswersheets, setNoOfAnswersheets] = useState('');
  const [data, setData] = useState([]);
  const contactId = JSON.parse(localStorage.getItem('userDetails'))?.ContactId;
  const [tempData, setTempData] = useState([]);
  const previewCard = {
    Program: locationData?.item?.Programe_Name__c
      ? locationData?.item?.Programe_Name__c.split('-')[2]
      : '-',
    Batch: locationData?.item?.Programe_Name__c || '-',
    Term: locationData?.term || '-',
    Course: locationData?.course || '-',
    Exam: locationData?.exam || '-',
    Type: locationData?.type || '-',
    'Exam mode':
      locationData?.item?.Facility_Booking__r?.Exam__r?.Mode_of_Exam__c || '-',
    Pattern:
      locationData?.item?.Facility_Booking__r?.Exam__r?.Exam_Pattern__c || '-',
    Date: locationData?.examDate || '-',
    Format:
      locationData?.item?.Facility_Booking__r?.Exam__r?.Exam_Format__c || '-',
    'Start Time':
      locationData?.item?.Facility_Booking__r?.Exam__r?.Start_Time__c || '-',
  };
  const createData = (
    idx,
    studentRollNo,
    misconductType,
    description,
    isEditMode,
    saved
  ) => ({
    idx,
    studentRollNo,
    misconductType,
    description,
    isEditMode,
    saved,
  });
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
  const editPage = () => {
    setEditPreview(true);
    setDisableAdd(false);
  };
  const cancelPage = () => {
    setNoOfStudents(locationData && locationData?.item?.No_Of_Students__c);
    setNoOfAnswersheets(
      locationData && locationData?.item?.No_Of_Answersheets__c
    );
    setEditPreview(false);
  };
  const savePage = async () => {
    handleAccept();
    if (noOfStudents && noOfAnswersheets) {
      let locData = locationData?.item;
      const payload = {
        noOfStudent: noOfStudents,
        answerSheet: noOfAnswersheets,
        Id: locData?.Id,
        sheetName: uploaded?.name,
        sheet: base64String,
      };
      setLoading(true);
      postInvigilatorAttachment(payload)
        .then(res => {
          setLoading(false);
          if (res.success) {
            let validData;
            data?.map(s => {
              if (typeof s.studentRollNo == 'string') {
                validData = false;
              } else if (s.studentRollNo?.props?.value == undefined) {
                validData = true;
              }
            });
            if (data?.length == 0 || validData) {
              handleSnackbarOpen('success', 'Uploaded Successfully');
              setEditPreview(false);
              setDisableAdd(true);
              navigateToExamFaculty();
            }
            console.log('Closing dialog...');
            setEditPreview(false);
            setReloadAPI(!reloadAPI);
            setSubmitDialog(false);
          }
        })
        .catch(error => {
          setLoading(false);
          handleSnackbarOpen('error', 'Something went wrong');
        });
    }
  };
  const viewFile = () => {
    if (viewAttachment.length > 0) {
      window.open(viewAttachment[0]?.DistributionPublicUrl, '_blank');
    }
  };
  const handleClose3 = () => {
    setSubmitDialog(false);
  };
  const handleUploadDoc = async e => {
    if (e.type === 'application/pdf') {
      setUploaded(e);
      setFileName(e?.name);
      let convertedData = await toBase64(e);
      let splitString = convertedData.split('data:application/pdf;base64,')[1];
      updateBase64String(splitString);
    } else {
      handleSnackbarOpen('error', 'Please upload a PDF');
    }
  };
  const removeFile = () => {
    setFileName(null);
    updateBase64String(null);
  };
  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  const onChange = (e, rw) => {
    const value = e.target.value;
    const name = e.target.name;
    const newData = [...data];
    let found = false;
    newData.forEach(row => {
      if (row.idx === rw.idx) {
        row[name] = value;
        found = true;
      }
    });
    if (!found) {
      const newRow = {
        idx: rw.idx,
        [name]: value,
        isEditMode: true,
      };
      newData.push(newRow);
    }
    setData(newData);
  };
  const handleAccept = () => {
    const newData = [...data];
    let examid = locationData?.item?.Facility_Booking__r?.Exam__r?.Id;
    let facilityId = locationData?.item?.Facility_Booking__r?.FacilityID__r?.Id;
    let validData;
    data?.map((s, i) => {
      if (typeof s.studentRollNo == 'string') {
        validData = true;
      } else if (s.studentRollNo?.props?.value == undefined) {
        newData.splice(i, 1);
      }
    });
    if (newData.length > 0 && examid && facilityId && validData) {
      setLoading(true);
      let payload = [];
      newData.map(item => {
        payload.push({
          rollNo: item?.studentRollNo,
          examId: examid,
          facilityId: facilityId,
          misconduct_type: item?.misconductType,
          reason: item?.description,
        });
      });
      postInvigilatorMisconduct(payload)
        .then(res => {
          let check = res.some(item => item.success === true);
          if (check) {
            handleSnackbarOpen('success', 'Update Successful');
            setReloadAPI2(!reloadAPI2);
            setEditPreview(false);
            newData.forEach(row => {
              row.isEditMode = false;
            });
            setSubmitDialog(false);
            setDisableAdd(true);
            setData(newData);
            history.push(Routes.facultyExams);
          } else {
            let check = res.filter(item => item.success === false);
            handleSnackbarOpen(
              'error',
              check.length > 0 ? check[0]?.message : 'Something went wrong'
            );
            setSubmitDialog(false);
            setDisableAdd(false);
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          setSubmitDialog(false);
          if (error) {
            handleSnackbarOpen(
              'error',
              error?.response?.data.message || 'Something went wrong'
            );
          }
        });
    }
  };
  const handleReject = (id, index) => {
    setReloadAPI2(!reloadAPI2);
    setDisableAdd(false);
    setData(tempData);
    setDisableAdd(true);
  };
  const addNewStudent = () => {
    const newData = [...data];
    let idx = Number(`${newData.length + 1}`);
    let row = { idx };
    newData.push(
      createData(
        `${newData.length + 1}`,
        <KenInputField
          name="studentRollNo"
          value={data[idx]?.studentRollNo}
          autofocus
          dropdownColor="#FFFFFF"
          onChange={e => onChange(e, row)}
          label="Student Roll No."
          required
        />,
        <KenInputField
          name="misconductType"
          value={data[idx]?.misconductType}
          autofocus
          label="Misconduct Type"
          dropdownColor="#FFFFFF"
          onChange={e => onChange(e, row)}
          required
        />,
        <KenInputField
          name="description"
          value={data[idx]?.description}
          autofocus
          dropdownColor="#FFFFFF"
          onChange={e => onChange(e, row)}
          label="Description"
          required
        />,
        false,
        true
      )
    );
    setData(newData);
  };

  useEffect(() => {
    let examid = locationData?.item?.Id;
    if (examid && contactId) {
      getInvigilatorPostExam(contactId).then(res => {
        if (res.done) {
          if (res.records.length > 0) {
            let currentObj = res.records?.find(s => s.Id == examid);
            setNoOfAnswersheets(currentObj?.No_Of_Answersheets__c);
            setNoOfStudents(currentObj?.No_Of_Students__c);
          }
        }
      });
    }
  }, [reloadAPI]);
  useEffect(() => {
    let examid = locationData?.item?.Facility_Booking__r?.Exam__r?.Id;
    let facilityId = locationData?.item?.Facility_Booking__r?.FacilityID__r?.Id;
    if (examid && facilityId) {
      setLoading(true);
      getExamInvigilatorMisconduct(examid, facilityId)
        .then(res => {
          if (res.length > 0) {
            let data = [];
            res.map(item => {
              data.push({
                idx: item.Id,
                studentRollNo: item.Student_Roll_Number__c,
                misconductType: item.Misconduct_Type__c,
                description: item.Reason_for_Misconduct__c,
                isEditMode: false,
                saved: false,
                item,
              });
            });
            setData(data);
            setTempData(data);
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
    }
  }, [reloadAPI2]);
  useEffect(() => {
    let invigilatorId = locationData.item.Id;
    if (invigilatorId) {
      setLoading(true);
      getExamInvigilatorAttachment(invigilatorId)
        .then(res => {
          if (res) {
            setViewAttachment(res);
            setFileName(res[0].Name);
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
    }
  }, [reloadAPI]);
  const navigateToExamFaculty = () => {
    history.push({
      pathname: '/exams-faculty',
      state: { pageCheck: 1 },
    });
  };
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
      <Box className={classes.breadCrumbWrapper}>
        <Card style={{ padding: '15px' }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            classes={{ separator: classes.separator }}
          >
            <Link
              color="inherit"
              onClick={navigateToExamFaculty}
              style={{ cursor: 'pointer' }}
            >
              Invigilation & Proctoring
            </Link>
            <Typography color="textPrimary">Exam review & incidents</Typography>
          </Breadcrumbs>
        </Card>
      </Box>
      <Grid container xs={12} className={classes.previewInfo}>
        {Object.entries(previewCard).map(([key, value]) => {
          if (key === 'Start Time') {
            value = moment(value, 'HH:mm:ss').format('hh:mm A');
          }
          return (
            <Grid
              item
              lg={3}
              md={6}
              xs={12}
              className={
                mobileView
                  ? classes.mobileInfoCard
                  : tabView
                  ? classes.tabInfoCard
                  : classes.infoCard
              }
            >
              <Grid lg={4} md={3} xs={12}>
                <Typography style={{ fontSize: '15px', opacity: '50%' }}>
                  {key}:
                </Typography>
              </Grid>
              <Grid lg={8} md={9} xs={12}>
                <Typography style={{ fontSize: '14px', color: '#000' }}>
                  {value}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Grid
        container
        xs={12}
        className={classes.previewInfo2}
        style={{ marginTop: '20px' }}
      >
        <Grid xs={12} md={8}>
          <Typography className={classes.compType}>
            Invigilation Details
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          {!editPreview ? (
            <Grid item xs={12} style={{}}>
              <Button
                variant="contained"
                color="primary"
                disabled={locationDataType === 'view' ? true : false}
                style={{ float: 'right', textTransform: 'capitalize' }}
                onClick={editPage}
              >
                Edit
              </Button>
            </Grid>
          ) : (
            <Grid item xs={12} style={{}}>
              <Button
                variant="contained"
                color="primary"
                style={{ float: 'right', textTransform: 'capitalize' }}
                onClick={() => {
                  setSubmitDialog(true);
                }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="primary"
                style={{
                  float: 'right',
                  textTransform: 'capitalize',
                  marginRight: 10,
                  background: '#fff',
                }}
                onClick={() => {
                  cancelPage();
                  handleReject();
                  removeFile();
                }}
              >
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid container xs={12} className={classes.previewInfo2}>
        <Grid item xs={4}>
          {!editPreview ? (
            <div style={{ display: 'flex', gap: 20 }}>
              <Typography style={{ lineHeight: '33px', fontSize: '14px' }}>
                No of Students:
              </Typography>
              <Typography
                style={{
                  fontWeight: 600,
                  lineHeight: '33px',
                  fontSize: '14px',
                }}
              >
                {noOfStudents}
              </Typography>
            </div>
          ) : (
            <Grid item xs={8}>
              <KenInputField
                label="No. of Students"
                name="noOfStudents"
                value={noOfStudents}
                optionalLabel={false}
                dropdownColor="#FFFFFF"
                onChange={e => {
                  var numbers = /^[0-9]{0,3}$/;
                  if (e.target.value.match(numbers)) {
                    setNoOfStudents(e.target.value);
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
        <Grid item xs={4}>
          {!editPreview ? (
            <div style={{ display: 'flex', gap: 20 }}>
              <Typography style={{ lineHeight: '33px', fontSize: '14px' }}>
                No of Answersheets:
              </Typography>
              <Typography
                style={{
                  fontWeight: 600,
                  lineHeight: '33px',
                  fontSize: '14px',
                }}
              >
                {noOfAnswersheets}
              </Typography>
            </div>
          ) : (
            <Grid item xs={8}>
              <KenInputField
                label="No. of Answersheet"
                name="Role"
                optionalLabel={false}
                value={noOfAnswersheets}
                dropdownColor="#FFFFFF"
                onChange={e => {
                  var numbers = /^[0-9]{0,3}$/;
                  if (e.target.value.match(numbers)) {
                    setNoOfAnswersheets(e.target.value);
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
        <Grid item xs={4} style={{ display: 'flex', gap: 20 }}>
          {!editPreview ? (
            <>
              {viewAttachment && viewAttachment[0]?.DistributionPublicUrl ? (
                <div style={{ display: 'flex', gap: 20 }}>
                  <Typography style={{ lineHeight: '33px', fontSize: '14px' }}>
                    {viewAttachment && viewAttachment[0]?.DistributionPublicUrl
                      ? 'View Sheet:'
                      : 'Upload sheet:'}
                  </Typography>
                  <Typography
                    style={{ lineHeight: '32px' }}
                    className={classes.actionAnchor}
                    onClick={viewFile}
                  >
                    View
                  </Typography>
                </div>
              ) : (
                <Grid container xs={12}>
                  <Grid item xs={3}>
                    <Typography
                      className={classes.uploadText}
                      style={{ lineHeight: '40px', fontSize: '14px' }}
                    >
                      Upload Sheet
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <KenInputField
                      placeholder="Choose a File"
                      disabled={true}
                      name="uploadSheet"
                      optionalLabel={false}
                      dropdownColor="#FFFFFF"
                    />
                  </Grid>
                </Grid>
              )}
            </>
          ) : (
            <Grid item xs={8}>
              <Typography className={classes.uploadText}>
                Upload Sheet
              </Typography>
              <div
                style={{
                  marginTop: '4px',
                  border: '1px solid #DFE1E6',
                  borderRadius: '3px',
                  padding: '7px 4px',
                  overflow: 'hidden',
                }}
              >
                <input
                  style={{
                    marginTop: '10px',
                    paddingLeft: '2px',
                    display: 'none',
                  }}
                  label="Upload Sheet"
                  type="file"
                  accept="application/pdf"
                  name="uploadSheet"
                  id="file"
                  onChange={e => handleUploadDoc(e.target.files[0])}
                  aria-label={
                    fileName ? `Selected file: ${fileName}` : 'Upload Sheet'
                  }
                />
                <Button
                  style={{
                    padding: '8px 4px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    textTransform: 'inherit',
                    display: 'initial',
                    lineHeight: '14px',
                    width: fileName ? '200px' : '110px',
                    background: 'transparent',
                    color: '#000',
                    textAlign: 'left',
                  }}
                  onClick={e =>
                    document
                      .getElementById('file')
                      .click(() => handleUploadDoc(e.target.files[0]))
                  }
                >
                  {fileName ? `${fileName}` : 'Choose a File'}
                </Button>
                {fileName ? (
                  <RxCross1
                    style={{
                      float: 'right',
                      margin: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeFile()}
                  />
                ) : null}
              </div>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        className={classes.previewInfo2}
        style={{ borderTop: '1px solid #e4e4e4' }}
      >
        <Typography className={classes.compType}>
          Exam Misconduct Details
        </Typography>
      </Grid>
      <Grid item xs={12} className={classes.previewInfo2}>
        <Table sx={{ minWidth: 700 }} className="preview-table">
          <TableBody>
            {data.length > 0 &&
              data.map((row, index) => {
                return (
                  <TableRow key={row.idx}>
                    <KenGridEditable
                      {...{
                        row,
                        onChange,
                        columns: [
                          {
                            column_name: 'studentRollNo',
                            is_inline_edit: false,
                            inline_edit_type: 'kenInputField',
                            label: 'Student Roll No.',
                          },
                          {
                            column_name: 'misconductType',
                            is_inline_edit: false,
                            inline_edit_type: 'kenInputField',
                            label: 'Misconduct Type',
                          },
                          {
                            column_name: 'description',
                            is_inline_edit: false,
                            inline_edit_type: 'kenInputField',
                            label: 'Description',
                          },
                        ],
                      }}
                    />
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '12px', textTransform: 'capitalize' }}
          onClick={() => addNewStudent()}
          disabled={disableAdd}
        >
          Add Misconduct
        </Button>
      </Grid>
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
          <DialogContentText>
            <Typography
              style={{
                color: '#000',
                fontSize: '24px',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              Are you sure you want to submit?
            </Typography>
            <Typography
              style={{
                color: '#000',
                fontSize: '16px',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              (Please note that changes cannot be made after submission)
            </Typography>
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
            onClick={savePage}
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
