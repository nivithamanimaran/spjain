import { Box, Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#092682',
    marginLeft: '4px',
  },
  headTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#092682',
    marginLeft: '4px',
  },
  subHeaderTitle: {
    width: '100%',
  },
  addButton: {
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    textTransform: 'none',
    '&:hover': {
      color: 'white',
      borderBottom: '1px solid white',
    },
  },
  mainActions: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '2rem 0 1rem',
  },
  error: {
    color: '#FFFFFF',
    background: '#EB5757',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  normal: {
    color: '#FFFFFF',
    background: '#27AE60',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  publishGenerate: {
    color: '#FFFFFF',
    background: '#979797',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  publishView: {
    color: '#FFFFFF',
    background: '#F2994A',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  Blue: {
    color: '#FFFF',
    background: '#03248F',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  Green: {
    color: '#FFFF',
    background: '#27AE60',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
    width: '102px',
  },
  medium: {
    color: '#FFFFFF',
    background: '#F2994A',
    width: '102px',
    borderRadius: 15,
    fontSize: '10px',
    fontWeight: 'bold',
    margin: '0 5px',
  },
  errorText: {
    color: '#F14B2D',
  },
  greenText: {
    color: '#27AE60',
  },
  gridKenClass: {
    '&  table tbody tr td ': {
      padding: '5px',
    },
    '&  table thead tr th ': {
      fontWeight: 'bold',
      color: '#061938',
    },
  },
  progressBarBox: {
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: '#E5E5E5',
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#27AE60',
    },
  },
}));
const FacultySubject = () => {
  const classes = useStyles();
 const history =  useHistory()
  const venueCell = row => {
    // if (row == 'btn') {
    return (
      <Box>
        {/* <Typography>Room 1</Typography> */}
        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{ borderRadius: 15 }}
          // component={Link}
          // to={`${routes.currentProgrammes}/${id}/details`}
        >
          View
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          style={{ borderRadius: 15, marginLeft: '10px' }}
          // component={Link}
          // to={`${routes.currentProgrammes}/${id}/details`}
        >
          Download
        </Button>
      </Box>
    );
    // }
  };
  const columns = [
    {
      Header: (
        <Typography variant="h6" className={classes.headTitle}>
          #
        </Typography>
      ),
      accessor: 'id',
      disableGlobalFilter: true,
    },

    {
      Header: (
        <Typography variant="h6" className={classes.headTitle}>
          Subject
        </Typography>
      ),
      accessor: 'subject',
      disableGlobalFilter: true,
    },
    {
      Header: (
        <Typography variant="h6" className={classes.headTitle}>
          Roll Number
        </Typography>
      ),
      accessor: 'rollno',
      disableGlobalFilter: true,
    },

    {
      Header: (
        <Typography variant="h6" className={classes.headTitle}>
          {/* Answer script */}
          Answer Script
        </Typography>
      ),
      accessor: 'answer',
      disableGlobalFilter: true,
    },
  ];

  const data = [
    {
      id: 1,
      subject: 'Artifical Intelligence',
      rollno: '1',
      // subject: payment('paid'),
      answer: venueCell(),
    },
    {
      id: 2,
      subject: 'Python',
      rollno: '2',
      // subject: payment('paid'),
      answer: venueCell(),
      // answer: answerCell('paid'),
    },
  ];
  return (
    <Box className="cardlsitbox">
      <Grid container spacing={2}>
        <Grid item xs={12} md={11}>
          <Typography variant="h6" className={classes.title}>
            LIST OF EXAMS
          </Typography>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button onClick={() => history.push('/faculty')} variant='contained' color='primary'>Back</Button>
        </Grid>
      </Grid>

      <KenCard elevation={0}>
        <KenGrid
          columns={columns}
          data={data}
          pagination={{ disabled: true }}
          toolbarDisabled={true}
          initialState={{
            hiddenColumns: ['id'],
          }}
        />
      </KenCard>
    </Box>
  );
};

export default FacultySubject;
