import React, { useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  Tab,
  Typography,
  Tabs,
  Button,
} from '@material-ui/core';
import styles from './Examinations.module.css';
import Event from '../../assets/Examantions/Events.svg';
import ExamantionIcon from '../../assets/Examantions/ExamantionIcon.svg';
import KenCard from '../../global_components/KenCard';
import MyExam from './MyExam/Index';
import MyRequests from './MyRequests/MyRequests';
import InformationIcon from '../../assets/Examantions/Information.svg';

function TabPanels(props) {
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
        <Box sx={{ p: '10px' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Examinations = () => {
  const [value, setValue] = useState(0);
  const [openModel, setOpenModel] = useState(false);

  const handleChange = (event, newValue) => {
    // setBreadValue(breadCrumbsMenu[newValue])
    setValue(newValue);
  };
  function a11yProps(index) {
    console.log('index', index);
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  return (
    <div className="main">
      <Box className="update_section">
        <Typography className="upadte_title">Updates</Typography>
        <Divider className="divider" />
        <Grid className="update_details" container spacing={2}>
          <Grid className="update_image_grid" item xs={1}>
            <div className="update_details_icon">
              <img src={Event} width="30px" />
            </div>
          </Grid>
          <Grid style={{ marginTop: '5px' }} item xs={9}>
            <Typography className="upadte_details_text_title">
              Events
            </Typography>{' '}
            <Typography className="upadte_details_text_des">Updates</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box className="update_section_blue">
        <Grid className="" container spacing={2}>
          <Grid className="update_image_grid" item xs={1}>
            <div className="update_details_icon_blue">
              <img src={ExamantionIcon} width="30px" />
            </div>
          </Grid>
          <Grid style={{ marginTop: '5px' }} item xs={9}>
            <Typography className="upadte_details_text_title">
              Examinations
            </Typography>{' '}
            <Typography className="upadte_details_text_des">
              Seating Plans Released
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <div className="cardlsitbox tab_list_box">
        <KenCard elevation={0} style={{ padding: 0 }}>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                style={{
                  padding: '0 14px',
                }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                className="testststst"
              >
                <Tab
                  label="My Exams"
                  {...a11yProps(0)}
                  style={{ fontSize: '12px' }}
                />
                <Tab
                  label="My Requests"
                  {...a11yProps(1)}
                  style={{ fontSize: '12px' }}
                />
                <Tab
                  label="Exam History"
                  {...a11yProps(2)}
                  style={{ fontSize: '12px' }}
                />
                {value === 1 && (
                  <div style={{ margin: 'auto', marginRight: '0px' }}>
                    {' '}
                    <Button
                      variant="contained"
                      color="primary"
                      className="apply-btn-text"
                      onClick={() => {
                        setOpenModel(true);
                      }}
                    >
                      {'Apply'}
                    </Button>
                    <img src={InformationIcon} />
                  </div>
                )}
                {/* <Tab
                  label="Exam Fees"
                  {...a11yProps(1)}
                  style={{ fontSize: '12px' }}
                />
                <Tab
                  label="Hall Ticket"
                  {...a11yProps(2)}
                  style={{ fontSize: '12px' }}
                /> */}
              </Tabs>
            </Box>
          </Box>
        </KenCard>
      </div>
      <div style={{ marginTop: '15px' }}>
        {' '}
        <TabPanels value={value} index={0}>
          <MyExam />
        </TabPanels>
        <TabPanels value={value} index={1}>
          <MyRequests openModel={openModel} setOpenModel={setOpenModel} />
        </TabPanels>
        <TabPanels value={value} index={2} style={{ background: '#fff' }}>
          'Exam History'
        </TabPanels>
      </div>
    </div>
  );
};

export default Examinations;
