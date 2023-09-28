import {
  Box,
  Card,
  Grid,
  Tab,
  Tabs,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import MarksBreak from './MarksBreak/MarksBreak';
import MyExam from './MyExam/MyExam';
import StudentService from './StudentService/StudentService';
import KenLoader from '../../../components/KenLoader';
import KenSnackBar from '../../../components/KenSnackbar';

function a11yProps(index) {
  console.log('index', index);
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
function TabPanels(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className={classes.tabpanel}
    >
      {value === index && (
        <Box className={classes.attBoxpad}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const useStyles = makeStyles(theme => ({}));
export default function ExamStudent() {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = useState(location?.state?.pageCheck || 0);
  const [selectedTab, setSelectedTab] = useState('Exams');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  //   SnackBar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showTabs, setShowTabs] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      setSelectedTab('My Exams');
    } else if (newValue === 1) {
      setSelectedTab('Marks Breakdown');
    }
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
      <Grid container xs={12}>
        <Grid item xs={12}>
          {!showTabs && (
            <Card style={{ marginTop: '30px', background: '#fff' }}>
              <Tabs
                style={{
                  padding: '0px',
                }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  label="My Exams"
                  {...a11yProps(0)}
                  style={{ fontSize: '14px', textTransform: 'none' }}
                  className={classes.tabPaneFont}
                />
                <Tab
                  label="My Requests"
                  {...a11yProps(1)}
                  style={{ fontSize: '14px', textTransform: 'none' }}
                  className={classes.tabPaneFont}
                />
                <Tab
                  label="Marks Breakdown"
                  {...a11yProps(2)}
                  style={{ fontSize: '14px', textTransform: 'none' }}
                  className={classes.tabPaneFont}
                />
              </Tabs>
            </Card>
          )}
        </Grid>
        <Grid item xs={12}>
          <TabPanels value={value} index={0}>
            <MyExam />
          </TabPanels>
          <TabPanels value={value} index={1}>
            <StudentService setShowTabs={setShowTabs} />
            {/* <MyRequest data={data} setData={setData} /> */}
          </TabPanels>
          <TabPanels value={value} index={2}>
            <MarksBreak />
          </TabPanels>
        </Grid>
      </Grid>
    </Box>
  );
}
