import { Divider, Grid, Paper, useMediaQuery } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import KenButton from '../../../global_components/KenButton';
import KenCard from '../../../global_components/KenCard';
import KenCheckbox from '../../../global_components/KenCheckbox';
import KenGrid from '../../../global_components/KenGrid';
import KenInputField from '../../../global_components/KenInputField';
import {
  getActiveFeeByContact,
  getStudentDetailsByContact,
  postFeePaymentUsingFlywire,
  postFeePaymentUsingHdfc,
} from '../../../utils/ApiService';
import { useAppContext } from '../../../utils/contextProvider/AppContext';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    border: 'none',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  table: {
    paddingBottom: '20px',
  },

  tableborder: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
    [theme.breakpoints.down('sm')]: {
      '&>div>div': {
        overflowX: 'auto',
      },
      '&>div>div>table>thead>tr>th': {
        textAlign: 'start',
        paddingLeft: '3%',
      },
    },
  },
  btnbottom: {
    padding: '20px',
  },
  head: {
    color: '#090F69',
    fontSize: '16px',
    border: 'none',
    background: '#F1F5FA',
    borderRadius: ' 4px 4px 0px 0px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  cell: {
    fontSize: '14px',
    border: 'none',
  },

  Typo1: {
    fontSize: '11px',
    marginBottom: '10px',
    marginTop: '4px',
  },
  

  typenum2: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#090F69',
  },
  divider: {
    height: '60px',
    marginRight: '90px',
    marginTop: '30px',
  },
  header: {
    fontSize: 15,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
    padding: '0px',
  },
  header1: {
    fontSize: 15,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
    padding: '0px',
  },
  // mobile view//

  
  selectedT: {
    fontSize: '11px',
    marginTop: '5px',
    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
      marginLeft: '0px',
    },
  },

  feesButton: {
    justifyContent: 'flex-end',

    [theme.breakpoints.down('md')]: {
      textAlign: 'center',
      justifyContent: 'center',
      marginTop:"10px"
    },
  },
  buttonPayall: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      marginTop: '10px',
    },
  },
}));



export default function SimpleAccordion(props) {
  const { setLoading } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [data, setData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const amountRef = useRef(null);
  const [gindex, setGindex] = useState(0);

  const {
    state: { userDetails },
  } = useAppContext();
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

  const handleInputChange = (event, row, data) => {
    const dataCopy = [...data];
    let element = dataCopy.find(el => el?.title === row?.original?.termName);
    element.termData[row.index][event.target.name] = event.target.value;
    let selectedAmount = 0;
    element.termData.forEach(el => {
      if (el.feeChecked) {
        selectedAmount = Number(el.amountBeingPaid) + Number(selectedAmount);
      }
    });
    element.selectedTotalPayableAmount = Number(selectedAmount);
    setGindex(row.index);
    setData([...dataCopy]);
  };

  const FeePaymentColumn = [
    {
      Header: <Typography style={{ width: '0px' }} />,
      accessor: 'feeChecked',
      Cell: ({ value, row }) => {
        return (
          <div style={{ width: '10px' }}>
            <KenCheckbox
              name={`feeChecked`}
              className={classes.checkbox}
              value={value}
              onChange={eve => selectedCheckBoxItem(eve, row, data)}
              color="primary"
            />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Fee Type</Typography>,
      accessor: 'feeType',
      disableGlobalFilter: true,
      Footer: 'Profile Progress',
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Currency</Typography>,
      accessor: 'currencyOfPayment',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Due Amount</Typography>,
      accessor: 'remainingAmount',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Partial Fee</Typography>,
      accessor: 'isPartialPayment',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              paddingLeft: '15px',
              width: '150px',
            }}
          >
            <KenCheckbox
              name={`isPartialPayment`}
              className={classes.checkbox}
              value={value}
              disabled={
                row?.original?.isPartialPaymentAllowed === true ? false : true
              }
              onChange={eve => selectedCheckBoxItemPartial(eve, row, data)}
              color="primary"
            />
          </div>
        );
      },
    },
    {
      Header: (
        <Typography className={classes.header1}>Amount Being paid</Typography>
      ),
      accessor: 'amountBeingPaid',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              paddingLeft: '15px',
              width: '170px',
            }}
          >
            <KenInputField
              autoFocus={gindex == row.index ? true : false}
              value={value}
              name={'amountBeingPaid'}
              onChange={e => handleInputChange(e, row, data)}
              disabled={row.original.isPartialPayment ? false : true}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    amountRef?.current?.focus?.();
  }, [amountRef]);

  //Group similar currency type objects in a single array


  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  const selectedCheckBoxItem = (event, row, data) => {
    const dataCopy = [...data];
    let element = dataCopy.find(el => el?.title === row?.original?.termName);
    element.termData[row.index][event.target.name] = event.target.checked;
    let selectedAmount = Number(element.selectedTotalPayableAmount);
    if (element.termData[row.index]['feeChecked'] === true) {
      selectedAmount =
        Number(element.termData[row.index]['amountBeingPaid']) +
        Number(selectedAmount);
    } else if (
      element.termData[row.index]['feeChecked'] === false &&
      selectedAmount > 0
    ) {
      selectedAmount =
        Number(selectedAmount) -
        Number(element.termData[row.index]['amountBeingPaid']);
    }
    element.selectedTotalPayableAmount = Number(selectedAmount.toFixed(2));
    setData([...dataCopy]);
  };

  const selectedCheckBoxItemPartial = (event, row, data) => {
    const dataCopy = [...data];
    let element = dataCopy.find(el => el?.title === row?.original?.termName);
    element.termData[row.index][event.target.name] = event.target.checked;
    if (event.target.checked === false) {
      element.termData[row.index]['amountBeingPaid'] =
        row?.original?.remainingAmount;
      let selectedAmount = 0;
      element.termData.forEach(el => {
        if (el.feeChecked) {
          selectedAmount = Number(el.amountBeingPaid) + Number(selectedAmount);
        }
      });
      element.selectedTotalPayableAmount = selectedAmount;
    }
    setData([...dataCopy]);
  };

  const getProvider = currencyCode => {
    switch (currencyCode) {
      case 'USD':
        return {
          provider: 'SPJ',
          payment_destination: 'spjain',
        };
      case 'AED':
        return {
          provider: 'SJD',
          payment_destination: 'spjain-aed',
        };
      case 'AUD':
        return {
          provider: 'SJU',
          payment_destination: 'spjain-aud',
        };
      case 'EUR':
        return {
          provider: 'SJE',
          payment_destination: 'spjain-eur',
        };
      case 'GBP':
        return {
          provider: 'SJG',
          payment_destination: 'spjain-gbp',
        };
      case 'SGD':
        return {
          provider: 'SJN',
          payment_destination: 'spjain-sgd',
        };
      default:
        return {
          provider: 'SPJ',
          payment_destination: 'spjain',
        };
    }
  };

  const getPayselectedAmt = index => {
    const dataCopy = [...data];
    setLoading(true);
    const params = userDetails;
    let noteValues = [];
    let totalLateFee;
    dataCopy[index]?.termData?.forEach((item, inde) => {
      if (item?.feeChecked === true) {
        noteValues.push({
          fee: item?.feeType,
          amount: item?.amountBeingPaid,
          Contact__c: params.ContactId,
          Fee_Type__c: item?.feeType,
          Late_Fees__c: item?.lateFee || 0,
          Amount__c: item?.amountBeingPaid,
          record_id: item?.instalmentRecordId,
          isPartialPayment: item?.isPartialPayment,
          K42_Unplanned_Payment__c: item?.unplannedPaymentId || '',
          Remaining_Amount:
            item?.isPartialPayment === true
              ? Number(item.amountPayable) - Number(item?.amountBeingPaid)
              : 0,
          Total_Amount: item.amountPayable,
        });
        totalLateFee = Number(item?.lateFee) + totalLateFee;
      }
    });

    const indexOfFirst = params.Name.indexOf(' ');
    const wholeNumber = Math.floor(dataCopy[index].selectedTotalPayableAmount); // Returns 355
    const decimal = (
      Number(dataCopy[index].selectedTotalPayableAmount) - Number(wholeNumber)
    ).toFixed(2); // Returns 0.00 as a string
    const wholeNumberLate = Math.floor(totalLateFee); // Returns 355
    const decimalLate = (
      Number(totalLateFee) - Number(wholeNumberLate)
    ).toFixed(2); // Returns 0.00 as a string
    let payload = {
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      amount: wholeNumber,
      paisa: Number(decimal),
      paymentReferenceId: null,
      lateamount: wholeNumberLate,
      latepaisa: decimalLate,
      acceptPartial: true,
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      currencyCode: dataCopy[index].currency,
      description: '',
      paidFor: 'demandNote',
      concessionAmount: 0,
      notes: noteValues,
      ...getProvider(dataCopy[index].currency),
      studentId: params.ContactId,
    };
    if (payload.currencyCode == 'INR') {
      setLoading(true);
      postFeePaymentUsingHdfc(payload).then(res => {
        if (res?.data) {
          setHtmlContent(res.data);
          var newWindow = window.open();
          newWindow.document.write(res.data);
          setTimeout(() => {
            setLoading(false);
          }, 120000);
          setLoading(false);
        }
      });
    } else {
      setLoading(true);
      postFeePaymentUsingFlywire(payload)
        .then(res => {
          window.open(res?.data?.url);
          setTimeout(() => {
            setLoading(false);
          }, 120000);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          handleSnackbarOpen('warning', 'Something Went Wrong.');
        });
    }
  };

 

  const handlePayAll = index => {
    const dataCopy = [...data];
    setLoading(true);
    const params = userDetails;
    let noteValues = [];
    dataCopy[index]?.termData?.forEach((item, inde) => {
      noteValues.push({
        fee: item?.feeType,
        amount: item?.amountPayable,
        Contact__c: params.ContactId,
        Fee_Type__c: item?.feeType,
        Late_Fees__c: item.lateFee || 0,
        Amount__c: item?.amountPayable,
        isPartialPayment: item?.isPartialPayment,
        K42_Unplanned_Payment__c: item?.unplannedPaymentId || '',
        Remaining_Amount: 0,
        Total_Amount: item.amountPayable,
      });
    });

    const indexOfFirst = params.Name.indexOf(' ');
    const wholeNumber = Math.floor(dataCopy[index].totalAmount); // Returns 355
    const decimal = (
      Number(dataCopy[index].totalAmount) - Number(wholeNumber)
    ).toFixed(2); // Returns 0.00 as a string
    let payload = {
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      amount: wholeNumber,
      paisa: Number(decimal),
      paymentReferenceId: null,
      acceptPartial: true,
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      currencyCode: dataCopy[index].currency,
      description: '',
      paidFor: 'demandNote',
      concessionAmount: 0,
      notes: noteValues,
      ...getProvider(dataCopy[index].currency),
      studentId: params.ContactId,
    };
    if (payload.currencyCode == 'INR') {
      setLoading(true);
      postFeePaymentUsingHdfc(payload).then(res => {
        if (res?.data) {
          setHtmlContent(res.data);
          var newWindow = window.open();
          newWindow.document.write(res.data);
          setTimeout(() => {
            setLoading(false);
          }, 120000);
          setLoading(false);
        }
      });
    } else {
      setLoading(true);
      postFeePaymentUsingFlywire(payload)
        .then(res => {
          window.open(res?.data?.url);
          setTimeout(() => {
            setLoading(false);
          }, 120000);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          handleSnackbarOpen('warning', 'Something Went Wrong.');
        });
    }
  };
  useEffect(() => {
    setLoading(true);
    const params = userDetails.ContactId;
    getActiveFeeByContact(params)
      .then(res => {
        if (res.success) {
          const inputdata=Object.keys(res?.data)
          // inputdata.sort((a, b) => {
          //   const termA = a.match(/Term (\d+)/)[1];
          //   const termB = b.match(/Term (\d+)/)[1];
          //   return termA - termB;
          // });
          let termName = inputdata
          let termData = Object.values(res?.data);
          let data = [];
          let currency;
          termName?.forEach((el, index) => {
            let totalAmount = 0;
            data.push({
              title: el,
              termData: termData[index].map(el => {
                let remainingAmount = 0;
                let lateFee;
                if (
                  el?.lateFeeStartDate !== null &&
                  el?.lateFeePercentage !== null
                ) {
                  let currentDate = moment();
                  let lateFeeDate = moment(el?.lateFeeStartDate);
                  if (lateFeeDate?.diff(currentDate, 'days') < 0) {
                    remainingAmount =
                      Number(el?.remainingAmount) *
                        (Number(el?.lateFeePercentage) / 100) +
                      Number(el?.remainingAmount);
                    lateFee = Number(remainingAmount).toFixed(2);
                    el.remainingAmount = Number(remainingAmount).toFixed(2);
                  } else {
                    remainingAmount = Number(el.remainingAmount).toFixed(2);
                    lateFee = 0;
                  }
                }
                totalAmount = totalAmount + Number(el?.remainingAmount);
                currency = el.currencyOfPayment;
                return {
                  isPartialPayment: false,
                  feeChecked: false,
                  amountBeingPaid:
                    Number(remainingAmount).toFixed(2) == 0.0
                      ? el.remainingAmount
                      : Number(remainingAmount).toFixed(2),
                  lateFee: lateFee,
                  ...el,
                };
              }),
              selectedTotalPayableAmount: 0,
              totalAmount: totalAmount.toFixed(2),
              currency: currency,
            });
          });
          setData(data);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);


  return (
    <div className={classes.root}>
      <>
        <Paper variant="elevation" elevation={24}>
          {data &&
            data.map((el, index) => {
              return (
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                  }}
                >
                  {el?.termData?.length > 0 ? (
                    <Accordion style={{ boxShadow: 'none' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>
                          <b>Pending Fees for {el.title} </b>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className={classes.table}>
                        <Grid container justifyContent="center">
                          <Grid item xs={12}>
                            <div className="KenDivFeeSchedule">
                              <div className={classes.tableborder}>
                                <KenGrid
                                  columns={FeePaymentColumn}
                                  data={el.termData}
                                  pagination={{ disabled: true }}
                                  tableTotal={{
                                    disabled: true,
                                    checkbox: true,
                                  }}
                                  getRowProps={{ selected: true }}
                                  toolbarDisabled={true}
                                  gridProps={{
                                    getHeaderProps: cell => ({
                                      style: {
                                        background: '#F1F5FA',
                                        border: 'none',
                                      },
                                    }),
                                    getCellProps: cell => ({
                                      style: {
                                        border: 'none',
                                      },
                                      footerRows: [1],
                                      footerStyles: {
                                        backgroundColor: 'white',
                                      },
                                      footerCellStyles: {
                                        borderBottom: 'none',
                                      },
                                    }),
                                  }}
                                />
                                <Grid container className={classes.btnbottom}>
                                  <Grid xs={5} md={9}>
                                    <Grid container justifyContent="flex-end">
                                      <Grid>
                                        <Typography className={classes.Typo1}>
                                          <b>SELECTED&nbsp;TOTAL</b>
                                        </Typography>
                                      </Grid>
                                      <Grid>
                                        <Typography
                                          className={classes.typenum2}
                                        >
                                          &nbsp;&nbsp;
                                          {el.selectedTotalPayableAmount}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      container
                                      justifyContent="flex-end"
                                      className={classes.feesButton}
                                    >
                                      <KenButton
                                        variant="contained"
                                        disabled={
                                          Number(
                                            el.selectedTotalPayableAmount
                                          ) > 0
                                            ? false
                                            : true
                                        }
                                        onClick={() => getPayselectedAmt(index)}
                                      >
                                        <Typography
                                          style={{
                                            fontFamily: 'sans-serif',
                                            textTransform: 'none',
                                            fontSize: isMobileScreen
                                              ? '14px'
                                              : '12px',
                                          }}
                                        >
                                          Pay Selected
                                        </Typography>
                                      </KenButton>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    container
                                    xs={2}
                                    md={1}
                                    style={{
                                      justifyContent: isMobileScreen
                                        ? 'center'
                                        : 'flex-end',
                                    }}
                                  >
                                    <Divider
                                      orientation="vertical"
                                      flexItem
                                      style={{
                                        height: '60px',
                                        marginRight: '60px',
                                        marginTop: '10px',
                                      }}
                                    />
                                  </Grid>
                                  <Grid xs={5} md={2}>
                                    <Grid container justifyContent="flex-end">
                                      <Grid>
                                        <Typography className={classes.Typo1}>
                                          <b>TOTAL</b>
                                        </Typography>
                                      </Grid>
                                      <Grid>
                                        <Typography
                                          className={classes.typenum2}
                                        >
                                          {' '}
                                          &nbsp;&nbsp;{el.totalAmount}{' '}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      container
                                      classNmae={classes.buttonPayall}
                                      style={{
                                        justifyContent: isMobileScreen
                                          ? 'initial'
                                          : 'flex-end',
                                      }}
                                    >
                                      <KenButton
                                        variant="contained"
                                        onClick={() => handlePayAll(index)}
                                      >
                                        <Typography
                                          style={{
                                            fontFamily: 'sans-serif',
                                            textTransform: 'none',
                                            fontSize: isMobileScreen
                                              ? '14px'
                                              : '12px',
                                          }}
                                        >
                                          Pay All
                                        </Typography>
                                      </KenButton>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ) : null}
                </div>
              );
            })}
        </Paper>
      </>
    
    </div>
  );
}
