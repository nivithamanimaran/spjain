import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import KenGrid from '../../../global_components/KenGrid';
import FeeCartTable from './feeCartData.json';
import KenCheckbox from '../../../global_components/KenCheckbox';
import './style.scss';
import KenCard from '../../../global_components/KenCard';
import KenButton from '../../../global_components/KenButton';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import {
  getFeeInventoryByContact,
  getFeeScheduleByContact,
  getStudentDetailsByContact,
  postFeePaymentUsingFlywire,
} from '../../../utils/ApiService';
import KenSelect from '../../../global_components/KenSelect';
import KenSnackBar from '../../../components/KenSnackbar';
import KenLoader from '../../../components/KenLoader';
import KenInputField from '../../../global_components/KenInputField';
import KenTableInputField from '../../../global_components/KenTableInputField';
import { Header } from './Common/Header';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  root1: {
    width: '95%',
    marginTop: '30px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  cardText: {
    fontSize: '30px',
    textAlign: 'initial',
    fontWeight: '400',
    fontFamily: 'Open Sans',
    //  paddingBottom:'27px',
  },
  tableComponent: {
    marginBottom: 10,
  },
  amtTable: {
    width: '100%',
    height: 50,
  },
  amtTD: {
    // textAlign: 'center',
    color: '#00218D',
    fontSize: 15,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  heading: {
    fontSize: '18px',
    fontWeight: 400,
  },
  tabs: {
    width: '95%',
    marginTop: '30px',
    // boxShadow:'none',
    backgroundColor: 'white',
  },
  boxTable: {
    width: '100%',
    padding: 20,
    border: '0.6px solid #D7DEE9',
  },
  studentsInfo: {
    // fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '19.5px',
    display: 'flex',
    alignItems: 'center',
    // letterSpacing: '0.44px',
    color: '#505F79',
    margin: '20px',
  },
  value: {
    'font-family': 'Open Sans',
    'font-style': 'normal',
    'font-weight': '400',
    'font-size': '12px',
    'line-height': '16px',
    'text-align': 'center',
    color: '#7A869A',
  },
  listContainer: {
    background: '#E7ECFF',
    borderRadius: '3px',
    minHeight: 141,
    margin: '16px auto',
    padding: 8,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  title: {
    'font-family': 'Open Sans',
    'font-style': 'normal',
    'font-weight': '600',
    'font-size': '14px',
    'line-height': '19px',
    color: '#505F79',
  },
  label: {
    'font-family': 'Open Sans',
    'font-style': 'normal',
    'font-weight': '600',
    'font-size': '12px',
    'line-height': '16px',
    'text-align': 'center',
    color: '#7A869A',
    marginBottom: '8px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  studentInfoTitle: {
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '19.5px',
    display: 'flex',
    alignItems: 'center',
    // letterSpacing: '0.44px',
    color: '#092682',
    margin: '20px',
  },
  textContent: {
    color: '#092682',
    fontSize: '12px',
  },
  textContentSpan: {
    // color: '#0077FF',
    fontSize: '12px',
  },
  inputFields: {
    // fontSize: 12,
    // padding:'8px',
    // margin:'10px',
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

export default function FeePaymentTable(props) {
  const {
    originalTableData = [],
    columns,
    amountToBePaid,
    dataIndex,
    selectedTotalPay,
    selectedData,
    feeCurrency,
    selectedAmtPayment,
    gridProps,
  } = props;
  console.log('props', props);
  // console.log('props', props?.selectedData?.Remaining_Amount__c);
  const classes = useStyles();
  // const theme = useTheme();
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [regID, setRegID] = useState();
  const [admissionYear, setAdmissionYear] = useState();
  const [studentCategory, setStudentCategory] = useState();
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
  const [gradeData, setGradeData] = useState(originalTableData);
  // const [selectPay, setSelectPay] = useState(props?.selectedTotalPay);
  // const [selectPayCurrency, setSelectPayCurrency] = useState(props?.selectedData?.Currency_of_Payment__c);
  // const [selectIndex, setSelectIndex] = useState(selectedData?.Remaining_Amount__c);
  const [openDrawerBreakdown, setOpenDrawerBreakdown] = React.useState(false);
  const [finalAmountToPay, setFinalAmountToPay] = React.useState(
    amountToBePaid
  );
  
  const [openSubDrawerBreakdown, setOpenSubDrawerBreakdown] = React.useState(
    false
  );
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
        <Typography>{row.value}</Typography>
      </>
    );
  };

  //   const FeePaymentcolumn = [
  //     {
  //       Header: 'Fee Type',
  //       accessor: 'Fee_Type__c',
  //       disableGlobalFilter: true,
  //       Cell:CommonCell,
  //     },
  //     {
  //       Header: 'Currency',
  //       accessor: 'currency',
  //       disableGlobalFilter: true,
  //       Cell:CommonCell,
  //     },
  //     {
  //       Header: 'Due Amount',
  //       accessor: 'Planned_Amount_Payable__c',
  //       disableGlobalFilter: true,
  //       Cell:CommonCell,
  //     },
  //     {
  //       Header: 'Partial Fee',
  //       accessor: 'checked',
  //       Cell: ({ value, row }) => {
  //         return (
  //           <div
  //             style={{
  //               display: 'flex',
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //             }}
  //           >
  //             <KenCheckbox
  //               name={`checkbox`}
  //               className={classes.checkbox}
  //               value={value}
  //               disabled={value === false ? false : true}
  //               // disabled={
  //               //   data[index] ? false : true
  //               // }
  //               onChange={event => selectedCheckBoxItem(event, row, data)}
  //               color="primary"
  //             />
  //             {/* <KenCheckbox
  //               name={`checkbox`}
  //               // className={classes.checkbox}
  //               value={value}
  //               // disabled={data[row.index]["IsMan__c"]}
  //               // onChange={(event) => selectedCheckBoxItem(event, row, data)}
  //               color="primary"
  //             /> */}
  //           </div>
  //         );
  //       },
  //       disableGlobalFilter: true,
  //     },
  //     {
  //       Header: 'Amount Being Paid ',
  //       accessor: 'Total_Fee_Amount_Formula__c',
  //       // Cell: ({ value, row }) => {
  //       //   console.log('value :: ', value);
  //       //   console.log('row?.index :: ', row);

  //       //   return (
  //       //     <div style={{ width: 128, backgroundColor: '#F4F5F7' }}>

  //       //       {/* <KenInputField
  //       //       optionalLabel={false}
  //       //        value={value}
  //       //        onChange={event => changeAmount(event, row, data)}
  //       //        inputProps={{ height: '10px',  }}
  //       //        disabled={row?.values?.checked === false ? true : false}
  //       //        name={`name${row?.index}`}
  //       //        autoFocus={true}
  //       //        /> */}
  //       //       <TextField
  //       //         // style={{padding:'8px 5px'}}
  //       //         variant="outlined"
  //       //         size="small"
  //       //         inputProps={{ height: '10px' }}
  //       //         //   placeholder="Input Amount"
  //       //         // name={`data[${row.index}]['Total_Fee_Amount_Formula__c']`}
  //       //         name={autoFocus}
  //       //         // value={`${data[row.index]['Total_Fee_Amount_Formula__c']}`}
  //       //         value={value}
  //       //         disabled={row?.values?.checked === false ? true : false}
  //       //         className={classes.inputFields}
  //       //         // autoFocus={row?.index === selectedIndex}
  //       //         onChange={event => changeAmount(event, row, data)}
  //       //         onBlur={event => onAmountBlur(event)}
  //       //       />
  //       //     </div>
  //       //   );
  //       // },
  //       disableGlobalFilter: true,
  //     },
  //   ];

  useEffect(() => {
    amountRef?.current?.focus?.();
  }, [amountRef]);

  useEffect(() => {
    setLoading(true);
    const params = userDetails.ContactId;
    getFeeScheduleByContact(params)
      .then(res => {
        setLoading(false);
        if (res.success) {
          let mainData = [];
          let tableData = [];
          let apiResponse = res?.['Data '];
          apiResponse.map(elem => {
            if (
              mainData.some(
                el => el.currency === elem?.PlannedPay?.Currency_of_Payment__c
              )
            ) {
              let index = mainData.findIndex(
                el => el.currency === elem?.PlannedPay?.Currency_of_Payment__c
              );
              let tAmount = 0;
              mainData[index].data.forEach(el => {
                tAmount = tAmount + Number(el.Total_Fee_Amount_Formula__c);
              });
              mainData[index].totalAmount = tAmount;
              mainData[index].data.push({
                ...elem?.PlannedPay,
                currency: elem?.PlannedPay?.Currency_of_Payment__c,
                checked: elem?.FeeInv?.['Partial_Payment_Allowed__c'],
                Fee_Type__c: elem?.PlannedPay?.Fee_Type__c,
                lateFee:
                  elem?.LateFeeData?.LateFeeAmount === null
                    ? 0
                    : elem?.LateFeeData?.LateFeeAmount,
                planId: elem?.PlannedPay ? elem?.PlannedPay?.Id : null,
                Total_Fee_Amount_Formula__c:
                  elem?.PlannedPay?.Total_Fee_Amount_Formula__c,
                Planned_Amount_Payable__c:
                  elem?.PlannedPay?.Planned_Amount_Payable__c,
                Planned_Amount_Payable__c:
                  elem?.PlannedPay?.Planned_Amount_Payable__c,
              });
            } else {
              mainData.push({
                currency: elem?.PlannedPay?.Currency_of_Payment__c,
                data: [
                  {
                    ...elem?.PlannedPay,
                    currency: elem?.PlannedPay?.Currency_of_Payment__c,
                    checked: elem?.FeeInv?.['Partial_Payment_Allowed__c'],
                    Fee_Type__c: elem?.PlannedPay?.Fee_Type__c,
                    lateFee:
                      elem?.LateFeeData?.LateFeeAmount === null
                        ? 0
                        : elem?.LateFeeData?.LateFeeAmount,
                    planId: elem?.PlannedPay ? elem?.PlannedPay?.Id : null,
                    Total_Fee_Amount_Formula__c:
                      elem?.PlannedPay?.Total_Fee_Amount_Formula__c,
                    Planned_Amount_Payable__c:
                      elem?.PlannedPay?.Planned_Amount_Payable__c,
                    Planned_Amount_Payable__c:
                      elem?.PlannedPay?.Planned_Amount_Payable__c,
                  },
                ],
              });
              console.log('mainData', mainData);
              setData(mainData);
            }
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
        }
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
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

  const getPayselectedAmt = () => {
    // console.log('props?.selectedData', props?.selectedData);
    const params = userDetails;

    let noteValues = [];

    props?.selectedData.map((item, inde) => {
      console.log('item', item);
      noteValues.push({
        fee: item['Fee_Type__c'],
        amount: item.Total_Fee_Amount_Formula__c,
        Contact__c: params.ContactId,
        Fee_Type__c: item['Fee_Type__c'],
        K42_Planned_Payment__c: item.Id,
        Late_Fees__c: item.lateFee || 0,
        Amount__c: item.Planned_Amount_Payable__c,
      });
    });
    console.log('noteValues', noteValues);

    // fee payment using flywire
    const indexOfFirst = params.Name.indexOf(' ');

    let payload = {
      amount: props?.selectedTotalPay || 0,
      paisa: '00',
      paymentReferenceId: null,
      acceptPartial: true,
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      // callBackUrl: `http://localhost:3000/thankyou`,
      currencyCode: props?.feeCurrency,
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
  };

  const payNow = (val, index, currency) => {
    
    setLoading(true);
    console.log('val', val);
    // const userDetails = getUserDetails();
    const params = userDetails;
    console.log(params);
    let noteValues = [];
    // let selecteAmount =[];

    const tData = index >= 0 ? data.filter((el, ind) => ind === index) : data;
    tData[0].data.map((item, inde) => {
      console.log('item', item);
      noteValues.push({
        fee: item['Fee_Type__c'],
        amount: item.Total_Fee_Amount_Formula__c,
        Contact__c: params.ContactId,
        Fee_Type__c: item['Fee_Type__c'],
        K42_Planned_Payment__c: item.planId,
        Late_Fees__c: item.lateFee || 0,
        Amount__c: item.Planned_Amount_Payable__c,
      });
      // selecteAmount.push(item.Planned_Amount_Payable__c);

      // else{noteValues.push(false)}
    });
    console.log('noteValues', noteValues);

    // fee payment using flywire
    const indexOfFirst = params.Name.indexOf(' ');

    let payload = {
      amount: val,
      paisa: '00',
      paymentReferenceId: null,
      acceptPartial: true,
      firstName: params?.Name?.substring(0, indexOfFirst)?.trim(),
      lastName: params?.Name?.substring(indexOfFirst)?.trim(),
      mobile: params.Phone,
      email: params.mail,
      callBackUrl: 'sp-jain-stage-portal.ken42.com/thankyou',
      // callBackUrl: `http://localhost:3000/thankyou`,
      currencyCode: currency,
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
  };

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const changeAmount = (event, row) => {
    let val = event.target.value;
    let tAmount = 0;

    if (!isNaN(val)) {
      if (Number(val) >= initialAmt) {
        const newData = [...originalTableData];
        newData.map(el => {
          if (el.currency === row?.original.currency) {
            el.data[row.index]['Total_Fee_Amount_Formula__c'] = Number(val);
            console.log(
              "el.data[row.index]['Total_Fee_Amount_Formula__c']",
              el.data[row.index]['Total_Fee_Amount_Formula__c']
            );
            setAutoFocus(el.data[row.index]['Total_Fee_Amount_Formula__c']);
          }
        });

        let index = newData.findIndex(
          element => element.currency === row?.original.currency
        );

        console.log('INDEX', index);
        setSelectedIndex(index);

        newData[index].data.forEach(elem => {
          tAmount = tAmount + Number(elem.Total_Fee_Amount_Formula__c);
        });
        newData[index].totalAmount = tAmount;
        // setData(newData);
        setNewData(newData);
        // console.log('newData', newData);
        // console.log('checking DAta', tAmount);
      } else {
        handleSnackbarOpen('warning', 'Amount should be less than total fee.');
      }
    }
  };

  const onAmountBlur = (event, row, data) => {
    let val = event.target.value;
    let tAmount = 0;
    console.log('event ::', event);
    if (!isNaN(val)) {
      if (Number(val) >= initialAmt) {
        const newData = [...data];
        newData.map(el => {
          if (el.currency === row?.original.currency) {
            el.data[row.index]['Total_Fee_Amount_Formula__c'] = Number(val);
            console.log(
              "el.data[row.index]['Total_Fee_Amount_Formula__c']",
              el.data[row.index]['Total_Fee_Amount_Formula__c']
            );
            setAutoFocus(el.data[row.index]['Total_Fee_Amount_Formula__c']);
          }
        });

        let index = newData.findIndex(
          element => element.currency === row?.original.currency
        );

        console.log('INDEX', index);
        setSelectedIndex(index);

        newData[index].data.forEach(elem => {
          tAmount = tAmount + Number(elem.Total_Fee_Amount_Formula__c);
        });
        newData[index].totalAmount = tAmount;
        // setData(newData);
        setNewData(newData);
        // console.log('newData', newData);
        // console.log('checking DAta', tAmount);
      } else {
        handleSnackbarOpen('warning', 'Amount should be less than total fee.');
      }
    }
    setData(newData);
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

  const EditableCell = ({
    value: initialValue,
    row,
    column: { id },
    updateMyData,
    // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [errors, setErrors] = useState([]);
    const [value, setValue] = React.useState(initialValue);

    const onChange = e => {
      e.preventDefault();
      //   changeAmount(e, row);
      setValue(e.target.value);
      validateFields(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(row.index, id, value, errors);
    };

    const numRegex = /^\d+(\.\d{1,2})?$/;

    const validationChecks = (val, max) => {
      let allErrors = [...errors];
      let rowErrors;
      if (typeof val === undefined || val?.trim() === '') {
        rowErrors = { error: true, errorMessage: 'Required' };
      } else if (+val > max) {
        rowErrors = {
          error: true,
          errorMessage: `Max value should be less than ${max}`,
        };
      } else if (+val < 0) {
        rowErrors = {
          error: true,
          errorMessage: 'Negative values are not allowed',
        };
      } else if (!new RegExp(numRegex).test(val)) {
        rowErrors = {
          error: true,
          errorMessage: 'Value should be a number',
        };
      } else {
        rowErrors = {
          error: false,
          errorMessage: '',
          type: `${data[0]?.termName}`,
        };
      }
      allErrors[index] = rowErrors;
      setErrors(allErrors);
    };
    const validateFields = val => {
      switch (id) {
        case 'portfolio':
          validationChecks(val, 5);
          break;

        case 'exam':
          validationChecks(val, gradeData[0]?.writtenTestMaxMarks);
          break;

        case 'totalMarks':
          validationChecks(val, gradeData[0]?.maxMarks);
          break;

        default:
          break;
      }
    };
    return (
      // <Box className={classes.inputContainer}>
        <KenTableInputField
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={classes.input}
          errors={errors[row.index]?.error}
          touched={true}
          name={row.index}
          centerAligned={true}
        />
      // </Box>
    );
  };

  const defaultColumn = {
    Cell: EditableCell,
  };

  const updateMyData = (rowIndex, columnId, value, errors) => {
    // We also turn on the flag to not reset the page

    let allErrors = [...gridErrors];
    let rowErrors = errors[rowIndex];
    allErrors[rowIndex] = rowErrors;
    setGridErrors(allErrors);

    // We also turn on the flag to not reset the page
    const errorsArr = allErrors.filter(error => error?.error === true);

    setInputError({
      error: errorsArr.length > 0 ? true : false,
      errorMessage: errorsArr.length > 0 ? 'Invalid grades found.' : '',
      type: `${data[0]?.termName}`,
    });

    setGradeData(old =>
      old.map((row, index) => {
        // console.log('row in setgrade', row);
        console.log('row in olde', old[rowIndex][value]);
        // console.log('columnId',columnId);
        // console.log('VALUESS',value);
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };
  useEffect(() => {
    // console.log('data is Updated', gradeData);
    const dataForSum = gradeData;
    const finalData = dataForSum.reduce(function(sum, row) {
      return Number(sum) + Number(row.Total_Fee_Amount_Formula__c);
    }, 0);
    setFinalAmountToPay(finalData);
    console.log('finalData', finalData);
  }, [gradeData]);

  const theme = useTheme();
  const isTabletView = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <>
    {isTabletView ?(
    <>
    <Header
          // activePath={Routes.feesPayment}
          info={{
            regID,
            studentClass,
            studentCategory,
            admissionYear,
            totalFee,
            paidFee,
            totalAmount,
            studentName,
          }}
          showEdit={false}
          showSave={false}
        >
          <Box>
            <Box>
              {gradeData.map((item, index) => {
                return (
                  <Box className={classes.listContainer}>
                    <Box className={`${classes.row} ${classes.titleRow}`}>
                      <Box className={classes.title}>{item?.Fee_Type__c}</Box>
                    </Box>
                    <Box display={'flex'} justifyContent="space-between">
                      <Box className={classes.row}>
                        <Box
                          display={'flex'}
                          flexDirection="column"
                          alignItems={'flex-start'}
                        >
                          <Box className={classes.label}>Due Amount</Box>
                          <Box className={classes.value}>
                            ₹{item?.Planned_Amount_Payable__c}
                          </Box>
                        </Box>
                        <Box
                          display={'flex'}
                          flexDirection="column"
                          alignItems={'flex-start'}
                        >
                          <Box className={classes.label}>Late Fee</Box>
                          <Box className={classes.value}>₹ {item?.lateFee}</Box>
                        </Box>
                        <Box
                          display={'flex'}
                          flexDirection="column"
                          alignItems={'flex-start'}
                        >
                          <Box className={classes.label}>Amount Being Paid</Box>
                          <Box className={classes.value}>
                            {!item?.Partial_Payment_Allowed__c ? (
                              <KenInputField
                                onChange={e =>
                                  changeAmount(event, { ...item, index })
                                }
                                optionalLabel= {false}
                                value={item?.Total_Fee_Amount_Formula__c}
                              />
                            ) : (
                              <Box component={'span'}>
                                ₹{item?.Total_Fee_Amount_Formula__c}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <div style={{ textAlign: 'center' }}>
              <KenButton
                variant="primary"
                buttonClass={classes.payNow}
                onClick={() =>
                  payNow(finalAmountToPay, dataIndex, feeCurrency)
                }
              >
                Pay Now
              </KenButton>
            </div>
            {/* <Box className={classes.footerTotalAmount}>
              <Box>TOTAL AMOUNT</Box>
              <Box>{amtToPay}</Box>
            </Box> */}
          </Box>
        </Header>
    </>):(<div className={classes.tableComponent}>
        <KenSnackBar
          message={snackbarMessage}
          severity={snackbarSeverity}
          autoHideDuration={5000}
          open={openSnackbar}
          handleSnackbarClose={handleSnackbarClose}
          position="Bottom-Right"
        />
        {/* <KenCard paperStyles={{ padding: 16 }}> */}
        {/* {data &&
            data.map((el, index) => { */}
        {/* return ( */}
        <div className="KenDiv">
          <KenGrid
            columns={columns}
            // data={el.data}
            data={gradeData}
            pagination={{ disabled: true }}
            tableTotal={{ disabled: true, checkbox: true }}
            getRowProps={{ selected: true }}
            toolbarDisabled={true}
            gridProps={{
              footerRows: [1],
              footerStyles: { backgroundColor: 'white' },
              footerCellStyles: { borderBottom: 'none' },
              updateMyData: updateMyData,
              defaultColumn: defaultColumn,
            }}
            getColumnProps={column => ({
              onClick: () => alert('Column!'),
            })}
          />

          <Grid item xs={12} sm={6}>
            <Box />
          </Grid>
          <Grid item xs={12}>
            {/* <Box
              display="flex"
              justifyContent="space-between"
              marginRight="160px"
              marginLeft="620px"
              marginTop="15px"
            >
              <div>
                <Typography className={classes.amtTD}>TOTAL</Typography>
              </div>
              <div>
                <Typography className={classes.amtTD}>
                  {finalAmountToPay}
                </Typography>
              </div>
            </Box> */}
            <div>
              <div>
                <Box
                  justifyContent="space-between"
                  marginBottom="15px"
                  display="flex"
                >
                  <div style={{ paddingLeft: '29px' }}>
                    <KenButton
                      variant="contained"
                      onClick={() => getPayselectedAmt()}
                      // disabled={props?.selectedData?.checked ? false : true}
                    >
                      <Typography
                        style={{
                          fontFamily: 'sans-serif',
                          textTransform: 'none',
                        }}
                      >
                        Pay Selected
                      </Typography>
                    </KenButton>
                  </div>
                  <div style={{ paddingRight: '70px' }}>
                    <KenButton
                      variant="contained"
                      onClick={() =>
                        payNow(finalAmountToPay, dataIndex, feeCurrency)
                      }
                    >
                      <Typography
                        style={{
                          fontFamily: 'sans-serif',
                          textTransform: 'none',
                        }}
                      >
                        Pay All
                      </Typography>
                    </KenButton>
                  </div>
                </Box>
              </div>
            </div>
          </Grid>
        </div>
        {/* );
            })} */}

        {/* <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              marginRight="160px"
              marginLeft="620px"
              marginTop="15px"
            >
              <div>
                <Typography className={classes.amtTD}>TOTAL</Typography>
              </div>
              <div>
                <Typography className={classes.amtTD}>{amtToPay}</Typography>
              </div>
            </Box>
            <Box textAlign="end" marginTop="15px">
              <KenButton variant="contained" onClick={payNow}>
                <Typography
                  style={{
                    fontFamily: 'sans-serif',
                    textTransform: 'none',
                  }}
                >
                  Pay Now
                </Typography>
              </KenButton>
            </Box>
          </Grid>  */}
        {/* </KenCard> */}
      </div>)}
      {/* {loading && <KenLoader />} */}
      
    </>
  );
}
