import { Box, Typography, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  colorBoxContainer: {
    display: 'flex',
    marginBottom: 10,
  },
  colorBox: {
    borderRadius: 3,
    width: 24,
    height: 24,
    [theme.breakpoints.down('sm', 'md')]: {
      fontSize: 15,
    },
  },
  colorBoxText: {
    fontSize: 13,
    color: theme.palette.KenColors.neutral400,
    marginLeft: 5,
    alignSelf: 'center',
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 10,
    },
  },
  ansBoxColor: {
    background: theme.palette.KenColors.secondaryBlue,
    '& > *': {
      color: theme.palette.KenColors.gradeSectionHeaderLabel,
    },
  },
  flgBoxColor: {
    background: theme.palette.KenColors.orange11,
    '& > *': {
      color: theme.palette.KenColors.orange10,
    },
  },
  skipBoxColor: {
    background: theme.palette.KenColors.neutral40,
    '& > *': {
      color: theme.palette.KenColors.neutral400,
    },
  },
  notVisitedBoxColor: {
    background: theme.palette.KenColors.sideNavColor,
    border: `1px solid ${theme.palette.KenColors.neutral40}`,
    '& > *': {
      color: theme.palette.KenColors.neutral400,
    },
  },
  ansFlgBoxColor: {
    position: 'relative',
    background: theme.palette.KenColors.secondaryBlue,
    '& > *': {
      color: theme.palette.KenColors.gradeSectionHeaderLabel,
    },
    '& > span': {
      position: 'absolute',
      right: 2,
      top: 2,
      borderRadius: 3,
      width: 6,
      height: 6,
      background: theme.palette.KenColors.orange10,
    },
  },
  typoTitle: {
    color: theme.palette.KenColors.neutral400,
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16,
  },
}));

const BOX_STATUS = {
  answered: 'Answered',
  flagged: 'Flagged',
  skipped: 'Skipped',
  notVisited: 'Not Visited',
  ansAndFlagged: 'Answered & Flagged',
};

export function ColorBox({ status, statusValue }) {
  const classes = useStyles();
  return (
    <Box className={classes.colorBoxContainer}>
      <Box className={[classes.colorBox, getBoxStatusColor(status)].join(' ')}>
        <span className={classes.colorBoxDot} />
      </Box>
      <Typography className={classes.colorBoxText}>
        {status}: {statusValue ? statusValue : 0}
      </Typography>
    </Box>
  );
}

function getBoxStatusColor(status) {
  const classes = useStyles();

  switch (status) {
    case BOX_STATUS.answered:
      return classes.ansBoxColor;

    case BOX_STATUS.flagged:
      return classes.flgBoxColor;

    case BOX_STATUS.skipped:
      return classes.skipBoxColor;

    case BOX_STATUS.notVisited:
      return classes.notVisitedBoxColor;

    case BOX_STATUS.ansAndFlagged:
      return classes.ansFlgBoxColor;

    default:
      return classes.notVisitedBoxColor;
  }
}

const colorBoxes = [
  {
    status: BOX_STATUS.answered,
    statusValue: 18,
  },
  {
    status: BOX_STATUS.flagged,
  },
  {
    status: BOX_STATUS.skipped,
    statusValue: 2,
  },
  {
    status: BOX_STATUS.answered,
  },
  {
    status: BOX_STATUS.notVisited,
  },
  {
    status: BOX_STATUS.ansAndFlagged,
  },
];

export default function QuizAnalysis() {
  const classes = useStyles();
  return (
    <Box p={2}>
      <Typography className={classes.typoTitle}>Quiz Analysis</Typography>
      <Grid container>
        {colorBoxes.map(el => {
          return (
            <Grid item md={6} sm={6} xs={12}>
              <ColorBox status={el.status} statusValue={el.statusValue} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
