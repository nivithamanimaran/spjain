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
  header: {
    fontSize: 20,
  },
}));

export default function Animation() {
  const classes = useStyles();
  return (
    <div class="divContent">
      <div className={classes.animationWrap}>
        <p>
          <video autoplay="autoplay" controls="" width="98%;">
            <source
              src="https://www.olabs.edu.in/olabs/OlabsAnimation/VolumeofCylinder/English/volumeofrightcircularcylinder_english.mp4"
              type="video/mp4"
            />{' '}
            Your browser does not support HTML5 video, please update your
            browser.
          </video>
        </p>

        <div className={classes.wrap}>
          <h1 className={classes.header}>Acknowledgement:</h1>
          <Typography>
            cdac.olabs.edu.in,. (2016). Volume of right circular cylinder.
            Retrieved 7 April 2021, from
            cdac.olabs.edu.in/?sub=80&brch=20&sim=163&cnt=740
          </Typography>
        </div>
      </div>
    </div>
  );
}
