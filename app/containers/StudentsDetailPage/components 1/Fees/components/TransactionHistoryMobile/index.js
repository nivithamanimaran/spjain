import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import BaseCard from '../../../../../../new_components/card';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.KenColors.link1,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: 24,
  },
  categoryContainer: {
    padding: 18,
    border: `1px solid #E4E4E4`,
    borderRadius: '4px',
  },
  keyTypo: {
    color: theme.palette.KenColors.link1,
    fontWeight: 600,
  },
}));

export default function TransactionHistoryMobile(props) {
  const classes = useStyles();
  const { data } = props;
  return (
    <Box style={{ width: '100%' }}>
      <BaseCard>
        <Typography className={classes.title}>Transaction History</Typography>
        <Grid container xs={12} spacing={2} direction="column">
          {data.map(el => {
            return (
              <Grid item md={12} xs={12}>
                <>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                    className={classes.categoryContainer}
                    spacing={1}
                  >
                    <Grid item xs={12}>
                      <>
                        <Grid
                          container
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography className={classes.keyTypo}>
                              Currency
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>{el.currency}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item xs={12}>
                      <>
                        <Grid
                          container
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography className={classes.keyTypo}>
                              Transaction Date
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>{el.transactionDate}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item xs={12}>
                      <>
                        <Grid
                          container
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography className={classes.keyTypo}>
                              Payment Mode
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>{el.paymentMode}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item xs={12}>
                      <>
                        <Grid
                          container
                          direction="column"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography className={classes.keyTypo}>
                              Particulars
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>{el.particulars}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item xs={12}>
                      <>
                        <Grid
                          container
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography className={classes.keyTypo}>
                              Paid Amount
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography>{el.paidAmount}</Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item xs={12}>
                      <>
                        <Grid
                          container
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Grid item>
                            <SaveAltIcon />
                          </Grid>
                          <Grid item>
                            <Typography>
                              <KeyboardArrowDownIcon />
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
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
