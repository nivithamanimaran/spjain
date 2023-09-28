import React, { Component, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
  Toolbar,
  Grid,
  Button,
  AppBar,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import './index.css';
import KenButton from '../../../global_components/KenButton';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import Routes from '../../../utils/routes.json';
import { Link } from 'react-router-dom';
import ChatLayout from '../../../components/ChatLayout/ChatLayout';
import ChatInput from '../../../components/ChatInput/ChatInput';
import KenDialogBox from '../../../components/KenDialogBox';

const useStyles = makeStyles(theme => ({
  back: {
    fontSize: '12px',
    '&:hover': {
      cursor: 'pointer',
    },
    marginLeft: '-8px',
  },
  iconBack: {
    height: 12,
  },
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00218D',
  },
  grid: {
    minWidth: '13.8vw',
  },
  boxContainer: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
    marginTop: '26px',
    // paddingTop: '62px',
    paddingBottom: '30px',
  },
  headBox: {
    backgroundColor: theme.palette.KenColors.kenWhite,
  },
  redText: {
    color: '#EF4060',
  },
  greenText: {
    color: '#36B37E',
  },
}));

const SubjectDocumnet = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [messageDialog, setMessageDialog] = useState(false);
  function handleMessageDialog() {
    setMessageDialog(prevState => !prevState);
  }
  const handleClickDialoge = () => {
    handleMessageDialog();
  };

  const chatData = [
    {
      sender: true,
      message: `Hey, Could you please let me know which chapters I have to cover
    in UX/UI paper?`,
      profilePic: 'https://ptetutorials.com/images/user-profile.png',
      time: '3 days ago',
    },
    {
      sender: false,
      message: `Hi Nandhini, you should include first 8 chapters in mid semester
      exam.`,
      profilePic: '',
      time: '3 days ago',
    },
    {
      sender: true,
      message: `Okay, Thank you gentleman!`,
      profilePic: 'https://ptetutorials.com/images/user-profile.png',
      time: '3 days ago',
    },
  ];
  const [chats, setChats] = useState(chatData);
  const [typedMessage, setTypedMessage] = useState(
    'Anytime, You are always welcome!'
  );
  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };
  const messageChangeHandler = e => {
    setTypedMessage(e.target.value);
  };

  const sendMessageHandler = () => {
    if (!typedMessage) {
      return;
    }

    setChats(prev => {
      return [
        ...prev,
        {
          sender: false,
          message: typedMessage,
          profilePic: '',
          time: moment(new Date()).fromNow(),
        },
      ];
    });

    setTypedMessage('');
  };

  const [tableData, setData] = useState([
    {
      Sr_No: '1',
      Program: 'Bachelor Of Business Communication',
      Subject: 'Macroeconomics',
      Intake_Year: 'September 2022',
      Year: '2022',
      Status: 'Approved',
      View: '',
    },
    {
      Sr_No: '2',
      Program: 'Master Of Global Business	',
      Subject: 'Dynamics Of Business Communication',
      Intake_Year: 'July 2022',
      // Year: '2022',
      Status: 'Upload Pending',
    },
    {
      Sr_No: '3',
      Program: 'Global MBA',
      Subject: 'Business and Global Economy',
      Intake_Year: 'February 2023',
      // Year: '2022',
      Status: 'Approved',
      View: '',
    },
    {
      Sr_No: '4',
      Program: 'Executive MBA',
      Subject: 'Financial Accounting',
      Intake_Year: 'October 2022',
      // Year: '2022',
      Status: 'Approved',
      View: '',
    },
    {
      Sr_No: '5',
      Program: 'Global MBA',
      Subject: 'Marketing Management',
      Intake_Year: 'February 2023',
      // Year: '2022',
      Status: 'Upload Pending',
      View: '',
    },
  ]);
  const columns = [
    {
      Header: 'SR.NO',
      accessor: 'Sr_No',
      disableGlobalFilter: true,
    },
    {
      Header: 'PROGRAM',
      accessor: 'Program',
      disableGlobalFilter: true,
    },
    {
      Header: 'SUBJECT',
      accessor: 'Subject',
      disableGlobalFilter: true,
    },
    {
      Header: 'INTAKE YEAR',
      accessor: 'Intake_Year',
      disableGlobalFilter: true,
    },
    // {
    //   Header: 'YEAR',
    //   accessor: 'Year',
    //   disableGlobalFilter: true,
    // },
    {
      Header: 'STATUS',
      accessor: 'Status',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div className="action-btn-item">
            {value === 'Upload Pending' ? (
              <div className={classes.redText}>{value}</div>
            ) : (
              <div className={classes.greenText}>{value}</div>
            )}
          </div>
        );
      },
    },
    {
      Header: 'CHAT',
      accessor: 'Chat',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div className="action-btn-item">
            <Button
              className={classes.actionBtn}
              variant="Secondary"
              onClick={() => handleClickDialoge()}
            >
              <SmsOutlinedIcon />
            </Button>
          </div>
        );
      },
    },
    {
      Header: `Actions`,
      accessor: 'Upload ',

      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <>
            <div className="action-btn-item">
              {row.values.Status != 'Approved' ? (
                <Link
                  to={`/${Routes.SubjectDocumentUpload}/${row.id}`}
                  className={classes.actionBtn}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="Secondary">
                    <PublishOutlinedIcon />
                  </Button>
                </Link>
              ) : (
                <Link
                  to={`/${Routes.gradeBook}`}
                  className={classes.actionBtn}
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="Secondary" style={{fontSize: '11px', width: '115px', color: '#0077FF'}}>Gradebook</Button>
                </Link>
              )}
            </div>
          </>
        );
      },
    },
    {
      Header: `VIEW`,
      accessor: 'View ',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div className="action-btn-item">
            {row.values.Status === 'Approved' && (
              <>
                <KenButton
                  className={classes.actionBtn}
                  variant="Secondary"
                  onClick={() => {}}
                >
                  <VisibilityOutlinedIcon />
                </KenButton>
                {/* <KenButton
                  className={classes.actionBtn}
                  variant="Secondary"
                  onClick={() => {}}
                >
                  <VisibilityOutlinedIcon />
                </KenButton> */}
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Box>
        {
          // Back Section
        }{' '}
        <div className="top-bar-div">
          <ArrowBackIcon className={classes.iconBack} color="primary" />
          <Typography className={classes.back} color="primary">
            {/* {t('Back')} */}
          </Typography>
        </div>
        {
          // Add Button Section
        }{' '}
        <AppBar position="static" elevation={0} className={classes.header}>
          <Toolbar className="top-bar-section">
            <Typography variant="h6" className={classes.title}>
              {/* My Profile */}
            </Typography>
            <Grid item xs={12}>
              <Link
                to={`/${Routes.indicateAvailability}`}
                className={classes.actionBtn}
                style={{ textDecoration: 'none' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className="add-button"
                  // onClick={() => setProfilePicUpdate(false)}
                >
                  {/* <span>
                  <AddIcon />
                </span> */}
                  Indicate Availability
                </Button>
              </Link>
            </Grid>
          </Toolbar>
        </AppBar>
        {/* Table Data  */}
        {/* <AppBar
          position="static"
          elevation={0}
          className={classes.boxContainer}
        >
        
        </AppBar> */}
        <Grid item md={12}>
          <Box mt={2} mb={2} className={classes.headBox} autoPageSize>
            <Box className="tabl-padding">
              <KenCard className="tabl-padding">
                <KenGrid
                  columns={columns}
                  data={tableData}
                  pagination={{ disabled: true }}
                  tableTotal={{ disabled: true, checkbox: true }}
                  gridProps={{
                    getRowProps: row => ({
                      onClick: () => onPreview(row.values),
                    }),
                  }}
                  toolbarDisabled={true}
                />
              </KenCard>
            </Box>
          </Box>
        </Grid>
        <KenDialogBox
          title={
            <Typography
              variant="p"
              className={classes.modalHeader}
              style={{ display: 'flex', alignItems: 'center ' }}
            >
              <p>
                <img
                  style={{ borderRadius: '50%', marginRight: '10px' }}
                  width="40"
                  height="40"
                  src={'http://dummyimage.com/174x172.png/5fa2dd/ffffff'}
                  alt="user"
                />
                {'Jane Cooper'}
              </p>

              <p>A - 12345</p>
              <p>Campus 1</p>
              <p>Course 1</p>
            </Typography>
          }
          open={messageDialog}
          handleClose={() => handleMessageDialog()}
          hidePositiveButton={true}
          hideNegativeButton={true}
          maxWidth="md"
          dividers
        >
          <div className="chat-box-part">
            <ChatLayout chats={chats} />

            <ChatInput
              typedMessage={typedMessage}
              messageChangeHandler={messageChangeHandler}
              sendMessageHandler={sendMessageHandler}
            />
          </div>
        </KenDialogBox>
      </Box>
    </div>
  );
};

export default SubjectDocumnet;
