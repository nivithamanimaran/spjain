import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KenCard from '../../../global_components/KenCard';
import { makeStyles } from '@material-ui/core/styles';
import Routes from '../../../utils/routes.json';

const KenGrid = React.lazy(() => import('../../../global_components/KenGrid'));
const ContactCell = React.lazy(() =>
  import('../../../global_components/KenGrid/components/ContactCell')
);
const CircularProgressWithLabel = React.lazy(() =>
  import('../../../components/ChartWidgets/CircularProgressWithLabel')
);

const useStyles = makeStyles(theme => ({
 
  stud: {
    border: '1px solid #E4E4E4 !important',
    boxShadow: 'none !important',
    [theme.breakpoints.down('xs')]: {
      width: '120px',
    },
  },
  gridCard: {
    display: 'flex',

    marginTop: '15px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginLeft: '-60px',
    },
  },
  tablecont: {
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      marginTop: '40px',
      width: "100%"
    },
    '&>div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '&>div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '200%',
      },
    },
  },


  container: {
    padding: 16,
  },
  subheaderGrid: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: "-53px"
    },
    '&>div>p': {
      [theme.breakpoints.down('sm')]: {
        marginLeft: '40px',
      },
    },
  },
  title: {
    fontSize: 11,
    textTransform: 'uppercase',
    color: theme.palette.KenColors.kenBlack,
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    color: theme.palette.KenColors.kenBlack,
    opacity: '0.5',
  },
  cardValue: {
    fontWeight: 500,
    fontSize: 16,
    color: theme.palette.KenColors.kenBlack,
  },
  header: {
    fontSize: 16,
    color: theme.palette.KenColors.gradeSectionHeaderLabel,
    fontWeight: 600,
  },
}));

export default function StudentTableGrid({
  data = [],

}) {
  const AttendanceCell = ({ value }) => {
    return (
      <div>
        <CircularProgressWithLabel
          value={value}
          style={{color:value<75?"red":null}}
          label={
            value == '0.0' || value === null ? 'NA' : `${value?.toFixed(1)}`
          }
        />
      </div>
    );
  };
  const { t } = useTranslation();
  const classes = useStyles();
  const columns = [
    {
      Header: <Typography className={classes.header}>Student Name</Typography>,
      accessor: 'StudentName',
      Cell: ({ value, row }) => {
        return (
          <Link
            to={`/${Routes.studentDetails}/${row.original.ContactID}`}
            style={{ textDecoration: 'none' }}
          >
            <ContactCell value={value} />
          </Link>
        );
      },
    },

    {
      Header: <Typography className={classes.header}>Reg. Number</Typography>,
      accessor: 'StudentRegdNo',
      disableGlobalFilter: true,
    },
    {
      Header: <Typography className={classes.header}>Attendance</Typography>,
      accessor: 'Attendacne',
      Cell: AttendanceCell,
      disableGlobalFilter: true,
    },

  ];
  return (
    <>
      <div className={classes.container}>
        <kenCard>
          <Grid container spacing={12} className={classes.subheaderGrid}>
            <Grid>
              {' '}
              <Typography>
                <span className={classes.title}>Term:</span>{' '}
                <span style={{ fontWeight: 'bold', fontSize: 11 }}>
                  {data[0]?.TermName}
                </span>{' '}
              </Typography>
            </Grid>
            <Grid>
              {' '}
              <Typography style={{ marginLeft: '40px' }}>
                <span className={classes.title}>course:</span>{' '}
                <span style={{ fontWeight: 'bold', fontSize: 11 }}>
                  {data[0]?.CourseName}{' '}
                </span>
              </Typography>
            </Grid>
            <Grid>
              <Typography style={{ marginLeft: '40px' }}>
                <span className={classes.title}>Section:</span>{' '}
                <span style={{ fontWeight: 'bold', fontSize: 11 }}>
                  {data[0]?.Section}{' '}
                </span>
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} className={classes.gridCard}>
            <Grid item xs={3}>
              <Card className={classes.stud}>
                <CardContent>
                  <Typography className={classes.cardTitle}>
                    {' '}
                    No. Of students
                  </Typography>
                  <Typography className={classes.cardValue}>
                    {data?.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card className={classes.stud}>
                <CardContent>
                  <Typography className={classes.cardTitle}>
                    Students at Risk
                  </Typography>
                  <Typography className={classes.cardValue}>
                    {data.filter(student => student.Attendacne < 75).length}

                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </kenCard>

        <div className={classes.tablecont}>
          <KenGrid
            columns={columns}
            searchEnabled={false}
            toolbarDisabled={true}
            data={data}
            style={{ marginTop: '10px' }}
            gridProps={{
              getHeaderProps: cell => ({
                style: {
                  fontWeight: 'bold',
                  fontSize: '16px',
                  background: '#F1F5FA',
                  border: 'none',
                },
              }),

              getCellProps: cell => ({
                style: {
                  borderBottom: 'none',
                },
              }),
            }}
          />
        </div>
      </div>
    </>
  );
}
