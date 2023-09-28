import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import KenCard from '../../components/KenCard';
import { getStudentFeedbackDetails } from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import KenGrid from '../../global_components/KenGrid';
import KenLoader from '../../components/KenLoader';

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

export default function Feedbacktable(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setuser] = useState([]);
  const userDetails = getUserDetails();
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getStudentFeedbackDetails(userDetails.ContactId)
      .then(res => {
        setuser(res);
        let datapush = [];
        res?.forEach((item, i) => {
          datapush?.push(
            ...{
              Faculty: item.facultyName,
              Subject: item.subjectName,
              SubjectCode: item.subjectCode,
              Feedback: item.feedbackStatus,
              Date: item.startDate,
              Sessionname: item.facultyName,
              time: moment(item.sessionStartDate).format('hh:mm'),
              endTime: moment(item.sessionStartEnd).format('hh:mm'),
              item: item,
              index: i + 1,
            }
          );
        });
        setdata(datapush);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

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
          Name of Faculty
        </p>
      ),
      accessor: 'facultyName',
    },
    {
      Header: (
        <p
          style={{
            color: '#092682',
            fontSize: '16px',
            fontWeight: '500',
            font: 'Inter',
          }}
        >
          Subject
        </p>
      ),
      accessor: 'subjectName',
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
        ),
    },
    {
      Header: ' ',
      Cell: ({ row }) => {
        return (
          <VisibilityRoundedIcon
            onClick={() => props.handleClick(row.original)}
          />
        );
      },
    },
  ];

  return (
    <div>
      {loading && <KenLoader />}
      {isMobileScreen ? (
        <Grid>
          {user?.map(e => (
            <KenCard style={{ width: '100%', padding: '20px' }}>
              <Grid style={{ display: 'flex' }}>
                <Typography
                  style={{
                    fontSize: '10px',
                    color: '#7A7A7B',
                    marginTop: '-18px',
                  }}
                >
                  Name:<b>{e.facultyName}</b>
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
                  Subject:<b>{e.subjectName}</b>
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
        <>
          <KenGrid
            columns={column}
            data={user || []}
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
