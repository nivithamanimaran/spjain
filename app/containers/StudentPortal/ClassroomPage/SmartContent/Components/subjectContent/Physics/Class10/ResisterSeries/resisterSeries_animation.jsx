import React from 'react';
import {
  Box,
  Grid,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  animationWrap: {
    width: ' 90%',
    margin: '0 auto',
    padding: 12,
  },
  headTag: {
    fontSize: 20,
  },
}));

export default function Animation() {
  const classes = useStyles();
  return (
    <div className={classes.animationWrap}>
      <iframe
        src="//amrita.olabs.edu.in/olab/PHY/EMM/MeterBridge-Single-And-Series/index.html?elink_videoID=G0gQrsCfLaM&amp;linktoken=615dcda99010f8afe9d6339e18561a67&amp;elink_lan=en-IN&amp;elink_title=Equivalent Resistance of Resistors (Series)"
        width="900px"
        height="700px"
      >
        {' '}
      </iframe>
      <div className={classes.wrap}>
        <h1 className={classes.headTag}>Acknowledgement:</h1>
        <Typography>
          amrita.olabs.edu.in,. (2012). Equivalent Resistance of Resistors
          (Series). Retrieved 3 March 2021, from
          amrita.olabs.edu.in/?sub=1&brch=4&sim=40&cnt=122
        </Typography>
      </div>
    </div>
  );
}
