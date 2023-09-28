import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons//AddCircleOutline';
import BackupIcon from '@material-ui/icons/Backup';
import React, { useEffect, useState } from 'react';
import { default as Submitted } from '../../../../../assets/check-circle.png';
import Clock from '../../../../../assets/clock.png';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Info from '../../../../../assets/info.png';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSnackbar } from 'notistack';
import {
  getQuestionPaperDoc,
  getQuestionPaperList,
  postQuestionPaper,
} from '../../../../../utils/ApiService';
import KenLoader from '../../../../../components/KenLoader';

const useStyles = makeStyles(theme => ({
  card: {
    padding: '20px',
    marginTop: '20px',
  },
  buttonsssssss: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cardnames: {
    fontSize: '18px',
    fontWeight: 400,
    color: 'darkGray',
  },
  cardDarknames: {
    fontSize: '16px',
    fontWeight: 400,
    marginTop: '5px',
  },
  boxMargin: {
    marginTop: '20px',
  },
  Questions: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  specialGrid: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '20px',
  },
  gridBackground: {
    backgroundColor: '#F8FBFF',
    border: '1px solid #E4E4E4',
    marginBottom: '20px',
    borderRadius: '10px',
    padding: '0px 10px',
  },

  statustypo: {
    fontSize: '14px',
    fontWeight: 500,
    marginTop: '8px',
  },
  borderGrid: {
    borderBottom: '1px solid #E4E4E4',
    paddingBottom: '10px',
  },
  topGrid: {
    marginBottom: '20px',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0, 1),
  },
}));

const ExamPreview = ({ rowData, onClose }) => {
  const classes = useStyles();
  console.log('rowData', rowData);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [reuploadedFile, setReuploadedFile] = useState(null);
  const [questionPaperName, setQuestionPaperName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionPaperList, setQuestionPaperList] = useState([]);
  const [viewingPDF, setViewingPDF] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedData = await getQuestionPaperList(rowData.examRecordId);
        if (Array.isArray(fetchedData)) {
          const modifiedData = fetchedData.map(item => ({
            ...item,
            ContentDocumentId:
              item.ContentDocumentLinks?.records[0]?.ContentDocumentId || null,
          }));
          setQuestionPaperList(modifiedData);
          setLoading(false);
        } else {
          setLoading(false);
          console.error(
            'Fetched question paper data is not an array:',
            fetchedData
          );
        }
      } catch (error) {
        console.error('Error fetching question paper list:', error);
      }
    };

    fetchData();
  }, [rowData.examRecordId]);

  const handleAddQuestionPaperSet = () => {
    const newSet = {
      Id: null,
      Name: `Question Paper Set ${questionPaperList.length + 1}`,
      File: null,
      Status__c: 'Pending',
    };
    console.log('test', newSet.Name);
    setQuestionPaperName(newSet.Name);
    setQuestionPaperList(prevSets => [...prevSets, newSet]);
  };

  const handleUpload = async (setId, file, questionPaperName) => {
    console.log('Uploading file...', file);
    const updatedSets = questionPaperList.map(set =>
      set.Id === setId ? { ...set, File: file, Status__c: 'Submitted' } : set
    );

    setQuestionPaperList(updatedSets);
    setReuploadedFile(file);
    setSelectedPDF({ File: file, Status: 'Submitted' });
    setShowPDF(true);
    setQuestionPaperName(questionPaperName);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error uploading question paper:', error);
      enqueueSnackbar('Error uploading question paper', { variant: 'error' });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const contactId = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails')).ContactId
      : null;

    if (contactId) {
      try {
        for (const set of questionPaperList) {
          if (set.File instanceof Blob) {
            const reader = new FileReader();
            reader.onload = async () => {
              console.log('File loaded successfully.');
              const base64Raw = reader.result.split(',')[1];
              const payload = {
                examId: rowData.examRecordId,
                contactId: contactId,
                recordId: set.Id,
                fileName: set.File.name,
                questionPaperName: set.Name,
                content: base64Raw,
                status: 'Submitted',
              };
              console.log('testname', set.Name);
              try {
                const response = await postQuestionPaper(payload);
                console.log('Upload response:', response);

                const updatedSets = questionPaperList.map(qpSet =>
                  qpSet.Id === response.newlySubmittedQuestionPaperId
                    ? { ...qpSet, Status__c: 'Submitted' }
                    : qpSet
                );
                setQuestionPaperList(updatedSets);
              } catch (error) {
                console.error('Error uploading question paper:', error);
                setLoading(false);
                enqueueSnackbar('Error submitting question paper', {
                  variant: 'error',
                });
              }
            };
            reader.readAsDataURL(set.File);
          } else {
            console.error(
              `File for Question Paper Set ${set.Id} is not a valid Blob.`
            );
          }
        }

        setLoading(false);
        setShowPDF(false);
        setOpenDialog(false);
        enqueueSnackbar('Question paper submitted successfully', {
          variant: 'success',
        });
      } catch (error) {
        console.error('Error loading file:', error);
      }
    } else {
      console.error('ContactId is not available.');
    }
  };

  const handleViewPDF = async (file, status, contentDocumentId) => {
    setShowPDF(false);
    setViewingPDF(false);

    try {
      if (
        status === 'Submitted' ||
        status === 'Assigned' ||
        status === 'Alteration Requested'
      ) {
        setLoading(true);
        let pdfData;

        if (status === 'Alteration Requested' && reuploadedFile) {
          pdfData = reuploadedFile;
        } else {
          try {
            const response = await getQuestionPaperDoc(contentDocumentId);

            if (response && response.success && response.data) {
              pdfData = response.data;
              console.log('pdfData', pdfData);
            } else {
              setLoading(false);
              console.error(
                'Error fetching submitted document:',
                response.errorMessages
              );
              return;
            }
          } catch (error) {
            setLoading(false);
            console.error('Error fetching PDF data:', error);
            return;
          }
        }

        // Create a blob from the base64-encoded PDF data
        const decodedData = atob(pdfData);
        const byteArray = new Uint8Array(decodedData.length);

        for (let i = 0; i < decodedData.length; i++) {
          byteArray[i] = decodedData.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: 'application/pdf' });

        if (selectedPDF && selectedPDF.File instanceof Blob) {
          URL.revokeObjectURL(selectedPDF.File);
        }

        const url = URL.createObjectURL(blob);
        setSelectedPDF({ File: blob, ObjectURL: url, Status: status });
        setLoading(false);
        setShowPDF(true);
      } else {
        const selectedFile =
          status === 'Alteration Requested' ? reuploadedFile : file;

        if (selectedPDF && selectedPDF.File instanceof Blob) {
          URL.revokeObjectURL(selectedPDF.File);
        }

        setSelectedPDF({ File: selectedFile, Status: status });
        setShowPDF(true);
      }

      if (status === 'Submitted' || status === 'Alteration Requested') {
        setViewingPDF(true);
      } else {
        setViewingPDF(false);
      }
    } catch (error) {
      console.error('Error fetching or loading PDF:', error);
    }
  };
  const handleClosePDFViewer = () => {
    setViewingPDF(false);
    setShowPDF(false);
    setSelectedPDF(null);
  };
  return (
    <>
      {loading && <KenLoader />}
      {showPDF ? (
        <Card style={{ padding: '15px' }}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            classes={{ separator: classes.separator }}
          >
            <Link
              color="inherit"
              onClick={handleClosePDFViewer}
              style={{ cursor: 'pointer' }}
            >
              Submission
            </Link>
            <Typography color="textPrimary">Preview</Typography>
          </Breadcrumbs>
        </Card>
      ) : (
        <Card style={{ padding: '15px' }}>
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
              Question Paper
            </Link>
            <Typography color="textPrimary">Submission</Typography>
          </Breadcrumbs>
        </Card>
      )}
      <Card className={classes.card}>
        {showPDF ? (
          <Box className={classes.boxMargin}>
            {!viewingPDF && showPDF && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    float: 'right',
                    marginBottom: '10px',
                    marginRight: '10px',
                    textTransform: 'capitalize',
                  }}
                  onClick={handleOpenDialog}
                  disabled={!reuploadedFile && !selectedPDF?.File}
                >
                  Submit
                </Button>
                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Confirm Submission
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to submit the question paper{' '}
                      {questionPaperName}?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDialog}
                      color="primary"
                      style={{ textTransform: 'capitalize' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      color="primary"
                      autoFocus
                      style={{ textTransform: 'capitalize' }}
                    >
                      Yes, Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
            {showPDF && selectedPDF && (
              <iframe
                src={
                  selectedPDF.Status === 'Alteration Requested' &&
                  reuploadedFile
                    ? URL.createObjectURL(reuploadedFile)
                    : selectedPDF.Status === 'Submitted' ||
                      selectedPDF.Status === 'Pending' ||
                      selectedPDF.Status === 'Alteration Requested'
                    ? URL.createObjectURL(selectedPDF.File)
                    : ''
                }
                title={
                  selectedPDF.Status === 'Alteration Requested'
                    ? 'Re-uploaded Question Paper'
                    : 'Question Paper'
                }
                width="100%"
                height="500"
              />
            )}
          </Box>
        ) : (
          <Box className={classes.boxMargin}>
            <Grid container spacing={2} className={classes.topGrid}>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Batch :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.program}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>Term:</Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.term}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Course:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.course}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.topGrid}>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Course Code :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.courseCode}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Exam :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.exam}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Type :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.type}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.borderGrid}>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Format:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.examFormat}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Exam mode:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.examMode}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography className={classes.cardnames}>
                      Pattern :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography className={classes.cardDarknames}>
                      {rowData.examPattern}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box className={classes.boxMargin}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography className={classes.Questions}>
                    Question paper Bank
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} className={classes.specialGrid}>
                {questionPaperList.map((set, index) => (
                  <Grid
                    container
                    item
                    md={12}
                    className={classes.gridBackground}
                    style={{ padding: '10px 16px' }}
                  >
                    <React.Fragment key={set.Id}>
                      <Grid item xs={12} md={3}>
                        <Typography className={classes.cardDarknames}>
                          {set.Name}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                    <Grid item xs={12} md={7}>
                      <Typography className={classes.statustypo}>
                        {set.Status__c === 'Submitted' ? (
                          <span>
                            <img src={Submitted} alt="Submitted" />
                            <span style={{ marginLeft: '5px' }}>
                              Submitted {set.Faculty_Name_Teacher__c}
                            </span>
                          </span>
                        ) : set.Status__c === 'Pending' ? (
                          <span>
                            <img src={Clock} alt="Pending" />
                            <span style={{ marginLeft: '5px' }}>Pending</span>
                          </span>
                        ) : set.Status__c === 'Alteration Requested' ? (
                          <span>
                            <img src={Info} alt="Info" />
                            <span style={{ marginLeft: '5px' }}>
                              Alteration Requested
                            </span>
                          </span>
                        ) : set.Status__c === 'Assigned' ? (
                          <span>
                            <img src={Submitted} alt="Submitted" />
                            <span style={{ marginLeft: '5px' }}>
                              Submitted {set.Faculty_Name_Teacher__c}
                            </span>
                          </span>
                        ) : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      {set.Status__c === 'Pending' ? (
                        <label htmlFor={`upload-input-${set.Id}`}>
                          <input
                            id={`upload-input-${set.Id}`}
                            type="file"
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={e =>
                              handleUpload(set.Id, e.target.files[0], set.Name)
                            }
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            startIcon={<BackupIcon />}
                            style={{
                              float: 'right',
                              textTransform: 'capitalize',
                            }}
                          >
                            Upload
                          </Button>
                        </label>
                      ) : set.Status__c === 'Submitted' ||
                        set.Status__c === 'Assigned' ? (
                        <Grid item xs={12} md={12}>
                          {set.Status__c === 'Pending' ||
                          set.Status__c === 'Submitted' ||
                          set.Status__c === 'Assigned' ||
                          set.Status__c === 'Alteration Requested' ? (
                            <>
                              {set.Status__c === 'Pending' ||
                              set.Status__c === 'Alteration Requested' ? (
                                <label htmlFor={`upload-input-${set.Id}`}>
                                  <input
                                    id={`upload-input-${set.Id}`}
                                    type="file"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={e =>
                                      handleUpload(set.Id, e.target.files[0])
                                    }
                                  />
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    startIcon={<BackupIcon />}
                                    style={{
                                      float: 'right',
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {set.Status__c === 'Pending'
                                      ? 'Upload'
                                      : 'Re-upload'}
                                  </Button>
                                </label>
                              ) : null}

                              <Button
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                  if (
                                    set.Status__c === 'Pending' ||
                                    set.Status__c === 'Submitted' ||
                                    set.Status__c === 'Assigned' ||
                                    set.Status__c === 'Alteration Requested'
                                  ) {
                                    handleViewPDF(
                                      set.Status__c === 'Alteration Requested'
                                        ? reuploadedFile
                                        : set.File,
                                      set.Status__c,
                                      set.ContentDocumentId
                                    );
                                  }
                                }}
                                style={{
                                  float: 'right',
                                  textTransform: 'capitalize',
                                }}
                              >
                                View
                              </Button>
                            </>
                          ) : null}
                        </Grid>
                      ) : set.Status__c === 'Alteration Requested' ? (
                        <label htmlFor={`upload-input-${set.Id}`}>
                          <input
                            id={`upload-input-${set.Id}`}
                            type="file"
                            accept=".pdf"
                            style={{ display: 'none' }}
                            onChange={e =>
                              handleUpload(set.Id, e.target.files[0])
                            }
                          />
                          <div className={classes.buttonsssssss}>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={() => {
                                if (
                                  set.Status__c === 'Pending' ||
                                  set.Status__c === 'Submitted' ||
                                  set.Status__c === 'Assigned' ||
                                  set.Status__c === 'Alteration Requested'
                                ) {
                                  handleViewPDF(
                                    set.Status__c === 'Alteration Requested'
                                      ? reuploadedFile
                                      : set.File,
                                    set.Status__c,
                                    set.ContentDocumentId
                                  );
                                }
                              }}
                              style={{
                                float: 'right',
                                textTransform: 'capitalize',
                              }}
                            >
                              View
                            </Button>
                            <Button
                              color="primary"
                              component="span"
                              startIcon={<BackupIcon />}
                              style={{
                                float: 'right',
                                textTransform: 'capitalize',
                              }}
                            >
                              Re-upload
                            </Button>
                          </div>
                        </label>
                      ) : null}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {(rowData.questionPaperStatus === 'Alteration Requested' ||
              rowData.questionPaperStatus === 'Pending' ||
              rowData.questionPaperStatus === 'Submitted') &&
            rowData.questionPaperStatus !== 'Assigned' ? (
              <Grid item xs={12} md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddQuestionPaperSet}
                >
                  <div style={{ display: 'flex' }}>
                    <AddCircleOutlineIcon />
                    <Typography
                      style={{ marginLeft: '5px', textTransform: 'capitalize' }}
                    >
                      Add Question Paper{' '}
                    </Typography>
                  </div>
                </Button>
              </Grid>
            ) : null}
          </Box>
        )}
      </Card>
    </>
  );
};
export default ExamPreview;
