import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import SystemUpdateAltOutlinedIcon from '@material-ui/icons/SystemUpdateAltOutlined';
import KenCard from '../../../global_components/KenCard';
import { Grid } from '@material-ui/core';
import KenCheckbox from '../../../global_components/KenCheckbox';
import GetAppIcon from '@material-ui/icons/GetApp';
import {

    useMediaQuery,

} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
    tablehead1:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '120px', fontWeight: 'bold',border:'none' 

    },
    tablehead2:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '110px', fontWeight: 'bold',border:'none'
    },
    tablehead3:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '140px', fontWeight: 'bold',border:'none'
    },
    tablehead4:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '140px', fontWeight: 'bold',border:'none'
    },
    tablehead5:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '200px', fontWeight: 'bold',border:'none'
    },
    tablehead6:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '150px', fontWeight: 'bold',border:'none'
    },
    tablehead7:{
        textAlign: 'start', color: '#092682', fontSize: '14px', width: '210px', fontWeight: 'bold',border:'none'
    },
    tableborder: {
        border: 'solid 2px',
        borderRadius:'5px',
        borderColor: '#F1F5FA',
      },
      bor:{
        border:'none',

      },
     
    


      // mobile view//


   mobilehead:{
    fontSize: '10px', color: '#7A7A7B', marginTop: '10px'
  },
  mobiledata:{
    fontSize: '12px', marginTop: '10px', fontWeight: 'bold'
  },


}))

const useRowStyles = makeStyles(theme=>({

   
    tablehead8:{
        textAlign: 'start', color: '#092682', fontSize: '13px', fontWeight: 'bold',border:'none'
    },
    tablehead9:{
        fontSize: '12px', textAlign: 'left', borderBottom: 'none',border:'none'
    },
    cell: {
        fontSize: '14px',
        border: 'none'
      },
      tableborder: {
        border: 'solid 2px',
        borderRadius:'5px',
        borderColor: '#F1F5FA',
      },




}));

function createData(currency, transaction, payment, particulars, paid, receipt, bill) {
    return {
        currency, transaction, payment, particulars, paid, receipt, bill

    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>

            <TableRow className={classes.root}>
                <TableCell className={classes.cell}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row"className={classes.cell}>
                    2022 BBA Jan Term 5 Course Material Fee
                </TableCell>
                <TableCell className={classes.cell}>AUD</TableCell>
                <TableCell className={classes.cell}>625</TableCell>
                <TableCell className={classes.cell}>0</TableCell>
                <TableCell className={classes.cell}>625</TableCell>
                <TableCell className={classes.cell}>21-04-2022</TableCell>
                <TableCell className={classes.cell}><KenCheckbox /></TableCell>

            </TableRow>
            <TableRow>
                <TableCell colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box >
                            <Table aria-label="collapsible table" className={classes.tableborder} style={{ boxShadow: 'none',marginLeft:"10px" }}>
                                <TableHead style={{ backgroundColor: '#F1F5FA' }}>
                                    <TableRow>

                                        <TableCell className={classes.tablehead8}>Inst</TableCell>
                                        <TableCell className={classes.tablehead8}>Currency</TableCell>
                                        <TableCell className={classes.tablehead8}>Amount</TableCell>
                                        <TableCell className={classes.tablehead8}>Paid amount</TableCell>
                                        <TableCell className={classes.tablehead8}>Remaining Amount</TableCell>
                                        <TableCell className={classes.tablehead8}>Fee Collection Start Date</TableCell>
                                        <TableCell className={classes.tablehead8}>Due Date</TableCell>
                                        <TableCell className={classes.tablehead8}>Late Fee Start Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'left', }}>
                                    <TableRow className={classes.root} style={{ borderBottom: '0px' }}>
                                        <TableCell className={classes.tablehead9} >Inst 1</TableCell>
                                        <TableCell className={classes.tablehead9} >AUD</TableCell>
                                        <TableCell className={classes.tablehead9} >250</TableCell>
                                        <TableCell className={classes.tablehead9} >0</TableCell>
                                        <TableCell className={classes.tablehead9} >250</TableCell>
                                        <TableCell className={classes.tablehead9} >21-12-2022</TableCell>
                                        <TableCell className={classes.tablehead9} >21-12-2022</TableCell>
                                        <TableCell className={classes.tablehead9} >21-12-2022</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

// const icon = ;

const rows = [
    createData('2022 BBA Jan Term 5 Course Material Fee', 'AUD', '625', '0', '625', '21-04-2022', <KenCheckbox />),


];

export default function CollapsibleTable() {
  const classes = useStyles();
    const theme = useTheme();
    const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
    return (
        <div>
            {
                isMobileScreen ? <>
                    <TableContainer component={Paper} className={classes.tableborder} style={{ boxShadow: 'none',marginLeft:"10px" }}>
                        <Table aria-label="collapsible table">
                            <TableHead style={{ backgroundColor: '#F1F5FA' }}>
                                <TableRow>
                                    <TableCell className={classes.bor}></TableCell>
                                    <TableCell className={classes.tablehead1}>Fee Type</TableCell>
                                    <TableCell className={classes.tablehead2}>Currency</TableCell>
                                    <TableCell className={classes.tablehead3}>Fees Amount</TableCell>
                                    <TableCell className={classes.tablehead4}>Paid Amount</TableCell>
                                    <TableCell className={classes.tablehead5}>Remaining amount</TableCell>
                                    <TableCell className={classes.tablehead6}>Next Inst Date</TableCell>
                                    <TableCell className={classes.tablehead7}>Invoiced/not Invoiced</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody style={{ fontSize: '13px', width: '90px', fontWeight: 'bold', textAlign: 'left' }}>
                                
                                    <Row  />
                             
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
                    :
                    <>
                        <Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Inst</b></Typography>
                                <Typography className={classes.mobiledata}>Inst 1</Typography>
                            </Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Currency</b></Typography>
                                <Typography className={classes.mobiledata}>AUD</Typography>
                            </Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Amount</b></Typography>
                                <Typography className={classes.mobiledata}>250</Typography>
                            </Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Paid amount</b></Typography>
                                <Typography className={classes.mobiledata}>0</Typography>
                            </Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Remaining Amount</b></Typography>
                                <Typography className={classes.mobiledata}>250</Typography>
                            </Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Fee Collection Start Date</b></Typography>
                                <Typography className={classes.mobiledata}>-</Typography>
                            </Grid>
                            <Grid>
                                <Typography  className={classes.mobilehead}><b>Late Fee Start Date</b></Typography>
                                <Typography className={classes.mobiledata}>-</Typography>
                            </Grid>
                        </Grid>
                    </>
            }

        </div>
    );
}