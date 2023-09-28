import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import BaseCard from '../../../../new_components/card';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 30,
    borderBottom: '1px solid #E2EBF1',
    [theme.breakpoints.only('xs')]: {
      padding: 16,
    },
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '20px',
    color: theme.palette.KenColors.kenColors,
  },
  des: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.KenColors.kenColors,
  },
  isResolvedGreen: {
    color: theme.palette.KenColors.kenColors,
    fontSize: 12,
    fontWeight: 600,
    background: 'rgba(82, 193, 90, 0.27)',
    borderRadius: 4,
    padding: 5,
  },
  isResolvedYellow: {
    color: theme.palette.KenColors.kenColors,
    fontSize: 12,
    fontWeight: 600,
    background: 'rgba(255, 239, 182, 0.27)',
    borderRadius: 4,
    padding: 5,
  },
}));

const data = [
  {
    title: 'Suspension',
    des: 'Stealing Question Papers',
    date: '12/08/1998',
    isResolved: 'Resolved',
  },
  {
    title: 'Fine',
    des: 'Breaking of Lab Equipment',
    date: '12/08/1998',
    isResolved: 'Pending',
  },
  {
    title: 'Suspension',
    des: 'Stealing Question Papers',
    date: '12/08/1998',
    isResolved: 'Resolved',
  },
  {
    title: 'Fine',
    des: 'Breaking of Lab Equipment',
    date: '12/08/1998',
    isResolved: 'Pending',
  },
];

export default function Request() {
  const classes = useStyles();
  return (
    <Box mt={2}>
      <BaseCard>
        <Grid container direction="column">
          {data.map(el => {
            return (
              <Grid item>
                <>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    className={classes.container}
                  >
                    <Grid item>
                      <>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography className={classes.title}>
                              {el.title}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography className={classes.des}>
                              {el.des}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography className={classes.des}>
                              {el.date}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item>
                      <Typography
                        className={
                          el.isResolved === 'Resolved'
                            ? classes.isResolvedGreen
                            : classes.isResolvedYellow
                        }
                      >
                        {el.isResolved}
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            );
          })}
        </Grid>
      </BaseCard>
    </Box>
  );
}
