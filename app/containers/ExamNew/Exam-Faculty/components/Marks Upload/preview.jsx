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
import KenLoader from '../../../../../components/KenLoader';
import KenSnackBar from '../../../../../components/KenSnackbar';
import KenGrid from '../../../../../global_components/KenGrid';
import Routes from '../../../../../utils/routes.json';
import '../../styles.scss';
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

export default function MarksUploadPreview() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const mobileView = useMediaQuery(theme.breakpoints.only('xs'));
  const tabView = useMediaQuery(theme.breakpoints.only('md'));
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedStudent, setSelectedStudent] = useState({});
  const [expanded, setExpanded] = useState(0);
  const [accordienCheck, setAccordienCheck] = useState(true);
  const previewCard = {
    'Student Name': 'Anaia Aranjo',
    Program: 'Undergraduate Program',
    Batch: 'UGLE 2022',
    'Academic Cycle': '2023-2024',
    'Course Code': 'BCA 001',
    Course: 'Digital Literacy',
    Section: 'A',
  };
  // const previewCard = {
  //   'Student Name': selectedStudent?.['Student Name'] || '-',
  //   Program: selectedRow?.Program || '-',
  //   Batch: selectedRow?.Batch || '-',
  //   'Academic Cycle': selectedStudent?.['Academic Cycle'] || '-',
  //   'Course Code': selectedRow?.['Course Code'] || '-',
  //   Course: selectedRow?.Course || '-',
  //   Section: selectedRow?.Section || '-',
  // };
  const [scoreData, setScoreData] = useState([]);
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
            {value}/{row?.original?.outOf}
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
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    if (location?.state) {
      let { selectedRow, row } = location?.state;
      setSelectedRow(selectedRow);
      setSelectedStudent(row);
      setScoreData(row.Score);
    }
  }, [location]);

  const prevPage = () => {
    history.push({
      pathname: Routes.facultyExams,
      state: { pageCheck: 3 },
    });
    // history.goBack();
  };

  return (
    <Box>
      {loading ? <KenLoader /> : null}
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
                item
                lg={4}
                md={6}
                xs={12}
                style={{ padding: '10px' }}
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
                background: '#0000001A',
                boxSizing: 'border-box',
                fontSize: 14,
                color: '#00000099',
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
                  {selectedStudent?.['Composite Marks']}
                </Typography>
                <Typography style={{ fontSize: 14, fontWeight: 600 }}>
                  {selectedStudent?.['Final Grade']}
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
                    <Typography style={{ fontSize: 14 }}>
                      {selectedStudent?.['Attendance']}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Typography style={{ fontSize: 14, opacity: '50%' }}>
                      Fees :
                    </Typography>
                    <Typography style={{ fontSize: 14, color: 'red' }}>
                      {selectedStudent?.['Fees']}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Typography style={{ fontSize: 14, opacity: '50%' }}>
                      Disciplinary Action :
                    </Typography>
                    <Typography style={{ fontSize: 14, color: 'red' }}>
                      {selectedStudent?.['Disciplinary Action']}
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
                              fontSize: 12,
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
