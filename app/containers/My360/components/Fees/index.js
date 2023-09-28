import React, { useEffect, useState } from 'react';
import { Box, Grid, useMediaQuery, useTheme } from '@material-ui/core';
import { getContactAdditionalInfoData } from '../../../../utils/ApiService';
import FeeCard from './components/FeeCard';
import TransactionHistory from './components/TransactionHistory';
import TransactionHistoryMobile from './components/TransactionHistoryMobile';

const KenLoader =React.lazy(() => import('../../../../components/KenLoader'));

export default function Fees({ profile }) {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [loader, setLoader] = useState();
  const [feeData, setFeeData] = useState();
  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getContactAdditionalInfoData(profile?.ContactId)
        .then(res => {
          setLoader(false);
          console.log(res);
          setFeeData(res?.data[0]);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);

  return (
    <Box mt={5} style={{ background: '#F4F5F7' }}>
      {loader === true && <KenLoader />}
      <Grid container direction="row">
        <Grid item container md={12} direction="row" spacing={2}>
          {feeData?.OverDue && feeData?.upcomingfeeDate && (
            <Grid item container direction="row" spacing={2}>
              <Grid item xs={6}>
                <FeeCard title="Overdue" description={feeData?.OverDue} />
              </Grid>
              <Grid item xs={6}>
                <FeeCard
                  title="Upcoming fees DATE"
                  description={feeData?.upcomingfeeDate}
                />
              </Grid>
            </Grid>
          )}
          <Grid item>{/* <KenButton>Download History</KenButton> */}</Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          {!isMobileScreen ? (
            <TransactionHistory data={feeData?.AdditionalInfo} />
          ) : (
            <div style={{ width: '100%' }}>
              <TransactionHistoryMobile data={feeData?.AdditionalInfo} />
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
