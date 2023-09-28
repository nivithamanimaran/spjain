import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KenCheckbox from '../../../global_components/KenCheckbox';
import KenButton from '../../../global_components/KenButton';
import KenCard from '../../../global_components/KenCard';
// import KenInputField from '../../../global_components/KenInputField';
import KenGrid from '../../../global_components/KenGrid';
import KenInputField from '../../../global_components/KenInputField';
import { Grid, Box, Divider } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core';
import {
  getFeeInventoryByContact,
  getFeeScheduleByContact,
  getStudentDetailsByContact,
  postFeePaymentUsingFlywire,
  postFeePaymentUsingHdfc,
  // getFeeInventoryByContact,
  // getStudentDetailsByContact,
  // postFeeInventoryByContact,
  // postFeePaymentUsingFlywire,
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
    minWidth: 650,
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
    marginRight: '9px',
    marginBottom: '10px',
    marginTop: '4px',
  },
  Typo2: {
    fontSize: '11px',
    marginRight: '20px',
    marginBottom: '9px',
  },
  btnbottom: {
    padding: '20px',
  },
  tableborder: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
  },
  typenum2: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#090F69',
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
// function createData(currency, transaction, payment, particulars, paid, receipt) {
//   return { currency, transaction, payment, particulars, paid, receipt };
// }

// const rows = [
//   createData(<KenCheckbox />, 'Re-Evaluation Fee', 'INR', '1000', <KenButton
//     variant="contained"
//   // onClick={event => downloadReceipt(event, row, data)}

//   >
//     <Typography
//       style={{
//         fontFamily: 'sans-serif',
//         textTransform: 'none',
//         fontSize: '14px'
//       }}
//     >
//       Pay Now
//     </Typography>
//   </KenButton>),

// ];
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

export default function SimpleAccordion({ setLoading }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  // const [loading, setLoading] = useState();
  const [regID, setRegID] = useState();
  const [admissionYear, setAdmissionYear] = useState();
  const [studentCategory, setStudentCategory] = useState();
  const [htmlContent,setHtmlContent]=useState('')
  const [studentName, setStudentName] = useState();
  const [studentClass, setStudentClass] = useState();
  const [totalFee, setTotalFee] = useState(formatCurrency('INR', 0));
  const [paidFee, setPaidFee] = useState(formatCurrency('INR', 0));
  const [dueAmt, setDueAmt] = useState(formatCurrency('INR', 0));
  const [amtToPay, setAmtToPay] = useState(formatCurrency('INR', 0));
  const [totalAmount, setTotalAmount] = useState(formatCurrency('INR', 0));
  const [disableField, setDisableField] = useState(true);
  const [withoutCurrencyAmt, setWithoutCurrencyAmt] = useState(0);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [initialAmt, setInitialAmt] = useState(0);
  const [newData, setNewData] = useState(0);
  const amountRef = useRef(null);
  const [apiAmt, setAPIAmt] = useState(0);
  const [autoFocus, setAutoFocus] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [gradeData, setGradeData] = useState(data);
  const [openDrawerBreakdown, setOpenDrawerBreakdown] = React.useState(false);
  const [openSubDrawerBreakdown, setOpenSubDrawerBreakdown] = React.useState(
    false
  );
  const [serviceFeeAmount, setServiceFeeAmount] = useState(0);
  const [serviceFeeAmount1, setServiceFeeAmount1] = useState(0);
  const [serviceFeeAmount2, setServiceFeeAmount2] = useState(0);
  const [ServiceTotalFeeAmount, setServiceTotalFeeAmount] = useState(0);
  const [serviceAllFeeAmt, setServiceAllFeeAmt] = useState(0);
  // const [serviceFeeAmount, setServiceFeeAmount] = useState(0);
  const [gridErrors, setGridErrors] = useState([]);
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
            width: '120px',
          }}
        >
          {row.value}
        </Typography>
      </>
    );
  };
  const CommonCell1 = row => {
    return (
      <>
        <Typography
          style={{
            fontSize: '14px',
            paddingLeft: '15px',
            width: '200px',
          }}
        >
          {row.value}
        </Typography>
      </>
    );
  };
  const columns = [
    {
      Header: <Typography style={{ width: '10px' }} />,
      accessor: 'checkedAmt',
      Cell: ({ value, row }) => {
        return (
          <div style={{ width: '10px' }}>
            <KenCheckbox
              name={`checkbox`}
              className={classes.checkbox}
              value={value}
              onChange={eve => selectedCheckBoxPay(eve, row, data)}
              color="primary"
            />
            {/* <KenCheckbox
            name={`checkbox`}
            className={classes.checkbox}
            value={value}
            onChange={eve => selectedCheckBoxItem(eve, row, data)}
            color="primary"
          /> */}
          </div>
        );
      },

      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Fee Type</Typography>,
      accessor: 'Fee_Type_Name__c',
      disableGlobalFilter: true,
      Cell: CommonCell1,
    },
    {
      Header: <Typography className={classes.header}>Currency</Typography>,
      accessor: 'currency',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Fee Amount</Typography>,
      accessor: 'Fee_Amount__c',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Pay Amount</Typography>,
      accessor: 'PayAmount',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              paddingLeft: '15px',
              width: '150px',
            }}
          >
            <KenButton
              variant="contained"
              //onClick={event => downloadReceipt(event, row, data)}
              onClick={() => getPayselectedAmt()}
            >
              <Typography
                style={{
                  fontFamily: 'sans-serif',
                  textTransform: 'none',
                  fontSize: '14px',
                }}
              >
                Pay Now
              </Typography>
            </KenButton>
          </div>
        );
      },
    },
  ];
  const datas = [
    {
      FeeType: 'Re-Evaluation Fee',
      Currency: 'AUD',
      FeeAmount: '1000',
    },
  ];
  useEffect(() => {
    amountRef?.current?.focus?.();
  }, [amountRef]);
  function groupBy(objectArray, property) {
    return objectArray.reduce(function(acc, obj) {
      let key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }
  useEffect(() => {
    setLoading(true);
    const params = userDetails.ContactId;
    getFeeInventoryByContact(params) // getFeeScheduleByContact  => New Update
      .then(res => {
        // setLoading(true);
        if (res.success) {
          //combine all PlannedPay in a single Array
          const arr = res['StudentServiceFee'].map(item => {
            return {
              ...item?.PlannedPay,
              FeeInv: item?.FeeInv,
              currency: item?.FeeInv?.Currency_of_Payment__c,
              checked: item?.FeeInv?.['Partial_Payment_Allowed__c'] || false,
              Fee_Amount__c: item?.FeeInv?.Fee_Amount__c,
              Fee_Type_Name__c: item?.FeeInv?.Fee_Type_Name__c
            };
          });

          //Put "--" if there is no currency in an object so that further execution won't be disturbed
          const dataArray = arr.map(item => {
            if (!item?.FeeInv.hasOwnProperty('Currency_of_Payment__c')) {
              return {
                ...item,
                Currency_of_Payment__c: 'Unknown Currency',
                currency: '--',
              };
            }
            return item;
          });

          //Group similar currency data together
          const groupedByCurrency = dataArray.reduce((group, product) => {
            const { Currency_of_Payment__c } = product.FeeInv;
            group[Currency_of_Payment__c] = group[Currency_of_Payment__c]
              ? group[Currency_of_Payment__c]
              : [];
            group[Currency_of_Payment__c].push(product);
            return group;
          }, {});

          const finalArr = [];
          for (const key in groupedByCurrency) {
            const sum = groupedByCurrency[key].reduce((prev, curr) => {
              return prev + curr.FeeInv.Fee_Amount__c;
            }, 0);

            // console.log(`${key}`);

            finalArr.push({
              [key]: groupedByCurrency[key],
              totalAmount: sum,
              currency: key,
              data: groupedByCurrency[key]
            });
          }

          console.log(`finalArr`, finalArr, arr);
          setData(finalArr);
          setLoading(false);
          console.log('ajith->', finalArr);

          // Old code by Devesh & Shubham

          //   let mainData = [];
          //   let tableData = [];
          //   let apiResponse = res?.['Data '];
          //   apiResponse.map(elem => {
          //     if (
          //       mainData.some(
          //         el => el.currency === elem?.PlannedPay?.Currency_of_Payment__c
          //       )
          //     ) {
          //       let index = mainData.findIndex(
          //         el => el.currency === elem?.PlannedPay?.Currency_of_Payment__c
          //       );
          //       console.log('index in API', index);
          //       let tAmount = 0;
          //       mainData[index].data.forEach(el => {
          //         tAmount = tAmount + Number(el.Total_Fee_Amount_Formula__c);
          //       });
          //       mainData[index].totalAmount = tAmount;
          //       mainData[index].data.push({
          //         ...elem?.PlannedPay,
          //         currency: elem?.PlannedPay?.Currency_of_Payment__c,
          //         checked: elem?.FeeInv?.['Partial_Payment_Allowed__c'],
          //         Fee_Type__c: elem?.PlannedPay?.Fee_Type__c,
          //         lateFee:
          //           elem?.LateFeeData?.LateFeeAmount === null
          //             ? 0
          //             : elem?.LateFeeData?.LateFeeAmount,
          //         planId: elem?.PlannedPay ? elem?.PlannedPay?.Id : null,
          //         Total_Fee_Amount_Formula__c:
          //           elem?.PlannedPay?.Total_Fee_Amount_Formula__c,
          //         Planned_Amount_Payable__c:
          //           elem?.PlannedPay?.Planned_Amount_Payable__c,
          //         Planned_Amount_Payable__c:
          //           elem?.PlannedPay?.Planned_Amount_Payable__c,
          //       });
          //       setData(mainData);
          //     } else {
          //       mainData.push({
          //         currency: elem?.PlannedPay?.Currency_of_Payment__c,
          //         data: [
          //           {
          //             ...elem?.PlannedPay,
          //             currency: elem?.PlannedPay?.Currency_of_Payment__c,
          //             checked: elem?.FeeInv?.['Partial_Payment_Allowed__c'],
          //             Fee_Type__c: elem?.PlannedPay?.Fee_Type__c,
          //             lateFee:
          //               elem?.LateFeeData?.LateFeeAmount === null
          //                 ? 0
          //                 : elem?.LateFeeData?.LateFeeAmount,
          //             planId: elem?.PlannedPay ? elem?.PlannedPay?.Id : null,
          //             Total_Fee_Amount_Formula__c:
          //               elem?.PlannedPay?.Total_Fee_Amount_Formula__c,
          //             Planned_Amount_Payable__c:
          //               elem?.PlannedPay?.Planned_Amount_Payable__c,
          //             Planned_Amount_Payable__c:
          //               elem?.PlannedPay?.Planned_Amount_Payable__c,
          //           },
          //         ],
          //       });
          //       console.log('mainData', mainData);
          //       setData(mainData);
        }
      })
      .catch(err => {
        setLoading(false);
      });

    // if (apiResponse.length > 0) {
    //   setLoading(false);
    //   let totalFeeAmt = tableData.reduce(
    //     (sum, row) => row?.['Total_Fee_Amount_Formula__c'] + sum,
    //     0
    //   );
    //   console.log('row', row);
    //   setAmtToPay(formatCurrency('INR', totalFeeAmt));
    //   let totalFeeDueAmt = mainData[index].data.reduce(
    //     (sum, row) => row?.['Planned_Amount_Payable__c'] + sum,
    //     0
    //   );
    //   // setAmtToPay(formatCurrency('INR', Math.round(totalFeeAmt)));
    //   setAPIAmt(Math.round(totalFeeAmt));
    //   setAmtToPay(Math.round(totalFeeAmt));
    //   setWithoutCurrencyAmt(Math.round(totalFeeAmt));
    //   setInitialAmt(Math.round(totalFeeAmt));
    //   setDueAmt(formatCurrency('INR', Math.round(totalFeeDueAmt)));
    //   // setAmtToPay(formatCurrency('INR', Number.parseFloat(totalFeeAmt).toFixed(2)));
    //   // setAPIAmt(Number.parseFloat(totalFeeAmt).toFixed(2));
    //   // setDueAmt(formatCurrency('INR', Number.parseFloat(totalFeeDueAmt).toFixed(2)));
    // }
  }, []);
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
  useEffect(() => {
    console.log('selectedData3', selectedData);
  }, [selectedData]);
  useEffect(() => {
    console.log('currencyData', currencyData);
  }),
    [currencyData];

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const selectedCheckBoxItem = (event, row, data) => {
    const newData = [...data];
    newData.map(el => {
      if (el.currency === row?.original.currency) {
        if (!el.data[row.index]['Partial_Payment_Allowed__c']) {
          el.data[row.index]['checked'] = event.target.checked;
          setData([...newData]);
        }
      }
    });
  };
  const selectedCheckBoxPay = (event, row, data) => {
    console.log('row', row);
    console.log('data222', data);
    console.log('event.target.checkedw', event.target.checked);
    let selectDataArray = [...selectedData];
    const newData = [...data];
    console.log('newData', newData);
    newData.map(el => {
      if (el.currency === row?.original.currency) {
        if (event.target.checked) {
          let feePay =
            serviceFeeAmount + el.data[row.index].FeeInv.Fee_Amount__c;
          let feePay1 =
            serviceFeeAmount1 + el.data[row.index].FeeInv.Fee_Amount__c;
          let feePay2 =
            serviceFeeAmount2 + el.data[row.index].FeeInv.Fee_Amount__c;
          selectDataArray.push({ ...el.data[row.index] });
          setSelectedIndex(row.index);
          if (row?.original.currency === 'AUD') {
            setServiceFeeAmount(feePay);
          } else if (row?.original.currency === 'AED') {
            setServiceFeeAmount1(feePay1);
          } else if (row?.original.currency === 'INR') {
            setServiceFeeAmount2(feePay2);
          }

          setServiceTotalFeeAmount(feePay);
          setServiceAllFeeAmt(Math.round(feePay));
        } else {
          let feePaytwo =
            serviceFeeAmount - el.data[row.index].FeeInv.Fee_Amount__c;
          let feePaytwo1 =
            serviceFeeAmount1 - el.data[row.index].FeeInv.Fee_Amount__c;
          let feePaytwo2 =
            serviceFeeAmount2 - el.data[row.index].FeeInv.Fee_Amount__c;
          console.log('selectDataArray', selectDataArray);
          const selectedItems = selectDataArray.filter(
            elem => elem.Id !== row?.original?.Id
          );

          selectDataArray = selectedItems;

          setSelectedIndex(row.index);
          // setServiceFeeAmount(feePaytwo);
          if (row?.original.currency === 'AUD') {
            setServiceFeeAmount(feePaytwo);
          } else if (row?.original.currency === 'AED') {
            setServiceFeeAmount1(feePaytwo1);
          } else if (row?.original.currency === 'INR') {
            setServiceFeeAmount2(feePaytwo2);
          }
          setServiceTotalFeeAmount(feePaytwo);
        }
        el.data[row.index]['checkedAmt'] = event.target.checked;
        console.log(el.data, 'el');
        // setData(newData);

        if (event.target.checked) {
          const dataArray = [...selectDataArray];
          const updatedDataArray = dataArray.filter(
            elem => elem.currency === row?.values?.currency
          );
          setSelectedData(updatedDataArray);

          const rawData = [...data];
          const otherCurrencyData = rawData.filter(
            elem => elem.currency != row?.values?.currency
          );
          const currentCurrencyData = rawData.filter(
            elem => elem.currency === row?.values?.currency
          );

          const updatedCurrencyData = otherCurrencyData.map(elem => {
            const updatedDataObject = elem?.data?.map(item => {
              return {
                ...item,
                checkedAmt: false,
              };
            });
            return {
              ...elem,
              data: updatedDataObject,
            };
          });
          console.log('updatedCurrencyData', [
            ...updatedCurrencyData,
            ...currentCurrencyData,
          ]);

          //  setData([...updatedCurrencyData,...currentCurrencyData]);
          setCurrencyData([...updatedCurrencyData, ...currentCurrencyData]);
        } else {
          setSelectedData(selectDataArray);
        }
      } else {
        if (row?.original.currency === 'AUD') {
          setServiceFeeAmount1(0);
          setServiceFeeAmount2(0);
        } else if (row?.original.currency === 'AED') {
          console.log('AED');
          setServiceFeeAmount(0);
          setServiceFeeAmount2(0);
        } else if (row?.original.currency === 'INR') {
          console.log('INR');
          setServiceFeeAmount(0);
          setServiceFeeAmount1(0);
        }
        el.data.map((s, i) => {
          el.data[i]['checkedAmt'] = false;
        });
        console.log(el.data, 'el');
        // setData(newData);
      }
      setData(newData);
    });
  };
  const getPayselectedAmt = (props) => {
    // console.log('props?.selectedData', props?.selectedData);
    const params = userDetails;
    let noteValues = [];
    var value;
    selectedData.map((item, inde) => {
      console.log('item', item);
      value=item
      noteValues.push({
        fee: value.Fee_Amount__c,
        amount: value.Fee_Amount__c,
        Contact__c: params.ContactId,
        Fee_Type__c: value.Fee_Type_Name__c,
        K42_Planned_Payment__c: item.Id,
        Late_Fees__c: item.lateFee || 0,
        Amount__c: item.Planned_Amount_Payable__c,
      });
    });
    console.log('noteValues', value);

    // fee payment using flywire
    const indexOfFirst = params.Name.indexOf(' ');
    console.log('props console',props)
    let payload = {
      amount: value.Fee_Amount__c,
      paisa: '00',
      paymentReferenceId: null,
      acceptPartial: true,
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      // callBackUrl: `http://localhost:3000/thankyou`,
      currencyCode: value.currency,
      description: '',
      paidFor: 'demandNote',
      concessionAmount: 0,
      // orgId: config.orgID,
      // registrationNo: regID,
      programPlan: studentClass,
      notes: noteValues,
      studentId: params.ContactId,
    };
    console.log('payload', payload);
      if (value.currency == 'INR') {
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
    } else{
      postFeePaymentUsingFlywire(payload)
      .then(res => {
        console.log('[postFeePaymentUsingFlywire] response: ', res);
        window.open(res?.data?.url, '_self');
        setTimeout(() => {
          setLoading(false);
        }, 120000);
        // setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        handleSnackbarOpen('warning', 'Something Went Wrong.');
      });
    }
  };

  //console.log('ajith', data);

  return (
    <div className={classes.root}>
      {isMobileScreen ? (
        <>
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
                  {el.data.length > 0 ? (
                    <Accordion style={{ boxShadow: 'none' }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>
                          <b>Student Service Fees {el.currency} </b>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container justifyContent="center">
                          <Grid item xs={12}>
                            <div className="KenDivFeeSchedule">
                              <div className={classes.tableborder}>
                                <KenGrid
                                  columns={columns}
                                  data={el.data}
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
                                        padding: '20px 35px',
                                      },
                                    }),
                                    getCellProps: cell => ({
                                      style: {
                                        border: 'none',
                                        padding: '15px 20px',
                                      },
                                    }),
                                  }}
                                />
                                <Grid container className={classes.btnbottom}>
                                  <Grid xs={7}>
                                    <Grid container justifyContent="flex-end">
                                      <Grid>
                                        <Typography className={classes.Typo1}>
                                          <b>SELECTED&nbsp;TOTAL</b>
                                        </Typography>
                                      </Grid>
                                      <Grid>
                                        {el.data[index]?.currency === 'AUD' ? (
                                          <Typography
                                            className={classes.typenum2}
                                          >
                                            &nbsp;&nbsp;{serviceFeeAmount}
                                          </Typography>
                                        ) : null}
                                        {el.data[index]?.currency === 'AED' ? (
                                          <Typography
                                            className={classes.typenum2}
                                          >
                                            &nbsp;&nbsp;{serviceFeeAmount1}
                                          </Typography>
                                        ) : null}
                                        {el.data[index]?.currency === 'INR' ? (
                                          <Typography
                                            className={classes.typenum2}
                                          >
                                            &nbsp;&nbsp;{serviceFeeAmount2}
                                          </Typography>
                                        ) : null}
                                      </Grid>
                                    </Grid>
                                    <Grid container justifyContent="flex-end">
                                      <KenButton
                                        variant="contained"
                                        onClick={() => getPayselectedAmt()} // needs re-work
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
                                    xs={2}
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
                                      <KenButton variant="contained" onClick={() => getPayselectedAmt()}>
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
        </>
      ) : (
        <>
          <Accordion style={{ boxShadow: 'none' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontSize: '14px' }}>
                <b>Student Service Fees in INR</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <KenCard>
                <Grid spacing={10}>
                  <Grid container>
                    <Grid xs={6}>
                      <KenCheckbox />
                    </Grid>
                    <Grid xs={6} container justifyContent="flex-end">
                      <KenButton variant="contained">
                        <Typography
                          style={{
                            fontFamily: 'sans-serif',
                            textTransform: 'none',
                            fontSize: '12px',
                          }}
                        >
                          Pay Now
                        </Typography>
                      </KenButton>
                    </Grid>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Fee Type</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      Re-Evaluation Fee
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Currency</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>INR</Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Fee Amount</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>1000</Typography>
                  </Grid>
                  <Grid container style={{ marginTop: '20px' }}>
                    <Grid xs={6} style={{ marginTop: '10px' }}>
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
                    <Grid container justifyContent="flex-end" xs={1}>
                      <Divider
                        orientation="vertical"
                        flexItem
                        style={{ height: '60px', marginTop: '5px' }}
                      />
                    </Grid>
                    <Grid
                      xs={5}
                      container
                      justifyContent="flex-end"
                      style={{ marginTop: '10px' }}
                    >
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
