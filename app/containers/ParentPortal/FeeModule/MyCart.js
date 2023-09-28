import React, { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import KenLoader from '../../../components/KenLoader';
import {
  getFeeInventoryByContact,
  postFeeInventoryByContact,
  getStudentDetailsByContact,
} from '../../../utils/ApiService';
import Typography from '@material-ui/core/Typography';
import KenCheckbox from '../../../global_components/KenCheckbox';
import KenButton from '../../../global_components/KenButton';
import { Grid, Box, Divider, Tab, MenuItem } from '@material-ui/core';
import KenInputField from '../../../global_components/KenInputField';
import KenSelect from '../../../global_components/KenSelect';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';
import { useMediaQuery } from '@material-ui/core';
// import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import KenAccordion from '../../../components/KenAccordion';
import KenDialog from '../../../global_components/KenDialog';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    border: 'none',
  },
  // heading: {
  //   fontSize: theme.typography.pxToRem(15),
  // },
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
    marginRight: '20px',
    marginBottom: '10px',
  },
  Typo2: {
    fontSize: '11px',
    marginRight: '20px',
    marginBottom: '9px',
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    color: '#00000',
    fontWeight: 500,
  },
  schedules: {
    fontSize: 14,
    textAlign: 'center',
    color: '#0B0080',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  resp: {
    [theme.breakpoints.down('md')]: {
      '&>div>div>table': {
        width: '365%',
      },
      '&>div>div': {
        overflowX: 'auto',
      },
      '&>div>div>table>thead>tr>th': {
        textAlign: 'start',
      },
    },
  },
  centerAlign: {
    textAlign: 'center',
  },

  /* For non-mobile screen alignment */
  leftAlign: {
    textAlign: 'left',
  },
}));

export default function SimpleAccordion({ setLoading }) {
  const classes = useStyles();
  const theme = useTheme();
  // const [loading, setLoading] = useState(false);
  const [regID, setRegID] = useState('-');
  const [studentName, setStudentName] = useState();
  const [studentClass, setStudentClass] = useState();
  const [data, setData] = useState([]);
  const [recallAPI, setRecallAPI] = useState(false);
  const [studentCategory, setStudentCategory] = useState('-');
  const [admissionYear, setAdmissionYear] = useState('-');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();
  const [disable, setdisable] = useState(false);
  const [enableEditBtn, setEnableEditBtn] = useState(false);
  const [openDialog, setOpenDialog] = useState();
  const [dialogData, setDialogData] = useState();

  useEffect(() => {
    setLoading(true);
    const userDetails = getUserDetails();
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
      setLoading(false);
    });
    getFeeInventoryByContact(params)
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
  }, [recallAPI]);

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const onSubmit = index => {
    setLoading(true);
    const userDetails = getUserDetails();
    const params = userDetails.ContactId;
    let payloadData = [];
    // let apiPass = [];
    const dataCopy = [...data];
    dataCopy[index]?.termData?.forEach(item => {
      // if (item['checked']) {
      // if (!item['IsPreviouslySelected']) {
      // apiPass.push(true);
      payloadData.push({
        feeAssignmentId: item.feeAssignmentId,
        scheduleId: item.selectedSchedule,
      });
      // }
      // }
    });
    // let payload = { payloadData };

    // let checker = (apiPass) => apiPass.every((check) => check === true);
    // if (checker(apiPass)) {
    postFeeInventoryByContact(params, payloadData)
      .then(res => {
        console.log(res);
        setdisable(false);
        setLoading(false);
        handleSnackbarOpen('success', res.message);
        setRecallAPI(!recallAPI);
        setEnableEditBtn(false);
      })
      .catch(err => {
        console.log('err');
        // handleSnackbarOpen('error', res.message);
        setLoading(false);
        setEnableEditBtn(false);
        setRecallAPI(!recallAPI);
      });
    // }
  };

  const handleCollectionFrequency = (value, row, data) => {
    const dataCopy = [...data];
    let element = dataCopy.find(el => el?.title === row?.original?.termName);
    element.termData[row.index].selectedSchedule = value;
    setData([...dataCopy]);
  };

  // const selectedCheckBoxItem = (event, row) => {
  //   // var amount = totalAmount.split('₹')[1].replace(/,/g, "");
  //   // amount = Number(amount);
  //   // if (!data[row.index]['IsMan__c']) {
  //   if (enableEditBtn) {
  //     const newData = [...data];
  //     newData[row.index]['checked'] = event.target.checked;
  //     setData(newData);
  //     console.log(event, row, data);
  //   }
  //   // }
  // };

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

  // const option = [
  //   {
  //     label: 'AUD',
  //     value: 'AUD',
  //   },
  //   {
  //     label: 'INR',
  //     value: 'INR',
  //   },
  // ];

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

  const columns = [
    {
      Header: <Typography className={classes.header}>Term</Typography>,
      accessor: 'termName',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Paticulars</Typography>,
      accessor: 'feeType',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Currency</Typography>,
      accessor: 'currencyOfPayment',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: (
        <Typography className={classes.header}>Total Fee Amount</Typography>
      ),
      accessor: 'amount',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: (
        <Typography className={classes.header}>
          Payment Schedule Plan
        </Typography>
      ),
      accessor: 'PaymentScheduleplan',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        const options = [];
        row?.original?.schedules.forEach(el => {
          options.push({
            label: el.scheduleName,
            value: el.scheduleId,
          });
        });
        return (
          <div
            style={{
              paddingLeft: '15px',
            }}
          >
            <KenSelect
              inputBaseRootClass={classes.inputBaseClass}
              options={options}
              type="option"
              id="option"
              name="option"
              value={row.original.selectedSchedule || ''}
              // disabled={disable ? false : true}
              variant="outline"
              // onChange={e=>{
              //   setselects(e.target.value)
              // }}
              onChange={event => {
                handleCollectionFrequency(event.target.value, row, data);
              }}
              optionalLabel={false}
            />
          </div>
        );
      },
    },
    {
      Header: (
        <Typography className={classes.header}>Schedule Plans</Typography>
      ),
      accessor: 'schedules',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography
            className={classes.schedules}
            onClick={() => {
              setOpenDialog(true);
              let data = [];
              row?.original?.schedules.forEach(el => {
                el?.instalments.map(elem => {
                  data.push({ ...elem, scheduleName: el.scheduleName });
                });
              });
              setDialogData(data);
            }}
          >
            View Plan
          </Typography>
        );
      },
    },
  ];

  console.log(dialogData);
  const columnsDialog = [
    {
      Header: (
        <Typography className={classes.header}>Installment Number</Typography>
      ),
      accessor: 'instalmentNumber',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Schedule Name</Typography>,
      accessor: 'scheduleName',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Start Date</Typography>,
      accessor: 'startDate',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>End Date</Typography>,
      accessor: 'endDate',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: (
        <Typography className={classes.header}>Late Fee Start Date</Typography>
      ),
      accessor: 'lateFeeStartDate',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Payable %</Typography>,
      accessor: 'percentage',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
  ];

  return (
    <div className={classes.root}>
      {isMobileScreen ? (
        <>
          {/* {loading && <KenLoader />} */}

          <div style={{ float: 'right' }}>
            {/* {disable ? (
              <>
                <KenButton
                  style={{ marginRight: '15px' }}
                  variant="contained"
                  // onClick={() => { setdisable(!disable) }}

                  // onClick={event => downloadReceipt(event, row, data)}
                  disabled={enableSave ? false : true}
                  onClick={() => {
                    onSubmit();
                    setEnableSave(false);
                  }}
                >
                  <Typography
                    style={{
                      fontFamily: 'sans-serif',
                      textTransform: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Save
                  </Typography>
                </KenButton>
                <KenButton
                  style={{ marginRight: '15px' }}
                  variant="contained"
                  onClick={() => {
                    setdisable(false);
                    setEnableSave(false);
                    setChangedData([]);
                    setRecallAPI(!recallAPI);
                    setEnableEditBtn(false);
                  }}

                  // onClick={event => downloadReceipt(event, row, data)}
                >
                  <Typography
                    style={{
                      fontFamily: 'sans-serif',
                      textTransform: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Cancel
                  </Typography>
                </KenButton>
              </>
            ) : (
              <>
                <KenButton
                  variant="contained"
                  onClick={() => {
                    setdisable(!disable);
                    setEnableEditBtn(true);
                  }}

                  // onClick={event => downloadReceipt(event, row, data)}
                >
                  <Typography
                    style={{
                      fontFamily: 'sans-serif',
                      textTransform: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Edit Fee Cart
                  </Typography>
                </KenButton>
              </>
            )} */}
          </div>
          {/* {data.length > 0 ? (
            <>
              {data?.map((el) => {
                return (
                  <>
                    <KenAccordion label={el.title}>
                      <Grid>
                        <div className="KenDivFeeSchedule">
                          <div>
                            <KenGrid
                              columns={columns}
                              data={data}
                              pagination={{ disabled: true }}
                              tableTotal={{ disabled: true, checkbox: true }}
                              getRowProps={{ selected: true }}
                              toolbarDisabled={true}
                              gridProps={{
                                getHeaderProps: (cell) => ({
                                  style: {
                                    background: '#F1F5FA',
                                    border: 'none',
                                    padding: '10px 30px',
                                  },
                                }),
                                getCellProps: (cell) => ({
                                  style: {
                                    fontWeight: 400,
                                    fontSize: 14,
                                    background: 'white',
                                  },
                                }),
                              }}
                            />
                          </div>
                        </div>
                      </Grid>
                    </KenAccordion>
                  </>
                );
              })}
            </>
          ) : null} */}
        </>
      ) : (
        <>
          {/* {loading && <KenLoader />} */}
          {/* {data.map((item, index) => {
            return (
              <KenCard>
                <Grid spacing={10}>
                  <Grid>
                    <KenCheckbox />
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Term</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      2022-BBA Com 1 Term 4
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Paticulars</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>
                      2022 BBA Jan Term 4 Course Material Fee
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Currency</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>AED</Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Total Fee Amount</b>
                    </Typography>
                    <Typography className={classes.mobiledata}>78.5</Typography>
                  </Grid>
                  <Grid>
                    <Typography className={classes.mobilehead}>
                      <b>Payment Schedule Plan</b>
                    </Typography>
                    <KenSelect
                      optionalLabel={false}
                      style={{ marginTop: '10px' }}
                    />
                  </Grid>
                </Grid>
              </KenCard>
            );
          })} */}
          {/* <Grid>
            <Grid
              container
              justifyContent="flex-end"
              style={{ marginTop: '20px' }}
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
                  Edit Fee Cart
                </Typography>
              </KenButton>
            </Grid>
          </Grid> */}
        </>
      )}

      {data &&
        data?.length > 0 &&
        data?.map((el, index) => {
          return (
            <Accordion style={{ boxShadow: 'none' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ fontSize: '16px' }}>
                  <b>{el.title}</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="KenDivFeeSchedule" style={{ width: '100%' }}>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-end"
                    style={{ marginBottom: 16 }}
                  >
                    <Grid item md={12}>
                      <KenButton
                        variant="primary"
                        onClick={() => {
                          onSubmit(index);
                        }}
                      >
                        Save
                      </KenButton>
                    </Grid>
                  </Grid>
                  <div className={classes.resp}>
                    <KenGrid
                      columns={columns}
                      data={el?.termData}
                      pagination={{ disabled: true }}
                      tableTotal={{ disabled: true, checkbox: true }}
                      getRowProps={{ selected: true }}
                      toolbarDisabled={true}
                      gridProps={{
                        getHeaderProps: cell => ({
                          style: {
                            background: '#F1F5FA',
                            border: 'none',
                            padding: '10px 30px',
                          },
                        }),
                        getCellProps: cell => ({
                          style: {
                            fontWeight: 400,
                            fontSize: 14,
                            background: 'white',
                          },
                        }),
                      }}
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
            // <KenAccordion
            //   label={
            //     <Typography className={classes.heading}>{el.title}</Typography>
            //   }
            // >

            // </KenAccordion>
          );
        })}
      <KenDialog
        open={openDialog}
        handleClose={() => {
          setOpenDialog(false);
        }}
        // handleClickOpen={handleClickOpen}
        // positiveButtonText={t('labels:Save')}
        // negativeButtonText={t('labels:Cancel')}
        negativeButtonClick={() => {
          setOpenDialog(false);
        }}
        // positiveButtonClick={onSaveClick}
        // positiveButtonProps={{
        //   onClick: onSaveClick,
        //   disabled: !profilePicture,
        // }}
        // negativeButtonProps={{
        //   disabled: !profilePicture,
        // }}
        title={
          <Typography style={{ fontSize: 18, fontWeight: 'bold' }}>
            View Plan
          </Typography>
        }
        maxWidth="lg"
      >
        <div className="KenDivFeeSchedule" style={{ width: '100%' }}>
          <div>
            <KenGrid
              columns={columnsDialog}
              data={dialogData}
              pagination={{ disabled: true }}
              tableTotal={{ disabled: true, checkbox: true }}
              getRowProps={{ selected: true }}
              toolbarDisabled={true}
              gridProps={{
                getHeaderProps: cell => ({
                  style: {
                    background: '#F1F5FA',
                    border: 'none',
                    padding: '10px 30px',
                  },
                }),
                getCellProps: cell => ({
                  className: isMobileScreen
                    ? classes.centerAlign
                    : classes.leftAlign,
                  style: {
                    fontWeight: 400,
                    fontSize: 14,
                    background: 'white',
                  },
                }),
              }}
            />
          </div>
        </div>
      </KenDialog>
    </div>
  );
}
