import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, useTheme, Button } from '@material-ui/core';
import KenGrid from '../../../../global_components/KenGrid';
import KenCard from '../../../../global_components/KenCard';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import '../Styles.scss';

const useStyles = makeStyles(theme => ({
  accepted: {
    backgroundColor: '#52C15A45',
    padding: '10px',
    width: '40%',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: '60%',
      borderRadius: '8px',
    },
  },
  pending: {
    backgroundColor: '#FFEFB645',
    padding: '10px',
    width: '40%',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: '60%',
      borderRadius: '8px',
    },
  },
  rejected: {
    backgroundColor: '#DD4B3945',
    padding: '10px',
    width: '40%',
    textAlign: 'center',
    [theme.breakpoints.down('md')]: {
      width: '60%',
      borderRadius: '8px',
    },
  },
  resp: {
    [theme.breakpoints.down('md')]: {
      marginTop: '1em',
    },
  },
}));
const MyRequest = ({ data, setData, handleApply }) => {
  console.log('setData', data);
  const classes = useStyles();
  const kentheme = useTheme();
  const isMobileScreen = useMediaQuery(kentheme.breakpoints.down('sm'));
  React.useEffect(() => {
    setData([
      {
        Type: 'AnswerSheet',
        course: 'Course A',
        Exam: 'Exam X',
        Date: '2023-07-20',
        ApprovalStatus: 'Accepted',
      },
      {
        Type: 'Reevaluation',
        course: 'Course B',
        Exam: 'Exam Y',
        Date: '2023-07-21',
        ApprovalStatus: 'Rejected',
      },
      {
        Type: 'Retest',
        course: 'Course B',
        Exam: 'Exam Y',
        Date: '2023-07-21',
        ApprovalStatus: 'Rejected',
      },
    ]);
  }, [setData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Type',
        accessor: 'Type',
      },
      {
        Header: 'Course',
        accessor: 'course',
      },
      {
        Header: 'Exam',
        accessor: 'Exam',
      },
      {
        Header: 'Date of Request',
        accessor: 'Date',
      },
      {
        Header: 'Approval Status',
        accessor: 'ApprovalStatus',
        Cell: ({ value }) => {
          let cellClassName;
          switch (value) {
            case 'Accepted':
              cellClassName = classes.accepted;
              break;
            case 'Pending':
              cellClassName = classes.pending;
              break;
            case 'Rejected':
              cellClassName = classes.rejected;
              break;
            default:
              cellClassName = '';
          }
          return <div className={cellClassName}>{value}</div>;
        },
      },
    ],
    [classes.accepted, classes.pending, classes.rejected]
  );
  const approvalStatusCell = ({ value }) => {
    let cellClassName;
    switch (value) {
      case 'Accepted':
        cellClassName = classes.accepted;
        break;
      case 'Pending':
        cellClassName = classes.pending;
        break;
      case 'Rejected':
        cellClassName = classes.rejected;
        break;
      default:
        cellClassName = '';
    }
    return <Typography className={cellClassName}>{value}</Typography>;
  };

  return (
    <>
      {!isMobileScreen ? (
        <div>
          <KenGrid columns={columns} data={data} />
        </div>
      ) : (
        <Grid container xs={12}>
          <Grid className={classes.RightBox}>
            <KenCard paperStyles={{ padding: 10, borderRadius: '4px' }}>
              <Grid container>
                <Grid container xs={6}>
                  <Grid item xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>Type</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{data[0]?.Type}</Typography>
                  </Grid>
                </Grid>
                <Grid container xs={6}>
                  <Grid item xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Course
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{data[0]?.course}</Typography>
                  </Grid>
                </Grid>
                <Grid container xs={6} className={classes.resp}>
                  <Grid item xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>Exam</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{data[0]?.Exam}</Typography>
                  </Grid>
                </Grid>
                <Grid container xs={6} className={classes.resp}>
                  <Grid item xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Date Of Request
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>{data[0]?.Date}</Typography>
                  </Grid>
                </Grid>
                <Grid container xs={6} className={classes.resp}>
                  <Grid item xs={12}>
                    <Typography style={{ fontWeight: 'bold' }}>
                      Approval Test
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {approvalStatusCell({ value: data[0]?.ApprovalStatus })}{' '}
                  </Grid>
                </Grid>
                <Grid container xs={6} className={classes.resp}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleApply}
                    style={{ width: '70%', height: '50px', marginTop:"15px" }}
                  >
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </KenCard>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default MyRequest;
