import React, { useEffect, useState } from 'react';
import CrowdfundingData from '../Student Service/data.json';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import KenSnackbar from "../../components/KenSnackbar"
import { Divider, Typography } from '@material-ui/core';
import { styled, makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { CardActions } from '@material-ui/core';
import { useTheme } from 'styled-components';
import KenCard from '../../components/KenCard';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import clsx from 'clsx';
import {getCaseByRequestId} from '../../utils/ApiService'
import { useLocation } from 'react-router-dom';
import KenLoader from "../../components/KenLoader";

const useStyles = makeStyles(theme => ({
  crowdName: {
    fontSize: '32px',
    fontWeight: '600',
    lineHeight: '100%',
  },
  titlediv: {
    fontSize: '11px',
    fontWeight: '600',
    opacity: '0.5',
  },
  valuediv: {
    fontSize: '16px',
    fontWeight: 500,
    width: '10em',
  },
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));


const SupportDetails = () => {
  const classes = useStyles();
  const [data, setData] = useState('');
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [post, setPost] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [serviceCase, setServiceCase] = useState([]);
  const [loader,setLoader]= useState(false);
  const search = useLocation().search;
    const recordID = new URLSearchParams(search).get("recordID");


  useEffect(() => {
    const getData = CrowdfundingData.CrowdfundingData.filter(items => {
      return items.id === 'RecyclingInitiative';
    });
    setData(getData[0]);
  }, [id]);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  React.useEffect(() => {
    //Case
    if(recordID){
      setLoader(true)
      getCaseByRequestId(recordID).then(res => {
        console.log(res);
        setServiceCase(res)
        setLoader(false)
      }).catch(err => {
        console.log(err);
        setLoader(false)
      })
    }
   
  }, [])

  function getSteps() {
    return ['Opened', 'Assigned', 'Reviewed', 'Pending','Resolved'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return ``;
      case 1:
        return '';
      case 2:
        return ``;
      default:
        return 'Unknown step';
    }
  }

  const handleJoin = () => {
    handleSnackbarOpen(
      'success',
      'Awesome! You are now a member of “2012 Graduates” Group'
    );
    setPost(true);
  };
  const HandleNewPost = () => {
    setOpenSnackbar(false);
    setOpen(true);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const CustomStepIcon = (props) => {
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        <CheckCircleOutlineIcon style={{color:'#7A869A'}} />
      </div>
    );
  };

  return (
    <div>
       {loader&&<KenLoader/>}
      <KenCard>
        <div className="groups-main-div-details">
          <div className="info-div">
            <Grid container spacing={3}>
              <Grid md={10} justifyContent="flex-start">
                <div className={classes.crowdName}>
                  {/* {data.name} */}
                  <Typography style={{ fontSize: '32px' }}>
                    <b>Need a provisional Certificate...</b>
                  </Typography>
                </div>
              </Grid>
              <Grid md={2} justifyContent="flex-end">
                <div className="Giveaways-div">
                  <div className="Giveaways-div-btn-class">
                    <Button
                      variant="outlined"
                      style={{
                        color: '#DD4B39',
                        borderColor: '#DD4B39',
                        textTransform: 'capitalize',
                      }}
                    >
                      Cancel Request
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <br />
          <br />
          <div>
            <Divider />
          </div>
          <div
            className="Giveaways-date-info-div"
            style={{ marginTop: '20px' }}
          >
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Grid container>
                  <Grid item md={2.4}>
                    <div>
                      <span className={classes.titlediv}>REQUEST ID</span>
                      <div className={classes.valuediv}>#{serviceCase[0]?.RequestNumber}</div>
                    </div>
                  </Grid>
                  <Grid item md={2.4}>
                    <div>
                      <span className={classes.titlediv} style={{ marginLeft: '10px' }}>Date & Time</span>
                      <div className={classes.valuediv}>{moment(serviceCase[0]?.DateOfRequest).format("MMM Do YY")}</div>
                    </div>
                  </Grid>
                  <Grid item md={2.4}>
                    <div>
                      <span className={classes.titlediv}>REQUEST TYPE</span>
                      <div className={classes.valuediv}>{serviceCase[0]?.RequestType}</div>
                    </div>
                  </Grid>
                  <Grid item md={2.4}>
                    <div>
                      <span className={classes.titlediv}>STATUS</span>
                      <div className={classes.valuediv}>{serviceCase[0]?.Status}</div>
                    </div>
                  </Grid>
                  <Grid item md={2.4}>
                    <div>
                      <span className={classes.titlediv}>PRIORITY</span>
                      <div className={classes.valuediv}>{serviceCase[0]?.priority}</div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <br />
          <br />
          <Grid item md={8}>
            <div className="time-div-supportdetail">
              {moment(serviceCase[0]?.DateOfRequest).format('MMMM Do YYYY, h:mm:ss a')}
            </div>
            <br />
            <div
              className="support-note"
              style={{
                margintop: '30px',
                fontSize: '16px',
                lineHeight: '28px',
              }}
            >
              <div className="support-not-description">
                {/* Hi Team, I need a Provisional certificate for application of
                Canada Visa.
                <br />
                <br />
                I’m currently in the process of applying for it and will need it
                within a week. Let me know if you need any details from my side
                and if you can send the certificate or a time I can come and
                collect a hard copy. */}
                {serviceCase[0]?.description}
              </div>{' '}
            </div>

            {/* <div className="time-div-supportdetail-your">
              SURABH (ADMIN), 4th oct 2022, 8:25PM
            </div> */}
            {/* <div
              className="note-description-support"
              style={{ fontSize: '16px', lineHeight: '28px' }}
            >
              Hi Megha,
              <br />
              <br />
              Saurabh from Admin team here.
              <br />
              <br />
              I’d be happy to assist you on this. Give us a day or two and we
              can send across the Certificate here as a PDF. Let me know if that
              works for you
              <br />
              <br />
              If you need a hard copy, you can come and collect in college
              anytime after tomorrow.
              <br />
              <br />
              Hope that works.
              <br />
              Thank you and let s know if I can help with anything else.
            </div> */}
          </Grid>

          <Grid container />
        </div>
        {/* <KenSnackbar
          message={snackbarMessage}
          severity={snackbarSeverity}
          autoHideDuration={10000}
          open={openSnackbar}
          handleSnackbarClose={handleSnackbarClose}
          position="Top-Right"
        /> */}


        <div className={classes.root}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                {/* <p >{label}</p><CheckCircleOutlineIcon/> */}
                <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                <StepContent>
                  <Typography>{getStepContent(index)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      {/* <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button> */}
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed - you&apos;re finished</Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </div>
      </KenCard>
    </div>
  );
};

export default SupportDetails;
