import {
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Link,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useState } from 'react';

import Success from './Success';
import Textarea from '../../../../global_components/KenTextArea';
import KenInputField from '../../../../global_components/KenInputField';

const useStyles = makeStyles({
  Courses: {
    padding: '20px',
    marginBottom: '20px',
    color: '#092682',
  },
  payment: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#092682',
  },
  topMargin: {
    padding: '0px 0px 15px',
  },
  mild: {
    fontSize: '18px',
    fontWeight: 400,
    color: '#7A7A7B',
  },
  borderGrid: {
    marginTop: '20px',
    borderBottom: '1px solid #D2E1E9',
    paddingBottom: '10px',
  },
  bold: {
    fontSize: '18px',
    fontWeight: 500,
  },
  marginTopnGrid: {
    marginTop: '20px',
  },
  flexButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    float: 'right',
  },
  Details: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#092682',
    marginBottom: '20px',
  },
  Details1: {
    fontSize: '16px ',
    fontWeight: 600,
    color: '#092682',
  },
});

const RequestDetails = ({
  selectedRow,
  selectedService,
  onClose,
  isApplyClicked,
  setIsApplyClicked,
  setShowTabs,
}) => {
  const classes = useStyles();
  console.log('isApplyClicked', isApplyClicked);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  const handlePayNowClick = () => {
    setIsPaymentSuccessful(true);
  };

  const handleBackClick = () => {
    onClose();
  };

  console.log('selectedRow', selectedRow);
  return (
    <>
      {isPaymentSuccessful ? (
        <Success
          setShowTabs={setShowTabs}
          isApplyClicked={isApplyClicked}
          setIsApplyClicked={setIsApplyClicked}
        />
      ) : (
        <>
          <div className={classes.topMargin}>
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<NavigateNextIcon fontSize="small" />}
              classes={{ separator: classes.separator }}
            >
              <Link
                color="inherit"
                onClick={handleBackClick}
                style={{ cursor: 'pointer' }}
              >
                {selectedService}
              </Link>
              <Typography color="textPrimary">
                Apply for {selectedService}
              </Typography>
              <Typography color="textPrimary">{selectedRow?.course}</Typography>
            </Breadcrumbs>
          </div>
          <Card className={classes.Courses}>
            <div className={classes.Details1}>
              {' '}
              Request for {selectedService}
            </div>
          </Card>
          <Card className={classes.Courses}>
            <div className={classes.Details}>{selectedService} Details</div>
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <KenInputField
                    label="Request Type"
                    value={selectedService}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <KenInputField
                    label="Course"
                    value={selectedRow?.course}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <KenInputField
                    label="Exam"
                    value={selectedRow?.type || 'N/A'}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <KenInputField
                    label="Exam"
                    value={selectedRow?.exam || 'N/A'}
                    disabled
                  />{' '}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={10}>
                  <Textarea
                    label="Description"
                    placeholder="Enter additional comments here..."
                    defaultValue=""
                    minRows={4}
                    maxRows={6}
                  />
                </Grid>
              </Grid>
              {selectedRow?.action === 'View' ? null : (
                <>
                  <Grid
                    container
                    spacing={2}
                    className={classes.marginTopnGrid}
                  >
                    <Grid item xs={12} md={10}>
                      <div className={classes.payment}>Payment Summary</div>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} className={classes.borderGrid}>
                    <Grid item xs={12} md={5}>
                      <div className={classes.mild}>Per {selectedService}</div>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <div className={classes.mild}>Rs. 200</div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    className={classes.marginTopnGrid}
                  >
                    <Grid item xs={12} md={5}>
                      <div className={classes.bold}>Total Amount</div>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <div className={classes.bold}>Rs. 400</div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    className={classes.marginTopnGrid}
                  >
                    <Grid item xs={12} md={8}>
                      <div className={classes.flexButton}>
                        <Button color="primary">Pay Later</Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handlePayNowClick}
                        >
                          Pay Now
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default RequestDetails;
