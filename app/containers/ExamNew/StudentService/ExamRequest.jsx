import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import KenGrid from '../../../global_components/KenGrid';
import KenInputField from '../../../global_components/KenInputField';
import KenSnackBar from '../../../components/KenSnackbar';

const useStyles = makeStyles(theme => ({
  table: {
    '& > div >div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },

    '& > div >div>div': {
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
      },
    },
    '& > div >div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '220%',
        marginTop: '50px',
      },
    },
  },
  actionButton: {
    minWidth: '100px',
  },
  approvedButton: {
    minWidth: '100px',
    backgroundColor: '#52C15A45',
    color: 'black',
    pointerEvents: 'none',
  },
  payment: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '20px',
    marginTop: '20px',
    paddingLeft: '10px',
  },
  peranswer: {
    fontSize: '18px',
    fontWeight: 400,
    color: '#7A7A7B',
    paddingLeft: '5px',
  },
  borderpayment: {
    borderBottom: '1px solid #D2E1E957',
    paddingBottom: '20px',
  },
  borderpaymenttop: {
    paddingTop: '20px',
  },
  totalanswer: {
    fontSize: '18px',
    fontWeight: 500,
    paddingLeft: '5px',
  },
  BackBuuton: {
    float: 'right',
    margin: '15px',
  },
}));

const ExamRequest = ({ onGoBack }) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogData, setDialogData] = React.useState(null);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = React.useState(false);
  const [data, setData] = React.useState([
    {
      courseCode: 'CSE101',
      course: 'Introduction to Computer Science',
      exam: 'Midterm',
      type: 'Apply',
      lastDate: '2023-08-15',
      Credits: '1',
      action: 'Apply',
    },
    {
      courseCode: 'CSE1011111',
      course: 'Introduction to Computer Science',
      exam: 'Midterm',
      type: 'Apply',
      lastDate: '2023-08-15',
      Credits: '5',
      action: 'Apply',
    },
    {
      courseCode: 'CSE102',
      course: 'Introduction to Computer Science',
      exam: 'Midterm',
      type: 'Apply',
      lastDate: '2023-08-15',
      Credits: '2',
      action: 'Applied',
    },
    {
      courseCode: 'CSE103',
      course: 'Introduction to Computer Science',
      exam: 'Midterm',
      type: 'Apply',
      lastDate: '2023-08-15',
      Credits: '3',
      action: 'Approved',
    },
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Course Code',
        accessor: 'courseCode',
      },
      {
        Header: 'Course',
        accessor: 'course',
      },
      {
        Header: 'Credits',
        accessor: 'Credits',
      },
      {
        Header: 'Exam',
        accessor: 'exam',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Last Date',
        accessor: 'lastDate',
      },

      {
        Header: 'Actions',
        accessor: 'action',
        Cell: ({ row }) => {
          if (row.original.action === 'Approved') {
            return (
              <Button
                style={{ color: 'black' }}
                className={classes.approvedButton}
                disabled
              >
                {row.original.action}
              </Button>
            );
          } else {
            return (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleActionClick(row.original)}
                className={classes.actionButton}
                disabled={row.original.action === 'Applied'}
              >
                {row.original.action}
              </Button>
            );
          }
        },
      },
    ],
    [classes.approvedButton, classes.actionButton]
  );

  const handleActionClick = rowData => {
    if (rowData.action === 'Apply') {
      setDialogData(rowData);
      setSelectedRow(rowData);
      setOpenDialog(true);
    } else if (rowData.action === 'Applied') {
    } else if (rowData.action === 'Approved') {
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogPayNow = () => {
    if (selectedRow) {
      const updatedData = data.map(row => {
        if (row === selectedRow) {
          return { ...row, action: 'Applied' };
        }
        return row;
      });
      setData(updatedData);
      setSelectedRow(null);
      setOpenDialog(false);
      setIsSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  return (
    <div>
      <div className={classes.table}>
        <KenGrid
          columns={columns}
          data={data}
          pagination={{ disabled: false }}
        />
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Apply for Revaluation Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={12}>
              <KenInputField
                style={{ backgroundColor: '#E4E4E4', padding: '0px 5px' }}
                label="Course"
                value={dialogData ? dialogData.course : ''}
                readOnly
              />
            </Grid>
            <Grid item md={12}>
              <KenInputField
                style={{ backgroundColor: '#E4E4E4', padding: '0px 5px' }}
                label="Exam"
                value={dialogData ? dialogData.exam : ''}
                readOnly
              />
            </Grid>
            <Grid item md={12}>
              <KenInputField
                style={{ backgroundColor: '#E4E4E4', padding: '0px 5px' }}
                label="Type"
                value={dialogData ? dialogData.type : ''}
                readOnly
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <div className={classes.payment}>Payment Summary</div>
          </Grid>
          <Grid container spacing={2} className={classes.borderpayment}>
            <Grid item xs={12} md={6}>
              <div className={classes.peranswer}>Per Revaluation Request</div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.peranswer}>Rs. 200</div>
            </Grid>
          </Grid>
          <Grid container spacing={2} className={classes.borderpaymenttop}>
            <Grid item xs={12} md={6}>
              <div className={classes.totalanswer}>Total Amount</div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.totalanswer}>Rs. 200</div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDialogPayNow}
            color="primary"
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
      <KenSnackBar
        message="Payment successful!"
        severity="success"
        autoHideDuration={5000}
        open={isSnackbarOpen}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Left"
      />
      <Button
        variant="contained"
        className={classes.BackBuuton}
        color="primary"
        onClick={onGoBack}
      >
        Back
      </Button>
    </div>
  );
};

export default ExamRequest;
