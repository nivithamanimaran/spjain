import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  TextareaAutosize,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import KenCheckbox from '../../../global_components/KenCheckbox';
import KenInputField from '../../../global_components/KenInputField';
import KenSelect from '../../../global_components/KenSelect';
import KenSnackBar from '../../../components/KenSnackbar';

const useStyles = makeStyles(theme => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginRight: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    gap: '10px',
  },
  card: {
    padding: '20px',
  },
  snackbarPositionLeft: {
    left: theme.spacing(2),
  },
  textArea: {
    width: '100%',
    padding: '8px',
    fontSize: 14,
    color: theme.palette.KenColors.neutral900,
    marginTop: '4px',
    borderRadius: '8px',
    border: `1px solid ${theme.palette.KenColors.assessmentBorder}`,
    minHeight: '96px',
    maxHeight: '192px',
    resize: 'vertical',
    outline: 'none',
    '&::-webkit-calendar-picker-indicator': {
      filter: 'invert(0.5)',
    },
  },
  header: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '25px',
    [theme.breakpoints.down('xs')]: {
    fontSize: '20px',
    },

  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '10px',
  },
}));

const ExchangeProgram = ({ onGoBack }) => {
  const classes = useStyles();
  const [requestType] = useState('Program Exchange');
  const [currentProgram, setCurrentProgram] = useState('');
  const [targetProgram, setTargetProgram] = useState('');
  const [reason, setReason] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleCurrentProgramChange = event => {
    setCurrentProgram(event.target.value);
  };

  const handleTargetProgramChange = event => {
    setTargetProgram(event.target.value);
  };

  const handleReasonChange = event => {
    setReason(event.target.value);
  };

  const handleTermsCheckboxChange = event => {
    setIsTermsChecked(event.target.checked);
  };

  const handleSubmit = () => {
    // Perform form submission logic here, e.g., API call
    console.log('Request Type:', requestType);
    console.log('Current Program:', currentProgram);
    console.log('Target Program:', targetProgram);
    console.log('Reason:', reason);
    console.log('Terms & Conditions:', isTermsChecked);
    setIsSnackbarOpen(true);
    // After successful submission, you can also clear the form fields
    setCurrentProgram('');
    setTargetProgram('');
    setReason('');
    setIsTermsChecked(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const isSubmitDisabled =
    !currentProgram || !targetProgram || !reason || !isTermsChecked;

  return (
    <Card className={classes.card}>
      <div className={classes.header}>Request to Exchange Program</div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div>
            <div className={classes.sectionTitle}>Request Type</div>
            <KenInputField value={requestType} readonly />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div className={classes.sectionTitle}>Current Program</div>
          <KenSelect
            value={currentProgram}
            onChange={handleCurrentProgramChange}
            options={[
              { label: 'Program A', value: 'Program A' },
              { label: 'Program B', value: 'Program B' },
              // Add more programs as needed
            ]}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.sectionTitle}>Target Program</div>
          <KenSelect
            value={targetProgram}
            onChange={handleTargetProgramChange}
            options={[
              { label: 'Program X', value: 'Program X' },
              { label: 'Program Y', value: 'Program Y' },
              // Add more programs as needed
            ]}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.sectionTitle}>Reason</div>
          <TextareaAutosize
            // label="Reason"
            placeholder="Enter your reason here"
            value={reason}
            onChange={handleReasonChange}
            className={classes.textArea}
            rowsMin={4}
            rowsMax={8}
          />
        </Grid>
        <Grid item xs={12} md={12} style={{ padding: '4px 20px' }}>
          <FormControlLabel
            control={
              <KenCheckbox
                className={classes.sectionTitle}
                disabled={false}
                name="termsCheckbox"
                label="I have read and understood the terms & conditions"
                value={isTermsChecked}
                onChange={handleTermsCheckboxChange}
              />
            }
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.buttonContainer}>
            <Button variant="contained" onClick={onGoBack}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={classes.submitButton}
            >
              Submit
            </Button>
          </div>
        </Grid>
      </Grid>
      <KenSnackBar
        message="Form submitted successfully!"
        severity="success"
        autoHideDuration={5000}
        open={isSnackbarOpen}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Left"
      />
    </Card>
  );
};

export default ExchangeProgram;
