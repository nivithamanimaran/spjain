import { Grid, TextField, useMediaQuery } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import KenButton from '../../../global_components/KenButton';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';
import {
  getFeeReceipt,
  getMyReceiptsByAttachmentID,
  getTransactionDetails,
} from '../../../utils/ApiService';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles(theme => ({
  cellhead1: {
    color: '#092682',
    fontSize: '16px',
    textAlign: 'start',
    color: '#092682',
    fontSize: '14px',
    width: '200px',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 15,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
    // border: 'solid 1px',
    padding: '0px',
    // width: '100px'
  },
  outerContainer: {
    border: '1px solid #DEE9EF',
    borderRadius: '4px',
    padding: '22.5px 35px',
    backgroundColor: 'white',
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
  body: {
    padding: '10px',
    backgroundColor: 'red',
  },
  collapsestyles: {
    backgroundColor: 'white',
    padding: '0px',
  },

  // mobile view//

  mobilehead: {
    fontSize: '10px',
    color: '#7A7A7B',
    marginTop: '10px',
  },
  mobiledata: {
    fontSize: '12px',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  resp: {
    [theme.breakpoints.down('md')]: {
      '&>div>div>table': {
        width: '250%',
      },
      '&>div>div': {
        overflowX: 'auto',
      },
      '&>div>div>table>thead>tr>th': {
        textAlign: 'start',
      },
    },
  },
}));

const useRowStyles = makeStyles(theme => ({
  type1: {
    fontSize: '11px',
    paddingTop: '4px',
  },
  type2: {
    fontSize: '16px',
    color: '#193389',
    marginLeft: '20px',
  },
  tableborder: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
    boxShadow: 'none',
  },
}));
const CollapseData = props => {
  // console.log(props);
  let rows = props?.original;
  const classes = useStyles();
  return (
    <div>
      <Box mt={2} mb={2} mr={15} ml={15} className={classes.outerContainer}>
        <Grid container spacing={3}>
          <Grid item container direction="row">
            <Grid item container md={8} sm={8} alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.keyTypo}>
                  Transaction Id
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.valueTypo}>
                  {rows?.TransactionId}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container md={4} sm={4} alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.keyTypo}>
                  payment type
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.valueTypo}>
                  {rows?.Transaction_type__c}{' '}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direction="row">
            <Grid item container md={8} sm={8} alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.keyTypo}>reciept no </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.valueTypo}>
                  {rows?.Receipt_Number__c}{' '}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container md={4} sm={4} alignItems="center" spacing={2}>
              <Grid item>
                <Typography className={classes.keyTypo}>
                  remaining amount{' '}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.valueTypo}>
                  {rows?.Remaining_Amount__c}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default function CollapsibleTable({ setLoading }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  // const [loading, setLoading] = useState();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    state: { userDetails },
  } = useAppContext();

  // useEffect(() => {
  //   setLoading(true);
  //   const params = userDetails.ContactId;
  //   getStudentDetailsByContact(params).then(resp => {
  //     let studentDetails = resp;
  //     setRegID(studentDetails?.Data['Registration_Number__c']);
  //     setStudentCategory(
  //       studentDetails?.Data['Fee_Category_of_the_Students__c']
  //     );
  //     setAdmissionYear(studentDetails?.Data['Year_of_Joining__c']);
  //     setStudentClass(studentDetails['ProgramPlan']);
  //     setLoading(false);
  //   });
  // }, []);

  const downloadReceipt = (event, row, data) => {
    // console.log(event, row, data, data[row.index].attachment?.Id);
    const params = data[row.index].attachment?.Id;
    getMyReceiptsByAttachmentID(params)
      .then(res => {
        var blob = new Blob([res], { type: 'application/pdf' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Receipt.pdf';
        link.click();
      })
      .catch(err => {
        // console.log('Err: ', err);
      });
  };
  const handleChangedStartDate = e => {
    let date = moment(e).format('YYYY-MM-DD');
    setStartDate(date);
  };
  const handleChangedEndDate = e => {
    let date = moment(e).format('YYYY-MM-DD');
    setEndDate(date);
  };

  const getFeeStatus = status => {
    switch (status) {
      case 'initiated':
        return 'Initiated, Not Completed';

      case 'guaranteed':
        return 'Paid';

      case 'delivered':
        return 'Payment Recieved';

      case 'cancelled':
        return 'Cancelled';

      case 'processed':
        return 'Paid';

      case 'failed':
        return 'Failed';

      default:
        return '';
    }
  };

  useEffect(() => {
    setLoading(true);
    getTransactionDetails(userDetails?.ContactId)
      .then(res => {
        if (res.success) {
          setData(res.data);
          setLoading(false);
        } else {
          setData([]);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        setLoading(false);
      });
  }, []);

  const CommonCell = row => {
    return (
      <>
        <Typography
          style={{
            fontSize: '14px',
            paddingLeft: '15px',
            width: '150px',
          }}
        >
          {row.value}
        </Typography>
      </>
    );
  };
  const CommonCellAMT = row => {
    return (
      <>
        <Typography style={{ fontSize: '13px' }}>
          {row.value.toFixed(2)}
        </Typography>
      </>
    );
  };

  const HeaderCell = typo => {
    return (
      <Typography
        style={{ color: '#092682', fontSize: '15px', fontWeight: '600' }}
      >
        {typo}
      </Typography>
    );
  };

  const convertBase64ToFile = (base64String, fileName) => {
    const bytes = atob(base64String);
    let n = bytes.length;
    let uint8Array = new Uint8Array(n);
    while (n--) {
      uint8Array[n] = bytes.charCodeAt(n);
    }
    let file = new File([uint8Array], fileName, { type: 'application/pdf' });
    return file;
  };

  const handleDownloadReceipt = transactionId => {
    getFeeReceipt(transactionId)
      .then(res => {
        console.log(res);
        if (res.success) {
          const file = convertBase64ToFile(res?.data?.body, res?.data?.title);
          saveAs(file, res?.data?.title);
        } else {
          enqueueSnackbar('Something went wrong', { variant: 'error' });
        }
      })
      .err(err => {
        console.log(err);
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      });
  };

  const columns = [
    {
      Header: HeaderCell('Fee Type'),
      accessor: 'feeType',
      Cell: ({ row, value }) => {
        return (
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item>
              <Typography>{value}</Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.subHeadingFeeType}>
                {row?.original?.programName}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      Header: HeaderCell('Fee Amount'),
      accessor: 'feeAmount',
      Cell: ({ row, value }) => {
        return (
          <Typography>
            <span style={{ fontSize: 10 }}>{row.original.currencyCode}</span>{' '}
            {Number(value).toFixed(2)}
          </Typography>
        );
      },
    },
    // {
    //   Header: 'Transaction ID',
    //   accessor: 'transactionId',
    //   Cell: ({ row, value }) => {
    //     return (
    //       <Typography  >
    //         {value}
    //       </Typography>
    //     );
    //   },
    // },
    {
      Header: HeaderCell('Date'),
      accessor: 'transactionDate',
      Cell: ({ row, value }) => {
        return (
          <Grid container direction="row" spacing={1}>
            <Grid item>
              {value && (
                <Typography>{moment(value).format('DD-MM-YYYY')}</Typography>
              )}
            </Grid>
            <Grid item>
              {value && (
                <Typography className={classes.subHeadingFeeType}>
                  {moment(value).format('hh:mm')}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      },
    },
    {
      Header: HeaderCell('Mode'),
      accessor: 'mode',
      Cell: ({ row, value }) => {
        return (
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography>{value}</Typography>
            </Grid>
            <Grid item>
              <Typography
                className={
                  row?.original?.webhookStatus === 'guaranteed' ||
                  row?.original?.webhookStatus === 'delivered' ||
                  row?.original?.webhookStatus === 'processed'
                    ? classes.subHeadingModeSuccess
                    : row?.original?.webhookStatus === 'initiated'
                    ? classes.subHeadingModeInitiated
                    : classes.subHeadingModeFail
                }
              >
                {getFeeStatus(row?.original?.webhookStatus)}
              </Typography>
            </Grid>
          </Grid>
        );
      },
    },
    {
      Header: HeaderCell('Payment Type'),
      accessor: 'paymentType',
      Cell: ({ row, value }) => {
        return (
          <Grid container direction="column" spacing={1} width={100}>
            <Grid item>
              <Typography
                className={
                  value === 'Partial'
                    ? row?.original?.status === 'Success'
                      ? classes.typoPaymentTypePartialSuccess
                      : classes.typoPaymentTypePartialFailed
                    : row?.original?.status === 'Failed'
                    ? classes.typoPaymentTypeFullFailed
                    : classes.typoPaymentTypeFullSuccess
                }
              >
                {value}
              </Typography>
            </Grid>
            {/* <Grid item>
              {value && (
                <Typography className={classes.subHeadingPaymentTypeSuccess}>
                  {row?.original?.status === 'Success'
                    ? 'Completed'
                    : 'Incomplete'}
                </Typography>
              )}
            </Grid> */}
          </Grid>
        );
      },
    },
    {
      Header: HeaderCell('Receipt'),
      accessor: 'recordId',
      Cell: ({ row, value }) => {
        return (
          <Grid container direction="column" spacing={1} width={100}>
            <Grid item>
              {value &&
                (row?.original?.webhookStatus === 'guaranteed' ||
                  row?.original?.webhookStatus === 'delivered' ||
                  row?.original?.webhookStatus === 'processed') && (
                  <Typography
                    variant="subtitle2"
                    className={classes.download}
                    onClick={() => {
                      handleDownloadReceipt(value);
                    }}
                  >
                    <GetAppIcon />
                  </Typography>
                )}
            </Grid>
          </Grid>
        );
      },
    },
  ];
  const datas = [
    {
      Currency: 'AUD',
      TransactionDate: '17-08-2022',
      PaymentMode: 'FlywireOnline',
      Particulars: '2022 BBA Jan Term 5 Course Material Fee',
      PaidAmount: '62.5',
    },
  ];
  return (
    <div>
      {/* {isMobileScreen ? ( */}
      <>
        <div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              position: 'relative',
              float: 'right',
            }}
          >
            {/* <KenDatePicker
                name={'startDate'}
                value={startDate}
                required={false}
                onChange={e => handleChangedStartDate(e)}
              />
              <KenDatePicker
                name={'endDate'}
                value={endDate}
                required={false}
                onChange={e => handleChangedEndDate(e)}
              /> */}

            {/* <KenButton
                variant="contained"
              // onClick={event => downloadReceipt(event, row, data)}

              >
                <Typography
                  style={{
                    fontFamily: 'sans-serif',
                    textTransform: 'none',
                    fontSize: '12px'
                  }}
                >
                  Download History
                </Typography>
              </KenButton> */}
          </div>
          {
            <KenCard>
              <div className={`KenDivFeeSchedule ${classes.resp}`}>
                <KenGrid
                  toolbarDisabled={true}
                  columns={columns}
                  data={data}
                  pagination={{ disabled: true }}
                  initialState={{ hiddenColumns: ['status'] }}
                />
              </div>
            </KenCard>
          }
        </div>
      </>
      {/* ) : ( */}
      {/* <> */}
      {/* {data &&
                data.map((item, index) => {
                  console.log(item);
                  return (
                    <> */}
      {/* <Grid container spacing={3}>
            <Grid xs={6}>
              <TextField
                type="date"
                variant="outlined"
                size={'small'}
                style={{ width: '90%' }}
              />
            </Grid>
            <Grid xs={6}>
              <TextField
                type="date"
                variant="outlined"
                placeholder="End Date"
                size={'small'}
                style={{ width: '90%' }}
              />
            </Grid>
            <Grid xs={6}>
              <KenButton
                variant="contained"
                onClick={event => downloadReceipt(event, row, data)}
                style={{ width: '90%', marginTop: '10px' }}
              >
                <Typography
                  style={{
                    fontFamily: 'sans-serif',
                    textTransform: 'none',
                    fontSize: '12px',
                  }}
                >
                  Download History
                </Typography>
              </KenButton>
            </Grid>
          </Grid>
          <br />
          <KenCard>
            <Grid spacing={10}>
              <Grid>
                <Typography className={classes.mobilehead}>
                  <b>Currency</b>
                </Typography>
                <Typography className={classes.mobiledata}>AUD</Typography>
              </Grid>
              <Grid>
                <Typography className={classes.mobilehead}>
                  <b>Transaction Date</b>
                </Typography>
                <Typography className={classes.mobiledata}>
                  17-08-2022
                </Typography>
              </Grid>
              <Grid>
                <Typography className={classes.mobilehead}>
                  <b>Payment Mode</b>
                </Typography>
                <Typography className={classes.mobiledata}>
                  Flywire, Online
                </Typography>
              </Grid>
              <Grid>
                <Typography className={classes.mobilehead}>
                  <b>Particulars</b>
                </Typography>
                <Typography className={classes.mobiledata}>
                  2022 BBA Jan Term 5 Course Material Fee
                </Typography>
              </Grid>
              <Grid>
                <Typography className={classes.mobilehead}>
                  <b>Paid Amount</b>
                </Typography>
                <Typography className={classes.mobiledata}>62.5</Typography>
              </Grid>
              <Grid>
                <Typography className={classes.mobilehead}>
                  <b>Receipt</b>
                </Typography>
                <SaveAltIcon style={{ color: '#193389' }} />
              </Grid>
            </Grid>
            <div
              style={{
                border: 'solid 1px',
                borderColor: '#7A7A7B',
                marginTop: '10px',
              }}
            >
              <KenCard>
                <Grid spacing={10}>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>TRANSACTION ID</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      a1f1y000002EVirAAG
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>PAYMENT TYPE</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      Collection
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>RECEIPT NO</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      RN00386
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>REMAINING AMOUNT</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>62.5</Typography>
                  </Grid>
                </Grid>
              </KenCard>
            </div>
          </KenCard>
        </>
      ) */}
      {/* //   );
      // })}

      // </>
      } */}
    </div>
  );
}
