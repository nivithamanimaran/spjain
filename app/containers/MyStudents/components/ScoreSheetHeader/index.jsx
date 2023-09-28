import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  title: {
    margin: 12,
    color: theme.palette.KenColors.primary,
    fontSize: 18,
    fontWeight: 400,
  },
}));

export default function ScoreSheetHeader(props) {
  const { title } = props;
  const classes = useStyles();
  return (
    <Box style={{ background: '#F1F5FA' }}>
      <Grid container justifyContent="center">
        <Grid item>
          <Typography className={classes.title}>{title}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
