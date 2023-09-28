import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import {
  Grid,
  Box,
  Drawer,
  Accordion,
  AccordionDetails,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  AccordionSummary,
} from '@material-ui/core';
import { AiOutlineDown } from 'react-icons/ai';
import KenCard from '../../global_components/KenCard';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Current from './components/current/index';
import AttendanceHistory from './components/attendanceHistory/index';
const drawerWidth = 260;
const useStyles = makeStyles(theme => ({
  mainContainer: {
    display: 'flex',
    background: theme.palette.KenColors.background,
    padding: '0 32px',
    minHeight: '100vh',
    marginTop: 64,
    overflow: 'hidden',
  },
  containerWrap: {
    width: 'calc(100% - 260px)',
  },
  appBar: {
    [theme.breakpoints.up('smUp')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      zIndex: 1000,
    },
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerOpen: {
    width: drawerWidth,
    overflow: 'hidden',
    background: '#092682',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.KenColors.kenLogoColor,
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: 65,
    },
    [theme.breakpoints.down('xs')]: {
      width: 65,
    },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00218D',
  },
  AccordionDetailsStyle: {
    display: 'Block',
  },
  annoucementTable: {
    width: '100%',
  },
  annoucementTab: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    background: '#F4F5F7',
    border: ' 0.6px dashed #DFE1E6',
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tabs: {
    '& .MuiPaper-root': {
      padding: '0px',
      backgroundColor: 'red',
    },
  },
  root: {
    '& .MuiPaper-root': {
      padding: '0px',
    },
  },

  cardWrap: {
    backgroundColor: 'red',
    'border-bottom-left-radius': 0,
    'border-bottom-right-radius': 0,
    '& .MuiPaper-root': {
      padding: '0px',
      backgroundColor: 'red',
    },
  },
  tabpad: {
    paddingBottom: '1em',
    '& > div ': {
      boxShadow: 'none !important',
    },
  },
  tabPaneFont: {
    fontSize: 14,
    fontWeight: 500,
    color: '#000000',
    textTransform: 'capitalize',
    '&.selected': {
      color: '#193389 !important',
    },
  },
  toolbar: theme.mixins.toolbar,
  '& .MuiTabs-indicator': {
    left: '20px !important',
    widtth: '120px !important',
  },
  attBoxpad: {
    padding: '30px',
    ['@media (max-width:600px)']: {
      padding: '20px 0px',
    },
  },
  tabhead: {
    paddingLeft: '1em',
    ['@media (max-width:600px)']: {
      paddingLeft: '5em',
    },
  },
  tabpanel: {
    [theme.breakpoints.down('sm')]: {
      background: 'none !important',
    },
  },
  selected: {
    color: '#193389',
    fontSize: 14,
    fontWeight: 500,
  },
}));

const menus = [
  {
    icon: '',
    label: 'EXAM DETAILS',
    // path: routes.dashboard,
  },
  {
    icon: '',
    label: 'EXAM FEES',
    // path: routes.currentProgrammes,
  },
  {
    icon: '',
    label: 'HALL TICKETS',
    // path: routes.currentProgrammes,
  },
];
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
const Attendance = props => {
  props.setHeading("Attendance")
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = React.useState(true);
  const [cOfferingId, setCOfferingId] = React.useState('');

  const handleClick = () => {
    history.push('/app/academics-planner');
  };
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
  const handleChangeAccordien = () => {
    setExpanded(!expanded);
  };
  return (
    <Box>
      <div
        className={`${classes.cardlsitbox} ${classes.tabpad} ${classes.root}`}
      >
        <KenCard
          elevation={0}
          paperStyles={{
            paddingLeft: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <Box className={classes.tabhead}>
            <Box
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                // padding: '0 25px',
              }}
            >
              <Tabs
                style={{
                  padding: '0px',
                }}
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                className={classes.tabs + 'hinew'}
              >
                <Tab
                  label="Overview"
                  {...a11yProps(0)}
                  style={{ fontSize: '14px', textTransform: 'none' }}
                  className={classes.tabPaneFont}
                  classes={{ selected: classes.selected }}
                />
                <Tab
                  label="Attendance History"
                  {...a11yProps(1)}
                  style={{ fontSize: '14px', textTransform: 'none' }}
                  className={classes.tabPaneFont}
                  classes={{ selected: classes.selected }}
                />
              </Tabs>
            </Box>
          </Box>
        </KenCard>
      </div>
      <TabPanels
        value={value}
        index={0}
        style={{ background: '#fff', minHeight: 400, borderRadius: '8px' }}
      >
        <Current />
      </TabPanels>
      <TabPanels
        value={value}
        index={1}
        style={{ background: '#fff', minHeight: 400, borderRadius: '8px' }}
      >
        <AttendanceHistory />
      </TabPanels>
    </Box>
  );
};

export default Attendance;
