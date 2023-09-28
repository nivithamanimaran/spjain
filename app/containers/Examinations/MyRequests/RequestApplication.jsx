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
import React, { useEffect } from 'react';
import KenSelect from '../../../global_components/KenSelect';
import CloseIcon from '@material-ui/icons/Close';
import KenButton from '../../../global_components/KenButton';
import { getCourseList, postRequestReExam } from '../../../utils/ApiService';
import { KEY_USER_DETAILS } from '../../../utils/constants';
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

const months = [
  { label: 'Select', value: 'Select' },
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' },
];
const RequestApplication = ({ handleClose }) => {
  const [value, setValue] = React.useState('AnswerSheet');
  const [courseList, setCourseList] = React.useState([]);

  const [currentMonth, setCurrentMonth] = React.useState('Select');
  console.log('currentMonthcurrentMonth', currentMonth);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const changeLang = e => {
    setCurrentMonth(e.target.value);
  };
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));

  const postRequest = async () => {
    const payload = [
      {
        RequestType: value,
        FeesStatus: 'Paid',
        id: 'a1v1y000000TkGUAA0',
        CourseName: currentMonth,
      },
    ];
    try {
      const res = await postRequestReExam(studentDetails.ContactId, payload);
      // setLoading(true);
      if (!res) {
        return;
      }
      alert('data added');
      getCourseData();

      // setLoading(false);
    } catch (error) {
      console.log('errorerror', error);
    }
  };

  const getCourseData = async () => {
    try {
      const res = await getCourseList();
      // setLoading(true);
      if (!res) {
        return;
      }

      const data =
        res.length === 0
          ? []
          : res?.map(item => {
              return {
                label: item.CourseName,
                value: item.id,
              };
            });

      console.log('data123', data);

      setCourseList(data);
      // setLoading(false);
    } catch (error) {
      console.log('errorerror', error);
    }
  };
  useEffect(() => {
    getCourseData();
  }, []);
  const classes = useStyles(); // how to assign UseStyle
  return (
    <>
      <Box className={classes.main}>
        <Grid container>
          <Grid sm={10} className={classes.contentStart}>
            <Typography className={classes.titleText}>
              Request Application
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
        <FormControl style={{ marginTop: '24px' }} component="fieldset">
          <RadioGroup
            aria-label="request-application"
            name="requestApplication"
            value={value}
            onChange={handleChange}
            className={classes.radioGroupButton}
          >
            <FormControlLabel
              value="AnswerSheet"
              control={<Radio />}
              label="Answer Sheet"
              className={
                value === 'AnswerSheet'
                  ? `${classes.radioButtonCheckedBG}`
                  : `${classes.radioButtonUnCheckedBG}`
              }
            />
            <FormControlLabel
              value="ReEvaluation"
              control={<Radio />}
              label="Re-Evaluation"
              className={
                value === 'ReEvaluation'
                  ? `${classes.radioButtonCheckedBG}`
                  : `${classes.radioButtonUnCheckedBG}`
              }
            />
            <FormControlLabel
              value="ReTest"
              control={<Radio />}
              label="Re-Test"
              className={
                value === 'ReTest'
                  ? `${classes.radioButtonCheckedBG}`
                  : `${classes.radioButtonUnCheckedBG}`
              }
            />
          </RadioGroup>
        </FormControl>
        <KenSelect
          value={currentMonth || []}
          onChange={changeLang}
          options={courseList}
          placeholder={'Select'}
          required={true}
          label="Course Name"
          customStyle={{ marginTop: '20px' }}
        />
        <Grid container className={classes.paymentMain}>
          <Grid sm={12} className={classes.contentStart}>
            <Typography className={classes.paymentTitle}>
              Payment Summary
            </Typography>
          </Grid>
        </Grid>
        <Grid container className={classes.paymentSecondory}>
          <Grid sm={10} className={classes.contentStart}>
            <Typography className={classes.titleSubText}>
              Per Answer sheet
            </Typography>
          </Grid>
          <Grid sm={2} className={classes.contentEnd}>
            <Typography className={classes.titleSubText}>Rs. 200</Typography>
          </Grid>
        </Grid>{' '}
        <Grid container>
          <Grid sm={10} className={classes.contentStart}>
            <Typography className={classes.titleSubText}>Per Exam</Typography>
          </Grid>
          <Grid sm={2} className={classes.contentEnd}>
            <Typography className={classes.titleSubText}>Rs. 200</Typography>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />{' '}
        <Grid container>
          <Grid sm={10} className={classes.contentStart}>
            <Typography className={classes.totalTitleText}>
              Total Amount
            </Typography>
          </Grid>
          <Grid sm={2} className={classes.contentEnd}>
            <Typography className={classes.totalTitleText}>Rs. 400</Typography>
          </Grid>
        </Grid>{' '}
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
