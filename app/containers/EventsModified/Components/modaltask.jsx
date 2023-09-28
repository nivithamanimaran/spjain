import {
  Box,
  Fade,
  Modal,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
  Grid,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import moment from "moment";
import { useState, useEffect } from 'react';
// import DatePicker from "react-datepicker";
// import Clock from "../../Assets/Svg/clock.svg";
// import KenButton from "../../Components/KenButton";
// import KenInput from "../../Components/KenInput";
// import CalendarComponent from "../../Components/KenCalendar";
// import { useForm, Controller } from "react-hook-form";
// import { TABLET_BREAKPOINT } from "../../Constants/constant";
// import Datas from './Datas.json';
// import KenAutoComplete from '../../Components/KenAutoComplete';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import KenSelect from '../../../components/KenSelect';
// import InboxIcon from '@mui/icons-material/Inbox';
import KenDatePicker from '../../../components/KenDatePicker';

const TABLET_BREAKPOINT = 'tablet';
const style = {
  position: 'absolute',
  bottom: 0,
  right: '0%',
  // height:'90%',
  width: 400,
  bgcolor: 'background.paper',
  border: 0,
  boxShadow: 24,
};
const style1 = {
  width: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const useStyles = makeStyles(theme => ({
  containerWrapper: {
    height: '100%',
    // Width: 350,
    width: 400,
    borderRadius: 8,
    padding: '15px 0px 0px 0px',
    boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    [theme.breakpoints.down('sm')]: {
      // 'height': '90%',
      marginTop: '50px',
      width: '100%',
      'border-radius': '0',
      padding: '15px 0px 0px 0px',
      // 'max-width': '100%',
      'box-shadow': 'none',
      overflow: 'auto',
      // top: "64px",
    },
  },
  footer: {
    width: '100%',
    minHeight: '40px',
    position: 'absolute',
    textAlign: 'end',
    bottom: '0px',
    [theme.breakpoints.down('sm')]: {
      bottom: '13px',
      left: '0',
      'overscroll-behavior': 'none',
      position: 'fixed',
      right: '0',
      background: 'white',
      bottom: '20px',
    },
  },
  cancel: {
    // marginRight:'20px',
    textTransform: 'capitalize',
    fontSize: '16px',
    'font-weight': '500',
    'line-height': '100%',
    color: '#092682',
    marginRight: 16,
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '14px',
    },
  },
  add: {
    textTransform: 'capitalize',
    fontSize: '16px',
    background: '#092682',
    'font-weight': '500',
    'line-height': '100%',
    'margin-right': '35px',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#193389',
      color: 'white',
    },
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '14px',
    },
  },
  containerOverflow: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      height: 'calc(100vh - 120px)',
      overflow: 'scroll',
    },
  },
  inputField: {
    borderRadius: '3px',
    backgroundColor: 'white',
    border: '1px solid #E4E4E4',
    // height:'32px',
    paddingTop: '6px',
  },
  SubHeading1: {
    fontWeight: 600,
    fontSize: '11px',
    paddingTop: '16px',
    opacity: 0.5,
    color: '#000000',
    lineHeight: '100%',
    paddingBottom: '4px',
    textTransform: 'uppercase',
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '10px',
    },
  },
  modelHeading: {
    fontWeight: 600,
    textAlign: 'left',
    lineHeight: '200%',
    fontSize: '16px',
    color: '#000000',
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      fontSize: '15px',
    },
  },
  headingIcon: {
    float: 'right',
    color: '#23263B',
  },
  MoreFilter: {
    fontWeight: 500,
    textAlign: 'left',
    lineHeight: '200%',
    fontSize: '14px',
    color: '#092682',
  },
}));

export default function Tasks({ onCancel, showTask }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Modal open={showTask} hideBackdrop={'sm'}>
      <Fade in={showTask}>
        <Box
          sx={isMobileScreen ? style1 : style}
          display="flex"
          flexDirection="column"
          className={classes.containerWrapper}
        >
          <Box padding={isMobileScreen ? '15px 15px 15px 15px' : '15px'}>
            <Typography className={classes.modelHeading}>Filter By</Typography>
            <div style={{ float: 'right', marginTop: '-28px' }}>
              <CloseIcon className={classes.headingIcon} onClick={onCancel} />
            </div>
            <Box style={{ paddingTop: '16px' }}>
              <>
                <Typography className={classes.SubHeading1}>
                  All Categories
                </Typography>
                <KenSelect
                  placeholder="Choose a Location"
                  className={classes.inputField}
                />
                <Typography className={classes.SubHeading1}>
                  Free & paid
                </Typography>
                <KenSelect
                  placeholder="Choose a Location"
                  className={classes.inputField}
                />
                <Typography className={classes.SubHeading1}>
                  Inside & Outside campus
                </Typography>
                <KenSelect
                  placeholder="Choose a Topic"
                  className={classes.inputField}
                />
                <Typography className={classes.SubHeading1}>
                  this quarter
                </Typography>
                <KenDatePicker />
              </>
              <div style={{ float: 'right', paddingTop: '16px' }}>
                <Typography className={classes.MoreFilter}>
                  More Filters +
                </Typography>
              </div>
            </Box>
            <Box className={classes.footer}>
              <Button className={classes.cancel}>Reset</Button>
              <Button variant="primary" className={classes.add} type="submit">
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
