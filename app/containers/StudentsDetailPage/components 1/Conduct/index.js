import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenLoader from '../../../../components/KenLoader';
import BaseCard from '../../../../new_components/card';
import { getRequestComplaintsdata } from '../../../../utils/ApiService';

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

export default function Conduct({ profile }) {
  const [loader, setLoader] = useState();
  const [conductData, setConductData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getRequestComplaintsdata(profile?.ContactId)
        .then(res => {
          console.log(res);
          setConductData([...res?.ConductList]);
          setLoader(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, [profile]);

  return (
    <Box mt={2}>
      {loader === true && <KenLoader />}
      <BaseCard>
        <Grid container direction="column">
          {conductData && conductData.length > 0 ? (
            conductData.map(el => {
              return (
                <Grid item md={12}>
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
                                {el?.conduct?.Name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className={classes.des}>
                                {el?.conduct?.Conduct_Type__c}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography className={classes.des}>
                                {el?.conduct?.Conduct_date__c}
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
                          {el?.conduct?.Status}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              );
            })
          ) : (
            <Typography style={{ padding: 16 }}>No Data Found</Typography>
          )}
        </Grid>
      </BaseCard>
    </Box>
  );
}