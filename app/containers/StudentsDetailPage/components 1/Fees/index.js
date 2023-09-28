import { Box, Grid, useMediaQuery, useTheme } from '@material-ui/core';
import React from 'react';
import KenButton from '../../../../global_components/KenButton';
import FeeCard from './components/FeeCard';
import TransactionHistory from './components/TransactionHistory';
import TransactionHistoryMobile from './components/TransactionHistoryMobile';

const data = [
  {
    currency: 'AUD',
    transactionDate: '17-08-2022',
    paymentMode: 'Flywire, Online',
    particulars: '2022 BBA Jan Term 5 Course Material Fee',
    paidAmount: '62.5',
    receipt: '1',
  },
  {
    currency: 'AUD',
    transactionDate: '17-08-2022',
    paymentMode: 'Flywire, Online',
    particulars: '2022 BBA Jan Term 5 Course Material Fee',
    paidAmount: '62.5',
    receipt: '1',
  },
  {
    currency: 'AUD',
    transactionDate: '17-08-2022',
    paymentMode: 'Flywire, Online',
    particulars: '2022 BBA Jan Term 5 Course Material Fee',
    paidAmount: '62.5',
    receipt: '1',
  },
];

export default function Fees() {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <Box mt={5} style={{ background: '#F4F5F7' }}>
      <Grid container direction="row">
        <Grid item container md={12} direction="row" spacing={2}>
          <Grid item container direction="row" spacing={2}>
            <Grid item xs={6}>
              <FeeCard title="Overdue" description="INR 10,OOO" />
            </Grid>
            <Grid item xs={6}>
              <FeeCard title="Upcoming fees DATE" description="08-12-22" />
            </Grid>
          </Grid>
          <Grid item>{/* <KenButton>Download History</KenButton> */}</Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          {!isMobileScreen ? (
            <TransactionHistory data={data} />
          ) : (
            <div style={{ width: '100%' }}>
              <TransactionHistoryMobile data={data} />
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
