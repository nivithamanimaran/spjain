import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  TextField,
  useMediaQuery,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react';
import KenButton from '../../../global_components/KenButton';
import KenCard from '../../../global_components/KenCard';
import KenCheckbox from '../../../global_components/KenCheckbox';
import KenGrid from '../../../global_components/KenGrid';
import KenInputField from '../../../global_components/KenInputField';
import KenSelect from '../../../global_components/KenSelect';
import {
  getActiveFeeByContact,
  postManualPayment,
} from '../../../utils/ApiService';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import './style.scss';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import converter from "currency-exchanger-js"

const useStyles = makeStyles(theme => ({
  tableComponent: {
    boxShadow: 'none',
  },

  header: {
    fontSize: 15,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
    padding: '0px',
  },


  resp: {
    [theme.breakpoints.down('md')]: {
      '&>div>div>div': {
        overflowX: 'auto',
      },
    },
  },
}));

export default function ManualPaymentPage({ setLoading, setValue }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [data, setData] = useState([]);
  const [gindex, setGindex] = useState(0);
  const [column, setColumn] = useState(FeePaymentColumn);
  const { enqueueSnackbar } = useSnackbar();
  const [todata, setTodata] = useState("USD")

  const initialValues = {
    StudentName: '',
    TransactionType: '',
    ModeOfPayment: '',
    PaymentDate: getCurrentDate(),
    TransactionId: '',
    bankName: '',
    branchName: '',
    chequeNumber: '',
    paymentReferenceId: '',
    demandDraftId: '',
    PaymentAmount: '',
    Remarks: '',
    currency: 'USD',
    file: '',
    fileDetails: '',
  };

  const [manualPymentData, setManualPymentData] = useState(initialValues);
  const [currencyconverted, setCurrencyconverted] = useState(0);
  const [validationErrorsMgs, setValidationErrorsMgs] = useState();
  const [currencyconversion, setCurrencyconversion] = useState([])
  const [triger, setTriger] = useState(false)
  const {
    state: { userDetails },
  } = useAppContext();
  const currencyTypesOptions = [
    {
      value: 'AUD',
      label: 'AUD',
    },
    {
      value: 'AED',
      label: 'AED',
    },
    {
      value: 'EUR',
      label: 'EUR',
    },
    {
      value: 'INR',
      label: 'INR',
    },
    {
      value: 'USD',
      label: 'USD',
    },
    {
      value: 'GBP',
      label: 'GBP',
    },
    {
      value: 'SGD',
      label: 'SGD',
    },
  ];



  const paymentModeOptions = [

    {
      label: 'Swift',
      value: 'Swift',
    },

    {
      label: 'UPI',
      value: 'UPI',
    },

    {
      label: 'Net Banking',
      value: 'NetBanking',
    },
  ];
  const { date, ref } = Yup;

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const validationSchema = Yup.object().shape({
    ModeOfPayment: Yup.string().required('Mode of Payment is required'),
    PaymentDate: Yup.date().required('Payment Date is required').test('not-in-future', 'Payment should not be in the future', (value) => {
      if (!value) return true;
      const currentDate = new Date();
      return value < currentDate;
    }),
    currency: Yup.string().required('Currency is required'),
    PaymentAmount: Yup.number()
      .typeError('Please select payment amount from fees list')
      .required('Payment Amount is required')
      .positive('Please select payment amount from fees list'),
    Remarks: Yup.string().required('Remarks is required'),
    upload: Yup.mixed()
    .required('Proof of Transaction is required'),
  });

  const isFileTypeAllowed = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    return allowedTypes.includes(file.type);
  };
  
  const FileToBase64 = data => {
    var baseArr = [];
    const file = new FileReader();
    file.readAsDataURL(data);
    file.onloadend = function () {
      baseArr.push(file.result);
    };
    return baseArr;
  };


  const onSubmit = () => {
    setLoading(true);
    validationSchema
      .validate(manualPymentData, { abortEarly: false })
      .then(() => {
        const student = userDetails;
        let paymentDataCopy = [];
        data.forEach(el => {
          el.termData.forEach(elem => {
            if (elem.feeChecked === true) {
              paymentDataCopy.push({
                currencyIsoCode: elem?.currencyOfPayment,
                feeTypeName: elem?.feeType,
                Id: elem?.instalmentRecordId,
                installmentNo: elem?.instalmentNumber,
                lateFee: 0,
                payingCurrency: manualPymentData?.currency,
                plannedAmountPayable: elem?.amountBeingPaid,
                studentId: student?.ContactId,
                studentName: student?.Name,
                term: el?.title,
                totalAmount: elem?.amountBeingPaid,
              });
            }
          });
        });
        const paymentDetails = {
          selectedTransactionType: 'Collection',
          selectedModOfPay: manualPymentData.ModeOfPayment,
          paymentDate: manualPymentData.PaymentDate,
        };
        const attachments = [
          {
            title: manualPymentData.fileDetails.name,
            fileName: manualPymentData.fileDetails.name,
            body: manualPymentData.upload[0].split(',')[1],
            fileType: manualPymentData.fileDetails.type,
            status: 'Pending Review',
          },
        ];
        const payload = {
          paymentData: paymentDataCopy,
          paymentDetails: paymentDetails,
          attachments: attachments,
        };
        postManualPayment(payload)
          .then(res => {
            enqueueSnackbar('The data has been send successfully', {
              variant: 'success',
            });
            setValue(3)
          })
          .catch(err => {
            console.error(err);
            enqueueSnackbar('Something went wrong', {
              variant: 'error',
            });
            setLoading(false);
          });
      })
      .catch(errors => {
        // Form data is invalid, handle errors
        const validationErrors = {};
        errors.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        // Set validation errors in state or display them as needed
        setValidationErrorsMgs(validationErrors)
        setLoading(false);
      });
  };


  const handleChange = async e => {
    setTriger(false)
    const { name, value } = e.target;
    setManualPymentData({ ...manualPymentData, [name]: value });
    setGindex(name);
    if (name === 'currency') {
      setTodata(value);
      let totalAmountdata = await convertCurrency(currencyconverted, todata, value)
      setCurrencyconverted(totalAmountdata)

    }
    // Validate the field
    validationSchema
      .validateAt(name, { [name]: value })
      .then(() => {
        // Field is valid, clear any previous validation error for this field
        setValidationErrorsMgs(prevErrors => ({
          ...prevErrors,
          [name]: undefined,
        }));

      })
      .catch(error => {
        // Field is invalid, set the validation error message
        setValidationErrorsMgs(prevErrors => ({
          ...prevErrors,
          [name]: error.message,
        }));
      });
  };
  // const [fromdata, setFromdata] = useState(manualPymentData.currency)
  const handleChangeFile = e => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) {
      return;
    }
    if (!isFileTypeAllowed(file)) {
      // Display an error message for invalid file type
      setValidationErrorsMgs((prevErrors) => ({
        ...prevErrors,
        [name]: 'Only PDF, JPG, PNG, JPEG is Allowed',
      }));
      return;
    }
    setManualPymentData({
      ...manualPymentData,
      [name]: FileToBase64(files[0]),
      fileDetails: files[0],
    });
    setGindex(name);

    // Validate the 'upload' field
    validationSchema
      .validateAt(name, { [name]: files[0] })
      .then(() => {
        // Field is valid, clear any previous validation error for this field
        setValidationErrorsMgs(prevErrors => ({
          ...prevErrors,
          [name]: undefined,
        }));
      })
      .catch(error => {
        // Field is invalid, set the validation error message
        setValidationErrorsMgs(prevErrors => ({
          ...prevErrors,
          [name]: error.message,
        }));
      });
  };

  useEffect(() => {
    let check = data.some(item => item.checked);
    if (
      check &&
      manualPymentData.ModeOfPayment &&
      manualPymentData.PaymentDate
    ) {
    } else {
    }
    setColumn(column);
  }, [manualPymentData]);


  const CommonCell = row => {
    return (
      <>
        <Typography
          style={{
            fontSize: '14px',
            paddingLeft:
              row.value === 'Not Reconciled' ||
                row.value === 'Reconciled' ||
                row.value === 'Submitted for Reconciliation'
                ? '0px'
                : '15px',
            textAlign:
              row.value === 'Not Reconciled' ||
                row.value === 'Reconciled' ||
                row.value === 'Submitted for Reconciliation'
                ? 'center'
                : '',
            width:
              row.value === 'Not Reconciled' ||
                row.value === 'Reconciled' ||
                row.value === 'Submitted for Reconciliation'
                ? '150px'
                : '100px',
            backgroundColor:
              row.value === 'Not Reconciled'
                ? '#F6CECA'
                : row.value === 'Reconciled'
                  ? '#D0EED2'
                  : row.value === 'Submitted for Reconciliation'
                    ? '#FFFBEB'
                    : '',
            lineHeight:
              row.value === 'Not Reconciled' || row.value === 'Reconciled'
                ? '35px'
                : '',
            borderRadius:
              row.value === 'Not Reconciled' || row.value === 'Reconciled'
                ? '4px'
                : '',
          }}
        >
          {row.value}
        </Typography>
      </>
    );
  };

  const handleInputChange = (event, row, data) => {
    const dataCopy = [...data];
    const manualPayCopy = { ...manualPymentData };
    let element = dataCopy.find(el => el?.title === row?.original?.termName);
    element.termData[row.index][event.target.name] = event.target.value;
    let selectedAmount = 0;
    element.termData.forEach(el => {
      if (el.feeChecked) {
        selectedAmount = Number(el.amountBeingPaid) + Number(selectedAmount);
      }
    });
    manualPayCopy.PaymentAmount = Number(selectedAmount).toFixed(2);
    setManualPymentData(manualPayCopy);
    setGindex(row.index);
    setData([...dataCopy]);
  };

  const selectedCheckBoxItem = async (event, row, data) => {
    const dataCopy = [...data];
    const manualPayCopy = { ...manualPymentData };
    let element = dataCopy.find(el => el?.title === row?.original?.termName);
    element.termData[row.index][event.target.name] = event.target.checked;
    let selectedAmount = Number(manualPayCopy.PaymentAmount);
    if (element.termData[row.index]['feeChecked'] === true) {
      setTriger(false)
      let totalAmountdata = await convertCurrency(element.termData[row.index]['amountBeingPaid'], element.termData[row.index].currencyOfPayment, todata)

      selectedAmount =
        Number(totalAmountdata) +
        Number(currencyconverted);
      let startconvertion = element.termData[row.index]['currencyOfPayment']
      console.log(startconvertion, "currencyconversion");
      setCurrencyconversion(startconvertion)
      setCurrencyconverted(selectedAmount)
    } else if (
      element.termData[row.index]['feeChecked'] === false &&
      selectedAmount > 0
    ) {
      setTriger(false)
      const totalAmountcc = await convertCurrency(element.termData[row.index]['amountBeingPaid'], element.termData[row.index].currencyOfPayment, todata)
      console.log(totalAmountcc);
      selectedAmount =
        Number(currencyconverted) -
        Number(totalAmountcc);
    }
    let selectedAmountdata=selectedAmount<0?0:selectedAmount
    manualPayCopy.PaymentAmount = Number(selectedAmount);
    setManualPymentData(manualPayCopy);
    setData([...dataCopy]);
    setCurrencyconverted(selectedAmountdata)


  };
  function roundToDecimal(value, decimalPlaces) {
    const multiplier = 10 ** decimalPlaces;
    return Math.round(value * multiplier) / multiplier;
  }
  
  const convertCurrency = async (amount, fromCurrenct, toCurrency) => {
    try {

      const result = await converter.convertOnDate(Number(amount), fromCurrenct, toCurrency, new Date());
      const roundedResult = roundToDecimal(parseFloat(result),2)
      return roundedResult
    } catch (error) {
      console.error('Currency conversion error:', error);
    }

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
      Header: (
        <Typography className={classes.header}>
          Amount Being paid
          {/* ({manualPymentData?.currency}) */}
        </Typography>
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
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    const params = userDetails.ContactId;
    getActiveFeeByContact(params)
      .then(res => {
        if (res.success) {
          let termName = Object.keys(res?.data)
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
          setData(data);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);



  useEffect(() => {
    const convertCurrencydata = async () => {
      try {
        if (triger === true) {
          const result = await converter.convertOnDate(
            Number(manualPymentData.PaymentAmount),
            currencyconversion,
            todata,
            new Date()
          );

          setCurrencyconverted(roundToDecimal(parseFloat(result),2));
        }
      } catch (error) {
        console.error('Currency conversion error:', error);
      }
    };

    convertCurrencydata();
  }, [manualPymentData.PaymentAmount, currencyconversion, todata, triger]);


  return (
    <>
      <div className={classes.tableComponent}>
        <>
          <KenCard>
            <Grid container justifyContent="flex-end">
              <KenButton
                style={{ marginRight: '15px' }}
                variant="contained"
                onClick={() => onSubmit()}
              >
                <Typography
                  style={{
                    fontFamily: 'sans-serif',
                    textTransform: 'none',
                    fontSize: '14px',
                  }}
                >
                  Submit for Reconciliation
                </Typography>
              </KenButton>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#7A7A7B',
                    marginTop: '10px',
                  }}
                >
                  <b>MODE OF PAYMENTS <a style={{color:"red"}}>*</a></b>
                </label>
                <KenSelect
                  required={true}
                  type="ModeOfPayment"
                  name="ModeOfPayment"
                  id="ModeOfPayment"
                  value={manualPymentData.ModeOfPayment}
                  options={paymentModeOptions}
                  onChange={handleChange}
                  optionalLabel={false}
                />
                {validationErrorsMgs && validationErrorsMgs.ModeOfPayment ? (
                  <div style={{ color: "red" }}>{validationErrorsMgs.ModeOfPayment}</div>
                ) : null}
              </Grid>
              <Grid item xs={12} md={4} style={{ display: 'grid' }}>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#7A7A7B',
                    marginTop: '10px',
                  }}
                >
                  <b> PAYMENT DATE <a style={{color:"red"}}>*</a></b>
                </label>
                <TextField
                  id="PaymentDate"
                  name="PaymentDate"
                  type="date"
                  variant="outlined"
                  onChange={handleChange}
                  autoFocus={gindex === 'PaymentDate' ? true : false}
                  value={manualPymentData.PaymentDate}
                  className={classes.textField}
                  InputLabelProps={{
                    borderColor: '#ced4da',
                  }}
                  size={'small'}
                />
                {validationErrorsMgs && validationErrorsMgs.PaymentDate ? (
                  <div style={{ color: "red" }}>{validationErrorsMgs.PaymentDate}</div>
                ) : null}
              </Grid>
              <Grid item xs={12} md={4} style={{ display: 'grid' }}>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#7A7A7B',
                    marginTop: '10px',
                  }}
                >
                  <b>Currency <a style={{color:"red"}}>*</a></b>
                </label>
                <KenSelect
                  required={true}
                  type="currency"
                  name="currency"
                  id="currency"
                  value={manualPymentData.currency ? manualPymentData.currency : "USD"}
                  optionalLabel={false}
                  options={currencyTypesOptions}
                  onChange={handleChange}
                />
                {validationErrorsMgs && validationErrorsMgs.currency ? (
                  <div style={{ color: "red" }}>{validationErrorsMgs.currency}</div>
                ) : null}
              </Grid>
              <Grid item xs={12} md={4}>
                <div>
                  <label
                    style={{
                      fontSize: '11px',
                      color: '#7A7A7B',
                    }}
                  >
                    <b>AMOUNT <a style={{color:"red"}}>*</a></b>
                  </label>
                  <div className="manual-payment-module">
                    <KenInputField
                      name="PaymentAmount"
                      id="PaymentAmount"
                      autoFocus={gindex === 'PaymentAmount' ? true : false}
                      value={roundToDecimal(currencyconverted, 2)}
                      size={'medium'}
                      optionalLabel={false}
                      required={true}
                      disabled={true}
                    />
                    {currencyconverted === 0 && validationErrorsMgs && validationErrorsMgs.PaymentAmount ? (
                      <div style={{ color: "red" }}>{validationErrorsMgs.PaymentAmount}</div>
                    ) : null}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#7A7A7B',
                  }}
                >
                  <b>REMARK <a style={{color:"red"}}>*</a></b>
                </label>

                <div className="manual-payment-module">
                  <KenInputField
                    type="Remarks"
                    name="Remarks"
                    id="Remarks"
                    value={manualPymentData.Remarks}
                    size={'medium'}
                    autoFocus={gindex === 'Remarks' ? true : false}
                    optionalLabel={false}
                    required={true}
                    onChange={handleChange}
                  />
                  {validationErrorsMgs && validationErrorsMgs.Remarks ? (
                    <div style={{ color: "red" }}>{validationErrorsMgs.Remarks}</div>
                  ) : null}
                </div>
              </Grid>
              <Grid item xs={12} md={4}>
                <label
                  style={{
                    fontSize: '11px',
                    color: '#7A7A7B',
                  }}
                >
                  <b>Proof of Transaction <a style={{color:"red"}}>*</a></b>
                </label>

                <div className="manual-payment-module">
                  <KenInputField
                    type="file"
                    name="upload"
                    id="upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    value={manualPymentData.Upload}
                    size={'medium'}
                    optionalLabel={false}
                    required={true}
                    onChange={handleChangeFile}
                  />
                  {validationErrorsMgs && validationErrorsMgs.upload ? (
                    <div style={{ color: "red" }}>{validationErrorsMgs.upload}</div>
                  ) : null}
                </div>
              </Grid>
            </Grid>
            {data &&
              data.map((el, index) => {

                return (
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: isMobileScreen ? '10px' : ' 0px',
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
                              <div
                                className={`KenDivFeeSchedule ${classes.resp}`}
                              >
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
          </KenCard>
        </>

      </div>
    </>
  );
}
