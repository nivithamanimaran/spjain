import {
  Box,
  FormControl,
  FormControlLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
  Grid,
  IconButton,
  Divider,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenSelect from '../../../global_components/KenSelect';
import CloseIcon from '@material-ui/icons/Close';
import KenButton from '../../../global_components/KenButton';
import { getCourseList, postRequestReExam } from '../../../utils/ApiService';
import { KEY_USER_DETAILS } from '../../../utils/constants';

import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { MenuProps, options } from './utils';
import KenInputField from '../../../global_components/KenInputField';
import Textarea from '../../../global_components/KenTextArea';
const useStyles = makeStyles(theme => ({
  titleText: {
    fontFamily: 'Work Sans',
    fontSize: '24px',
    fontWeight: '600',
    color: '#193389',
  },
  radioGroupButton: {
    flexDirection: 'row',
  },
  contentStart: {
    display: 'flex',
    justifyContent: 'start',
  },
  contentEnd: {
    display: 'flex',
    justifyContent: 'end',
  },
  paymentMain: {
    marginTop: '55px',
  },
  paymentTitle: {
    fontFamily: 'Work Sans',
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
  },
  paymentSecondory: {
    marginTop: '25px',
  },
  titleSubText: {
    fontFamily: 'Work Sans',
    fontSize: '18px',
    fontWeight: '400',
    color: '#7A7A7B',
  },
  divider: {
    marginTop: '25px',
    marginBottom: '15px',
  },
  totalTitleText: {
    fontFamily: 'Work Sans',
    fontSize: '18px',
    fontWeight: '500',
    color: '#000000',
  },
  // main: {
  //   marginTop: '40px',
  //   marginBottom: '40px',
  // },
  ctaButton: {
    marginTop: '44px',
    marginBottom: '15px',
    paddingBottom: '20px',
  },
  payLaterButton: {
    marginRight: '15px',
    fontFamily: 'Work Sans',
    fontSize: '16px',
    fontWeight: '500',
    color: '#193389',
    textTransform: 'capitalize',
  },
  payNowButton: {
    // marginRight: '15px',
    fontFamily: 'Work Sans',
    fontSize: '16px',
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  radioButtonCheckedBG: {
    background: '#E9F3FF',
    marginLeft: '3px',
    padding: '5px 15px 5px 5px',
    borderRadius: '5px',
    '& span': {
      color: '#00218D',
    },
  },
  radioButtonUnCheckedBG: {
    background: '#fff',
    marginLeft: '3px',
    padding: '5px 15px 5px 5px',
    borderRadius: '5px',
    filter: 'drop-shadow(0px 1px 40px rgba(0, 0, 0, 0.05))',
    color: '#00218D',
  },
  closeIcon: {
    width: '14px !important',
    padding: '0px !important',
    color: '#000 !important',
  },
}));

const RequestApplication = ({ handleClose }) => {
  const [value, setValue] = React.useState('AnswerSheet');
  const [courseList, setCourseList] = React.useState([]);

  const [currentMonth, setCurrentMonth] = React.useState([]);
  const [currentMonth1, setCurrentMonth2] = React.useState([]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const changeLang = e => {
    setCurrentMonth(e.target.value);
    setCurrentMonth2(e.target.label);
    console.log('e.targete.targete.target', e.target);
  };

  //
  const [selected, setSelected] = useState([]);
  const isAllSelected =
    options.length > 0 && selected.length === options.length;

  const handleChanges = event => {
    const value = event.target.value;
    if (value[value.length - 1] === 'all') {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
  };
  //
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));

  // const postRequest = async () => {
  //   const payload = [
  //     {
  //       RequestType: value,
  //       FeesStatus: 'Paid',
  //       StudentId: studentDetails.ContactId,
  //       CourseName: currentMonth,
  //     },
  //   ];
  //   try {
  //     const res = await postRequestReExam(payload);
  //     // setLoading(true);
  //     if (!res) {
  //       return;
  //     }
  //     alert('data added');
  //     getCourseData();

  //     // setLoading(false);
  //   } catch (error) {
  //     console.log('errorerror', error);
  //   }
  // };

  // const getCourseData = async () => {
  //   try {
  //     const res = await getCourseList();
  //     // setLoading(true);
  //     if (!res) {
  //       return;
  //     }

  //     const data =
  //       res.length === 0
  //         ? []
  //         : res?.map(item => {
  //             return {
  //               label: item.CourseName,
  //               value: item.id,
  //             };
  //           });
  //     setCourseList(data);
  //     // setLoading(false);
  //   } catch (error) {
  //     console.log('errorerror', error);
  //   }
  // };
  // useEffect(() => {
  //   getCourseData();
  // }, []);
  const classes = useStyles(); // how to assign UseStyle
  return (
    <>
      <Box className={classes.main}>
        <Grid container>
          <Grid sm={10} className={classes.contentStart}>
            <Typography className={classes.titleText}>
              Reject Request
            </Typography>
          </Grid>
          <Grid sm={2} className={classes.contentEnd}>
            <IconButton
              aria-label="delete"
              color="primary"
              className={classes.closeIcon}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>{' '}
          </Grid>
        </Grid>
        <Grid>
          <Textarea
            minRows={'3'}
            placeholder={'Enter Description'}
            label={'Reason'}
          />
        </Grid>
        <Grid
          container
          className={`${classes.ctaButton} ${classes.contentEnd}`}
        >
          <KenButton
            // onClick={onhandleReExam}

            autoFocus
            buttonClass={classes.payLaterButton}
          >
            Pay Later
          </KenButton>{' '}
          <KenButton
            onClick={postRequest}
            autoFocus
            variant="contained"
            buttonClass={classes.payNowButton}
          >
            Pay Now
          </KenButton>
        </Grid>
      </Box>
    </>
  );
};

export default RequestApplication;
