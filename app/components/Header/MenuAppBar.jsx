import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import clsx from 'clsx';
import Dropzone from 'react-dropzone';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import { Box, Grid, MenuItem, Menu, Button, Popover } from '@material-ui/core';
import history from '../../utils/history';
import Badge from '@material-ui/core/Badge';
import CameraAltRoundedIcon from '@material-ui/icons/CameraAltRounded';
import {
  getUri,
  userAgentApplication,
} from '../../utils/helpers/userAgentApplication';
import {
  getUserDetails,
  getParentDetails,
  getUserChangeLang,
  logOut,
} from '../../utils/helpers/storageHelper';
import { useGoogleLogout } from 'react-google-login';
import ChevronDownIcon from '../../assets/icons/chevrondown.svg';
import {
  KEY_USER_DETAILS,
  KEY_USER_TYPE,
  KEY_FIRE_REG_TOKEN,
  KEY_USER_CHANGE_LANG,
  KEY_PARENT_DETAILS,
} from '../../utils/constants';
import { useTranslation } from 'react-i18next';
import { KEY_FACULTY_PROFILE_IMAGE } from '../../utils/constants';
import KenSelect from '../../components/KenSelect/index';
import configContext from '../../utils/helpers/configHelper';
import Context from '../../utils/helpers/context';
import Routes from '../../utils/routes.json';
import themeConfig from '../../utils/helpers/themeHelper';
import { unsubscribeMessage } from '../../utils/MessageHelper';
import MailIcon from '../../assets/icons/Mail.svg';
import KenButton from '../../global_components/KenButton';
import {
  getStudentDetails,
  getFacultyDetails,
  getSignature,
} from '../../utils/ApiService';
import KenAvatar from '../KenAvatar';
import { uploadSignature } from '../../utils/ApiService';
import KenDialog from '../../global_components/KenDialog';
import { useTheme } from '@material-ui/core';
import KenLoader from '../KenLoader';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router-dom';
const drawerWidth = 254;

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: theme.palette.KenColors.kenBlack,
    padding: '10px',
    fontSize: '24px',
    lineHeight: '24px',
    fontWeight: '600',
  },
  titleBeforeClick: {
    fontSize: '14px',
  },
  titleAfterClick: {
    fontSize: '24px',
  },


  circle: {
    width: '36px',
    height: '36px',
    lineHeight: '33px',
    borderRadius: '55%',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
  },
  profileCircle: {
    width: '250px',
    height: '250px',
    lineHeight: '75px',
    borderRadius: '50%',
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.KenColors.neutral20,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    background: theme.palette.KenColors.neutral20,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  logo: {
    maxHeight: '40px',
    maxWidth: '40px',
  },

  menuItem: {
    textDecoration: 'none',
    color: theme.palette.KenColors.primary,
    textTransform: 'none',
    padding: '5px 15px',
    fontWeight: '600',
  },
  toolbar: {
    minHeight: 64,
    paddingLeft: 24,
  },

  menuBar: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  actionButton: {
    padding: 0,
    color: 'inherit',
  },
  profileEditButton: {
    marginLeft: '80px',
    marginRight: '80px',
  },

  icon: {
    maxWidth: '24px',
    maxHeight: '24px',
  },


  childTitle: {
    color: theme.palette.KenColors.neutral100,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 16,
  },
  titleName: {
    color: `${theme.palette.KenColors.primary}`,
    fontSize: 12,
    lineHeight: '16px',
  },

  menuItemDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    width: '100%',
    maxWidth: 165,
    minWidth: 150,
  },
  activeMenuChildItem: {
    backgroundColor: theme.palette.KenColors.sideNavItemActiveBackground,
    '& $titleName': {
      color: theme.palette.KenColors.sideNavItemActiveColor,
    },
  },
  changeChild: {
    fontSize: 10,
    color: theme.palette.KenColors.neutral100,
  },
  childName: {
    color: theme.palette.KenColors.neutral700,
  },
  mailPopover: { maxWidth: 300, minWidth: 250 },
  mailItem: {
    color: theme.palette.KenColors.neutral700,
    whiteSpace: 'normal',
    width: '100%',
  },
  mailItemHead: {
    color: theme.palette.KenColors.neutral700,
    padding: '6px 16px',
    borderBottom: `1px solid ${theme.palette.KenColors.neutral100}`,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  mailItemActive: {
    color: theme.palette.KenColors.primary,
  },

  mailSendButtonWrap: {
    padding: '16px',
  },
  padding: {
    padding: '8px',
  },
  leftAligned: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  cameraAvatar: {
    backgroundColor: theme?.palette?.KenColors?.primary,
  },
  pointer: {
    '&:hover': {
      cursor: 'pointer',
    },
  },

  hide: {
    display: 'none',
  },

  typoCourse: {
    color: theme.palette.KenColors.kenBlack,
    fontSize: 12,
    fontWeight: 500,
  },
  popupHeader: {
    color: theme.palette.KenColors.kenBlack,
    fontWeight: 600,
  },
}));

const lang = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'हिन्दी',
    value: 'hin',
  },
  {
    label: 'Deutsche',
    value: 'de',
  },
];

export default function MenuAppBar(props) {
  //for changing the language
  const { t, i18n } = useTranslation();
  const { openDrawer, setOpenDrawer } = props;
  const kenTheme = useTheme();
  const [profilePicture, setProfilePicture] = useState();
  const { config } = useContext(configContext);
  const { handleSnackbarOpen } = useContext(Context);
  const { changeTheme } = React.useContext(themeConfig);
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const userLang = getUserChangeLang();
  const defaultLang =
    config && config.translation && config.translation.default
      ? config.translation.default
      : false;

  const parentDetails = getParentDetails();
 
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchor, setAnchor] = React.useState(null);
  const openChild = Boolean(anchor);
  const profile = getUserDetails();
  const [mailAnchorEl, setMailAnchorEl] = React.useState(null);
  const [selectedMails, setSelectedMails] = React.useState([]);
  const [facultyList, setFacultyList] = React.useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState([]);
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState();
  const [openDialog, setOpenDialog] = React.useState();
  const historynav = useHistory();
  const data = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));

  // state for dropDown
  const [ln, setLn] = React.useState(userLang || defaultLang || 'en');

  const handleDrop = acceptedFiles => {
  
    let file = acceptedFiles[0];
    if (
      KEY_FACULTY_PROFILE_IMAGE?.ALLOWED_FILE_TYPES?.includes(file?.type) &&
      file.size <= KEY_FACULTY_PROFILE_IMAGE.MAX_FILE_SIZE
    ) {
      const fileURL = URL.createObjectURL(acceptedFiles[0]);
      setDroppedFiles(acceptedFiles);
      setProfilePicture(fileURL);
    } else {
      handleSnackbarOpen('error', t('messages:Supported_Profile_Image_File'));
    }
  };


  const onSaveClick = acceptedFiles => {
    setLoading(true);

    const file = droppedFiles[0];
    const fileType = KEY_FACULTY_PROFILE_IMAGE.TYPE;
    const ContactId = JSON.parse(localStorage.getItem('userDetails'))
      ?.ContactId;
    if (droppedFiles && ContactId && file) {
      uploadSignature(ContactId, fileType, file)
        .then(res => {
          setAnchorEl(null);
          setOpenDialog(false);

          handleSnackbarOpen(
            'success',
            t('messages:Profile_Image_Upload_Success')
          );
          window.location.reload();
          getSignature(ContactId, KEY_FACULTY_PROFILE_IMAGE.TYPE)
            .then(res => {
              const length = res?.files?.length;
              const lastElementOfFiles = res?.files[length - 1];
              setUploadedProfilePicture(lastElementOfFiles);
              setLoading(false);
            })
            .catch(err => {
              console.error('error i get profile picture', err);
              setLoading(false);
            });
        })
        .catch(err => {
          setLoading(false);
          if (err?.response?.data?.hasOwnProperty('storageErrors')) {
            alert(t('messages:Supported_Profile_Image_File'));
          } else {
            alert(t('messages:Something_Wrong'));
            handleSnackbarOpen(
              'error',
              t('messages:Profile_Image_Upload_Error')
            );
          }
        });
    } else {
      setLoading(false);
    }
  };

  const changeLang = event => {
    setLn(event.target.value);
    i18n.changeLanguage(event.target.value);
    localStorage.setItem(
      KEY_USER_CHANGE_LANG,
      JSON.stringify(event.target.value)
    );
  };

  const getSignout = () => {
    const { signOut } = useGoogleLogout({
      redirectUri: getUri(config),
      clientId: getUri(config),
      onLogoutSuccess: () => {
        localStorage.clear();
        history.push('/');
      },
    });
    return signOut;
  };

  const logout = () => {
    if (config.isAdEnabled) {
      if (config.loginType === 'google') {
        getSignout();
      } else {
        unsubscribeMessage(
          config,
          profile,
          parentDetails,
          localStorage.getItem(KEY_FIRE_REG_TOKEN)
        );
        userAgentApplication(config).logout();
        localStorage.removeItem(KEY_USER_DETAILS);
      }
    } else {
      logOut(config, history);
    }
  };
  const handleProfileClick = () => {

    historynav.push(Routes.my360, {
       profilevalue: 1 
    })
  };
  const CameraBadge = () => {
    return (
      <KenAvatar className={`${classes.cameraAvatar} ${classes.pointer}`}>
        <CameraAltRoundedIcon />
      </KenAvatar>
    );
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeChild = event => {
    setAnchor(event.currentTarget);
  };

  const handleCancel = () => {
    setProfilePicture(null);
    setDroppedFiles([]);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setProfilePicture(null);
    setDroppedFiles([]);
  };

  const handleCloseChild = () => {
    setAnchor(null);
  };

  const handleChildren = details => {
    localStorage.setItem(KEY_USER_DETAILS, JSON.stringify(details));
    sessionStorage.removeItem('once');
    history.push('/home');
    window.location.reload();
  };


  const getParentName = () => {
    return JSON.parse(localStorage.getItem(KEY_PARENT_DETAILS));
  };

  const getChildName = () => {
    return getUserDetails().Name || '';
  };

  const handleMail = event => {
    setMailAnchorEl(event.currentTarget);
  };
  const handleMailClose = () => {
    setSelectedMails([]);
    setMailAnchorEl(null);
  };
  const onMailItemClick = mail => () => {
    const index = selectedMails.indexOf(mail);

    if (index < 0) {
      setSelectedMails([...selectedMails, mail]);
    } else {
      selectedMails.splice(index, 1);
      setSelectedMails([...selectedMails]);
    }
  };
  const handleDrawerChanges = () => {
    setOpenDrawer(!openDrawer);
  };
  
  React.useEffect(() => {
    const ContactId = JSON.parse(localStorage.getItem('userDetails'))
      ?.ContactId;

    getSignature(ContactId, KEY_FACULTY_PROFILE_IMAGE.TYPE).then(res => {
      const length = res?.files?.length;
      const lastElementOfFiles = res?.files[length - 1];
      setUploadedProfilePicture(lastElementOfFiles);
    });
  }, []);
  React.useEffect(() => {
    if (data.Type === KEY_USER_TYPE.parent && profile.ContactId) {
      getStudentDetails(profile.ContactId)
        .then(res => {
          const current =
            res.Program_Enrollment.find(item => item.Status === 'Current') ||
            res.Program_Enrollment[0];
          getFacultyDetails(current.hed__Account__c)
            .then(faculty => {
              if (faculty) {
                setFacultyList(faculty);
              }
            })
            .catch(er => {
              console.error('Error fetching faculty list: ', er);
            });
        })
        .catch(err => {
          console.error('error fetching student Details: ', err);
          handleSnackbarOpen('error', t('Student_Not_Found'));
        });
    }
  }, [data.Type]);



  React.useEffect(() => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    if (!openDrawer && !toolbarVisible) {
      setToolbarVisible(true);
    }
  }, [openDrawer, toolbarVisible]);



  return (
    <div className={classes.root}>
      {loading && <KenLoader />}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
        elevation={0}
      >
        <Toolbar classes={{ root: classes.toolbar }}>
          <IconButton
            size="large"
            edge="start"
            onClick={() => {
              handleDrawerChanges();
              if (isMobileScreen) {
                setToolbarVisible(false);
              }
            }}
            aria-label="open drawer"
            className={clsx(classes.menuButton, {
              [classes.hide]: openDrawer,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Box
            className={clsx(
              classes.title,
              toolbarVisible
                ? classes.titleAfterClick
                : classes.titleBeforeClick
            )}
          >
            {props?.heading || 'Home'}
          </Box>{' '}
          {toolbarVisible && (
            <div>
              <Grid
                container
                spacing={2}
                direction="row"
                justify="center"
                alignItems="center"
              >
                {config.translation && config.translation.enabled && (
                  <Grid item>
                    <KenSelect
                      value={ln}
                      onChange={changeLang}
                      options={lang}
                      placeholder={t('Change_Language')}
                    />
                  </Grid>
                )}
                {config.isThemeEnabled && (
                  <Grid item>
                    <Button color="primary" onClick={() => changeTheme()}>
                      {t('Change_Theme')}
                    </Button>
                  </Grid>
                )}

                {data.Type === KEY_USER_TYPE.parent && (
                  <Grid item>
                    <IconButton
                      className={classes.actionButton}
                      onClick={handleMail}
                    >
                      <img
                        src={MailIcon}
                        alt="search"
                        className={classes.icon}
                      />
                    </IconButton>
                    <Popover
                      id="menu-appbar-mail"
                      anchorEl={mailAnchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      open={Boolean(mailAnchorEl)}
                      onClose={handleMailClose}
                      classes={{ paper: classes.mailPopover }}
                    >
                      <Typography className={classes.mailItemHead}>
                        {t('Mail_To_Head')}
                      </Typography>

                      {config?.contacts?.length &&
                        config?.contacts
                          .filter(el => !!el.mail)
                          .map(contact => (
                            <MenuItem
                              onClick={onMailItemClick(contact.mail)}
                            >
                              <Typography
                                className={{
                                  [classes.mailItem]: true,
                                  [classes.mailItemActive]: selectedMails.includes(
                                    contact.mail
                                  ),
                                }}
                              >
                                {contact.name}
                              </Typography>
                            </MenuItem>
                          ))}
                      {facultyList?.length > 0
                        ? facultyList
                            .filter(el => !!el.mail)
                            .map(faculty => (
                              <MenuItem
                                onClick={onMailItemClick(faculty.mail)}
                              >
                                <Typography
                                  className={{
                                    [classes.mailItem]: true,
                                    [classes.mailItemActive]: selectedMails.includes(
                                      faculty.mail
                                    ),
                                  }}
                                >
                                  {faculty.Name}
                                </Typography>
                              </MenuItem>
                            ))
                        : null}

                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        className={classes.mailSendButtonWrap}
                      >
                        <KenButton
                          disabled={selectedMails.length === 0}
                          variant="primary"
                          onClick={() => {
                            window.open(`mailto:${selectedMails.join(',')}`);
                          }}
                        >
                          {t('labels:Send')}
                          {/* </a> */}
                        </KenButton>
                      </Box>
                    </Popover>
                  </Grid>
                )}
                <Grid item className={classes.menuBar}>
      
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    className={classes.actionButton}
                  >
                    {uploadedProfilePicture ? (
                      <KenAvatar
                        src={`data:image/png;base64, ${
                          uploadedProfilePicture?.body
                        }`}
                      />
                    ) : (
                      <KenAvatar
                        className={classes.circle}
                        url={profilePicture}
                      >
                        {data.Type === KEY_USER_TYPE.parent
                          ? getParentName()?.Name[0]
                          : data.Name.charAt(0)}
                      </KenAvatar>
                    )}
                  </IconButton>
                </Grid>
                <Grid item>
                  <>
                    <Grid container direction="column">
                      <Grid item>
                        <Link
                          style={{ textDecoration: 'none', color: '#000000' }}
                        >
                          {data.Name}
                        </Link>
                      </Grid>

                      <Grid item>
                        <Typography className={classes.typoCourse}>
                          {profile.Type === 'Faculty' ? 'Faculty' : 'Student'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
                {data.Type === KEY_USER_TYPE.parent && (
                  <Grid item>
                    <Grid item container onClick={handleChangeChild}>
                      <Grid>
                        <Typography
                          variant="body2"
                          className={classes.changeChild}
                        >
                          {t('Change_Child')}
                        </Typography>
                        <Typography
                          variant="body1"
                          className={classes.childName}
                        >
                          {getChildName()}
                        </Typography>
                      </Grid>
                      <Grid item alignItems="center">
                        <img src={ChevronDownIcon} />
                      </Grid>
                    </Grid>
                  </Grid>
        
                )}
              </Grid>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
                getContentAnchorEl={null}
                PaperProps={{ className: classes.padding }}
              >
                {profile && profile.Type == KEY_USER_TYPE.faculty && (
                  <>
                    {' '}
                    <MenuItem onClick={() => setAnchorEl(null)}>
           
                        <Typography className={classes.menuItem} onClick={handleProfileClick}>
                        {t('Profile')}

                      </Typography>
                    </MenuItem>
  
                  </>
                )}

                {profile && profile.Type == KEY_USER_TYPE.student && (
                  <MenuItem onClick={() => setAnchorEl(null)}>
                     <Typography className={classes.menuItem} onClick={handleProfileClick}>
                        {t('Profile')}

                      </Typography>
                  </MenuItem>
                )}


                <MenuItem onClick={handleClickOpen}>
                  <div className={classes.menuItem}>
                    {t('Edit Profile Image')}
                  </div>
                </MenuItem>
  
                <MenuItem>
                  <div onClick={logout} className={classes.menuItem}>
                    {t('Sign_Out')}
                  </div>
                </MenuItem>
              </Menu>
              <Menu
                id="menu"
                anchorEl={anchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'bottom',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={openChild}
                onClick={handleCloseChild}
                getContentAnchorEl={null}
              >
                <div style={{ marginTop: 16 }}>
                  <div className={classes.childTitle}>{t('Change_Child')}</div>
                  {parentDetails &&
                    parentDetails.RelatedTO.map(el => {
                      return (
                        <MenuItem
                          className={{
                            [classes.activeMenuChildItem]:
                              el.Name === getChildName(),
                          }}
                        >
                          <div
                            className={classes.menuItemDiv}
                            onClick={() => {
                              handleChildren(el);
                            }}
                          >
                            <div className={classes.circle}>
                              {el.Name.charAt(0)}
                            </div>
                            <div style={{ marginLeft: 8 }}>
                              <div className={classes.titleName}>{el.Name}</div>
                
                            </div>
                          </div>
                        </MenuItem>
                      );
                    })}
                </div>
              </Menu>
            </div>
          )}
        </Toolbar>
        <KenDialog
          open={openDialog}
          handleClose={handleClose}
          handleClickOpen={handleClickOpen}
          positiveButtonText={t('labels:Save')}
          negativeButtonText={t('labels:Cancel')}
          negativeButtonClick={handleCancel}
          positiveButtonProps={{
            onClick: onSaveClick,
            disabled: !profilePicture,
          }}
          negativeButtonProps={{
            disabled: !profilePicture,
          }}
          maxWidth="xs"
          title={
            <Box className={classes.leftAligned}>
              <Typography className={classes.popupHeader}>
                {t('labels:Edit_Profile_Image')}
              </Typography>
              <CloseIcon
                fontSize="small"
                onClick={handleClose}
                className={classes.pointer}
              />
            </Box>
          }
          titleStyle={classes.titleHead}
          dialogActions={true}
        >

          <Box>
            <Badge
              className={classes.profileEditButton}
              overlap="circular"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
    
              badgeContent={
                <Dropzone onDrop={handleDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: classes.dropZone })}>
                      <input {...getInputProps()} />
                      <CameraBadge />
           
                    </div>
                  )}
                </Dropzone>
              }
            >
              {' '}
              {profilePicture ? (
                <KenAvatar
                  className={classes.profileCircle}
                  url={profilePicture}
                />
              ) : uploadedProfilePicture?.body ? (
                <KenAvatar
                  className={classes.profileCircle}
                  src={`data:image/png;base64, ${uploadedProfilePicture?.body}`}
                />
              ) : (
                <KenAvatar
                  className={classes.profileCircle}
                  url={profilePicture}
                />
              )}
            </Badge>
          </Box>
    
        </KenDialog>
        <div
          style={{
            height: '2px',
            width: '80%',
            marginLeft: '30px',
            background:
              'linear-gradient(176.94deg, #D3E2EA 56.53%, #FFFFFF 99.84%)',
          }}
        />
      </AppBar>
    </div>
  );
}
