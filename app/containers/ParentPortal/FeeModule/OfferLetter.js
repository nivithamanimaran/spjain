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
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import KenGrid from '../../../global_components/KenGrid';
import KenLoader from '../../../components/KenLoader';
import {
    getFeePaymentByContact,
    getOfferLetterFeeByContact,
    getStudentDetailsByContact,
} from '../../../utils/ApiService';
import moment from 'moment';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import {
    useMediaQuery,
} from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        border: 'none'
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
        borderRadius: ' 4px 4px 0px 0px', fontSize: '14px', fontWeight: 'bold',

    },
    cell: {
        fontSize: '14px',
        border: 'none'
    },
    cell2: {
        fontSize: '16px',
        border: 'none',
        color: '#090F69'
    },
    tableborder: {
        border: 'solid 2px',
        borderRadius: '5px',
        borderColor: '#F1F5FA',
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
    footer:{
        textAlign:'left !important',
        color:'#090F69',
        fontSize:'16px', 
        fontWeight:600,
        paddingLeft:'15px'
      }

}));
function createData(currency, transaction, payment, particulars, paid, receipt, bill) {
    return { currency, transaction, payment, particulars, paid, receipt, bill };
}
function createData2(grossamount, aed, tax, feeamount, paid, receipt, bill) {
    return { grossamount, aed, tax, feeamount, paid, receipt, bill };
}
const rows = [
    createData('2022 BBA Jan Term 4 Course Material 4', 'AED', 37.5, 787.5),
    createData('2022 Jan BBA Term 4 Tuition Fee', 'AED', 2910, 6110),

];
const row2 = [
    createData2('Gross Total Amount', 'AED', 2947.5, 61897.5)
]
export default function SimpleAccordion({setLoading}) {
    const classes = useStyles();
    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
    const [data, setData] = useState([]);
    // const [loading, setLoading] = useState();
    const [regID, setRegID] = useState();
    const [studentCategory, setStudentCategory] = useState();
    const [admissionYear, setAdmissionYear] = useState();
    const [studentName, setStudentName] = useState();
    const [paidAmt, setPaidAmt] = useState(0);
    const [apiAmt, setAPIAmt] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [balanceAmt, setBalanceAmt] = useState();
    const [studentClass, setStudentClass] = useState();
    const [currency, setCurrency] = React.useState('');
    const {
        state: { userDetails },
    } = useAppContext();
    // const [feeScheduleData, setFeeScheduleData] = React.useState(FeeScheduleTableData);

    const CommonCell = row => {
        return (
            <>
                <Typography style={{
                    fontSize: '14px', paddingLeft: '15px',
                    width: '150px'
                }}>{row.value}</Typography>
            </>
        );
    };
    const CommonCell1 = row => {
        return (
            <>
                <Typography style={{
                    fontSize: '14px', paddingLeft: '15px',
                    width: '290px'
                }}>{row.value}</Typography>
            </>
        );
    };
    const columns = [

        {
            Header: <Typography className={classes.header} style={{ width: '360px' }}>Particulars</Typography>,
            accessor: 'Fee_Type_Name__c',
            disableGlobalFilter: true,
            Cell: CommonCell1,
            Footer: <p className={classes.footer}>Gross Total Amount</p>,
        },
        {
            Header: (
                <Typography className={classes.header}>Currency</Typography>
            ),
            accessor: 'Currency_of_Payment__c',
            Footer: info => {
                return (
                  <Typography className={`${classes.footer} ${classes.amtTD}`}>
                    {info?.data[0]?.Currency_of_Payment__c}
                  </Typography>
                );
              },
            disableGlobalFilter: true,
            Cell: CommonCell
        },
        {
            Header: <Typography className={classes.header}>Tax</Typography>,
            accessor: 'Tax_Amount__c',
            disableGlobalFilter: true,
            Footer: info => {
                const taxTotal = React.useMemo(
                  () =>
                    info?.rows?.reduce(
                      (sum, row) => +row?.values?.Tax_Amount__c + sum,
                      0
                    ),
                  [info?.rows]
                );
        
                return (
                  <Typography className={`${classes.footer} ${classes.amtTD}`}>
                    {taxTotal || '0'}
                  </Typography>
                );
              },
            Cell: CommonCell
        },
        {
            Header: <Typography className={classes.header}>Fees Amount</Typography>,
            accessor: 'Total_Fee_Amount__c',
            disableGlobalFilter: true,
            Footer: info => {
                const total = React.useMemo(
                  () =>
                    info?.rows?.reduce(
                      (sum, row) => +row?.values?.Total_Fee_Amount__c + sum,
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
            Cell: CommonCell,
        },

    ];
    const datas = [
        {
            Particulars: '2022 BBA Jan Term 4 Course Material 4', Currency: 'AUD', Tax: '62.5', FeesAmount: '787.5',
        },
        {
            Particulars: '2022 Jan BBA Term 4 Tuition Fee', Currency: 'AUD', Tax: '62.5', FeesAmount: '787.5',
        },
        {
            Particulars: 'Gross Total Amount', Currency: 'AUD', Tax: '2947.5', FeesAmount: '61897.5',
        },
    ]

    useEffect(() => {
        setLoading(true);
        const params = userDetails.ContactId;
        const newArray = [];
        getOfferLetterFeeByContact(params)
            .then(resp => {
                if (resp.success) {
                    let array = [];
                    let apiResponse = resp?.FeesData;
                    const updatedData = apiResponse.map(item => {
                        return {
                            ...item,
                            Term_c: item?.Term__c,
                            Term_Name: item?.Term__r?.Name,
                            Tax_Amount__c: item?.Tax_Amount__c || 0,
                        };
                    });

                    console.log('updatedData', updatedData);

                    const termWiseData = [];
                    const unique = [...new Set(updatedData.map(item => item.Term_Name))];
                    unique.map(item => {
                        const filteredArray = updatedData.filter(
                            el => el.Term_Name === item
                        );
                        let obj = { Term_c: item, data: filteredArray };
                        termWiseData.push(obj);
                    });

                    console.log('termWiseData', termWiseData);

                    const tableData = [];
                    termWiseData.map((item, index) => {
                        item?.data.map(value => {
                            let obj = {
                                ...value,
                                Fee_Type_Name__c: value['Fee_Type_Name__c'],
                                Tax_Amount__c: value['Tax_Amount__c']
                                    ? value['Tax_Amount__c']
                                    : 0,
                                Total_Fee_Amount__c: value['Total_Fee_Amount__c']
                                    ? value['Total_Fee_Amount__c']
                                    : 0,
                                Currency_of_Payment__c: value['Currency_of_Payment__c'],
                                Term_name: value['Term_Name'],
                            };
                            setCurrency(obj?.Currency_of_Payment__c);
                            tableData.push(obj);
                        });
                    });
                    console.log('tableDatatableData', tableData);
                    setData(termWiseData);
                setLoading(false);


                    // if (apiResponse.length > 0) {
                    //   setLoading(false);
                    //   let totalFeeAmt = tableData.reduce(
                    //     (sum, row) => row?.Total_Fee_Amount__c + sum,
                    //     0
                    //   );
                    //   let totalTaxAmt = tableData.reduce(
                    //     (sum, row) => row?.Tax_Amount__c + sum,
                    //     0
                    //   );
                    //   // let totalPaidAmt = tableData.reduce(
                    //   //   (sum, row) => row?.Tax_Amount__c + sum,
                    //   //   0
                    //   // );
                    //   // let totalBalance = tableData.reduce(
                    //   //   (sum, row) => row?.Tax_Amount__c + sum,
                    //   //   0
                    //   // );

                    //   setAPIAmt(totalFeeAmt);
                    //   setTotalTax(totalTaxAmt);
                    // }
                }
            })
            .catch(err => {
                setLoading(false);
            });
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.tableComponent}>
                {/* {loading && <KenLoader />} */}

                    {data.length > 0 &&
                        data.map(item => {
                            return (
                                <>
                                    {isMobileScreen ?
                                        <>
                                            <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}>
                                                <Accordion style={{ boxShadow: 'none' }}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className={classes.heading} ><b>{item.Term_c}</b></Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Grid container justifyContent='center'>
                                                            <Grid item xs={12}>
                                                                <div className="KenDivFeeSchedule">
                                                                    <div className={classes.tableborder}>
                                                                        <KenGrid
                                                                            columns={columns}
                                                                            data={item.data}
                                                                            pagination={{ disabled: true }}
                                                                            tableTotal={{ disabled: true, checkbox: true }}
                                                                            getRowProps={{ selected: true }}
                                                                            toolbarDisabled={true}
                                                                            gridProps={{
                                                                                getHeaderProps: cell => ({
                                                                                    style: {
                                                                                        background: '#F1F5FA',
                                                                                        border: 'none',
                                                                                        padding: '20px 35px'


                                                                                    },
                                                                                }),
                                                                                getCellProps: cell => ({
                                                                                    style: {
                                                                                        border: 'none'
                                                                                    },
                                                                                }),
                                                                                footerRows: [1],
                          footerStyles: { backgroundColor: 'white' },
                          footerCellStyles: { borderBottom: 'none' },
                                                                            }}

                                                                        />

                                                                    </div>
                                                                </div>
                                                            </Grid>

                                                        </Grid>

                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        </> :
                                        <>
                                            <Accordion style={{ boxShadow: 'none' }}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Typography style={{ fontSize: '14px' }}><b>2022 BBA Com 1 Term 4</b></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails >
                                                    <Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Particulars</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold' }}>2022 BBA Jan Term 4 Course Material 4</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Currency</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold' }}>AED</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Tax</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold' }}>37.5</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Fees Amount</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold' }}>787.5</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '12px', marginTop: '20px', fontWeight: 'bold', color: '#090F69' }}>Gross Total Amount</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Currency</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold', color: '#090F69' }}>AED</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Tax</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold', color: '#090F69' }}>2947.5</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography style={{ fontSize: '10px', color: '#7A7A7B', marginTop: '10px' }}><b>Fees Amount</b></Typography>
                                                            <Typography style={{ fontSize: '12px', marginTop: '10px', fontWeight: 'bold', color: '#090F69' }}>61897.5</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        </>}
                                </>
                            );
                        })}

            </div>
        </div>
    );
}