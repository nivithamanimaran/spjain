import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenLoader from '../../../../components/KenLoader';
import { useHistory } from 'react-router-dom';
import KenButton from '../../../../global_components/KenButton';
import BaseCard from '../../../../new_components/card';
import { getRequestComplaintsdata } from '../../../../utils/ApiService';
import moment from 'moment';

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
  title1: {
    marginLeft: '20px',
    fontWeight: 600,
    fontSize: 18,
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
    isResolved: 'Submited',
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
    isResolved: 'Submited',
  },
];

export default function Request({ profile }) {
  const history = useHistory();
  const [loader, setLoader] = useState();
  const [requestData, setRequestData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getRequestComplaintsdata(profile?.ContactId)
        .then(res => {
          setRequestData([...res?.RequestList]);
          setLoader(false);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, [profile]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '15px',
          alignItems: 'center',
        }}
      >
        <Typography className={classes.title1}>Request & Complaints</Typography>
        <KenButton
          variant="primary"
          onClick={() => {
            history.push(`/RaiseTicket`);
          }}
        >
          Raise Tickets
        </KenButton>
      </div>
      <Box mt={2}>
        {loader === true && <KenLoader />}
        <BaseCard>
          <Grid container direction="column">
            {requestData && requestData.length > 0 ? (
              requestData.map(el => {
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
                                  {el?.Request.Subject}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography className={classes.des}>
                                  {el?.Request?.Type}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography className={classes.des}>
                                  {moment(el?.Request?.CreatedDate).format(
                                    'DD-MM-YYYY'
                                  )}
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
                            {el?.Request?.Status}
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
    </>
  );
}
