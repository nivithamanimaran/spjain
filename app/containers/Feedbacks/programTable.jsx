import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import KenCard from '../../components/KenCard';
import { getProgramFeedbackDetails } from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenLoader from '../../components/KenLoader';
import KenGrid from '../../global_components/KenGrid';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tit: {
    font: '#092682',
  },
  one: {
    color: '#092682',
    fontWeight: 'bold',
    fontSize: '16px',
    height: '22px',
    width: '10px',
    left: '35px',
    top: '14px',
  },
  five: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
    textAlign: 'center',
  },
  eight: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
    textAlign: 'center',
  },
  nine: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
  },
}));

export default function ProgramTable(props) {
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setuser] = useState([]);
  const userDetails = getUserDetails();

  useEffect(() => {
    setLoading(true);
    getProgramFeedbackDetails(userDetails.ContactId)
      .then(res => {
        console.log('res', res);
        setuser(res);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [userDetails.ContactId, props.Detail]);

  console.log('111',user);

  const column = [
    {
      id: '#',
      Header: (
        <p style={{ color: '#092682', fontSize: '16px', fontWeight: '500' }}>
          #
        </p>
      ),
      Cell: ({ row }) => `${row.index + 1}.`,
    },
    {
      Header: (
        <p style={{ color: '#092682', fontSize: '16px', fontWeight: '500' }}>
          Name of Program
        </p>
      ),
      accessor: 'programName',
    },
    {
      Header: (
        <p style={{ color: '#092682', fontSize: '16px', fontWeight: '500' }}>
          Program Id
        </p>
      ),
      accessor: 'programId',
    },
    {
      Header: (
        <p style={{ color: '#092682', fontSize: '16px', fontWeight: '500' }}>
          Status
        </p>
      ),
      accessor: 'feedbackStatus',
      Cell: ({ row }) =>
        row.original.feedbackStatus == 'Pending' ? (
          <Button
            variant="contained"
            style={{
              background: 'rgba(255, 239, 182, 0.27)',
              boxShadow: 'none',
              fontSize: '10px',
              cursor: 'default',
              fontWeight: 'bold',
            }}
          >
            Pending
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{
              background: ' rgba(82, 193, 90, 0.27)',
              boxShadow: 'none',
              fontSize: '10px',
              cursor: 'default',
              fontWeight: 'bold',
            }}
          >
            Resolved
          </Button>
        ),
    },
    {
      Header: ' ',
      Cell: ({ row }) => {
        return (
          <VisibilityRoundedIcon
            style={{ cursor: 'pointer' }}
            onClick={() =>
              row.original.feedbackStatus === 'Pending' &&
              props.handleClick(row.original)
            }
          />
        );
      },
    },
  ];

  // function useData(pid){
  //     console.log('leo1',pid);
  //     user.map((e, i) => {
  //         const p = pid.original.programId
  //         console.log('leo2',p);
  //         console.log('vvvff',e);
  //         if (e.programId == p) {
  //             return (
  //                 props.handleClick(e)
  //             )
  //         }

  // })
  // }

  return (
    <div>
      {loading && <KenLoader />}
      <ToastContainer
        position="bottom-right"
        autoClose={4997}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {isMobileScreen ? (
        <Grid>
          {user.map(e => (
            <KenCard style={{ width: '100%', padding: '20px' }}>
              <Grid style={{ display: 'flex' }}>
                <Typography
                  style={{
                    fontSize: '10px',
                    color: '#7A7A7B',
                    marginTop: '-18px',
                  }}
                >
                  Name:<b>{e.programName}</b>
                </Typography>
              </Grid>
              <Grid style={{ display: 'flex' }}>
                <Typography
                  style={{
                    fontSize: '10px',
                    color: '#7A7A7B',
                    marginTop: '8px',
                  }}
                >
                  Subject:<b>{e.programId}</b>
                </Typography>
              </Grid>
              <br />
              <Grid container>
                <Grid item xs={6}>
                  {e.feedbackStatus == 'Pending' ? (
                    <Button
                      variant="contained"
                      style={{
                        background: 'rgba(255, 239, 182, 0.27)',
                        boxShadow: 'none',
                        fontSize: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      Pending
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      style={{
                        background: ' rgba(82, 193, 90, 0.27)',
                        boxShadow: 'none',
                        fontSize: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      Resolved
                    </Button>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: 'right' }}
                    onClick={() => props.handleClick(e)}
                  >
                    <Typography style={{ fontSize: '12px' }}>view</Typography>
                  </Button>
                </Grid>
              </Grid>
            </KenCard>
          ))}
        </Grid>
      ) : (
        // <TableContainer component={Paper}>
        //     <Table className={classes.table} aria-label="simple table">
        //         <TableHead>
        //             <TableRow>
        //                 <TableCell align="center">S No</TableCell>
        //                 <TableCell align="center">Program</TableCell>
        //                 <TableCell align="center">Program Id</TableCell>
        //                 <TableCell align="center">Status</TableCell>
        //                 <TableCell align="center">View Record</TableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody>
        //             {user.map((e, i) => {
        //                 return (
        //                     <TableRow>
        //                         <TableCell component="th" scope="row" className={classes.five}>
        //                             {i + 1}
        //                         </TableCell>
        //                         <TableCell className={classes.five}>{e.programName}</TableCell>
        //                         <TableCell className={classes.five}>{e.programId}</TableCell>
        //                         <TableCell style={{ paddingLeft: "10px" }} className={classes.eight}><p style={{ backgroundColor: "#FFEFB6", fontSize: '10px', fontWeight: "bold", width: "100px", height: "25px", paddingTop: "4px", borderRadius: "8px", textAlign: 'center' }}>{e.feedbackStatus}</p></TableCell>
        //                         <Button style={{ cursor: "pointer" }} className={classes.nine}><VisibilityRoundedIcon onClick={() => props.handleClick(e.)} /></Button>
        //                     </TableRow>
        //                 )
        //             })}
        //         </TableBody>
        //     </Table>
        // </TableContainer>
        <>
          <KenGrid
            columns={column}
            data={user}
            gridProps={{
              getHeaderProps: cell => ({
                style: {
                  background: '#F1F5FA',
                  border: 'none',
                  paddingTop: '0',
                  paddingBottom: '0',
                },
              }),
              getCellProps: cell => ({
                style: {
                  border: '1px',
                  background: '#fff',
                  // cursor: 'pointer',
                },
                footerRows: [1],
                footerStyles: { backgroundColor: 'white' },
                footerCellStyles: { borderBottom: 'none' },
              }),
            }}
          />
        </>
      )}
    </div>
  );
}
