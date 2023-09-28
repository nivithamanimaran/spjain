import React from 'react';
import Succeed from '../../../../assets/Succeed.png';
import { Button, Card, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  flexbox: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10%',
  },
  boldtext: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '25px',
  },
});

const Success = ({ isApplyClicked, setIsApplyClicked, setShowTabs }) => {
  const classes = useStyles();
  console.log('isApplyClicked', isApplyClicked);
  setShowTabs(false);

  return (
    <Card className={classes.flexbox}>
      <img src={Succeed} alt="Success" style={{ width: '10%' }} />
      <div className={classes.boldtext}>
        Your request has been submitted successfully.
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsApplyClicked(false);
          setShowTabs(false);
        }}
      >
        Go to Home
      </Button>
    </Card>
  );
};

export default Success;
