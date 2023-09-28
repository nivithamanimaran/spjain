import { Box, Button, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import KenCard from '../../global_components/KenCard';
import Invigilation_Proctoring from './Invigilation_Proctoring/Index';
// import MyRequests from './MyRequests/MyRequests';
import { useHistory } from 'react-router-dom';
import EvaluationsHome from './Evaluation/Index';
import ExaminationsHome from './Examinations/ExaminationsHome';

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

const ExaminationsFaculty = () => {
  const [value, setValue] = useState(2);
  const [myReq, setMyReq] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const history = useHistory();
  // const navigate = useNavigate();
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

  const onRedirect = () => {
    // navigate(`https://portal-dev.ken42.com/assessment`);
    window.open('https://portal-dev.ken42.com/assessment');
  };
  return (
    <div className="main">
      {/* <Box className="update_section">
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
      </Box> */}
      {/* <div className="cardlsitbox tab_list_box">
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
              >
                <Tab
                  label="Examinations"
                  {...a11yProps(0)}
                  style={{ fontSize: '12px' }}
                />
                <Tab
                  label="Invigilation/Proctoring"
                  {...a11yProps(1)}
                  style={{ fontSize: '12px' }}
                />
                <Tab
                  label="Evaluation"
                  {...a11yProps(2)}
                  style={{ fontSize: '12px' }}
                />
                {value === 0 && (
                  <div style={{ marginLeft: 'auto' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="apply-btn-text"
                      // href="https://portal-dev.ken42.com/assessment"
                      // target="_blank"
                      onClick={() => {
                        onRedirect();
                      }}
                    >
                      Qn Bank
                    </Button>
                  </div>
                )}
              </Tabs>
            </Box>
          </Box>
        </KenCard>
      </div> */}
      <div style={{ marginTop: '15px' }}>
        {' '}
        {/* <TabPanels value={value} index={0}>
          <Invigilation_Proctoring />
        </TabPanels> */}
        <TabPanels value={value} index={0}>
          <ExaminationsHome />
        </TabPanels>
        <TabPanels value={value} index={1}>
          <Invigilation_Proctoring />
        </TabPanels>
        <TabPanels value={value} index={2} style={{ background: '#fff' }}>
          <EvaluationsHome />
        </TabPanels>
      </div>
    </div>
  );
};

export default ExaminationsFaculty;
