import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Institutefeedback from './Institute';
import Programfeedback from './Program';
import { useState } from 'react';
import KenCardWithoutpadding from '../../components/KenCard/KenCard2';
import ProgramTable from '../Feedbacks/programTable';
import InstituteTable from '../Feedbacks/instituteTable';
import Button from '@material-ui/core/Button';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0} style={{ borderRadius: '8px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  back: {
    color: '#193389',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Work Sans',
  },
}));

export default function Facultyfeedbacks() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [Detail, setDetail] = React.useState('');
  const [disableButton, setDisableButton] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = details => {
    setDetail(details);
    setDisableButton(true);
  };

  return (
    <div className={classes.root}>
      <KenCardWithoutpadding>
        <div>
          {disableButton === false && (
            <AppBar
              position="static"
              style={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '8px',
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                <Tab
                  label="Program"
                  {...a11yProps(0)}
                  style={{ textTransform: 'capitalize' }}
                />
                <Tab
                  label="Institute"
                  {...a11yProps(1)}
                  style={{ textTransform: 'capitalize' }}
                />
                {/* {disableButton ? (
                <Button
                  onClick={() => {
                    setDisableButton(false);
                  }}
                  className={classes.back}
                  style={{
                    marginLeft: '400px',
                    background: 'white',
                    color: '#193389',
                    fontWeight: 'bold',
                  }}
                >
                  Back
                </Button>
              ) : null} */}
              </Tabs>
            </AppBar>
          )}
        </div>
      </KenCardWithoutpadding>
      <div style={{ marginTop: '30px' }}>
        <TabPanel value={value} index={0}>
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

          {disableButton ? (
            <Programfeedback
              programDetail={Detail}
              setDetail={setDetail}
              setDisableButton={setDisableButton}
            />
          ) : (
            <ProgramTable handleClick={handleClick} Detail={Detail} />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {disableButton ? (
            <Institutefeedback
              instituteDetail={Detail}
              setDetail={setDetail}
              setDisableButton={setDisableButton}
            />
          ) : (
            <InstituteTable handleClick={handleClick} Detail={Detail} />
          )}
        </TabPanel>
      </div>
    </div>
  );
}
