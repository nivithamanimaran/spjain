import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
import FeePaymentTable from './PaymentTable';
import { element } from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  // heading: {
  //   fontSize: theme.typography.pxToRem(15),
  // },
  root1: {
    width: '100%',
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
  heading: {
    fontFamily: 'Open Sans',
    fontSize: '16px',
    color: '#00218D',
    fontWeight: 600,
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
  amtTD: {
    // textAlign: 'center',
    color: '#00218D',
    fontSize: 15,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
    fontWeight: 600,
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

export default function FeePayment() {
  const classes = useStyles();
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [currencyData, setCurrencyData]=useState([]);
  const [selectedData, setSelectedData] = useState([]);
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
  const [gradeData, setGradeData] = useState(data);
  const [openDrawerBreakdown, setOpenDrawerBreakdown] = React.useState(false);
  const [openSubDrawerBreakdown, setOpenSubDrawerBreakdown] = React.useState(
    false
  );
  const [ServiceTotalFeeAmount, setServiceTotalFeeAmount] = useState(0);
  const [serviceAllFeeAmt, setServiceAllFeeAmt] = useState(0);
  const [serviceFeeAmount, setServiceFeeAmount] = useState(0);
  const [gridErrors, setGridErrors] = useState([]);
  const [inputError, setInputError] = useState({
    error: false,
    errorMessage: '',
  });
  const [tIndex, setTIndex] = useState();
  const [columns, setColumns] = useState();
  const {
    state: { userDetails },
  } = useAppContext();

  const CommonCell = row => {
    return (
      <>
        <Typography style={{ fontSize: '13px' }}>{row.value}</Typography>
      </>
    );
  };
  const [checkColor, setCheckColor] = useState();

  const selectRowColor = () =>{
    setCheckColor(id)
  };

  const FeePaymentColumn = [
    {
      Header: '',
      accessor: 'checkedAmt',
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KenCheckbox
              name={`checkedAmt`}
              className={classes.checkbox}
              value={value}
              onChange={event => selectedCheckBoxPay(event, row, data)}
              color="primary"
            />
          </div>
        );
      },
      disableGlobalFilter: true,
      Footer: <p className={classes.amtTD}>Selected Total</p> ,
    },
    {
      Header: 'Fee Type',
      accessor: 'Fee_Type__c',
      disableGlobalFilter: true,
      Cell: CommonCell,
      Footer: <p className={classes.amtTD}>{serviceFeeAmount}</p>,
    },
    {
      Header: 'Currency',
      accessor: 'currency',
      disableGlobalFilter: true,
      Cell: CommonCell,
      Footer: '',
    },
    {
      Header: 'Due Amount',
      accessor: 'Planned_Amount_Payable__c',
      disableGlobalFilter: true,
      Cell: CommonCell,
      Footer: '',
    },
    {
      Header: 'Partial Payment',
      accessor: 'checked',
      Footer: '',
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <KenCheckbox
              name={`checkbox`}
              className={classes.checkbox}
              value={value}
              disabled={value === false ? false : true}
              // disabled={
              //   data[index] ? false : true
              // }
              onChange={event => selectedCheckBoxItem(event, row, data)}
              color="primary"
            />
            {/* <KenCheckbox
              name={`checkbox`}
              // className={classes.checkbox}
              value={value}
              // disabled={data[row.index]["IsMan__c"]}
              // onChange={(event) => selectedCheckBoxItem(event, row, data)}
              color="primary"
            /> */}
          </div>
        );
      },
      disableGlobalFilter: true,
      Footer: <p className={classes.amtTD}>Total</p>,
    },
    {
      Header: 'Amount Being Paid ',
      accessor: 'Remaining_Amount__c',
      disableGlobalFilter: true,
      Footer: info => {
        // Only calculate Total_Fee_Amount_Formula__c if rows change
        const total = React.useMemo(
          () =>
            info?.rows?.reduce(
              (sum, row) => +row?.values?.Remaining_Amount__c + sum,
              0
            ),
          [info?.rows]
        );

        return (
          <Typography className={`${classes.footer} ${classes.amtTD}`}>
            {total || '0'}
          </Typography>
        );
      },
    },
  ];

  useEffect(() => {
    amountRef?.current?.focus?.();
  }, [amountRef]);

  //Group similar currency type objects in a single array
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
    getFeeScheduleByContact(params)
      .then(res => {
        
        setLoading(true);
        if (res.success) {
          //combine all PlannedPay in a single Array
          const arr = res['Data '].map(item => {
            return {
              ...item.PlannedPay,
              LateFeeData: item.LateFeeData,
              FeeInv: item.FeeInv,
              currency: item?.PlannedPay?.Currency_of_Payment__c,
              checked: item?.FeeInv?.['Partial_Payment_Allowed__c'],
            };
          });

          //Put "--" if there is no currency in an object so that further execution won't be disturbed
          const dataArray = arr.map(item => {
            if (!item.hasOwnProperty('Currency_of_Payment__c')) {
              return {
                ...item,
                Currency_of_Payment__c: 'Unknown Currency',
                currency: '--',
              };
            }
            return item;
          });

          //Group similar currency data together
          const groupedByCurrency = groupBy(
            dataArray,
            'Currency_of_Payment__c'
          );

          const finalArr = [];
          for (const key in groupedByCurrency) {
            const sum = groupedByCurrency[key].reduce(
              //sum of similar currency amounts
              (previousValue, currentValue) =>
                previousValue + currentValue.Remaining_Amount__c,
              0
            );

            // console.log(`${key}`);

            finalArr.push({
              [key]: groupedByCurrency[key],
              totalAmount: sum,
              currency: key,
              data: groupedByCurrency[key],
            });
          }

          console.log(`finalArr`, finalArr);
          setData(finalArr);
          setLoading(false);
          console.log("ajith->",finalArr)

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

  //   useEffect(() => {
  //     console.log('data is checking', data);
  //   }, [data]);

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

  useEffect(()=>{
    console.log('selectedData3', selectedData);

  },[selectedData])

  useEffect(()=>{
    console.log('currencyData', currencyData);
  }),[currencyData]

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
    console.log("row",row);
    console.log("data222",data);
    console.log("event.target.checkedw",event.target.checked);
    let selectDataArray = [...selectedData];
    const newData = [...data];
    console.log('newData',newData);
    newData.map(el => {
      if (el.currency === row?.original.currency) {
        if (event.target.checked) {
          let feePay =
            serviceFeeAmount + el.data[row.index].Remaining_Amount__c;
            selectDataArray.push({ ...el.data[row.index] });
          setSelectedIndex(row.index);
          setServiceFeeAmount(feePay);
          setServiceTotalFeeAmount(feePay);
          setServiceAllFeeAmt(Math.round(feePay));
        } else {
          let feePaytwo =
            serviceFeeAmount - el.data[row.index].Remaining_Amount__c;
            console.log("selectDataArray",selectDataArray);
            const selectedItems =selectDataArray.filter(elem=> elem.Id !== row?.original?.Id)
            
            selectDataArray = selectedItems; 
            
          setSelectedIndex(row.index);
          setServiceFeeAmount(feePaytwo);
          setServiceTotalFeeAmount(feePaytwo);
        }
        el.data[row.index]['checkedAmt'] = event.target.checked;
        setData(newData);
        
        if(event.target.checked){
            const dataArray = [...selectDataArray]
           const updatedDataArray= dataArray.filter(elem=> elem.currency === row?.values?.currency);
           setSelectedData(updatedDataArray);

           const rawData = [...data]
           const otherCurrencyData = rawData.filter(elem=> elem.currency != row?.values?.currency)
           const currentCurrencyData = rawData.filter(elem=> elem.currency === row?.values?.currency)
            
           const updatedCurrencyData = otherCurrencyData.map(elem=>{
            const updatedDataObject =  elem?.data?.map(item=> {
                return(
                  {
                   ...item,
                   checkedAmt: false
                  }
                )
              })
              return{
                ...elem,
                data: updatedDataObject
    
              }
           }) 
           console.log("updatedCurrencyData",[...updatedCurrencyData,...currentCurrencyData]);

          //  setData([...updatedCurrencyData,...currentCurrencyData]);
          setCurrencyData([...updatedCurrencyData,...currentCurrencyData]);
           

        }else{
          setSelectedData(selectDataArray);
        }
        
        
       
      }
      // else{

      // }
    });

  };


  console.log("ajith",data);

  return (
    <div>
      {/* {loading && <KenLoader />} */}
      <div className={classes.tableComponent}>
        <KenSnackBar
          message={snackbarMessage}
          severity={snackbarSeverity}
          autoHideDuration={5000}
          open={openSnackbar}
          handleSnackbarClose={handleSnackbarClose}
          position="Bottom-Right"
        />
        <KenCard paperStyles={{ padding: 16 }}>
          {data &&
            data.map((el, index) => {
              return (
                <>
                  <div className={classes.root1}>
                    <Accordion 
                      style={{
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>
                          Pending Fees in {el.currency}{' '}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        style={{
                          display: 'block',
                        }}
                      >
                        <FeePaymentTable
                          columns={FeePaymentColumn}
                          originalTableData={el.data}
                          amountToBePaid={el.totalAmount}
                          selectedData={selectedData}
                          selectedTotalPay={ServiceTotalFeeAmount}
                          dataIndex={index}
                          feeCurrency={el.currency}
                          {...el}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </>
              );
            })}
        </KenCard>
      </div>
    </div>
  );
}