import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import KenCard from '../../../../../../global_components/KenCard';
import KenGrid from '../../../../../../global_components/KenGrid';
import BaseCard from '../../../../../../new_components/card';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { getMyReceiptsByContact } from '../../../../../../utils/ApiService';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: 16,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
  },
  outerContainer: {
    border: '1px solid #DEE9EF',
    borderRadius: '4px',
    padding: '22.5px 35px',
  },
  keyTypo: {
    opacity: 0.5,
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    color: theme.palette.KenColors.kenBlack,
  },
  valueTypo: {
    fontWeight: 600,
    fontSize: 16,
    color: theme.palette.KenColors.link1,
  },
}));

const CollapseData = props => {
  const {
    original: { FeesDeatils },
  } = props;
  const classes = useStyles();
  return (
    <Box mt={2} mb={2} mr={8} ml={5} className={classes.outerContainer}>
      <Grid container spacing={3}>
        <Grid item container direction="row">
          <Grid item container md={6} sm={6} alignItems="center" spacing={2}>
            <Grid item>
              <Typography className={classes.keyTypo}>
                Transaction Id
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.valueTypo}>
                {FeesDeatils && FeesDeatils[0]?.fees?.Verification_Id__c}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container md={6} sm={6} alignItems="center" spacing={2}>
            <Grid item>
              <Typography className={classes.keyTypo}>payment type</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.valueTypo}>
                {FeesDeatils && FeesDeatils[0]?.fees?.Payment_type__c}{' '}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container direction="row">
          <Grid item container md={6} sm={6} alignItems="center" spacing={2}>
            <Grid item>
              <Typography className={classes.keyTypo}>reciept no </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.valueTypo}>
                {FeesDeatils && FeesDeatils[0]?.fees?.Receipt_no__c}{' '}
              </Typography>
            </Grid>
          </Grid>
          <Grid item container md={6} sm={6} alignItems="center" spacing={2}>
            <Grid item>
              <Typography className={classes.keyTypo}>
                remaining amount{' '}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.valueTypo}>
                {FeesDeatils && FeesDeatils[0]?.fees?.Remaining_Amount__c}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
const downloadReceiptt = (event, row, data) => {
  // console.log(event, row, data, data[row.index].attachment?.Id);
  const params = data[row.index].attachment?.Id;
  getMyReceiptsByContact(params)
    .then(res => {
      const blob = new Blob([res], { type: 'application/pdf' });
      saveAs(blob, 'Receipt.pdf');
    })
    .catch(err => {
      // console.log('Err: ', err);
    });
};
export default function TransactionHistory(props) {
  const { data } = props;
  const classes = useStyles();
  const columns = [
    {
      Header: <Typography className={classes.header}>Currency</Typography>,
      accessor: 'currencyCode',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography className={classes.header}>Transaction Date</Typography>
      ),
      accessor: 'trnsactdate',
      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Payment Mode</Typography>,
      accessor: 'payment',
      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Particulars</Typography>,
      accessor: 'Termname',
      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Paid Amount</Typography>,
      accessor: 'paidamount',
      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Receipt</Typography>,
      accessor: 'receipt',
      Cell: ({ value, row }) => {
        return (
          <SaveAltIcon
            style={{ cursor: 'pointer' }}
            onClick={event => downloadReceiptt(event, row, data)}
          />
        );
      },
      disableGlobalFilter: true,
    },
  ];

  return (
    <>
      <BaseCard
        rootStyles={{
          padding: 0,
        }}
      >
        <KenGrid
          columns={columns}
          data={data}
          pagination={{ disabled: true }}
          toolbarDisabled={true}
          isCollasable={true}
          component={CollapseData}
          gridProps={{
            getRowProps: row => ({
              isCollasable: true,
            }),
            getHeaderProps: cell => ({
              style: {
                background: '#F1F5FA',
              },
            }),
            getCellProps: cell => ({
              style: {
                fontWeight: 400,
                fontSize: 14,
                color: '#222222',
              },
            }),
          }}
        />
      </BaseCard>
    </>
  );
}
