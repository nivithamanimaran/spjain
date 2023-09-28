import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import KenSnackBar from '../../../../components/KenSnackbar';
import KenGrid from '../../../../global_components/KenGrid';
import Routes from '../../../../utils/routes.json';
import '../Styles.scss';
const useStyles = makeStyles(theme => ({
  previewInfo: {
    background: '#fff',
    padding: 20,
    gap: '30px',
  },

  cardBox: {
    height: '221px',
    padding: '20px',
  },
  infoCard: {
    display: 'flex',
    gap: '0px',
  },
  mobileInfoCard: {
    display: 'flex',
  },
  tabInfoCard: {
    display: 'flex',
  },
  statusBox: {
    padding: '5px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  QPHead: {
    fontSize: '20px',
    fontWeight: 600,
  },
  QPStatus: {
    fontSize: '14px',
    opacity: '50%',
    display: 'flex',
    gap: 16,
    lineHeight: '32px',
  },
  QPBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
}));

export default function MarksBreakDownPre() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const mobileView = useMediaQuery(theme.breakpoints.only('xs'));
  const tabView = useMediaQuery(theme.breakpoints.only('md'));
  const [selectedStudent, setSelectedStudent] = useState({});
  const previewCard = {
    'Student Name': 'Anaia Aranjo',
    Program: 'Undergraduate Program',
    Batch: 'UGLE 2022',
    'Academic Cycle': '2023-2024',
    'Course Code': 'BCA 001',
    Course: 'Digital Literacy',
    Section: 'A',
  };
  const scoreData = [
    {
      Type: 'Assignments',
      marks: '80/100',
      weightage: '30%',
      SubTypes: [
        { label: 'Assignment 1', marks: '20', outOf: '30', weightage: '50%' },
        { label: 'Assignment 2', marks: '25', outOf: '30', weightage: '50%' },
        { label: 'Assignment 3', marks: '35', outOf: '40', weightage: '60%' },
      ],
    },
    {
      Type: 'Quizzes',
      marks: '60/100',
      weightage: '20%',
      SubTypes: [
        { label: 'Quiz 1', marks: '10', outOf: '20', weightage: '50%' },
        { label: 'Quiz 2', marks: '20', outOf: '30', weightage: '40%' },
        { label: 'Quiz 3', marks: '30', outOf: '30', weightage: '30%' },
      ],
    },
    {
      Type: 'Miscellaneous',
      marks: '70/100',
      weightage: '15%',
      SubTypes: [
        { label: 'Misc 1', marks: '20', outOf: '30', weightage: '50%' },
        { label: 'Misc 2', marks: '25', outOf: '30', weightage: '40%' },
        { label: 'Misc 3', marks: '25', outOf: '40', weightage: '60%' },
        { label: 'Misc 4', marks: '0', outOf: '30', weightage: '30%' },
      ],
    },
    {
      Type: 'Final Exams',
      marks: '80/100',
      weightage: '35%',
      SubTypes: [
        { label: 'Final Exam', marks: '50', outOf: '60', weightage: '80%' },
      ],
    },
  ];
  const columns = [
    {
      Header: 'Grading Component',
      accessor: 'Type',
      disableGlobalFilter: true,
    },
    {
      Header: 'Marks Obtained',
      accessor: 'marks',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <Typography style={{ fontSize: '12px' }}>
            {value}
            {row?.original?.outOf}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: 'Weightage',
      accessor: 'weightage',
      disableGlobalFilter: true,
    },
  ];
  //   SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const prevPage = () => {
    history.push({
      pathname: Routes.ExamStudent,
      state: { pageCheck: 2 },
    });
    // history.goBack();
  };

  return (
    <Box>
      {/* {loading ? <KenLoader /> : null} */}
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={4000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      <Paper>
        <Grid container xs={12}>
          <Grid item xs={10}>
            <Typography
              style={{
                fontWeight: 600,
                fontSize: 16,
                margin: '8px 15px',
                lineHeight: '40px',
              }}
            >
              Marks Breakdown
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              style={{
                margin: '10px 15px',
                float: 'right',
                textTransform: 'capitalize',
              }}
              onClick={prevPage}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper style={{ marginTop: 15 }}>
        <Grid container xs={12} style={{ padding: 20 }}>
          {Object.entries(previewCard).map(([key, value]) => {
            return (
              <Grid
                style={{ padding: '10px' }}
                item
                lg={4}
                md={6}
                xs={12}
                className={
                  mobileView
                    ? classes.mobileInfoCard
                    : tabView
                    ? classes.tabInfoCard
                    : classes.infoCard
                }
              >
                <Grid lg={4} xs={6} md={5}>
                  <Typography style={{ fontSize: '16px', opacity: '50%' }}>
                    {key}:
                  </Typography>
                </Grid>
                <Grid lg={8} xs={6} md={8}>
                  <Typography style={{ fontSize: '16px' }}>{value}</Typography>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      <Grid item xs={12} style={{ marginTop: 20 }}>
        <KenGrid
          columns={columns}
          data={scoreData}
          pagination={{ disabled: true }}
          isCollasable={true}
          component={CollapseData}
          toolbarDisabled={true}
          gridProps={{
            getHeaderGroupProps: column => ({
              style: { border: '1px solid #D2E1E9' },
            }),
            getHeaderProps: column => ({
              style: {
                background: '#090F690001A',
                boxSizing: 'border-box',
                color: '#090F6900099',
              },
            }),
            getColumnProps: column => ({
              style: {
                background: '#fff',
                boxSizing: 'border-box',
              },
            }),
          }}
        />
        <Paper>
          <Grid item xs={12} style={{ padding: '14px 75px' }}>
            <div style={{ display: 'flex', gap: 30 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                  Composite Marks
                </Typography>
                <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                  Final Grade
                </Typography>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                  80/100
                </Typography>
                <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                  A+
                </Typography>
              </div>
            </div>
            <div
              style={{
                border: '1px solid #D2E1E9',
                padding: '20px',
                marginTop: 15,
              }}
            >
              <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                Student Details:
              </Typography>
              <Grid container style={{ marginTop: 10 }}>
                <Grid item xs={4}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Typography style={{ fontSize: 14, opacity: '50%' }}>
                      Attendance :
                    </Typography>
                    <Typography style={{ fontSize: 14 }}>79%</Typography>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Typography style={{ fontSize: 14, opacity: '50%' }}>
                      Fees :
                    </Typography>
                    <Typography style={{ fontSize: 14, color: 'red' }}>
                      Paid
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Typography style={{ fontSize: 14, opacity: '50%' }}>
                      Disciplinary Action :
                    </Typography>
                    <Typography style={{ fontSize: 14, color: 'red' }}>
                      Copying in the semester
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Paper>
      </Grid>
    </Box>
  );
}

const CollapseData = props => {
  const classes = useStyles();
  const [subTypes, setSubTypes] = useState([]);
  useEffect(() => {
    setSubTypes(props.original.SubTypes);
  }, []);
  return (
    <Box>
      <div classsName="subtable">
        <Grid xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} className="preview-table">
              <TableBody>
                {subTypes &&
                  subTypes.map(item => {
                    return (
                      <TableRow style={{ overflow: 'hidden' }}>
                        <TableCell style={{ width: '50%' }}>
                          <Typography
                            style={{
                              position: 'relative',
                              left: '14%',
                              fontSize: 14,
                            }}
                          >
                            {item.label}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography style={{ fontSize: 12 }}>
                            {item.marks}/{item.outOf}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography style={{ fontSize: 12 }}>
                            {item.weightage}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </div>
    </Box>
  );
};
