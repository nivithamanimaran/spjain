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
import KenSelect from '../../../../global_components/KenSelect';
import CloseIcon from '@material-ui/icons/Close';
import KenButton from '../../../../global_components/KenButton';
// import { getCourseList, postRequestReExam } from '../../../utils/ApiService';
// import { KEY_USER_DETAILS } from '../../../utils/constants';

// import Checkbox from '@material-ui/core/Checkbox';
// import InputLabel from '@material-ui/core/InputLabel';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import MenuItem from '@material-ui/core/MenuItem';
// import Select from '@material-ui/core/Select';

import './styles.scss';
import KenInputField from '../../../../global_components/KenInputField';
import Textarea from '../../../../global_components/KenTextArea';
import KenUploadButton from '../../../../global_components/KenUploadButton';

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
    marginTop: '30px',
    // marginBottom: '15px',
    // paddingBottom: '20px',
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

const ExtraAdd = ({ value, setValue, postCurruntInviExamantionReject }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles(); // how to assign UseStyle
  const [renderedImage, setRenderedImage] = useState('');
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box className={classes.main}>
        <Grid container>
          <Grid sm={10} className={classes.contentStart}>
            {/* <Typography className={classes.titleText}>
              Add Achievements
            </Typography> */}
          </Grid>
          <Grid sm={2} className={classes.contentEnd}>
            {/* <IconButton
              aria-label="delete"
              color="primary"
              className={classes.closeIcon}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>{' '} */}
          </Grid>
        </Grid>
        <Grid style={{ padding: '5px 0px' }}>
          <KenInputField
            value={value}
            placeholder={'Enter a Category'}
            label={'Category'}
            onChange={e => {
              console.log('e.target.value', e.target.value);
              setValue(e.target.value);
            }}
          />
        </Grid>
        <Grid style={{ padding: '5px 0px' }}>
          <KenInputField
            value={value}
            placeholder={'Enter a Role'}
            label={'Role'}
            onChange={e => {
              console.log('e.target.value', e.target.value);
              setValue(e.target.value);
            }}
          />
        </Grid>
        <Grid style={{ padding: '5px 0px' }}>
          <Textarea
            minRows={'3'}
            value={value}
            placeholder={'Enter Description'}
            label={'Description'}
            onChange={e => {
              console.log('e.target.value', e.target.value);
              setValue(e.target.value);
            }}
          />
        </Grid>
        <Grid
          style={{ display: 'block !important' }}
          className="display-Block-class"
          item
          xs={12}
          md={12}
        >
          <div className="text-box">
            <KenUploadButton
              onChange={'handleOnChangeDocuments'}
              name={''}
              value={'item.value'}
              label={'Certificate'}
            />
          </div>
        </Grid>

        {/* <Grid
          container
          className={`${classes.ctaButton} ${classes.contentEnd}`}
        >
          <KenButton
            onClick={handleClose}
            autoFocus
            buttonClass={classes.payLaterButton}
          >
            Cancel
          </KenButton>{' '}
          <KenButton
            onClick={postCurruntInviExamantionReject}
            autoFocus
            variant="contained"
            buttonClass={classes.payNowButton}
          >
            Submit
          </KenButton>
        </Grid> */}
      </Box>
    </>
  );
};

export default ExtraAdd;
