import React, { useState } from 'react';
import { Button, Card, Grid, Typography, Hidden } from '@material-ui/core';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import { makeStyles } from '@material-ui/core/styles';
import KenInputField from '../../../global_components/KenInputField';
import KenSnackBar from '../../../components/KenSnackbar';

const useStyles = makeStyles(theme => ({
  card: {
    padding: '20px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '20px',
    color: '#193389',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px',
      marginBottom: '15px',
    },
  },
  title1: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '20px',
    padding: '5px 10px',
    background: '#FFEFB645',
    [theme.breakpoints.down('xs')]: {
      fontSize: '14px',
      marginBottom: '15px',
    },
  },
  pendingchildflex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: 400,
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
      marginBottom: '15px',
    },
  },
  dueDate: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#8F8F8F',
    [theme.breakpoints.down('xs')]: {
      fontSize: '13px',
    },
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '10px',
  },
  buttonContainer: {
    float: 'right',
    gap: '10px',
    display: 'flex',
    justifyContent: 'end',
    marginTop: '10px',
    marginBottom: '10px',
    alignItems: 'center',
  },
  fileUploadButton: {
    border: '1px solid #E4E4E4',
    padding: '4px 10px',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      fontSize: "13px",
    },
  },
  sectionContainer: {
    padding: '10px',
  },
  pendingActionsCard: {
    marginBottom: '20px',
    padding: '20px',
    height: '200px',
    [theme.breakpoints.down('xs')]: {
      height: '150px',
    },
  },
  pendingflex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  header: {
    fontSize: '24px',
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      marginBottom: '5px',
      fontSize: '20px',
    },
  },
}));

const WithdrawlRequest = ({ onGoBack }) => {
  const classes = useStyles();
  const [reason, setReason] = useState('');
  const [file, setFile] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleTextAreaChange = event => {
    setReason(event.target.value);
  };

  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    console.log('Reason:', reason);
    console.log('File:', file);
    setIsSnackbarOpen(true);
    setReason('');
    setFile(null);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const isSubmitDisabled = !reason || !file;

  const pendingActionsData = [
    {
      title: 'Library Book',
      description: 'Basics of Engineering',
      dueDate: 'Due On 23/07/2023',
    },
    {
      title: 'Library Book',
      description: 'Murder on the Orient Express',
      dueDate: 'Due On 10/05/2023',
    },
    {
      title: 'Fees',
      description: 'Mess fees: 2000/-',
      dueDate: 'Due On 16/03/2023',
    },
    {
      title: 'Penalty',
      description: 'Breakage: 2000/-',
      dueDate: 'Damaged college property',
    },
  ];

  return (
    <div>
      <Card className={classes.card}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h6" className={classes.header}>
              Withdrawl Request
            </Typography>
          </Grid>
          <Grid
            container
            spacing={2}
            alignItems="center"
            className={classes.sectionContainer}
          >
            <Grid item xs={12} md={6}>
              <div className={classes.sectionTitle}>Reason for Withdrawl</div>
              <KenInputField
                required
                value={reason}
                onChange={handleTextAreaChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.sectionTitle}>
                Upload no due certificate
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="file-input"
                onChange={handleFileChange}
              />
              <label htmlFor="file-input">
                <Button
                  className={classes.fileUploadButton}
                  color="default"
                  startIcon={<AttachFileOutlinedIcon />}
                  component="span"
                >
                  Choose or Drag file
                </Button>
              </label>
              {file && <span>Selected file: {file.name}</span>}
            </Grid>
          </Grid>
          <div className={classes.buttonContainer}>
            <Button variant="contained" onClick={onGoBack}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </Button>
          </div>
        </Grid>
        <KenSnackBar
          message="Withdrawl Request submitted successfully!"
          severity="success"
          autoHideDuration={5000}
          open={isSnackbarOpen}
          handleSnackbarClose={handleSnackbarClose}
          position="Bottom-Left"
        />
      </Card>
      <Card className={classes.card}>
        <div className={classes.pendingflex}>
          <div className={classes.header}>Pending Actions</div>
          <Hidden smDown>
            <Button variant="contained" color="primary">
              Download No Due Certificate
            </Button>
          </Hidden>
        </div>
        <Grid container spacing={2}>
          {pendingActionsData.map((action, index) => (
            <Grid item xs={12} md={3}>
              <Card key={index} className={classes.pendingActionsCard}>
                <div>
                  <div className={classes.pendingchildflex}>
                    <Typography variant="h6" className={classes.title}>
                      {action.title}
                    </Typography>
                    <Typography variant="h6" className={classes.title1}>
                      Pending
                    </Typography>
                  </div>
                  <Typography className={classes.description} variant="body1">
                    {action.description}
                  </Typography>
                </div>
                <Typography className={classes.dueDate} variant="subtitle1">
                  {action.dueDate}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div>
          <Hidden smUp>
            <Button
              variant="contained"
              color="primary"
              style={{ fontSize: '9px', marginLeft: '86px' }}
            >
              Download No Due Certificate
            </Button>
          </Hidden>
        </div>
      </Card>
    </div>
  );
};

export default WithdrawlRequest;
