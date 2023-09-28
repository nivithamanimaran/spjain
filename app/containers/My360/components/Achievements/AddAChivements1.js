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
import { postContactAdditionaAchievementsStudent } from '../../../../utils/ApiService';
// import { KEY_USER_DETAILS } from '../../../utils/constants';
import KenSnackBar from '../../../../components/KenSnackbar';
import { useHistory } from 'react-router-dom';
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
import { getUserDetails } from '../../../../utils/helpers/storageHelper';

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

const AddAChivements1 = ({
  handleClose,
  value,
  setValue,
  postCurruntInviExamantionReject,
}) => {
  const classes = useStyles(); // how to assign UseStyle
  const [renderedImage, setRenderedImage] = useState('');
  const history = useHistory();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64Data, setBase64data] = useState('');
  const [base64String, setBase64String] = useState('');
  const [fileName, setFileName] = useState('');
  const contactId = getUserDetails().ContactId;
  const [formData, setFormData] = useState({
    category: '',
    role: '',
    description: '',
  });

  const handleInputChange = (fieldName, value) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = event => {
      const base64Data = event.target.result;
      // Perform further operations with the base64 data, such as sending it to an API or storing it in state
      const base64String = base64Data.split(';base64,')[1];
      setBase64String(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    // Create the payload object using the form data
    const payload = {
      contactId: contactId,
      category: formData.category,
      role: formData.role,
      description: formData.description,
      CERTIFICATE: {
        attachmentBody: base64String,
        attachmentContentType: selectedFile.type,
        attachmentName: fileName,
      },
    };

    // Call the API function to submit the payload
    postContactAdditionaAchievementsStudent(payload)
      .then(response => {
        handleSnackbarOpen('success', 'Successfully Submitted');
        if (response?.success === 'true') {
          return setTimeout(() => {
            history.push('/my360');
          }, 3000);
          //Once the Student has added the achievement he would get redirected to the my360 to see the added achievement after 3 seconds
        }
      })
      .catch(error => {
        handleSnackbarOpen('error', 'Failed to post new achievement.');
      });
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  return (
    <div>
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Top-Center"
      />
      {
        <>
          <Box className={classes.main}>
            <Grid container>
              <Grid sm={10} className={classes.contentStart}>
                <Typography className={classes.titleText}>
                  Add Achievements
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
              <KenInputField
                value={formData.category}
                placeholder={'Enter a Category'}
                label={'Category'}
                onChange={e => handleInputChange('category', e.target.value)}
              />
            </Grid>
            <Grid>
              <KenInputField
                value={formData.role}
                placeholder={'Enter a Role'}
                label={'Role'}
                onChange={e => handleInputChange('role', e.target.value)}
              />
            </Grid>
            <Grid>
              <Textarea
                minRows={'3'}
                value={formData.description}
                placeholder={'Enter Description'}
                label={'Description'}
                onChange={e => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid
              style={{ display: 'block !important' }}
              className="display-Block-class"
              item
              xs={12}
              md={12}
            >
              <div>
                <Typography style={{ color: '#505F79', fontSize: '12px' }}>
                  Certificate
                </Typography>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  value={fileName}
                  placeholder="Choose File"
                  readOnly
                  onClick={() => document.getElementById('fileInput').click()}
                />
                <button
                  style={{
                    marginLeft: '10px',
                    color: 'white',
                    backgroundColor: '#00218D',
                  }}
                >
                  Upload
                </button>
              </div>
            </Grid>

            <Grid
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
                onClick={handleSubmit}
                autoFocus
                variant="contained"
                buttonClass={classes.payNowButton}
              >
                Submit
              </KenButton>
            </Grid>
          </Box>
        </>
      }
    </div>
  );
};

export default AddAChivements1;
