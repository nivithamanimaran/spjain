import { Paper, Typography, makeStyles } from '@material-ui/core';
import KenSnackbar from '../../components/KenSnackbar/index';
import KenCardWithoutpadding from '../../components/KenCard/KenCard2';
import { useHistory } from 'react-router-dom';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoIcon from '@material-ui/icons/Info';
import React, { useState, createRef, useEffect, useRef } from 'react';
import KenGrid from '../../global_components/KenGrid';
import { Grid } from '@material-ui/core';
import KenButton from '../../global_components/KenButton';
import KenDialogBox from '../../global_components/KenDialogBox';
// ICOs
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import { AiFillCheckCircle } from 'react-icons/ai';
import CircularProgress from '@material-ui/core/CircularProgress';
import './StudentByComponent.css';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import {
  getSubcomponentScoresBySubComponentId,
  getStudentListByCourseOffering,
  createSubcomponentScores,
  postValidateSession,
  validateSubcomponentScores,
} from '../../utils/ApiService';
import { useLocation, useParams } from 'react-router-dom';

import KenLoader from '../../components/KenLoader';

import * as xlsx from 'xlsx';
import KenInputField from '../../global_components/KenInputField';

const useStyles = makeStyles(theme => ({
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
    margin: '10px 0px',
  },
  title: {
    fontWeight: 600,
    fontSize: '18px',
  },
  cancelBtn: {
    marginRight: '10px',
  },
  tableBox: {
    background: '#ffffff',
    padding: '10px 0px',
  },
  checkCircle: {
    width: '100%',
    height: '70px',
    color: '#36b37e',
  },
  error: {
    color: 'red',
  },
  uploadbtn: {
    padding: '9px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  buttonDiv: {
    height: '26px',
  },
}));

const ActionCell = ({
  value,
  row,
  isEditable,
  handleInputChange,
  maximumNumber,
}) => {
  console.log('rowrowrowrow', maximumNumber);
  const re = /^[0-9\b]+$/;
  let error;
  const [getvalue, setValue] = useState(value);
  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    handleInputChange(getvalue, row);
  };
  if (value > maximumNumber) {
    error = true;
  } else {
    error = false;
  }
  if (row.original.scoresFinalized === false)
    if (isEditable) {
      return (
        <>
          <KenInputField
            type="text"
            optionalLabel={false}
            onChange={onChange}
            onBlur={onBlur}
            value={getvalue}
            classNameInput={true}
          />

          {error && (
            <span style={{ color: 'red', width: '100%' }}>
              Marks should be less {maximumNumber}
            </span>
          )}
        </>
      );
    }
  return <label>{value}</label>;
};

export default function StudentsBySubComponent(props) {
  const history = useHistory();

  const search = useLocation().search;
  const id = new URLSearchParams(search).get('id');
  const params = useParams();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [subComponentData, setSubComponentData] = useState([]);
  const [severity, setseverity] = useState('');
  const [uploadDialog, setUploadDialog] = useState(false);
  const [reloadData, setrealoadData] = useState(false);
  const [uploadScoreDialog, setUploadScoreDialog] = useState(false);
  const [scoreMessage, setScoreMessage] = useState('');
  const [upload, setUpload] = useState(false);
  const [pdfLoader, setPdfLoader] = useState(false);
  const inputFile = createRef();
  const [pdfLoaded, setPdfLoaded] = useState(0);
  const [filename, setFileName] = useState();
  const [correctUpload, setCorrectUpload] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [subComponentId, setSubComponentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseoffId, setcourseoffId] = useState('');
  const [studentList, setStudentList] = useState([]);
  const [xLSXData, setXLSXData] = useState([]);
  const [isEditable, setisEditable] = useState(false);
  const [finalizeButton, setfinalizeButton] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [updatedStudentList, setUpdatedStudentList] = useState([]);
  const [maximumNumber, setMaximumnumber] = useState('');
  const [filterData, setFilterData] = useState('');
  const [filterData1, setFilterData1] = useState('');
  const [errorResponse, setErrorResponse] = useState(false);

  const handleUploadDialog = () => {
    setUploadDialog(prevState => !prevState);
  };
  const handleInputChange = (value, row) => {
    const newData = scoreData.map(item => {
      console.log('itemitem', row);
      if (item.id === row.original.id) {
        const data = {
          studentId: item.id,
          courseSubcomponentId: subComponentId,
          marksObtained: value,
          subcomponentScoresId: item.subcomponentScoresId,
          scoresFinalized: true,
        };
        console.log('itemitemitem', data);
        if (value < maximumNumber) {
          setUpdatedStudentList([...updatedStudentList, data]);
        }

        return { ...item, marksObtained: value };
      }
      return item;
    });
    setScoreData(newData);
  };

  const uploadSessionPlanner = () => {
    setUploadDialog(true);
  };

  // CONVERT XLSX TO JSON
  const convertXLSXtoJSON = ev => {
    setCorrectUpload(false);
    setPdfLoader(true);
    setTimeout(() => {
      setPdfLoaded(50);
    }, 1200);
    var files = ev.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function(ev) {
      var data = ev.target.result;
      let readedData = xlsx.read(data, {
        type: 'binary',
        cellDates: true,
      });
      const wsname = readedData.SheetNames[0];
      console.log('wsnamewsnamewsname', wsname);
      const ws = readedData.Sheets[wsname];
      /* Convert array to json*/
      const dataParse = xlsx.utils.sheet_to_json(ws);
      setOriginalData(dataParse);
      validateTemplate(dataParse);
    };
    reader.readAsBinaryString(f);
  };

  const fileSelected = (ev, i) => {
    console.log(ev.target.files);
    const file = ev.target.files[0];
    setUpload(true);
    setFileName(file.name);
    convertXLSXtoJSON(ev);
    setTimeout(() => {
      setPdfLoaded(20);
    }, 1000);
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  const validateTemplate = extractedData => {
    setPdfLoader(true);
    let data = [];
    let errorData = [];

    extractedData.map(item => {
      console.log('itemitemitemitem', item);
      data.push({
        studentId: item.Id ? item.Id : '',
        studentName: item['Student name'],
        marksObtained: item['Marks obtained'],
        scoresFinalized: item['Scores finalized'],
        subcomponentScoresId: item['Subcomponent scores id'],
        courseSubcomponentId: item['Course subcomponent id'],
      });
    });
    setTimeout(() => {
      setPdfLoaded(100);
    }, 1200);
    const payload = {
      Operation: 'Post',
      SubComponentScores: data,
    };
    let error = [];
    validateSubcomponentScores(payload)
      .then(res => {
        console.log('cdsfnsjidfshjk', res);
        let newData = [];
        // setValidationResponse(res.SubComponentScores);
        res.SubComponentScores.map(item => {
          console.log('cdsfnsjidfshjkdsfsdf', item, res);
          if (item.message && Object.keys(item.message).length === 0) {
            newData.push({
              ...item,

              studentName: item.studentName,
              maximumMarks: item.maximumMarks,
              marksObtained: item.marksObtained,
              scoresFinalized: item.scoresFinalized,
            });
            setScoreData(newData);
            setXLSXData(newData);
            handleSnackbarOpen('success', item.message?.success);
            setErrorResponse(false);
          } else {
            error.push({
              studentId: item.studentId,
              message: item.message,
            });
            setErrorResponse(true);
            handleSnackbarOpen('error', 'Highlighted records are incorrect.');
          }
        });
        const finalData = [];
        data.map(item => {
          error.map(errorItem => {
            if (item.studentId === errorItem.studentId) {
              console.log('ErrorError', item, errorItem);
              finalData.push({
                studentId: item.studentId ? item.studentId : '',
                studentName: item.studentName,
                marksObtained: item.marksObtained,
                scoresFinalized: item.marksObtained,
                subcomponentScoresId: item.subcomponentScoresId,
                courseSubcomponentId: item.courseSubcomponentId,
                action: (
                  <Tooltip
                    title={errorItem.message.courseSubcomponentId}
                    aria-label={errorItem.message.courseSubcomponentId}
                  >
                    <ErrorOutlineIcon />
                  </Tooltip>
                ),
              });
            }
          });
        });
        console.log('ErrorError', finalData);
        setScoreData(finalData);

        setPdfLoader(false);
        setUploadDialog(false);
        setPdfLoaded(0);
        setUpload(false);
      })
      .catch(err => {
        setPdfLoader(false);
        setUploadDialog(false);
        handleSnackbarOpen('error', err.message);
        setUpload(false);
        setPdfLoaded(0);
      });
  };

  useEffect(() => {
    if (params.id) {
      setisEditable(false);
      setSubComponentId(params.id);
      let idS = id || subComponentId;
      console.log('test', idS);
      setLoading(true);
      const filterData = [];
      getSubcomponentScoresBySubComponentId(params.id)
        .then(res => {
          if (res.length > 0) {
            console.log(res[0].courseOfferingId);
            setcourseoffId(res[0].courseOfferingId);
            setSubComponentData(res[0].maximumMarks);
            setMaximumnumber(res[0].maximumMarks);
            res.map(item => {
              filterData.push({
                id: item.studentId,
                studentName: item.studentName,
                marksObtained: item.marksObtained,
                subcomponentScoresId: item.id,
                scoresFinalized: item.scoresFinalized,
                subcomponentScoresId: item.id,
                courseSubcomponentId: params.id,
              });
            });
            setFilterData(filterData);
          }
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [params.id, reloadData]);
  useEffect(() => {
    if (courseoffId) {
      setisEditable(false);
      const filterData1 = [];
      getStudentListByCourseOffering(courseoffId)
        .then(res => {
          console.log('res.data', res.data);
          res?.data?.studentsList?.map(item => {
            filterData1.push({
              id: item.contactId,
              studentName: item.contactName,
              marksObtained: '',
              subcomponentScoresId: '',
              scoresFinalized: false,
            });
          });
          setFilterData1(filterData1);
          setStudentList(res.data.studentsList);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [courseoffId, reloadData]);
  useEffect(() => {
    if (filterData1.length > 0 || filterData.length > 0) {
      var union = [...new Set([...filterData, ...filterData1])];
      if (union.length > 0) {
        const finalizebutton =
          union.length > 0 &&
          union.filter(item => {
            return item.scoresFinalized === false;
          });
        console.log('finalizebutton', finalizebutton);
        if (finalizebutton && finalizebutton.length <= 0) {
          setfinalizeButton(true);
        } else {
          setfinalizeButton(false);
        }
      }
      setScoreData(union);
    }
  }, [filterData, filterData1]);

  const handleFinalize = () => {
    const finalStudentdata = scoreData.filter(score => {
      return (
        score.scoresFinalized === false &&
        score.marksObtained <= maximumNumber &&
        score.marksObtained === ''
      );
    });
    if (finalStudentdata.length === 0) {
      const result = {
        SubComponentScores: scoreData.map(data => {
          return {
            studentId: data.id,
            courseSubcomponentId: data.courseSubcomponentId,
            marksObtained: data.marksObtained,
            subcomponentScoresId: data.subcomponentScoresId,
            scoresFinalized: true,
          };
        }),
      };

      console.log('updatedStudentList', result);

      createSubcomponentScores(result)
        .then(res => {
          setLoading(false);
          console.log('resresresres', res);
          setOpen(true);
          setseverity('success');
          seterrorMessage(res.SubComponentScores[0].message);
          setisEditable(false);
          setUpdatedStudentList([]);
          setrealoadData(true);
          setUploadScoreDialog(false);
        })
        .catch(error => {
          setLoading(false);
          setUpdatedStudentList([]);
          setUploadScoreDialog(false);
          setOpen(true);
          seterrorMessage(error.message);
          setseverity('error');
        });
    } else {
      setOpen(true);
      seterrorMessage('Please submit all student marks');
      setseverity('error');
    }
  };
  const GoBackComponent = () => {
    history.push('/facultyresult');
  };
  const SendFinalizeScore = () => {
    console.log('updatedStudentList', updatedStudentList);
    const result = {
      Operation: 'Create',
      SubComponentScores: updatedStudentList,
    };
    setLoading(true);

    createSubcomponentScores(result)
      .then(res => {
        setLoading(false);
        console.log('resresresres', res);
        setOpen(true);
        setseverity('success');
        seterrorMessage(res.SubComponentScores[0].message);
        setisEditable(false);
        setUpdatedStudentList([]);
        setrealoadData(true);
        setUploadScoreDialog(false);
      })
      .catch(error => {
        setLoading(false);
        setUpdatedStudentList([]);
        setUploadScoreDialog(false);
        setOpen(true);
        seterrorMessage(error.message);
        setseverity('error');
      });
  };

  const columns = [
    {
      Header: 'Student',
      accessor: 'studentName',
      disableGlobalFilter: false,
    },

    {
      Header: 'Marks Obtained',
      accessor: 'marksObtained',
      Cell: ({ value, row }) =>
        ActionCell({
          value,
          row,
          isEditable,
          handleInputChange,
          maximumNumber,
        }),
    },
    {
      Header: 'Component Marks',
      accessor: 'marksInComponent',
      disableGlobalFilter: false,
    },
    {
      id: 'scoresFinalized',
      Header: 'Scores Finalized',
      accessor: d => d.scoresFinalized.toString(),
      disableGlobalFilter: false,
    },
    {
      id: 'action',
      Header: '',
      accessor: 'action',
      disableGlobalFilter: false,
    },
  ];
  const handleClose = () => {
    setOpen(false);
  };
  const handleDownload = () => {
    if (scoreData || xLSXData) {
      const data1 = xLSXData.length > 0 ? xLSXData : scoreData;
      const finalHeaderData = data1.map(items => {
        return {
          Id: items.id,
          'Student name': items.studentName,
          'Marks obtained': items.marksObtained,
          'Scores finalized': items.scoresFinalized,
          'Course subcomponent id': items.courseSubcomponentId,
          'Subcomponent scores id': items.subcomponentScoresId,
        };
      });
      const worksheet = xlsx.utils.json_to_sheet(finalHeaderData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      xlsx.writeFile(workbook, 'DataSheet.xlsx');
    }
  };
  const handleFinalizeMarks = () => {
    if (updatedStudentList.length > 0) {
      setUploadScoreDialog(true);
      setScoreMessage(
        "The marks you have added that can't be change later, click on Submit to confirm and save it"
      );
    } else {
      setOpen(true);
      setseverity('error');
      seterrorMessage('Please change atleast one score');
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <>
      <Typography variant="h6">
        Students List: <b>Component Name</b>
      </Typography>
      <KenSnackbar
        message={errorMessage}
        severity={severity}
        autoHideDuration={4000}
        open={open}
        handleSnackbarClose={handleClose}
        position="Bottom-Right"
      />
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      {loading && <KenLoader />}

      <Paper className={classes.uploadbtn} style={{ marginBottom: '20px' }}>
        <Grid container>
          <Grid
            item
            xs={4}
            style={{
              justifyContent: 'left',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            Maximum mark :{subComponentData}
          </Grid>
          <Grid
            item
            xs={8}
            style={{
              display: 'flex',
              justifyContent: 'end',
              gridColumnGap: '10px',
            }}
          >
            {finalizeButton === true ? (
              <KenButton
                label="Finalize marks"
                onClick={handleFinalize}
                variant="primary"
                style={{ padding: '20px' }}
                buttonClass={classes.buttonDiv}
              />
            ) : (
              <>
                {isEditable === false ? (
                  <>
                    <KenButton
                      label="Back"
                      onClick={GoBackComponent}
                      variant="primary"
                      style={{ padding: '20px' }}
                      buttonClass={classes.buttonDiv}
                    />
                    {errorResponse === false && (
                      <KenButton
                        label="Edit marks"
                        onClick={() => setisEditable(true)}
                        variant="primary"
                        style={{ padding: '20px' }}
                        buttonClass={classes.buttonDiv}
                      />
                    )}

                    <KenButton
                      label="Upload"
                      onClick={uploadSessionPlanner}
                      variant="primary"
                      style={{ padding: '20px' }}
                      buttonClass={classes.buttonDiv}
                    />

                    <KenButton
                      label="Download Format"
                      onClick={handleDownload}
                      variant="primary"
                      style={{ padding: '20px' }}
                      buttonClass={classes.buttonDiv}
                    />
                  </>
                ) : (
                  <>
                    <KenButton
                      label="Submit"
                      onClick={handleFinalizeMarks}
                      variant="primary"
                      style={{ padding: '20px' }}
                      buttonClass={classes.buttonDiv}
                    />

                    <KenButton
                      label="Cancel"
                      onClick={() => setisEditable(false)}
                      variant="primary"
                      style={{ padding: '20px' }}
                      buttonClass={classes.buttonDiv}
                    />
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Paper>

      <KenCardWithoutpadding>
        <KenGrid
          columns={columns}
          data={scoreData}
          pagination={{ disabled: false }}
          toolbarDisabled={true}
        />
      </KenCardWithoutpadding>

      <Paper className={classes.uploadbtn} style={{ marginBottom: '20px' }}>
        <Grid container style={{ justifyContent: 'right' }}>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'end',
              gridColumnGap: '10px',
            }}
          >
            {errorResponse === true && (
              <p style={{ color: 'red', fontSize: '17px' }}>
                <b>
                  There are some errors while importing data. Please correct and
                  upload it again.
                </b>
              </p>
            )}
            {isEditable && (
              <>
                <KenButton
                  label="Submit"
                  onClick={handleFinalizeMarks}
                  variant="primary"
                  style={{ padding: '20px' }}
                  buttonClass={classes.buttonDiv}
                />

                <KenButton
                  label="Cancel"
                  onClick={() => setisEditable(false)}
                  variant="primary"
                  style={{ padding: '20px' }}
                  buttonClass={classes.buttonDiv}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Paper>
      <KenDialogBox
        title={
          <Typography variant="h6" className={classes.dialogHeader}>
            Confirmation
          </Typography>
        }
        open={uploadScoreDialog}
        handleClose={() => setUploadScoreDialog(false)}
        negativeButtonClick={() => setUploadScoreDialog(false)}
        positiveButtonClick={() => SendFinalizeScore()}
        positiveButtonText="Submit"
        negativeButtonText="Cancel"
        maxWidth="sm"
        dividers
      >
        <Grid container spacing={3}>
          <p>{scoreMessage}</p>
        </Grid>
      </KenDialogBox>
      <KenDialogBox
        title={
          <Typography variant="h6" className={classes.dialogHeader}>
            Upload Bulk Data
          </Typography>
        }
        open={uploadDialog}
        handleClose={() => handleUploadDialog(false)}
        negativeButtonClick={() => handleUploadDialog(false)}
        positiveButtonText="Submit"
        negativeButtonText="Cancel"
        hidePositiveButton={true}
        maxWidth="sm"
        dividers
      >
        <Grid container spacing={3}>
          <div className="invoice-page-wrapper">
            <div
              className="invoice-custom-table-wrapper"
              style={{ padding: '0px' }}
            >
              <div className="pdf-extract-wrap" style={{ height: '70%' }}>
                <div
                  className="onboard-card dot-card"
                  onClick={onButtonClick}
                  style={{
                    height: '70vh',
                    width: '100%',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  {upload ? (
                    <React.Fragment>
                      <div
                        className="file-upload-wrap"
                        style={{ width: '70%' }}
                        onClick={event => {
                          event.stopPropagation();
                        }}
                      >
                        {pdfLoaded != 100 ? (
                          <>
                            <span
                              className="file-loaded-percentage"
                              style={{
                                position: 'absolute',
                                top: '8px',
                              }}
                            >
                              {pdfLoaded}%
                            </span>
                            <p className="file-process-hd">
                              {' '}
                              Uploading File(
                              {filename}){' '}
                            </p>
                          </>
                        ) : (
                          <>
                            <span
                              style={{
                                width: '80px',
                              }}
                            >
                              <AiFillCheckCircle
                                className={classes.checkCircle}
                              />
                            </span>
                            <p
                              className="file-process-hd"
                              style={{
                                justifyContent: 'center',
                              }}
                            >
                              {' '}
                              Upload Complete
                            </p>
                          </>
                        )}

                        {pdfLoader && <CircularProgress />}
                      </div>
                    </React.Fragment>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        id="file"
                        ref={inputFile}
                        style={{
                          display: 'none',
                          cursor: 'pointer',
                        }}
                        onChange={fileSelected}
                      />
                      <div className="card-third-round  ">
                        <PublishOutlinedIcon className="onboard-icons" />
                      </div>
                      <h6 className="onboard-card-header">Upload Excel</h6>
                      <p
                        className="onboard-card-title"
                        style={{ color: '#000' }}
                      >
                        Drag and drop file or{' '}
                        <span className="browse-content">browse</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </KenDialogBox>
    </>
  );
}
