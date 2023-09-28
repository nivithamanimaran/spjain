import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    color: '#808080',
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  des: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.KenColors.kenBlack,
  },
  container: {
    background: theme.palette.KenColors.kenWhite,
    border: '1px solid #E4E4E4',
    padding: 16,
    minWidth: 200,
    [theme.breakpoints.only('xs')]: {
      minWidth: 0,
    },
  },
}));

export default function FeeCard(props) {
  const classes = useStyles();
  const { title, description } = props;
  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item>
        <Typography className={classes.title}>{title}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.des}>{description}</Typography>
      </Grid>
    </Grid>
  );
}
