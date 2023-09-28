import React, { useEffect, useState } from 'react';
import { Card, Grid, makeStyles, Box } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import { getCourseComponent, postFacultysubmit } from '../../utils/ApiService';
import KenLoader from '../../components/KenLoader';
// import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import BreadCrumb from '../../components/BreadCrumb/BreadCrumb';
import KenDialog from '../../global_components/KenDialogBox';
import AddRows from './AddRows';
import './add.css';
import Routes from '../../utils/routes.json';
import KenButton from '../../global_components/KenButton';
import KenSnackBar from '../../global_components/KenSnackbar';

const useStyles = makeStyles(theme => ({
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  dialogText: {
    textAlign: 'center',
    fontSize: '20px',
    fontFamily: 'Work Sans',
    fontWeight: '500',
  },
  dialog: {
    '& .MuiDialogContent-dividers': {
      border: 'none !important',
    },
    '& .MuiDialogActions-root ': {
      justifyContent: 'center !important',
    },
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiDialog-paperFullWidth.MuiPaper-elevation24.MuiPaper-rounded': {
      maxWidth: '30% !important',
    },
    '& .MuiButton-outlinedPrimary': {
      border: 'none !important',
    },
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#000',
  },
  line: {
    width: '100%',
    height: '2px',
    background:
      'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(210, 225, 233, 1))',
    marginTop: '10px',
  },
  cardDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  backBtn: {
    display: 'flex',
    justifyContent: 'end',
  },
  submitBtn: {
    justifyContent: 'end',
    textAlign: 'end',
    marginTop: '15px',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
    },
    '&>div>button': {
      [theme.breakpoints.down('xs')]: {
        fontSize: '11px',
        width: '190px',
        marginLeft: '21px',
      },
    },
  },
  CardContainer: {
    marginTop: '20px',
    padding: '30px',
    background: 'white',
  },
}));

const Addd = () => {
  const location = useLocation();
  const classes = useStyles();
  const [data, setData] = useState(location?.state?.coursedata || {});
  const [termData, setTermData] = useState(location?.state?.termData || {});
  const [componentData, setComponentData] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courseCode, setCourseCode] = useState(
    location?.state?.coursedata?.courseCode || ''
  );
  const [enableBtn, setEnableBtn] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [editOption, setEditOption] = useState(false);
  const history = useHistory();
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

  const arrayBreadCrumb = [
    {
      head: 'Evaluation Plan',
      url: `/${Routes.evaluationPlan}`,
      style: { fontSize: 16 },
    },
    { head: courseCode, style: { fontWeight: 600, fontSize: 16 } },
  ];
  const handleSubmitDisable = () => {
    let arr = [...componentData];
    let eligibleArr = [];
    let arrLen = arr?.length;
    let avg = 0;

    if (arr?.length > 0) {
      for (let i = 0; i < arrLen; i++) {
        if (
          arr[i]['Course_Subcomponents__r'] &&
          arr[i]['Course_Subcomponents__r']['records'] &&
          arr[i]['Course_Subcomponents__r']['records']?.length > 0
        ) {
          arr[i]['Course_Subcomponents__r']['records']?.map(s => {
            avg = avg + Number(s?.Sub_Component_Weightage__c);
          });
        }
        if (avg === 100) {
          eligibleArr.push({ eligible: false });
        } else {
          eligibleArr.push({ eligible: true });
        }
        avg = 0;
      }
    }
    let eligible = eligibleArr?.some(s => s.eligible == true);
    setEnableBtn(eligible);
  };

  useEffect(() => {
    if (componentData?.length > 0) {
      handleSubmitDisable();
    }
  }, [componentData]);

  useEffect(() => {
    if (data) {
      const gradeStatus = data?.Grade_Book_Status__c;
      if (gradeStatus === 'Received') {
        setStatus(true);
      }
    }
  }, [location]);

  useEffect(() => {
    if (data?.id) {
      setLoading(true);
      getCourseComponent(data?.id)
        .then(res => {
          console.log(res);
          setComponentData(res?.records);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [data?.id, trigger]);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    let payload = {
      id: data.id,
      status: 'Received',
    };
    postFacultysubmit(payload)
      .then(res => {
        handleDialogClose();
        if (res?.success) {
          let tempData = { ...data };
          tempData.Grade_Book_Status__c = 'Received';
          history.replace({
            ...location,
            state: {
              ...location.state,
              coursedata: tempData,
            },
          });
          setData(tempData);
          setLoading(false);
          handleSnackbarOpen('success', 'Added Successfully');
          setStatus(true);
          setTrigger(!trigger);
        } else {
          setLoading(false);
          handleSnackbarOpen('error', 'Something went wrong');
        }
      })
      .catch(err => {
        setLoading(false);
        handleDialogClose();
        handleSnackbarOpen('error', 'Something went wrong');
      });
  };

  return (
    <div>
      {loading && <KenLoader />}
      <Box className={`${classes.breadCrumbWrapper} ${'breadCrumbText'}`}>
        <BreadCrumb array={arrayBreadCrumb} history={history} />
      </Box>

      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      <div className={classes.CardContainer}>
        <Grid container spacing={4}>
          <Grid item container xs={12} md={4} justifyContent="flex-start">
            <Grid item xs={6} md={5}>
              <div className="lighttypoadd"> Program : </div>
            </Grid>
            <Grid item xs={6} md={7}>
              <div className="darktypoadd">{termData?.programName}</div>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={4} justifyContent="flex-start">
            <Grid item xs={6} md={4}>
              <div className="lighttypoadd">Term :</div>
            </Grid>
            <Grid item xs={6} md={8}>
              <div className="darktypoadd">{termData?.termName}</div>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={4} justifyContent="flex-start">
            <Grid item xs={6} md={5}>
              <div className="lighttypoadd"> Intake : </div>
            </Grid>
            <Grid item xs={6} md={7}>
              <div className="darktypoadd">{termData?.batchName}</div>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={4} justifyContent="flex-start">
            <Grid item xs={6} md={5}>
              <div className="lighttypoadd"> Course Code : </div>
            </Grid>
            <Grid item xs={6} md={7}>
              <div className="darktypoadd">{courseCode}</div>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={4} justifyContent="flex-start">
            <Grid item xs={6} md={4}>
              <div className="lighttypoadd"> Course :</div>
            </Grid>
            <Grid item xs={6} md={8}>
              <div className="darktypoadd">{data?.courseName}</div>
            </Grid>
          </Grid>
          <Grid item container xs={12} md={4} justifyContent="flex-start">
            <Grid item xs={6} md={5}>
              <div className="lighttypoadd"> Section : </div>
            </Grid>
            <Grid item xs={6} md={7}>
              <div className="darktypoadd">{termData?.section}</div>
            </Grid>
          </Grid>
        </Grid>
      </div>

      {data?.Grade_Book_Status__c !== 'Received' ? (
        <Grid container className={classes.submitBtn}>
          <Grid item md={3} xs={3}>
            <KenButton
              label={<span>Submit</span>}
              variant="primary"
              disabled={enableBtn || status || editOption}
              style={{ textTransform: 'capitalize' }}
              onClick={() => {
                setDialogOpen(true);
              }}
            />
          </Grid>
        </Grid>
      ) : null}

      {componentData?.length > 0 && (
        <AddRows
          setLoading={setLoading}
          trigger={trigger}
          setTrigger={setTrigger}
          componentData={componentData}
          status={status}
          tableStatus={data?.Grade_Book_Status__c}
          setEditOption={setEditOption}
        />
      )}

      <KenDialog
        open={dialogOpen}
        dialogStyle={classes.dialog}
        handleClose={() => handleDialogClose()}
        negativeButtonClick={() => handleDialogClose()}
        positiveButtonClick={() => handleSubmit()}
        positiveButtonText="Confirm"
        negativeButtonText="Cancel"
      >
        <p
          className={classes.dialogText}
          style={{ fontSize: 20, fontWeight: '600', marginBottom: 0 }}
        >
          Are you sure you want to Submit?
        </p>
        <p
          className={classes.dialogText}
          style={{ fontSize: 16, marginTop: 0 }}
        >
          (Please note that changes cannot be made after submission)
        </p>
      </KenDialog>
    </div>
  );
};

export default Addd;
