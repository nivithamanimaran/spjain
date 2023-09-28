import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
// import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import { Link, NavLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import {
  getUserDetails,
  getParentDetails,
} from '../../utils/helpers/storageHelper';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import history from '../../utils/history';
import { useTranslation } from 'react-i18next';
import ken42Logo from '../../assets/Ken42logo.png';
import Logo from '../../assets/spJainTitle.png';
import logo from '../../assets/spJainLogo.png';
import configContext from '../../utils/helpers/configHelper';
import {
  KEY_USER_TYPE,
  KEY_PORTAL_TYPE,
  KEY_FIRE_REG_TOKEN,
  KEY_PARENT_DETAILS,
  KEY_USER_DETAILS,
} from '../../utils/constants';
import Routes from '../../utils/routes.json';
import { unsubscribeMessage } from '../../utils/MessageHelper';
import {
  getMarketplaceURL,
  getAttributes,
  createAttribute,
  getContactDetails,
} from '../../utils/ApiService';
import context from '../../utils/helpers/context';
import ProtectedComponent from '../../utils/rbac/ProtectedComponent';
import IconButton from '@material-ui/core/IconButton';

//icons
import Home from '@material-ui/icons/Home';
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag';
import ClassOutlinedIcon from '@material-ui/icons/ClassOutlined'; // classroom
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined'; // event
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined'; //time table
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined'; // course , report card
import LibraryAddCheckOutlinedIcon from '@material-ui/icons/LibraryAddCheckOutlined'; //essentials
import EventOutlinedIcon from '@material-ui/icons/EventOutlined'; // course
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined'; // my student
import StoreOutlinedIcon from '@material-ui/icons/StoreOutlined'; // market
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined'; //Lms dashboard
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined'; // account
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import AutorenewOutlinedIcon from '@material-ui/icons/AutorenewOutlined'; // fee
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import KenDialog from '../../components/KenDialogBox/index';
import KenCheckbox from '../../global_components/KenCheckbox';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
//ICONS
import { FaRupeeSign, FaUserGraduate } from 'react-icons/fa';
import { RiOrganizationChart } from 'react-icons/ri';
import { AiFillCalendar } from 'react-icons/ai';
import { ImPencil } from 'react-icons/im';
import { IoIosRibbon } from 'react-icons/io';
import { VscHome } from 'react-icons/vsc';
import { BsFillFileSpreadsheetFill } from 'react-icons/bs';
import { GiArchiveResearch } from 'react-icons/gi';
import CustomMenuItem from './CustomMenuItem';
import { List, Menu } from '@material-ui/core';
import NestedMenuItem from './NestedMenuItem';
import HelpOutlineSharpIcon from '@material-ui/icons/HelpOutlineSharp';
import ListAltSharpIcon from '@material-ui/icons/ListAltSharp';
import { hasChildren } from './hasChilder';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CollapseIcon from '../../assets/svg/sideNav/collapse.svg';
import HomeIcon from '../../assets/svg/sideNav/home.svg';
import My360Icon from '../../assets/svg/sideNav/my360.svg';
import AcademicsIcon from '../../assets/svg/sideNav/academics.svg';
import LearnIcon from '../../assets/svg/sideNav/learn.svg';
import ExaminationsIcon from '../../assets/svg/sideNav/examinations.svg';
import ResultsIcon from '../../assets/svg/sideNav/results.svg';
import FeesIcon from '../../assets/svg/sideNav/fees.svg';
import EventsIcon from '../../assets/svg/sideNav/events.svg';
import FeedbackIcon from '../../assets/svg/sideNav/feedback.svg';
import ResourcesIcon from '../../assets/svg/sideNav/resources.svg';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { Toolbar } from '@material-ui/core';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';

// import './index.css';
const drawerWidth = 254;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    // flex: 1,
  },
  root1: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  drawer: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    width: drawerWidth,
    whiteSpace: 'nowrap',
    background: `url(${ken42Logo})`,
    backgroundRepeat: 'round',
  },
  drawerPaper: {
    width: drawerWidth,
    zIndex: 99999,
    // background: theme.palette.KenColors.drawerBackground,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      zIndex: 1,
      paddingTop: 105,
    },
  },
  displayDrawer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '91vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 0,
    paddingTop: '15px',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 6px #d1d1d1`,
      webkitBoxShadow: `inset 0 0 6px #d1d1d1`,
      backgroundColor: `inset 0 0 6px #d1d1d1`,
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `inset 0 0 6px #d1d1d1`,
      opacity: '0.1',
      outline: `1px solid ${theme.palette.KenColors.neutral100}`,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    marginTop: 16,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 8,
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 0, 2),
    padding: theme.spacing(0, 2, 2, 2),
  },
  poweredBy: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px 10px',
  },
  logo: {
    maxHeight: 48,
    //   maxWidth: 160,
  },
  title: {
    fontSize: '10px',
    margin: theme.spacing(0, 2),
    color: theme.palette.KenColors.kenWhite,
    textAlign: 'end',
  },
  resources: {
    // margin: theme.spacing(0, 2),
    // paddingLeft: '32px',
    // marginLeft: 25,
    padding: 0,
  },
  subLevel: {
    // marginLeft: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: theme.palette.KenColors.kenWhite,
    height: 'auto',
    // '&:hover': {
    //   color: 'white',
    // },
  },
  link: {
    textDecoration: 'none',
    backgroundColor: 'inherit',
    color:
      theme.palette.KenColors.sideNavColor || theme.palette.KenColors.primary,
  },
  userName: {
    marginTop: 20,
    fontSize: 20,
    color: theme.palette.KenColors.kenWhite,
  },
  studentClassItem: {
    marginTop: 20,
    fontSize: 14,
    color: theme.palette.KenColors.kenWhite,
  },
  heading: {
    marginLeft: 24,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '0.875rem',
    lineHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.KenColors.kenWhite,
  },
  subHeading: {
    marginLeft: 32,
    fontSize: '0.875rem',
    color: theme.palette.KenColors.kenWhite,
  },
  contentDisabled: {
    // cursor: "not-allowed",
    textDecoration: 'none',
    pointerEvents: 'none',
  },
  menuIcon: {
    color: theme.palette.KenColors.kenWhite,
  },
  subListItem: {
    // marginLeft: 4,
    '&:hover': {
      backgroundColor: theme.palette.KenColors.sideNavItemHoverBackground,
      '& $subLevel': {
        color: theme.palette.KenColors.sideNavItemHoverColor,
      },
      '& $heading': {
        color: theme.palette.KenColors.sideNavItemHoverColor,
      },
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.KenColors.sideNavItemActiveBackground,
      color: 'white',
      fontWeight: 600,
    },
  },
  listItem: {
    padding: '8px 20px',
    // marginLeft: 4,
    '&:hover': {
      backgroundColor: theme.palette.KenColors.sideNavItemHoverBackground,
      '& $subLevel': {
        color: theme.palette.KenColors.sideNavItemHoverColor,
      },
      '& $heading': {
        color: theme.palette.KenColors.sideNavItemHoverColor,
      },
    },
    '&.Mui-selected': {
      backgroundColor: 'turquoise',
      color: 'white',
      fontWeight: 600,
    },
  },
  listItemSubLevel: {
    height: 'auto',
  },
  divider: {
    background: theme.palette.KenColors.background,
    height: 2,
  },
  active: {
    '& $listItem': {
      // borderLeft: `4px solid ${theme.palette.KenColors.kenWhite}`,
      marginLeft: 0,
      backgroundColor: theme.palette.KenColors.sideNavItemActiveBackground,
    },

    '& $subListItem': {
      // borderLeft: `4px solid ${theme.palette.KenColors.kenWhite}`,
      marginLeft: 0,
      backgroundColor: theme.palette.KenColors.sideNavItemActiveBackground,
    },

    '& $heading': {
      color: theme.palette.KenColors.sideNavItemActiveColor,
    },
    '& $subLevel': {
      color: theme.palette.KenColors.sideNavItemActiveColor,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.KenColors.sideNavItemActiveBackground,
      color: 'white',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: theme.palette.KenColors.sideNavItemActiveBackground,
        // color: 'white',
      },
    },
  },
  FS: {
    color: theme.palette.KenColors.neutral100,
    fontSize: '14px',
    marginLeft: '32px',
  },
  gradeIcon: {
    color: theme.palette.KenColors.neutral100,
  },
  displayPic: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  name: {
    fontSize: '14px',
    color: theme.palette.KenColors.primary,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    // background: theme.palette.KenColors.sideNavBackground,
    // backgroundImage: `url("https://inazstgpfs3001.blob.core.windows.net/assets/Untitled%20design%20(4).png")`,
    // backgroundImage: `url('https://inazstgpfs3001.blob.core.windows.net/assets/spjain-sidenavImg.png')`,
    background: '#090F69',
    // backgroundColor: theme.palette.KenColors.sideNavBackground,
    backgroundRepeat: 'round',
  },
  drawerOpen: {
    // background: theme.palette.KenColors.primary,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zIndex: 1,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: 16,
    // background: theme.palette.KenColors.primary,
    overflowX: 'hidden',
    zIndex: 1100,
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
      // width: 0,
      border: 'none',
    },
    // [theme.breakpoints.down('xs')]: {
    //   // width: 65,
    //   width: 0,
    //   border: 'none',
    // },
    // [theme.breakpoints.up('xs')]: {
    //   // width: 69,
    //   width: 0,
    //   border: 'none',
    // },
  },
  closeIcon: {
    // color: theme.palette.KenColors.kenWhite,
    // marginRight: 10,
    cursor: 'pointer',
  },
  topContainer: {
    // background: theme.palette.KenColors.backgroundSideNav,
    // background: '#0f182b',
    // background: '#fff',
    marginTop: 16,
    padding: '8px 16px',
  },
  dialogPaper: {
    height: 'none',
  },
  dialogTitle: {
    color: theme.palette.KenColors.kenBlack,
  },
  dialogAgree: {
    fontSize: 12,
  },
  popover: {
    // marginTop: '-25px',
    backgroundColor: '#121b2f',
  },
  header: {
    padding: '8px 16px',
    color: theme.palette.KenColors.kenWhite,
    fontSize: '14px',
    fontWeight: 600,
  },
  // activeLinkInner: {
  //   backgroundColor: theme.palette.KenColors.kenBlack,
  //   // '&:hover': {
  //     '& $subLevel': {
  //       color: theme.palette.KenColors.sideNavItemHoverColor,
  //       backgroundColor: theme.palette.KenColors.kenBlack,
  //     },
  //     '& $heading': {
  //       color: theme.palette.KenColors.sideNavItemHoverColor,
  //       backgroundColor: theme.palette.KenColors.kenBlack,
  //     },
  //   },
  //   '&.Mui-selected': {
  //     backgroundColor: 'turquoise',
  //     color: 'white',
  //     fontWeight: 600,
  //   // },
  // },
  subMenu: {
    paddingLeft: 36,
  },
  menuIcon: {
    color: 'white',
    minWidth: 48,
  },
  subMenuText: {
    fontSize: '0.725rem',
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    color: 'white',
  },
  menuItemText: {
    fontSize: '0.875rem',
    color: 'white',
    fontFamily: 'Work Sans, sans-serif',
  },
  logoWrap: {
    width: 170,
    display: 'inline-block',
  },
}));

const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14,
  },
}))(Tooltip);

export default function SideDrawer(props) {
  const { openDrawer, setOpenDrawer, mobileScreen, setHeading } = props;
  const { config } = useContext(configContext);
  const { handleSnackbarOpen } = useContext(context);
  const theme = useTheme();
  var showDrawer = props.showDrawer;

  const [menuItem, setMenuItem] = React.useState([]);
  const [menuPosition, setMenuPosition] = React.useState(null);
  const [selectedSubItems, setSelectedSubItems] = React.useState([]);
  const [marketDialogData, setMarketDialogData] = React.useState({
    value: true,
  });

  // for language translation
  const { t } = useTranslation();
  const appConfig = {
    // logo: 'https://inazstgpfs3001.blob.core.windows.net/assets/ken42_logo.png',
    logoAlt: 'logoAlt',
    title: KEY_PORTAL_TYPE.faculty,
    studentTitle: KEY_PORTAL_TYPE.student,
    parentTitle: KEY_PORTAL_TYPE.parent,
  };

  const handleGetAttribute = () => {
    getAttributes(profile?.ContactId)
      .then(res => {
        if (!res?.Message) {
          res?.forEach(el => {
            if (el?.name === 'marketDialog') {
              setMarketDialogData(el);
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleClose = () => {
    if (checkedValue === true) {
      const data = {
        attributes: [
          {
            Id: marketDialogData?.Id || 0,
            contactId: profile.ContactId,
            name: 'marketDialog',
            value: false,
          },
        ],
      };
      createAttribute({ attributes: data?.attributes }).then(res => {
        if (res.Message === 'Information updated') {
          handleMarketPlace();
          setOpenDialogMarket(false);
          setMarketDialogData(prev => {
            return { ...prev, value: false };
          });
        }
      });
    }
  };

  const handleDrawerOpen = () => {
    // setOpen(true);
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const classes = useStyles();
  const [poweredBy] = React.useState(false);
  const [showResources] = React.useState(false);
  //const [toggleClass, setToggleClass] = React.useState(false);
  const [openDialogMarket, setOpenDialogMarket] = React.useState();
  const [accessValue, setAccessValue] = useState(false);
  const [loading, setLoading] = React.useState();
  const [checkedValue, setCheckedValue] = React.useState();
  // const profile = getUserDetails();
  const parentProfile = getParentDetails();

  const [profile, setProfile] = React.useState(getUserDetails());

  useEffect(() => {
    let heading = sessionStorage.getItem('heading') || '';
    if (heading) {
      setHeading(heading);
    }
  }, []);

  const logout = () => {
    unsubscribeMessage(
      config,
      profile,
      parentProfile,
      localStorage.getItem(KEY_FIRE_REG_TOKEN)
    );
    localStorage.clear();
    localStorage.removeItem(KEY_USER_DETAILS);
    history.push('/');
  };

  const getCurrentProfile = () => {
    return profile.Type === KEY_USER_TYPE.parent ? parentProfile : profile;
  };

  const handleMarketPlace = async () => {
    const currentProfile = getCurrentProfile();
    if (currentProfile?.Name && currentProfile?.mail) {
      let firstName = currentProfile.Name.split(' ')[0];
      let params = `email=${currentProfile.mail}&first_name=${firstName}`; //`/${UrlEndPoints.authenticate}?UniqueId=${email}` "email"
      const url = await getMarketplaceURL(params);
      window.open(url, '_blank');
    } else {
      handleSnackbarOpen(KEY_STATUS.warning, t('messages:Marketplace_Error'));
    }
  };

  const getParentName = () => {
    return JSON.parse(localStorage.getItem(KEY_PARENT_DETAILS));
  };

  const faculty = [
    {
      id: 1,
      icon: (
        <img src={HomeIcon} style={{ fontSize: '24px' }} alt="HomeIcon-Logo" />
      ),
      label: 'Home',
      link: `/${Routes.home}`,
      isParent: false,
      callback: null,
    },
    {
      id: 2,
      icon: (
        <img src={My360Icon} style={{ fontSize: '24px' }} alt="My360-Logo" />
      ),
      label: 'My 360',
      link: `/${Routes.my360}`,
      isParent: false,
      callback: null,
    },

    {
      id: 3,
      icon: (
        <img
          src={AcademicsIcon}
          style={{ fontSize: '24px' }}
          alt="AcademicsLogo"
        />
      ),
      label: 'Academics',
      link: `/${Routes.facultyAcademics}`,
      callback: null,
      feature: 'facultyAcademics',
      action: 'view',
      isParent: true,
      subItems: [
        // {
        //   id: 1,
        //   icon: <EventOutlinedIcon />,
        //   label: 'Dashboard',
        //   link: `/${Routes.facultyAcademics}`,
        //   callback: null,
        //   feature: 'dashboard',
        //   isParent: false,
        //   action: 'view',
        //   isSubSubMenu: true,
        // },
        {
          id: 4,
          icon: (
            <img
              src={ExaminationsIcon}
              style={{ fontSize: '24px' }}
              alt="Teach-Logo"
            />
          ),
          label: 'Teach',
          callback: 'https://spjain-test.blackboard.com/',
          isParent: false,
          action: 'view',
          isSubSubMenu: true,
        },
        {
          id: 5,
          icon: <img src={ExaminationsIcon} style={{ fontSize: '24px' }} />,
          label: 'Examinations',
          link: `/${Routes.facultyExams}`,
          callback: null,
          isParent: false,
          action: 'view',
          isSubSubMenu: true,
        },
        {
          id: 6,
          icon: <GroupOutlinedIcon />,
          label: 'Attendance',
          link: `/${Routes.facultyAttendance}`,
          callback: null,
          feature: 'studentsByOffering',
          isParent: false,
          action: 'view',
          isSubSubMenu: true,
        },
        // {
        //   id: 4,
        //   icon: <img src={ExaminationsIcon} style={{ fontSize: '24px' }} />,
        //   label: 'Examinations',
        //   link: `/${Routes.examinationsFaculty}`,
        //   callback: null,
        //   isParent: false,
        //   action: 'view',
        //   isSubSubMenu: true,
        // },
        // {
        //   id: 2,
        //   icon: <EventNoteOutlinedIcon />,
        //   label: 'Gradebook',
        //   link: `/${Routes.gradeBook}`,
        //   callback: null,
        //   feature: 'grades',
        //   isParent: false,
        //   action: 'view',
        //   isSubSubMenu: true,
        // },

        // {
        //   id: 5,
        //   icon: <img src={ResultsIcon} style={{ fontSize: '24px' }} />,
        //   label: 'Result',
        //   link: `/${Routes.facultyresult}`,
        //   callback: null,
        //   feature: 'facultyresult',
        //   isParent: false,
        //   action: 'view',
        //   isSubSubMenu: true,
        // },
      ],
    },

    {
      id: 10,
      icon: <SettingsInputAntennaIcon style={{ fontSize: 24 }} />,
      label: 'Interview',
      link: `/${Routes.myStudents}`,
      callback: null,
      feature: 'FacultyOnboard',
      action: 'view',
    },
    {
      id: 7,
      icon: <PersonOutlinedIcon />,
      label: 'My Students',
      link: `/${Routes.studentsByOffering}`,
      callback: null,
      feature: 'attendance',
      isParent: false,
      action: 'view',
    },
    {
      id: 8,
      icon: <CalendarTodayOutlinedIcon style={{ fontSize: '24px' }} />,
      label: 'Calendar',
      link: `/${Routes.timetable}`,
      callback: null,
      feature: 'timetable',
      isParent: false,
      action: 'view',
    },
    // {
    //   id: 4,
    //   icon: <StoreOutlinedIcon style={{ fontSize: '24px' }} />,
    //   label: 'Faculty Exam',
    //   link: `/${Routes.faculty}`,
    //   callback: null,
    //   // feature: 'facultyProfile',
    //   isParent: false,
    //   action: 'view',
    // },

    // {
    //   id: 4,
    //   icon: <EventAvailableOutlinedIcon />,
    //   label: 'Events',
    //   link: `/${Routes.events}`,
    //   callback: null,
    //   feature: 'events',
    //   action: 'view',
    // },
    // {
    //   id: 9,
    //   icon: <img src={EventsIcon} style={{ fontSize: '24px' }} />,
    //   label: 'Events',
    //   link: `/${Routes.eventsModified}`,
    //   callback: null,
    //   feature: 'eventsModified',
    //   action: 'view',
    //   isParent: false,
    // },
    {
      id: 10,
      icon: (
        <img
          src={FeedbackIcon}
          style={{ fontSize: '24px' }}
          alt="Feedback-logo"
        />
      ),
      label: 'Feedback',
      link: `/${Routes.FacultyFeedbacks}`,
      callback: null,
      feature: 'myFeedback',
      isParent: false,
      action: 'view',
    },

    // {
    //   id: 11,
    //   icon: <OutlinedFlagIcon style={{ fontSize: '24px' }} />,
    //   label: 'Faculty Services',
    //   link: `/${Routes.Support}`,
    //   callback: null,
    //   feature: 'facultyServices',
    //   action: 'view',
    //   isParent: false,
    // subItems: [
    //   {
    //     id: 21,
    //     icon: <HelpOutlineSharpIcon />,
    //     label: 'Raise a Case',
    //     link: `/${Routes.raiseRequest}`,
    //     callback: null,
    //     feature: 'raiseCase',
    //     isParent: false,
    //     action: 'view',
    //   },
    //   {
    //     id: 22,
    //     icon: <ListAltSharpIcon />,
    //     label: 'Service List',
    //     link: `/${Routes.serviceList}`,
    //     callback: null,
    //     feature: 'serviceList',
    //     isParent: false,
    //     action: 'view',
    //   },
    // ],
    // },
    // {
    //   id: 6,
    //   icon: <ClassOutlinedIcon />,
    //   label: 'Examinations',
    //   link: `/${Routes.exams}`,
    //   callback: null,
    // },

    // {
    //   id: 7,
    //   icon: <ClassOutlinedIcon />,
    //   label: 'Resources',
    //   link: ``,
    //   callback: 'https://spjain-test.blackboard.com/',
    // },
    // {
    //   id: 8,
    //   icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,
    //   label: 'Faculty Onboard',
    //   link: `/${Routes.FacultyOnboard}`,
    //   callback: null,
    //   feature: 'FacultyOnboard',
    //   action: 'view',
    // },
    // {
    //   id: 81,
    //   icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,
    //   label: 'Faculty Onboard',
    //   link: ` `,
    //   callback: null,
    //   feature: 'FacultyOnboard',
    //   action: 'view',
    //   isParent: true,
    //   subItems: [
    //     {
    //       id: 87,
    //       icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,
    //       label: 'Document FLow',
    //       link: `/${Routes.documentUpload}`,
    //       callback: null,
    //       feature: 'FacultyOnboard',
    //       action: 'view',
    //     },
    //     {
    //       id: 88,
    //       icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,

    //       label: 'Contract FLow',
    //       link: `/${Routes.FacultyOnboard}`,
    //       callback: null,
    //       feature: 'FacultyOnboard',
    //       action: 'view',
    //     },
    //   ]
    // }
    {
      id: 9,
      icon: (
        <img src={HomeIcon} style={{ fontSize: '24px' }} alt="Course-logo" />
      ),
      label: 'Course Document',
      link: `/${Routes.documentUpload}`,
      callback: null,
      feature: 'FacultyOnboard',
      action: 'view',
    },

    {
      id: 10,
      icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,
      label: 'Evaluation Plan',
      link: `/${Routes.evaluationPlan}`,
      callback: null,
      feature: 'evaluationPlan',
      action: 'view',
    },
    // {
    //   id: 10,
    //   icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,

    //   label: 'Contract FLow',
    //   link: `/${Routes.FacultyOnboard}`,
    //   callback: null,
    //   feature: 'FacultyOnboard',
    //   action: 'view',
    // },

    // {
    //   id: 8,
    //   icon: <EventNoteOutlinedIcon />,
    //   label: 'Workload Management',
    //   link: `/${Routes.workload}`,
    //   callback: null,
    //   feature: 'workload',
    //   action: 'view',
    // },

    // {
    //   id: 8,
    //   icon: <EventNoteOutlinedIcon />,
    //   label: 'Grades',
    //   link: `/${Routes.grades}`,
    //   callback: null,
    //   feature: 'grades',
    //   action: 'view',
    // },
    // {
    //   id: 8,
    //   icon: <EventNoteOutlinedIcon />,
    //   label: 'Gradebook',
    //   link: `/${Routes.gradeBook}`,
    //   callback: null,
    //   feature: 'grades',
    //   action: 'view',
    // },

    // {
    //   id: 5,
    //   icon: <EventOutlinedIcon />,
    //   label: 'Course Content',
    //   link: `/${Routes.courseContentCreation}`,
    //   callback: null,
    //   feature: 'courseContent',
    //   action: 'view',
    // },

    // {
    //   id: 12,
    //   icon: <StoreOutlinedIcon style={{ fontSize: '24px' }} />,
    //   label: 'Resources',
    //   // link: 'marketPlace',
    //   callback: handleMarketPlace,
    //   feature: 'marketsPlace',
    //   isParent: false,
    //   action: 'view',
    // },
    // {
    //   id: 7,
    //   icon: <StoreOutlinedIcon style={{ fontSize: '24px' }} />,
    //   label: 'My Students',
    //   link: `/${Routes.myStudents}`,
    //   callback: null,
    //   feature: 'marketsPlace',
    //   action: 'view',
    // },
    // {
    //   id: 10,
    //   icon: <StoreOutlinedIcon />,
    //   label: 'Faculty Exam',
    //   link: `/${Routes.faculty}`,
    //   callback: null,
    //   // feature: 'facultyProfile',
    //   action: 'view',
    // },
    // {
    //   id: 2,
    //   icon: <ClassOutlinedIcon />,
    //   label: 'Classroom',
    //   link: `/${Routes.classroom}`,
    //   callback: null,
    // },
  ];
  const student = [
    {
      id: 1,
      icon: <img src={HomeIcon} style={{ fontSize: '24px' }} />,
      label: 'Home',
      link: `/${Routes.home}`,
      isParent: false,
      callback: null,
    },
    {
      id: 1,
      icon: <img src={My360Icon} style={{ fontSize: '24px' }} />,
      label: 'My 360',
      link: `/${Routes.my360}`,
      isParent: false,
      callback: null,
    },

    // {
    //   id: 2,
    //   icon: <FaUserGraduate style={{ fontSize: '24px' }} />,
    //   label: 'Performance',
    //   link: `/${Routes.Performance}`,
    //   isParent: false,
    //   callback: null,
    //   subItems: [
    //     {
    //       id: 21,
    //       icon: <RiOrganizationChart style={{ fontSize: '24px' }} />,
    //       label: 'My Path',
    //       link: `/${Routes.myPath}`,
    //       callback: null,
    //       feature: 'myPath',
    //       isParent: false,
    //       action: 'view',
    //       isSubSubMenu: true,
    //     },

    //     {
    //       id: 23,
    //       icon: <AiFillCalendar style={{ fontSize: '24px' }} />,
    //       label: 'Calendar',
    //       link: `/${Routes.timetable}`,
    //       callback: null,
    //       feature: 'timetable',
    //       isParent: false,
    //       action: 'view',
    //       isSubSubMenu: true,
    //     },
    //   ],
    // },
    {
      id: 3,
      icon: <img src={AcademicsIcon} style={{ fontSize: '24px' }} />,
      label: 'Academics',
      link: `/${Routes.academics}`,
      isParent: true,
      callback: null,
      subItems: [
        {
          id: 22,
          icon: <AiFillCalendar style={{ fontSize: '24px' }} />,
          label: 'Attendance',
          link: `/${Routes.attendance}`,
          callback: null,
          feature: 'attendance',
          isParent: false,
          action: 'view',
          isSubSubMenu: true,
        },
        {
          id: 31,
          icon: <img src={LearnIcon} style={{ fontSize: '24px' }} />,
          label: 'Learn',
          link: '',
          callback: 'https://spjain-test.blackboard.com/',
          feature: 'learn',
          isParent: false,
          action: 'view',
          isSubSubMenu: true,
        },
        {
          id: 32,
          icon: <img src={ExaminationsIcon} style={{ fontSize: '24px' }} />,
          label: 'Examinations',
          link: `/${Routes.ExamStudent}`,
          callback: null,
          isParent: false,
          action: 'view',
          isSubSubMenu: true,
        },
        {
          id: 33,
          icon: <img src={ResultsIcon} style={{ fontSize: '24px' }} />,
          label: 'Result',
          link: `/${Routes.result}`,
          callback: null,
          feature: 'result',
          action: 'view',
          isSubSubMenu: true,
        },
        {
          id: 34,
          icon: <FaUserGraduate style={{ fontSize: '24px' }} />,
          label: 'Course Enrollments',
          link: `/${Routes.enroll}`,
          callback: null,
          feature: 'enroll',
          action: 'view',
          isParent: false,
          isSubSubMenu: true,
          subItems: [
            {
              id: 341,
              icon: <HelpOutlineSharpIcon />,
              label: 'Completed Enrollments',
              link: `/${Routes.completeEnroll}`,
              callback: null,
              feature: 'enroll',
              isParent: false,
              action: 'view',
              isSubSubMenu: true,
            },
            {
              id: 342,
              icon: <ListAltSharpIcon />,
              label: 'Open Enrollments',
              link: `/${Routes.openEnroll}`,
              callback: null,
              feature: 'enroll',
              isParent: false,
              action: 'view',
              isSubSubMenu: true,
            },
          ],
        },
        // {
        //   id: 511,
        //   icon: <EventOutlinedIcon />,
        //   label: 'Dashboard',
        //   link: ``,
        //   callback: null,
        //   feature: 'dashboard',
        //   action: 'view',
        // },
        // {
        //   id: 511,
        //   icon: <EventOutlinedIcon />,
        //   label: 'Course Content',
        //   link: `/${Routes.courseContentCreation}`,
        //   callback: null,
        //   feature: 'courseContent',
        //   action: 'view',
        // },
      ],
    },
    {
      id: 23,
      icon: <CalendarTodayOutlinedIcon style={{ fontSize: '24px' }} />,
      label: 'Calendar',
      link: `/${Routes.timetable}`,
      callback: null,
      feature: 'timetable',
      isParent: false,
      action: 'view',
    },
    {
      id: 4,
      icon: <img src={FeesIcon} style={{ fontSize: '24px' }} />,
      label: 'Fees',
      link: `/${Routes.feePayment}`,
      callback: null,
      feature: 'feePayment',
      isParent: false,
      action: 'view',
    },
    // {
    //   id: 5,
    //   icon: <img src={EventsIcon} style={{ fontSize: '24px' }} />,
    //   label: 'Events',
    //   link: `/${Routes.eventsModified}`,
    //   callback: null,
    //   feature: 'eventsModified',
    //   isParent: false,
    //   action: 'view',
    // },
    {
      id: 101,
      icon: <img src={FeedbackIcon} style={{ fontSize: '24px' }} />,
      label: 'Feedback',
      link: `/${Routes.Feedbacks}`,
      callback: null,
      feature: 'Feedback',
      isParent: false,
      action: 'view',
    },
    {
      id: 11,
      icon: <img src={FeedbackIcon} style={{ fontSize: '24px' }} />,
      label: 'Student Service',
      link: `/${Routes.studentService}`,
      callback: null,
      isParent: false,
      action: 'view',
    },
    // {
    //   id: 102,
    //   icon: <img src={FeedbackIcon} style={{ fontSize: '24px' }} />,
    //   label: 'StudentService',
    //   link: `/${Routes.studentService}`,
    //   callback: null,
    //   isParent: false,
    //   action: 'view',
    // },
    // {
    //   id: 102,
    //   icon: <OutlinedFlagIcon style={{ fontSize: '24px' }} />,
    //   label: 'Student service',
    //   link: `/${Routes.Support}`,
    //   callback: null,
    //   feature: 'support',
    //   isParent: false,
    //   action: 'view',
    // },
    // {
    //   id: 6,
    //   icon: <GroupOutlinedIcon style={{ fontSize: '24px' }} />,
    //   label: 'Feedback',
    //   link: `/${Routes.feedBack}`,
    //   callback: null,
    //   feature: 'students',
    //   isParent: false,
    //   action: 'view',
    // },
    // {
    //   id: 7,
    //   icon: <img src={ResourcesIcon} style={{ fontSize: '24px' }} />,
    //   label: 'Resources',
    //   link: `'https://spjain-test.blackboard.com/',`,
    //   callback: 'https://spjain-test.blackboard.com/',
    //   feature: 'miscellaneous',
    //   action: 'view',
    //   // isParent: true,
    //   // subItems: [
    //   //   //   {
    //   //   //     id: 71,
    //   //   //     icon: <ListAltSharpIcon style={{ fontSize: '24px' }} />,
    //   //   //     label: 'Mail',
    //   //   //     link: `/${Routes.miscellaneous}`,
    //   //   //     callback: null,
    //   //   //     feature: 'raiseCase',
    //   //   //     isParent: false,
    //   //   //     action: 'view',
    //   //   //     isSubSubMenu: true,
    //   //   //   },
    //   //   //   {
    //   //   //     id: 72,
    //   //   //     icon: <ListAltSharpIcon style={{ fontSize: '24px' }} />,
    //   //   //     label: 'Academic Policies',
    //   //   //     link: `/${Routes.miscellaneous}`,
    //   //   //     callback: null,
    //   //   //     feature: 'serviceList',
    //   //   //     isParent: false,
    //   //   //     action: 'view',
    //   //   //     isSubSubMenu: true,
    //   //   //   },
    //   //   //   {
    //   //   //     id: 73,
    //   //   //     icon: <ListAltSharpIcon style={{ fontSize: '24px' }} />,
    //   //   //     label: 'FAQ',
    //   //   //     link: `/${Routes.miscellaneous}`,
    //   //   //     callback: null,
    //   //   //     feature: 'serviceList',
    //   //   //     isParent: false,
    //   //   //     action: 'view',
    //   //   //     isSubSubMenu: true,
    //   //   //   },
    //   //   // ],
    // },
    // {
    //   id: 911,
    //   icon: <StoreOutlinedIcon style={{ fontSize: '24px' }} />,
    //   label: 'Market Place',
    //   link: 'marketPlace',
    //   callback: handleMarketPlace,
    //   feature: 'marketsPlace',
    //   action: 'view',
    // },
    // {
    //   id: 5,
    //   icon: <GroupOutlinedIcon style={{ fontSize: '24px' }} />,
    //   label: 'Student Services',
    //   link: `/${Routes.raiseRequest}`,
    //   callback: null,
    //   feature: 'myStudents',
    //   action: 'view',
    //   isParent: true,
    //   // subItems: [
    //   //   {
    //   //     id: 21,
    //   //     icon: <HelpOutlineSharpIcon />,
    //   //     label: 'Raise a Case',
    //   //     link: ``,
    //   //     callback: null,
    //   //     feature: 'raiseCase',
    //   //     action: 'view',
    //   //   },
    //   //   {
    //   //     id: 22,
    //   //     icon: <ListAltSharpIcon />,
    //   //     label: 'Service List',
    //   //     link: `/${Routes.serviceList}`,
    //   //     callback: null,
    //   //     feature: 'serviceList',
    //   //     action: 'view',
    //   //   },
    //   // ],
    // },
  ];
  const parent = [
    {
      id: 1,
      icon: <Home />,
      label: 'Home',
      link: `/${Routes.home}`,
      callback: null,
    },
    {
      id: 2,
      icon: <AutorenewOutlinedIcon />,
      label: 'Fee Payment',
      link: `/${Routes.feePayment}`,
      callback: null,
    },
    {
      id: 3,
      icon: <EventNoteOutlinedIcon />,
      label: 'Report Card',
      link: `/${Routes.reports}`,
      callback: null,
    },
    {
      id: 4,
      icon: <EventAvailableOutlinedIcon />,
      label: 'Events',
      link: `/${Routes.events}`,
      callback: null,
    },
    {
      id: 5,
      icon: <TableChartOutlinedIcon />,
      label: 'Timetable',
      link: `/${Routes.timetable}`,
      callback: null,
    },
    {
      id: 6,
      icon: <StoreOutlinedIcon />,
      label: 'Store',
      link: 'marketPlace',
      callback: handleMarketPlace,
    },
    {
      id: 7,
      icon: <AccountBalanceOutlinedIcon />,
      label: 'Account Details',
      link: `/${Routes.accountDetail}`,
      callback: null,
    },
  ];

  const handleTeach = () => {
    window.open('https://spjain-test.blackboard.com/', '_blank');
  };

  React.useEffect(() => {
    let profileArr = [];

    switch (profile?.Type?.toLowerCase()) {
      case KEY_USER_TYPE?.faculty?.toLowerCase():
        profileArr = faculty;
        break;
      case KEY_USER_TYPE?.student?.toLowerCase():
        profileArr = student;
        break;

      case KEY_USER_TYPE?.parent?.toLowerCase():
        profileArr = parent;
        break;

      default:
        profileArr = [];
    }

    return setMenuItem(profileArr);
  }, [profile, marketDialogData, accessValue]);

  const handleMenuClick = (event, item) => {
    console.log('menu clicked', item);
    if (Array.isArray(item.subItems) && item?.subItems?.length > 0) {
      console.log('menu clicked----if', item.subItems);
      setSelectedSubItems(item);
      if (menuPosition) {
        return;
      }
      event.preventDefault();
      let currentTargetRect = event.currentTarget.getBoundingClientRect();
      const event_offsetX = currentTargetRect.top - 25;
      const event_offsetY = currentTargetRect.right;

      setMenuPosition({
        top: event_offsetX,
        left: event_offsetY,
      });
    } else {
      console.log('menu clicked----else');
      setSelectedSubItems([]);
      return null;
    }
  };
  const handleItemClick = event => {
    setMenuPosition(null);
  };
  const MenuItem = ({ item, openDrawer, setOpen }) => {
    const Component = hasChildren(item) ? MultiLevel : SingleLevel;
    return <Component openDrawer={openDrawer} setOpen={setOpen} item={item} />;
  };

  const SingleLevel = ({ item, openDrawer }) => {
    const classes = useStyles();
    return (
      <>
        <NavLink
          // key={key}
          className={classes.link}
          to={item?.link || ''}
          activeClassName={`${classes.active}`}
          exact
          // onClick={
          //   mobileScreen
          //     ? () => {
          //         handleDrawerClose();
          //         setHeading(item.label);
          //       }
          //     : () => {
          //         if (item?.callback !== null) {
          //           window.open(item.callback, '_blank');
          //         }
          //         setHeading(item.label);
          //         handleDrawerOpen();
          //       }
          // }
          onClick={() => {
            if (item.callback !== null) {
              window.open(item.callback, '_blank');
            }
            if (item.label == 'Learn') {
              setHeading('Home');
            } else {
              setHeading(item.label);
            }
            if (mobileScreen) {
              handleDrawerClose();
            } else {
              handleDrawerOpen();
            }
          }}
        >
          <ListItem
            className={
              item.isSubSubMenu ? classes.subListItem : classes.listItem
            }
            style={{
              padding:
                openDrawer === false
                  ? '12px 20px'
                  : item.isSubSubMenu
                  ? '12px 0px 12px 56px'
                  : '12px 24px',
            }}
            button
          >
            <ListItemIcon className={classes.menuIcon}>
              {item.icon}
            </ListItemIcon>

            {openDrawer === true && (
              <ListItemText
                primaryTypographyProps={{
                  className: item.isSubSubMenu
                    ? classes.subMenuText
                    : classes.menuItemText,
                }}
                primary={item.label}
              />
            )}
          </ListItem>
        </NavLink>
      </>
    );
  };

  const MultiLevel = ({ item, key, openDrawer }) => {
    const classes = useStyles();
    const { subItems: children } = item;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
      if (openDrawer === false) {
        return;
      }
      setOpen(prev => !prev);
    };
    useEffect(() => {
      if (openDrawer === false) {
        setOpen(false);
      }
    }, [openDrawer]);

    return (
      <React.Fragment>
        <ListItem
          button
          style={{ paddingLeft: openDrawer === true ? 24 : 0 }}
          onClick={e => handleClick(openDrawer)}
        >
          {openDrawer === true && (
            <>
              <ListItemIcon className={classes.menuIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ className: classes.menuItemText }}
                primary={item.label}
              />
            </>
          )}

          {/* </NavLink> */}

          {/* {open ? (
            <ExpandLessIcon style={{ color: '#fff' }} />
          ) : (
            <ExpandMoreIcon style={{ color: '#fff' }} />
          )} */}
        </ListItem>
        <List
          style={{ color: '#fff', marginTop: openDrawer === false && '-16px' }}
          disablePadding
        >
          {children?.map((child, key) => (
            <MenuItem openDrawer={openDrawer} key={key} item={child} />
          ))}
        </List>
        {/* <Collapse in={open} timeout="auto" unmountOnExit /> */}
      </React.Fragment>
    );
  };

  const customRender = items => {
    if (!Array.isArray(items)) return <></>;
    return items?.map((item, index) => {
      if (item.subItems) {
        return (
          <NestedMenuItem
            label={item.label}
            parentMenuOpen={!!menuPosition}
            PaperProps={{ className: classes.popover }}
            icon={item.icon}
            index={index}
            header={item.label}
          >
            {customRender(item.subItems)}
          </NestedMenuItem>
        );
      }
      return item?.link ? (
        <NavLink
          key={index}
          className={classes.link}
          to={item?.link}
          activeClassName={classes.activeLinkInner}
          exact
          onClick={mobileScreen ? handleDrawerClose : handleDrawerOpen}
        >
          <CustomMenuItem
            key={index}
            onClick={handleItemClick}
            icon={item.icon}
            label={item.label}
            openDrawer={openDrawer}
          />
        </NavLink>
      ) : (
        <CustomMenuItem
          key={index}
          onClick={handleItemClick}
          icon={item.icon}
          label={item.label}
          openDrawer={openDrawer}
          className={classes.navIcon}
        />
      );
    });
  };
  return (
    <div className={classes.root}>
      <Drawer
        variant={props.variant}
        onClose={() => {
          props.drawerChanges();
        }}
        open={props.openDrawer}
        container={props.container}
        anchor={props.anchor}
        ModalProps={{
          keepMounted: props.ModalProps,
        }}
        classes={{
          paper: clsx(classes.drawer, {
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
      >
        <Box
          className={classes.topContainer}
          // alignItems="center"
        >
          {openDrawer ? (
            <>
              <Grid container spacing={1}>
                <Grid item md={12} style={{ textAlign: 'right' }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    className={classes.menuButton}
                  >
                    <img
                      onClick={handleDrawerClose}
                      className={classes.closeIcon}
                      src={CollapseIcon}
                      // style={{ color: '#0f182b' }}
                      alt="collapseIcon"
                    />
                  </IconButton>
                </Grid>
                <Grid item md={12}>
                  <NavLink className={classes?.logoWrap} to={`/${Routes.home}`}>
                    <img
                      src={
                        // logo
                        'https://inazstgpfs3001.blob.core.windows.net/assets/ken42_logo.png'
                      }
                      className={classes.logo}
                      height="54px"
                      width="48px"
                      alt="logo-image"
                    />
                  </NavLink>
                </Grid>
              </Grid>
              {/* <div className={classes.toolbar}> */}

              {/* </div> */}
            </>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              {/* <FormatAlignLeftIcon
                className={classes.closeIcon}
                style={{ color: '#0f182b' }}
              /> */}
            </IconButton>
          )}
        </Box>

        <div className={classes.displayDrawer}>
          <Grid>
            {menuItem?.map((item, key) => (
              <List
                className={!item.isParent ? 'submenu-submenu-padding' : ''}
                component="div"
                activeClassName={classes.activeLinkInner}
                disablePadding
              >
                <MenuItem key={key} openDrawer={openDrawer} item={item} />
              </List>
            ))}
            <Hidden mdUp>
              <Link className={classes.link}>
                <ListItem
                  className={classes.listItem}
                  button
                  key="signOut"
                  onClick={logout}
                >
                  <span>
                    <ArrowBackOutlinedIcon />
                  </span>
                  <span className={classes.heading}>{t('Sign_Out')}</span>
                </ListItem>
              </Link>
            </Hidden>
          </Grid>
        </div>
      </Drawer>
      <KenDialog
        open={openDialogMarket}
        onClose={() => {
          setOpenDialogMarket(false);
        }}
        handleClose={handleClose}
        handleCancel={() => {
          setOpenDialogMarket(false);
        }}
        disabledOk={checkedValue === true ? false : true}
        // handleClickOpen={handleClickOpen}
        maxWidth="xs"
        // titleStyle={classes.titleHead}
        styleOverrides={{ dialogPaper: classes.dialogPaper }}
      >
        <Grid container>
          <Grid item>
            <Typography className={classes.dialogTitle}>
              {t('messages:Accept_Privacy')}
            </Typography>
          </Grid>
          <Grid item container direction="row" alignItems="center">
            <Grid item>
              <KenCheckbox
                value={checkedValue}
                onChange={() => {
                  checkedValue === true
                    ? setCheckedValue(false)
                    : setCheckedValue(true);
                }}
              />
            </Grid>
            <Grid item>
              <Typography className={classes.dialogAgree}>
                {t('messages:I_Agree')}{' '}
                {
                  <a href={config?.marketPlace?.terms} target="_blank">
                    {t('messages:Term_Condition')}
                  </a>
                }{' '}
                and{' '}
                {
                  <a href={config?.marketPlace?.privacyPolicy} target="_blank">
                    {t('messages:Privacy_Policy')}
                  </a>
                }
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </KenDialog>
    </div>
  );
}
