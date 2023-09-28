import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KenCheckbox from '../../../global_components/KenCheckbox';
import './style.scss';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import {
  getFeeScheduleByContact,
  getStudentDetailsByContact,
  getFeePaymentByContact,
} from '../../../utils/ApiService';
import CollapsibleTable from './FeescheduleOneTable';

import FeescheduleOneTable from './FeescheduleOneTable';
import { useMediaQuery } from '@material-ui/core';

import KenCard from '../../../global_components/KenCard';
import { Grid } from '@material-ui/core';
import KenButton from '../../../global_components/KenButton';
import { useHistory } from 'react-router-dom';
import KenGrid from '../../../global_components/KenGrid';
import KenLoader from '../../../components/KenLoader';

const useStyles = makeStyles(theme => ({
  amtTD: {
    // textAlign: 'center',
    color: '#00218D',
    fontSize: 15,
    fontFamily: 'Open Sans',
    textTransform: 'uppercase',
    fontWeight: 600,
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
  tableborder: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
    // width: '100%'
    [theme.breakpoints.down('md')]: {
      '&>div>div>div>table': {
        width: '130%',
      },
      '&>div>div>div': {
        overflowX: 'auto',
      },
      '&>div>div>div>table>thead>tr>th': {
        textAlign: 'start',
      },
    },
  },
  tableborderResp: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
    [theme.breakpoints.down('md')]: {
      '&>div>div': {
        overflowX: 'auto',
      },
    },
  },
  collapsestyles: {
    paddingBottom: '10px',
  },
  // header1: {
  //   fontSize: 15,
  //   fontWeight: 600,
  //   color: '#092682',
  //   textDecoration: 'none',
  //   // border: 'solid 1px',
  //   padding: '0px',
  //   // width: '150px'
  // },

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

export default function FeePayment({ setLoading }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  // const [loading, setLoading] = useState();
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
  const [tableView, setTableView] = useState(false);

  const {
    state: { userDetails },
  } = useAppContext();

  const history = useHistory();
  const handleClick = () => {
    setTableView(true);
  };

  const CommonCell = row => {
    return (
      <>
        <Typography
          style={{
            fontSize: '14px',
            paddingLeft: '15px',
            width: '100px',
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
            width: '130px',
          }}
        >
          {row.value}
        </Typography>
      </>
    );
  };
  const datas = [
    {
      FeeType: '2022 BBA Jan Term 5 Course Material Fee',
      Currency: 'AUD',
      FeesAmount: '625',
      PaidAmount: '0',
      Remainingamount: '625',
      NextInstDate: '28-12-2022',
    },
  ];

  const FeeSchedulecolumn = [
    {
      Header: () => <Typography style={{ width: '2px' }} />,
      accessor: 'chec',
      disableGlobalFilter: true,
    },

    {
      Header: () => (
        <Typography className={classes.header} style={{ width: '75px' }}>
          Fee Type
        </Typography>
      ),
      accessor: 'feeType',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: () => (
        <Typography className={classes.header} style={{ width: '70px' }}>
          Currency
        </Typography>
      ),
      accessor: 'currencyOfPayment',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: () => (
        <Typography className={classes.header} style={{ width: '96px' }}>
          Fees Amount
        </Typography>
      ),
      accessor: 'amount',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: () => (
        <Typography className={classes.header} style={{ width: '94px' }}>
          Paid Amount
        </Typography>
      ),
      accessor: 'receivedAmount',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: () => (
        <Typography
          className={classes.header}
          style={{ width: '138px', textAlign: 'left' }}
        >
          Remaining amount
        </Typography>
      ),
      accessor: 'remainingAmount',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    // {
    //   Header: () => (
    //     <Typography
    //       className={classes.header}
    //       style={{ width: '106px', textAlign: 'left' }}
    //     >
    //       Next Inst Date
    //     </Typography>
    //   ),
    //   accessor: 'Fee_Collection_Starts_Date',
    //   disableGlobalFilter: true,
    //   Cell: CommonCell,
    // },
    // {
    //   Header: () => (
    //     <Typography
    //       className={classes.header}
    //       style={{ width: '158px', textAlign: 'left' }}
    //     >
    //       Invoiced/not Invoiced
    //     </Typography>
    //   ),
    //   accessor: 'checked',
    //   disableGlobalFilter: true,
    //   Cell: ({ value, row }) => {
    //     return (
    //       <div
    //         style={{
    //           paddingLeft: '15px',
    //           // width: '150px'
    //         }}
    //       >
    //         <KenCheckbox
    //           name={`checkbox`}
    //           className={classes.checkbox}
    //           value={value}
    //           // disabled={data[row.index]['IsMan__c'] || disableTable}
    //           // onChange={eve => selectedCheckBoxItem(eve, row, data)}
    //           color="primary"
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    const params = userDetails.ContactId;
    setLoading(true);
    getFeeScheduleByContact(params)
      .then(res => {
        if (res.success) {
          let termName = Object.keys(res?.data);
          let termData = Object.values(res?.data);
          let data = [];
          termName?.forEach((el, index) => {
            data.push({ title: el, termData: termData[index] });
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

  const accordionColumn = [
    {
      Header: () => <Typography style={{ width: '2px' }} />,
      accessor: 'chec',
      disableGlobalFilter: true,
    },

    {
      Header: (
        <Typography
          className={classes.header}
          style={{ fontSize: '13px', width: '89px' }}
        >
          Installment
        </Typography>
      ),
      accessor: 'instalmentNumber',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography
          className={classes.header}
          style={{ fontSize: '13px', width: '61px' }}
        >
          Currency
        </Typography>
      ),
      accessor: 'currency',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography
          className={classes.header}
          style={{ fontSize: '13px', width: '55px' }}
        >
          Amount
        </Typography>
      ),
      accessor: 'amountPayable',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography className={classes.header} style={{ fontSize: '13px' }}>
          Paid Amount
        </Typography>
      ),
      accessor: 'receivedAmount',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography className={classes.header} style={{ fontSize: '13px' }}>
          Remaining Amount
        </Typography>
      ),
      accessor: 'remainingAmount',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography className={classes.header} style={{ fontSize: '13px' }}>
          Fee Collection Start Date
        </Typography>
      ),
      accessor: 'startDate',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography className={classes.header} style={{ fontSize: '13px' }}>
          Due Date
        </Typography>
      ),
      accessor: 'endDate',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography className={classes.header} style={{ fontSize: '13px' }}>
          Late Fee Start Date
        </Typography>
      ),
      accessor: 'lateFeeStartDate',
      disableGlobalFilter: true,
    },
  ];

  const CollapseData = props => {
    // console.log('ColllapsedData props', props);
    const [rows, setRows] = React.useState([]);
    const classes = useStyles();

    React.useEffect(() => {
      setRows(
        props?.original?.instalments?.map(el => {
          return {
            currency: props?.original?.currencyOfPayment,
            ...el,
          };
        })
      );
    }, [props]);

    return (
      <div className={classes.tableborder}>
        <div style={{ marginBottom: '20px' }}>
          <KenGrid
            columns={accordionColumn}
            data={rows}
            pagination={{ disabled: true }}
            tableTotal={{ disabled: true, checkbox: true }}
            getRowProps={{ selected: true }}
            toolbarDisabled={true}
            gridProps={{
              getHeaderProps: cell => ({
                style: {
                  background: '#F1F5FA',
                  border: 'none',
                  // width: '100%'
                  padding: '20px 15px',
                },
              }),
              getCellProps: cell => ({
                style: {
                  border: 'none',
                  padding: '20px 15px',
                },
              }),
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* {loading && <KenLoader />} */}
      <>
        <div
          style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '10px',
          }}
        >
          {data.length > 0 &&
            data.map(item => {
              return (
                <Accordion style={{ boxShadow: 'none' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography style={{ fontSize: '16px' }}>
                      <b>{item.title}</b>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* <FeescheduleOneTable /> */}

                    <Grid container justifyContent="center">
                      <Grid item xs={12}>
                        <div className={classes.tableborderResp}>
                          <KenGrid
                            columns={FeeSchedulecolumn}
                            data={item.termData}
                            pagination={{ disabled: true }}
                            toolbarDisabled={true}
                            isCollasable={true}
                            Collapseclass={classes.collapsestyles}
                            component={CollapseData}
                            gridProps={{
                              getRowProps: row => ({
                                isCollasable: true,
                              }),
                              getHeaderProps: cell => ({
                                style: {
                                  background: '#F1F5FA',
                                  padding: '20px 15px',
                                  border: 'none',
                                },
                              }),
                              getCellProps: cell => ({
                                style: {
                                  fontWeight: 400,
                                  fontSize: 14,
                                  color: '#222222',
                                  padding: ' 15px 0px',
                                  textAlign: 'left',
                                  border: 'none',
                                },
                              }),
                            }}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </div>
      </>
      {/* ) : (
        <>
          <Accordion style={{ boxShadow: 'none' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontSize: '14px' }}>
                <b>2022 BBA Com 1 Term 8</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {tableView ? (
                <CollapsibleTable />
              ) : (
                <KenCard>
                  <Grid>
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
                      <Typography className={classes.mobiledata}>
                        AUD
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography className={classes.mobilehead}>
                        <b>Fees Amount</b>
                      </Typography>
                      <Typography className={classes.mobiledata}>
                        625
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography className={classes.mobilehead}>
                        <b>Paid Amount</b>
                      </Typography>
                      <Typography className={classes.mobiledata}>0</Typography>
                    </Grid>
                    <Grid>
                      <Typography className={classes.mobilehead}>
                        <b>Remaining amount</b>
                      </Typography>
                      <Typography className={classes.mobiledata}>
                        625
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography className={classes.mobilehead}>
                        <b>Next Inst Date</b>
                      </Typography>
                      <Typography className={classes.mobiledata}>
                        26-12-2022
                      </Typography>
                    </Grid>
                    <Grid>
                      <Typography className={classes.mobilehead}>
                        <b>Invoiced/not Invoiced</b>
                      </Typography>
                      <KenCheckbox />
                    </Grid>
                    <Grid container justifyContent="flex-end">
                      <KenButton
                        variant="contained"
                        // onClick={event => downloadReceipt(event, row, data)}
                        onClick={handleClick}
                      >
                        <Typography
                          style={{
                            fontFamily: 'sans-serif',
                            textTransform: 'none',
                            fontSize: '12px',
                          }}
                        >
                          View Details
                        </Typography>
                      </KenButton>
                    </Grid>
                  </Grid>
                </KenCard>
              )}
            </AccordionDetails>
          </Accordion>
        </>
      )} */}
    </div>
  );
}
