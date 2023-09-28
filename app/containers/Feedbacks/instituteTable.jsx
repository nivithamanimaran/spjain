import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
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
import { getInstituteFeedbackDetails } from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenLoader from '../../components/KenLoader';
import KenGrid from '../../global_components/KenGrid';
import { object } from 'prop-types';

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
  two: {
    color: '#092682',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: 'Work Sans',
  },
  three: {
    color: '#092682',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: 'Work Sans',
  },
  four: {
    color: '#092682',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: 'Work Sans',
  },
  five: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
  },
  six: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
  },
  seven: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
  },
  eight: {
    color: '#222222',
    fontSize: '10px',
    fontWeight: 'bold',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },
  nine: {
    color: '#222222',
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Work Sans',
    lineHeight: '20px',
  },
}));

export default function InstituteTable(props) {
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setuser] = useState([]);
  const userDetails = getUserDetails();

  // useEffect(() => {
  //     getInstituteFeedbackDetails(userDetails.ContactId)
  //         .then((res) => {
  //             setuser(res)
  //             let datapush = [];
  //             res.map((item) => {
  //                 datapush.push(...{
  //                     Faculty: item.facultyName,
  //                     Subject: item.subjectName,
  //                     SubjectCode: item.subjectCode,
  //                     Feedback: item.feedbackStatus,
  //                     Date: item.startDate,
  //                     Sessionname: item.facultyName,
  //                     time: moment(item.sessionStartDate).format('hh:mm'),
  //                     endTime: moment(item.sessionStartEnd).format('hh:mm'),
  //                     item: item,
  //                 });
  //             });
  //             setdata(datapush);
  //             setLoading(false);
  //         })
  //         .catch(err => {
  //             setLoading(false);
  //         });
  // }, []);
  useEffect(() => {
    setLoading(true);
    getInstituteFeedbackDetails(userDetails.ContactId)
      .then(res => {
        let data = [];
        res?.FeedBackList?.map((item, i) => {
          // Object.entries(item)?.map(item => {
          // console.log(item);
          data.push({
            name: item?.feedback?.Account__r?.Name,
            Id: item?.feedback.Id,
            endDate: item?.feedback.End_Date__c,
            startDate: item?.feedback.Start_Date__c,
            parameters: item?.feedback.Parameter__c,
            facultyId: res?.id,
            recordTypeId: item?.feedback.RecordTypeId,
            instituteId: item?.feedback.Account__c,
            feedBackStatus: item?.feedbackStatus,
          });
          // });
        });
        setuser(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, [userDetails.ContactId, props.Detail]);

  console.log(user);

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
          Name of Institute
        </p>
      ),
      accessor: 'name',
    },
    {
      Header: (
        <p style={{ color: '#092682', fontSize: '16px', fontWeight: '500' }}>
          Institute Id
        </p>
      ),
      accessor: 'Id',
    },
    {
      Header: (
        <p style={{ color: '#092682', fontSize: '16px', fontWeight: '500' }}>
          Status
        </p>
      ),
      accessor: 'feedBackStatus',
      Cell: ({ row }) =>
        row.original.feedBackStatus == 'Pending' ? (
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
            onClick={() =>
              row.original.feedBackStatus == 'Pending' &&
              props.handleClick(row.original)
            }
          />
        );
      },
    },
  ];

  console.log('as', user);

  return (
    <div>
      {loading && <KenLoader />}
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
                  Name of Institute:<b>{e.name}</b>
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
                  Institute Id:<b>{e.Id}</b>
                </Typography>
              </Grid>
              <br />
              <Grid container>
                <Grid item xs={6}>
                  {e.Feedback == 'Pending' ? (
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
        //     <Table className={classes.table} aria-label="simple table" >
        //         <TableBody>
        //             {user.map((e, i) => {
        //                 return (
        //                     <TableRow>
        //                         <TableCell component="th" scope="row" className={classes.five}>
        //                             {i + 1}
        //                         </TableCell>
        //                         <TableCell className={classes.six}>{e.facultyName}</TableCell>
        //                         <TableCell className={classes.seven}>{e.subjectName}</TableCell>
        //                         <TableCell style={{ paddingLeft: "10px" }} className={classes.eight}><p style={{ backgroundColor: "#FFEFB6", fontSize: '10px', fontWeight: "bold", width: "100px", height: "25px", paddingTop: "4px", borderRadius: "8px", textAlign: 'center' }}>{e.feedbackStatus}</p></TableCell>
        //                         <TableCell style={{ cursor: "pointer" }} className={classes.nine}> <VisibilityRoundedIcon onClick={() => props.handleClick(e)} /></TableCell>
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
                  cursor: 'pointer',
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
