import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import KenCheckbox from '../../../global_components/KenCheckbox';
import KenButton from '../../../global_components/KenButton';
import KenLoader from '../../../components/KenLoader';
import { Paper, Grid, Divider } from '@material-ui/core';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import {
  getActiveFeeByContact,
  getFeeScheduleByContact,
  getStudentDetailsByContact,
  postFeePaymentUsingFlywire,
  postFeePaymentUsingHdfc,
} from '../../../utils/ApiService';
import KenInputField from '../../../global_components/KenInputField';
import { useMediaQuery } from '@material-ui/core';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';

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
  table1: {
    padding: '0px',
  },
  tableborder: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
    // width: '100%'
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
  cell2: {
    fontSize: '16px',
    border: 'none',
    color: '#090F69',
  },
  Typo1: {
    fontSize: '11px',
    // marginRight: '40px',
    marginBottom: '10px',
    marginTop: '4px',
  },
  Typo2: {
    fontSize: '11px',
    // marginRight: '10px',
    marginBottom: '9px',
  },
  typenum1: {
    minWidth: '30px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#090F69',
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
    // border: 'solid 1px',
    padding: '0px',
    // width: '100px'
  },
  header1: {
    fontSize: 15,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
    // border: 'solid 1px',
    padding: '0px',
    // width: '150px'
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
  selectedT: {
    fontSize: '11px',
    marginTop: '5px',
  },
  selecteddata: {
    fontSize: '15px',
    color: '#092682',
    marginLeft: '10px',
  },
}));

function formatCurrency(type, amount) {
  let currencyFormat;
  if (type === 'INR') {
    currencyFormat = 'en-IN';
  } else {
    currencyFormat = 'en-US';
  }
  return new Intl.NumberFormat(currencyFormat, {
    style: 'currency',
    currency: type,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function FeeScheduleManual(props) {
  const { setLoading } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [data, setData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [regID, setRegID] = useState();
  const [admissionYear, setAdmissionYear] = useState();
  const [studentCategory, setStudentCategory] = useState();
  const [studentName, setStudentName] = useState();
  const [studentClass, setStudentClass] = useState();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [initialAmt, setInitialAmt] = useState(0);
  const [newData, setNewData] = useState(0);
  const amountRef = useRef(null);
  const [apiAmt, setAPIAmt] = useState(0);
  const [autoFocus, setAutoFocus] = useState(false);
  const [gindex, setGindex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [gradeData, setGradeData] = useState(data);
  const [openDrawerBreakdown, setOpenDrawerBreakdown] = React.useState(false);
  const [openSubDrawerBreakdown, setOpenSubDrawerBreakdown] = React.useState(
    false
  );
  const [ServiceTotalFeeAmount, setServiceTotalFeeAmount] = useState(0);
  const [serviceAllFeeAmt, setServiceAllFeeAmt] = useState(0);
  const [htmlContent, setHtmlContent] = useState('');
  const [gridErrors, setGridErrors] = useState([]);
  const [valls, setvalls] = useState({
    value: '',
  });
  const [inputError, setInputError] = useState({
    error: false,
    errorMessage: '',
  });
  const [tIndex, setTIndex] = useState();

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

  useEffect(() => {
    setLoading(true);
    const params = userDetails.ContactId;
    getActiveFeeByContact(params)
      .then(res => {
        if (res.success) {
          let termName = Object.keys(res?.data);
          let termData = Object.values(res?.data);
          let data = [];
          let currency;
          termName?.forEach((el, index) => {
            let totalAmount = 0;
            data.push({
              title: el,
              termData: termData[index].map(el => {
                totalAmount = Number(totalAmount) + Number(el?.remainingAmount);
                currency = el.currencyOfPayment;
                return {
                  isPartialPayment: false,
                  feeChecked: false,
                  amountBeingPaid: el?.remainingAmount,
                  ...el,
                };
              }),
              selectedTotalPayableAmount: 0,
              totalAmount: totalAmount,
              currency: currency,
            });
          });
          setData(data?.reverse());
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  console.log(data);

  useEffect(() => {
    // setLoading(true);
    const params = userDetails.ContactId;
    setStudentName(userDetails.Name);
    getStudentDetailsByContact(params).then(resp => {
      let studentDetails = resp;
      setRegID(studentDetails?.Data['Registration_Number__c']);
      setStudentCategory(
        studentDetails?.Data['Fee_Category_of_the_Students__c']
      );
      setAdmissionYear(studentDetails?.Data['Year_of_Joining__c']);
      setStudentClass(studentDetails['ProgramPlan']);
    });
  }, []);

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
    element.selectedTotalPayableAmount = selectedAmount.toFixed(2);
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
    // const dataRequired = data[index];
    const params = userDetails;
    let noteValues = [];
    dataCopy[index]?.termData?.forEach((item, inde) => {
      if (item?.feeChecked === true) {
        noteValues.push({
          fee: item?.feeType,
          amount: item?.amountBeingPaid,
          Contact__c: params.ContactId,
          Fee_Type__c: item?.feeType,
          Late_Fees__c: item.lateFee || 0,
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
      }
    });

    const indexOfFirst = params.Name.indexOf(' ');
    const wholeNumber = Math.floor(dataCopy[index].selectedTotalPayableAmount); // Returns 355
    const decimal = (
      Number(dataCopy[index].selectedTotalPayableAmount) - Number(wholeNumber)
    ).toFixed(2); // Returns 0.00 as a string
    let payload = {
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      amount: wholeNumber,
      paisa: decimal,
      paymentReferenceId: null,
      acceptPartial: true,
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      // callBackUrl: `http://localhost:3000/thankyou`,
      currencyCode: dataCopy[index].currency,
      description: '',
      paidFor: 'demandNote',
      concessionAmount: 0,
      notes: noteValues,
      ...getProvider(dataCopy[index].currency),
      studentId: params.ContactId,
    };
    console.log(payload);
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

  const isFloat = n => {
    return Number(n) === n && n % 1 !== 0;
  };

  const handlePayAll = index => {
    const dataCopy = [...data];
    // const dataRequired = data[index];
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
    // let total;
    // if (isFloat(dataCopy[index].selectedTotalPayableAmount) === true) {
    //   total = dataCopy[index].selectedTotalPayableAmount?.split('.');
    // } else {
    //   total = dataCopy[index].selectedTotalPayableAmount;
    // }
    // fee payment using flywire
    const indexOfFirst = params.Name.indexOf(' ');
    const wholeNumber = Math.floor(dataCopy[index].totalAmount); // Returns 355
    const decimal = (
      Number(dataCopy[index].totalAmount) - Number(wholeNumber)
    ).toFixed(2); // Returns 0.00 as a string
    let payload = {
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      amount: wholeNumber,
      paisa: decimal,
      paymentReferenceId: null,
      acceptPartial: true,
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      // callBackUrl: `http://localhost:3000/thankyou`,
      currencyCode: dataCopy[index].currency,
      description: '',
      paidFor: 'demandNote',
      concessionAmount: 0,
      notes: noteValues,
      ...getProvider(dataCopy[index].currency),
      studentId: params.ContactId,
    };
    console.log('payload', payload);
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

  return (
    <div className={classes.root}>
      {isMobileScreen ? (
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
                                    <Grid xs={9}>
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
                                      <Grid container justifyContent="flex-end">
                                        <KenButton
                                          variant="contained"
                                          disabled={
                                            Number(
                                              el.selectedTotalPayableAmount
                                            ) > 0
                                              ? false
                                              : true
                                          }
                                          onClick={() =>
                                            getPayselectedAmt(index)
                                          }
                                        >
                                          <Typography
                                            style={{
                                              fontFamily: 'sans-serif',
                                              textTransform: 'none',
                                              fontSize: '14px',
                                            }}
                                          >
                                            Pay Selected
                                          </Typography>
                                        </KenButton>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      container
                                      justifyContent="flex-end"
                                      xs={1}
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
                                    <Grid xs={2}>
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
                                      <Grid container justifyContent="flex-end">
                                        <KenButton
                                          variant="contained"
                                          onClick={() => handlePayAll(index)}
                                        >
                                          <Typography
                                            style={{
                                              fontFamily: 'sans-serif',
                                              textTransform: 'none',
                                              fontSize: '14px',
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
      ) : (
        // mobile responsive
        <>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontSize: '14px' }}>
                <b>Pending Fees in AUD</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.table}>
              <KenCard>
                <Grid spacing={10}>
                  <Grid>
                    <KenCheckbox />
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Fee Type</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      2022 BBA Jan Term 5 Course Material Fee
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Currency</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>AUD</Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Due Amount</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>62.5</Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Partial Fee</b>
                    </Typography>
                    <KenCheckbox />
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Amount Being paid</b>
                    </Typography>
                    <KenInputField style={{ marginTop: '10px' }} />
                  </Grid>
                  <Grid container style={{ marginTop: '20px' }}>
                    <Grid xs={5}>
                      <Grid container>
                        <Typography className={classes.selectedT}>
                          <b>Selected total</b>
                        </Typography>
                        <Typography className={classes.selecteddata}>
                          <b>93</b>
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginTop: '10px' }}>
                        <KenButton
                          variant="contained"
                          // onClick={event => downloadReceipt(event, row, data)}
                          xs={6}
                        >
                          <Typography
                            style={{
                              fontFamily: 'sans-serif',
                              textTransform: 'none',
                              fontSize: '12px',
                            }}
                          >
                            Pay Selected
                          </Typography>
                        </KenButton>
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end" xs={2}>
                      <Divider
                        orientation="vertical"
                        flexItem
                        style={{ height: '60px', marginTop: '5px' }}
                      />
                    </Grid>
                    <Grid xs={5}>
                      <Grid container justifyContent="flex-end">
                        <Typography className={classes.selectedT}>
                          <b>TOTAL</b>
                        </Typography>
                        <Typography className={classes.selecteddata}>
                          <b>125</b>
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        item
                        justifyContent="flex-end"
                        style={{ marginTop: '10px' }}
                      >
                        <KenButton
                          variant="contained"
                          // onClick={event => downloadReceipt(event, row, data)}
                        >
                          <Typography
                            style={{
                              fontFamily: 'sans-serif',
                              textTransform: 'none',
                              fontSize: '12px',
                            }}
                          >
                            Pay All
                          </Typography>
                        </KenButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </KenCard>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </div>
  );
}
