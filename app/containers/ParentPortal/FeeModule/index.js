import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FeePaymentTable from './feePaymentData.json';
import KenCheckbox from '../../../global_components/KenCheckbox';
// import FeeTransactionTableData from './feeTransactionData.json';
import './style.scss';
import KenCard from '../../../global_components/KenCard';
import KenButton from '../../../global_components/KenButton';
import { getFeeScheduleByContact } from '../../../utils/ApiService';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import MyCartTable from '../FeeModule/MyCart';
import StudentServiceFeeTable from '../FeeModule/StudentServiceFeePayment';
// import FeeScheduleTable from './FeeSchedule';
import FeeScheduleTable from './FeeScheduleOne';
// import FeeTransactionTable from './FeeTransactions';
import PaymentPage from '../FeeModule/PaymentPage';
import KenLoader from '../../../components/KenLoader';
import FeeCard from './FeeCard';
import moment from 'moment';
// import ManualPaymentForm from './ManualFeePayment';
import ManualPaymentPage from './ManualPayment';

import Checkbox from '@material-ui/core/Checkbox';
import KenInputField from '../../../global_components/KenInputField';
import { GridOff } from '@material-ui/icons';
import FeeTransaction from './FeeTransaction';
import OfferLetter from './OfferLetter';
import { shadows } from '@material-ui/system';
import { useMediaQuery } from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0} style={{ boxShadow: '0px 5px 10px 0px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },

  tabs1: {
    fontSize: '13px',
    // minWidth: '0px',
    // padding: '0px 0px 0px 0px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    // margin: '0px',
  },
  tabs2: {
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },

  tabPadding: {
    // background: "#ffffff",
    // boxShadow: "0px 0px 9px #d6e0ff",
    margin: '0px',
    padding: '0px',
  },
}));

const columns = [
  {
    Header: 'Program',
    accessor: 'Program',
    disableGlobalFilter: true,
  },
  {
    Header: 'Subject',
    accessor: 'Subject',
    disableGlobalFilter: true,
  },
  {
    Header: 'Subject Code',
    accessor: 'SubjectCode',
    disableGlobalFilter: true,
  },
  {
    Header: 'Feedback',
    accessor: 'Feedback',
    //   Cell:ActionCell,
    Cell: ({ row }) => {
      return (
        <div>
          <KenButton
            // className={classes.btnLabels}
            onClick={() => {
              handleForm(row?.values?.Feedback);
            }}
            //   value={cell?.accessor}
            variant="primary"
            style={{
              height: '25px',
              marginRight: '10px',
              borderRadius: '25px',
              fontSize: '12px',
              width: '120px',
              background: `${
                row?.values?.Feedback !== 'Pending' ? '#27AE60' : '#F2994A'
              }`,
            }}
            label={row?.values?.Feedback}
          />
        </div>
      );
    },
    disableGlobalFilter: true,
  },
];
const arrayBreadCrumb = [
  {
    head: 'My Feedback',
  },
];
const studentDta = [
  {
    checked: false,
    Fee_Type_c: 'xyxx',
    Currency: 'njnjn',
    Remaining_Amountc: 'dddjdj',
    Fee_Collection_Starts_onc: '',
    Fee_Collection_End_Date_c: '',
  },
  {
    checked: false,
    Fee_Type_c: 'xyxx',
    Currency: 'njnjn',
    Remaining_Amountc: 'dddjdj',
    Fee_Collection_Starts_onc: 'SELECTED TOTAL:95',
    Fee_Collection_End_Date_c: 'TOTAL:125',
  },
];
export default function CenteredGrid(props) {
  props.setHeading("Fees")
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [loading, setLoading] = useState();
  const [feePaymentData, setFeePaymentData] = React.useState(FeePaymentTable);
  const [data, setData] = React.useState([]);
  const [dueDate, setDueDate] = React.useState([]);
  const [feeCardDueDate, setFeeCardDueDate] = React.useState();

  const [expanded, setExpanded] = React.useState(false);
  const [checked, setChecked] = useState(false);
  const [datas, setDatas] = useState(studentDta);
  const {
    state: { userDetails },
  } = useAppContext();
  
  const initialValue = sessionStorage.getItem("value") || 1;
  const [value, setValue] = React.useState(parseInt(initialValue)); 

  const handleChange = (event, newValue) => {
    sessionStorage.setItem("value", newValue);
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

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
        setLoading(false);
        try {
          if (res.success === 'true' || res.success === true) {
            //combine all PlannedPay in a single Array
            const arr = res['Data '].map(item => {
              return {
                ...item.PlannedPay,
                LateFeeData: item.LateFeeData,
                FeeInv: item.FeeInv,
                currency: item?.PlannedPay?.Currency_of_Payment__c,
                checked: item?.FeeInv?.['Partial_Payment_Allowed__c'],
                Remaining_Amount_c: item.PlannedPay.Remaining_Amount_c,
                Fee_Collection_Starts_on__c: item?.PlannedPay
                  ?.K42_Payment_Sch_Suppliment_r?.Fee_Collection_Starts_on_c
                  ? moment(
                      item?.PlannedPay?.K42_Payment_Sch_Suppliment__r
                        ?.Fee_Collection_Starts_on__c
                    ).format('L')
                  : null,
                Fee_Collection_End_Date__c: item?.PlannedPay
                  ?.K42_Payment_Sch_Suppliment_r?.Fee_Collection_Ends_on_c
                  ? moment(
                      item?.PlannedPay?.K42_Payment_Sch_Suppliment__r
                        ?.Fee_Collection_Ends_on__c
                    ).format('L')
                  : null,
                Late_Fee_Starts_on__c: item?.PlannedPay
                  ?.K42_Payment_Sch_Suppliment_r?.Late_Fee_Starts_on_c
                  ? moment(
                      item?.PlannedPay?.K42_Payment_Sch_Suppliment__r
                        ?.Late_Fee_Starts_on__c
                    ).format('L')
                  : null,
              };
            });

            let dueDateArray = [];
            arr.map(val => {
              dueDateArray.push({
                feeDueDate:
                  val?.K42_Payment_Sch_Suppliment_r?.Fee_Collection_Ends_on_c,
              });
              console.log(dueDateArray);
              setDueDate(dueDateArray);

              dueDateArray.sort();
              setFeeCardDueDate(dueDateArray[0]?.feeDueDate);
              console.log('sorted dueDate::', dueDateArray);
            });

            //Put "--" if there is no currency in an object so that further execution won't be disturbed
            const dataArray = arr.map(item => {
              if (!item.hasOwnProperty('Currency_of_Payment__c')) {
                return {
                  ...item,
                  Currency_of_Payment__c: 'NA',
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
            console.log('dataArray', dataArray);

            const finalArr = [];
            for (const key in groupedByCurrency) {
              const totalPendingAmount = groupedByCurrency[key].reduce(
                //sum of all remaining amounts
                (previousValue, currentValue) =>
                  previousValue + currentValue.Remaining_Amount__c,
                0
              );

              const totalAmount = groupedByCurrency[key].reduce(
                //sum of similar currency amounts
                (previousValue, currentValue) =>
                  previousValue + currentValue.Total_Fee_Amount_Formula__c,
                0
              );

              // console.log(`${key}`);

              finalArr.push({
                [key]: groupedByCurrency[key],
                totalPendingAmount: totalPendingAmount,
                totalAmount: totalAmount,
                currency: key,
                data: groupedByCurrency[key],
              });
            }

            console.log(`finalArr in module`, finalArr);
            setData(finalArr);
            setLoading(false);
          }
        } catch (error) {
          console.log('error', error);
        }
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);
  const FeeSchedulecolumn = [
    {
      Header: '',
      accessor: 'checked',
      Cell: ({ value, row }) => {
        console.log(value, row);
        return (
          <KenCheckbox
            name={`checkbox`}
            className={classes.checkbox}
            value={value}
            onChange={event => selectedCheckBoxItem(event, row, data)}
            color="primary"
          />
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Fee Type',
      accessor: 'Fee_Type__c',
      disableGlobalFilter: true,
    },
    {
      Header: 'Currency',
      accessor: 'Currency',
      disableGlobalFilter: true,
    },
    {
      Header: 'Due Amount',
      accessor: 'Remaining_Amount__c',
      disableGlobalFilter: true,
    },
    {
      Header: 'Partial Fee',
      accessor: 'Fee_Collection_Starts_on__c',
      Cell: ({ value, row }) => {
        console.log(value, row);
        return (
          <>
            <Checkbox
              defaultChecked
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            <Typography>SELECTED TOTAL:95</Typography>
            <Button
              variant="contained"
              style={{ backgroundColor: '#193389', color: '#FFFFFF' }}
            >
              Pay Seleted
            </Button>
          </>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Amount Being Paid ',
      accessor: 'Fee_Collection_End_Date__c',
      Cell: ({ value, row }) => {
        return (
          <>
            <KenInputField style={{ width: '175px', height: '37px' }} />
            <Typography>TOTAL:125</Typography>
            <Button
              variant="contained"
              style={{ backgroundColor: '#193389', color: '#FFFFFF' }}
            >
              Pay All
            </Button>
          </>
        );
      },
    },
  ];
  const selectedCheckBoxItem = (event, row, data) => {
    console.log(event, row, data);
    setDatas(current =>
      current.map((obj, i) => {
        if (i === row.index) {
          return { ...obj, checked: event.target.checked };
        }

        return obj;
      })
    );
  };

  return (
    <div className={classes.root}>
      {/* {isMobileScreen ? ( */}
      <>
        {loading && <KenLoader />}
        {/* <Grid container >
          {data?.length > 0 &&
            data?.map(item => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <FeeCard
                    primaryText={`${item.currency}, ${item.totalPendingAmount}`}
                    subText={`Total Pending Fees`}
                  />
                </Grid>
              );
            })}


        </Grid> */}

        <div>
          <div
            style={{
              backgroundColor: 'white',
              padding: '28px',
              height: '90px',
              borderRadius: '10px',
            }}
          >
            <Grid container>
              {data?.length > 0 &&
                data?.map(item => {
                  return (
                    <Grid xs={3} lg={3} md={3} sm={3}>
                      <div style={{ fontSize: '11px', fontWeight: '600' }}>
                        TOTAL PENDING FEES
                      </div>
                      <br />
                      <div style={{ fontSize: '16px', fontWeight: '500' }}>
                        <b>
                          {item.currency}, {item.totalPendingAmount}
                        </b>
                      </div>
                    </Grid>
                  );
                })}
              <Grid xs={12} lg={3} md={3} sm={3}>
                <div style={{ fontSize: '11px', fontWeight: '600' }}>
                  NEXT INSTALLMENT DUE
                </div>
                <br />
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  <b>YYYY-MM-DD</b>
                </div>
              </Grid>
            </Grid>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Grid item md={12}>
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  height: '60px',
                }}
              >
                <Tabs
                  // spacing={0}
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  style={{ width: '100%' }}
                >
                  <Tab
                    // md={2}
                    label="Fee Plan"
                    {...a11yProps(0)}
                    className={classes.tabs1}
                    style={{ maxWidth: '130px' }}
                  />
                  <Tab
                    // md={2}
                    label="Fee Payment"
                    {...a11yProps(1)}
                    className={classes.tabs1}
                    style={{ maxWidth: '130px' }}
                  />

                  <Tab
                    // md={2}
                    label="Fee Schedule"
                    {...a11yProps(2)}
                    className={classes.tabs1}
                    style={{ maxWidth: '130px' }}
                  />
                  <Tab
                    // md={3}
                    label="Transactions"
                    {...a11yProps(3)}
                    className={classes.tabs1}
                    style={{ maxWidth: '130px' }}
                  />
                  {/* <Tab
                      // md={2}
                      label="Student Service Fee"
                      {...a11yProps(4)}
                      className={classes.tabs1}
                    /> */}
                  <Tab
                    // md={3}
                    label="Manual Fee Payment"
                    {...a11yProps(4)}
                    className={classes.tabs1}
                  />
                  {/* <Tab
                      md={3}
                      label="Offer Letter Fee Details"
                      {...a11yProps(6)}
                      className={classes.tabs1}
                    /> */}
                </Tabs>
              </div>
            </Grid>
          </div>

          <div style={{ marginTop: '20px' }}>
            <SwipeableViews
              className={classes.tabPadding}
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <MyCartTable setLoading={setLoading} />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <PaymentPage setLoading={setLoading} />
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <FeeScheduleTable
                  pendingCurrency={data}
                  setLoading={setLoading}
                />
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                {/* <FeeTransactionTable/>  */}
                <FeeTransaction setLoading={setLoading} />
              </TabPanel>
              <TabPanel value={value} index={4} dir={theme.direction}>
                <ManualPaymentPage setLoading={setLoading} setValue={setValue}/>
              </TabPanel>
              <TabPanel value={value} index={5} dir={theme.direction}>
                <StudentServiceFeeTable setLoading={setLoading} />
              </TabPanel>
              <TabPanel value={value} index={6} dir={theme.direction}>
                <OfferLetter setLoading={setLoading} />
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
      </>
    </div>
  );
}
