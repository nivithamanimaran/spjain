import React, { useState } from 'react';
import { CardActions, Divider, useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, styled, useTheme } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowLeftOutlinedIcon from '@material-ui/icons/ArrowLeftOutlined';
import KenCard from '../../components/KenCard';
import KenLoader from '../../components/KenLoader';
import KenSelect from '../../components/KenSelect';
import KenButton from '../../global_components/KenButton';
import KenSnackBar from '../../global_components/KenSnackbar';
import { postCreateCase } from '../../utils/ApiService';

import { useHistory } from 'react-router-dom';
import Base64 from './Base64';
import { getUserDetails } from '../../utils/helpers/storageHelper';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
}));

const useStyles = makeStyles(theme => ({
  createTitle: {
    fontWeight: '600',
    fontSize: '32px',
    color: '#000000',
  },
  createDescription: {
    fontSize: '16px',
    marginTop: '10px',
    opacity: 0.7,
    color: '#000000',
  },
  textLabel: {
    fontSize: '11px',
    marginTop: '10px',
    marginTop: '20px',
  },
  attachbutton: {
    fontSize: '14px',
    fontWeight: '500',
  },
  textlabels: {
    fontSize: '11px',
  },
  heading: {
    fontSize: '15px',
    fontWeight: 'bold',
    lineHeight: '22.5px',
  },
  content: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '14.4px',
  },
  inputhead: {
    color: '#868686',
    fontSize: '10px',
  },
  inputfield: {
    borderRadius: '8px',
  },
  errorMessage: {
    fontSize: '9px',
    fontWeight: '900',
    color: 'red',
    marginLeft: '5px',
  },
}));
const data = [
  {
    label: 'Transcripts of 4 years',
    value: 'Transcripts of 4 years',
  },
  {
    label: 'Digital (PDF)',
    value: 'Digital (PDF)',
  },
  {
    label: 'INDIA',
    value: 'INDIA',
  },
  {
    label: 'KARNATAKA',
    value: 'KARNATAKA',
  },
  {
    label: 'BENGALURU',
    value: 'BENGALURU',
  },
];
const data1 = [
  {
    label: 'Top',
    value: 'Top',
  },
  {
    label: 'High',
    value: 'High',
  },
];

const AddYourRequest = () => {
  // const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm();
  // const onSubmit = data => alert(json.stringify(data));

  const classes = useStyles();
  const history = useHistory();
  // const handleCancel = () => {
  //   history.push("/Support")
  // };
  const handleCancel = () => {
    history.push('/Support');
  };
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const [value, setValue] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState();
  const [priority, setPriority] = useState('');
  const [image, setImage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [file, setFile] = useState();
  const [base64, setBase64] = useState();
  const [error, setError] = useState({
    type: false,
    priority: false,
    value: false,
  });
  const user = getUserDetails()

  const [fileError, setFileError] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();

    console.log('filefilefilefilefilefilefile', file);
    if (file && file.size >= 2097152) {
      setFileError(true);
      return;
    }
    if (type === '' || value === '' || priority === '') {
      setError(prev => {
        return { type: true, priority: true, value: true };
      });
    } else {
      handleCreateCase1();
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };

  const handleCreateCase1 = () => {
    let payload = [
      {
        TypeofReq: type,
        priority: priority,
        description: value,
        studentId: user?.ContactId,
        attachment: file
          ? [
              {
                attachmentName: file ? file.name : '',
                attachmentContentType: file ? file.type : '',
                attachmentBody: file ? base64.split('base64,')[1] : '',
              },
            ]
          : [],
      },
    ];

    if (payload[0]) {
      setLoading(true);
      postCreateCase(payload)
        .then(res => {
          // console.log(res);
          setType('');
          setValue('');
          setPriority('');
          setFile('');
          handleSnackbarOpen('success', 'Your Request has been created');
          setLoading(false);
          handleCancel();
        })
        .catch(err => {
          // console.log(err);
          handleSnackbarOpen('error', 'something went wrong');
          setLoading(false);
        });
    }
  };

  const label = { inputProps: { 'aria-label': 'Color switch demo' } };
  const createGroup = () => {
    handleSnackbarOpen('success', 'Your Request has been created');
  };
  let base64String = '';
  const onChangeImageHandler = event => {
    // console.log('added picture', event.target.files[0]);
    let file = event.target.files[0];
    // console.log('files', file);
    // if (
    //   KEY_FACULTY_PROFILE_IMAGE?.ALLOWED_FILE_TYPES?.includes(file?.type) &&
    //   file.size <= KEY_FACULTY_PROFILE_IMAGE.MAX_FILE_SIZE
    // ) {
    //   const fileURL = URL.createObjectURL(file);
    //   setImage(fileURL);
    // } else {
    //   //   alert(t('messages:Supported_Signature_File'));
    //   handleSnackbarOpen('warning', t('messages:Supported_Profile_Image_File'));
    // }
    const fileURL = URL.createObjectURL(file);
    // console.log('fileURK', typeof fileURL);
    setImage(fileURL);
  };

  // console.log('imageimageimageimage', image);
  return (
    <div>
      {loading && <KenLoader />}
      <KenSnackBar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      {isMobileScreen ? (
        <>
          <KenButton
            onClick={handleCancel}
            style={{ textTransform: 'capitalize' }}
          >
            <ArrowLeftOutlinedIcon />
            Back
          </KenButton>
          <KenCard>
            <Grid item xs={12} className="grid-main">
              <div className={classes.createTitle}>Add your Request</div>
              <div className={classes.createDescription}>
                Send in any request your College could help you with like
                transcripts or provisional certificate.
              </div>
              <br />
              <div className="line-description">
                <Divider />
              </div>
              <div className="group-form">
                <Grid item xs={12} className="group-name">
                  <div className="requirement-div">
                    <Grid container spacing={2}>
                      <Grid item md={4}>
                        <div className="requirement-div-select">
                          <Typography className={classes.textLabel}>
                            TYPE
                          </Typography>
                          <KenSelect
                            // {...register('Type', {
                            //   required: 'Type is required',
                            // })}
                            // value={FormValues.typee}
                            name="Choose a category"
                            // required
                            select
                            label=""
                            onChange={e => {
                              setType(e.target.value);
                              setError(prev => {
                                return {
                                  ...prev,
                                  type: false,
                                };
                              });
                            }}
                            // labelClassName={classes.selectBox}
                            options={data}
                            value={type}
                            // required
                            // errorLabel={false}
                            // {...field}
                            // error={errorMapper(error)}
                          />
                          <div>
                            {error.type && type === '' ? (
                              <label className={classes.errorMessage}>
                                **Type Can't be Empty
                              </label>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </Grid>
                      <Grid item md={4}>
                        <div className="format-required">
                          <Typography className={classes.textLabel}>
                            PRIORITY
                          </Typography>
                          <KenSelect
                            name="Choose a category"
                            // required
                            select
                            label=""
                            onChange={e => {
                              setPriority(e.target.value);
                              setError(prev => {
                                return {
                                  ...prev,
                                  priority: false,
                                };
                              });
                            }}
                            // labelClassName={classes.selectBox}
                            options={data1}
                            value={priority}
                            // errorLabel={false}
                            // {...field}
                            // error={errorMapper(error)}
                          />
                          <div>
                            {error.priority && priority === '' ? (
                              <label className={classes.errorMessage}>
                                **Priority Can't be Empty
                              </label>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="form-input-group">
                    <Typography className={classes.textLabel}>
                      REASON OR ADDITIONAL DETAILS
                    </Typography>
                    <TextField
                      fullWidth
                      label=""
                      value={value}
                      multiline
                      rows={4}
                      onChange={e => {
                        setValue(e.target.value);
                        setError(prev => {
                          return {
                            ...prev,
                            value: false,
                          };
                        });
                      }}
                      id="fullWidth"
                      variant="outlined"
                    />
                    {error.value && value === '' ? (
                      <label className={classes.errorMessage}>
                        **Reason Can't be Empty
                      </label>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="form-input-group-btn">
                    {/* <Button
                      variant="contained"
                      component="label"
                      className={classes.attachbutton}
                    > */}
                    {/* Attach File */}
                    <Base64
                      setBase64={setBase64}
                      setFile={setFile}
                      fileError={fileError}
                    />
                    {/* <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={onChangeImageHandler}
                      /> */}
                    {/* </Button> */}
                    {fileError ? (
                      <span className={classes.errorMessage}>
                        **File size must be less than 2MB (Your file size is
                        more than 2MB)
                      </span>
                    ) : (
                      <span className="message-warning">
                        File size must be less than 2MB
                      </span>
                    )}
                  </div>
                  {file && (
                    <div className="form-input-group-btn">
                      <>
                        <img src={`${file.base64}`} width="200px" />
                      </>
                    </div>
                  )}
                  {/* <div className="form-input-tiltle">
                    <div className="message-warning">Confirm Your Details</div>
                    <br />
                  </div> */}
                  <div className="line-description" />
                  {/* <div className="requirement-div">
                    <div className="phone-number-div">
                      <Typography className={classes.textlabels}>
                        PHONE NUMBER
                      </Typography>
                      <TextField
                        label=""
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        size="small"
                        id="fullWidth"
                        variant="outlined"
                      />
                    </div>
                    <div className="email-div">
                      <Typography className={classes.textlabels}>
                        YOUR EMAIL
                      </Typography>
                      <TextField
                        label=""
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        size="small"
                        id="fullWidth"
                        variant="outlined"
                        style={{ width: '340px' }}
                      />
                    </div>
                  </div> */}

                  {/* <div className="form-input-group-btn">
                    <Typography className={classes.textlabels}>
                      ADDRESS LINE 1
                    </Typography>
                    <TextField
                      label=""
                      fullWidth
                      value={value}
                      onChange={e => setValue(e.target.value)}
                      size="small"
                      id="fullWidth"
                      variant="outlined"
                      style={{ width: '490px' }}
                    />
                  </div> */}
                  {/* <div className="form-input-group-btn address-div">
                    <div>
                      <Typography className={classes.textlabels}>
                        ADDRESS LINE 2
                      </Typography>
                      <TextField
                        label=""
                        fullWidth
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        size="small"
                        id="fullWidth"
                        variant="outlined"
                        style={{ width: '350px' }}
                      />
                    </div>
                    <div className="pin-number-div">
                      <Typography className={classes.textlabels}>
                        PIN NUMBER
                      </Typography>
                      <TextField
                        label=""
                        fullWidth
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        size="small"
                        id="fullWidth"
                        variant="outlined"
                        style={{ width: '100px' }}
                      />
                    </div>
                  </div> */}
                  {/* <div className="requirement-div form-input-group-btn">
                    <div>
                      <Typography className={classes.textlabels}>
                        COUNTRY
                      </Typography>
                      <KenSelect
                        name="Choose a category"
                        // required
                        select
                        label=""
                        // labelClassName={classes.selectBox}
                        options={data}
                        value={'INDIA'}
                        // errorLabel={false}
                        // {...field}
                        // error={errorMapper(error)}
                      />
                    </div>
                    <div>
                      <Typography className={classes.textlabels}>
                        STATE
                      </Typography>
                      <KenSelect
                        name="Choose a category"
                        // required
                        select
                        label=""
                        // labelClassName={classes.selectBox}
                        options={data}
                        value={'KARNATAKA'}
                        // errorLabel={false}
                        // {...field}
                        // error={errorMapper(error)}
                      />
                    </div>
                    <div>
                      <Typography className={classes.textlabels}>
                        CITY
                      </Typography>
                      <KenSelect
                        name="Choose a category"
                        // required
                        select
                        label=""
                        // labelClassName={classes.selectBox}
                        options={data}
                        value={'BENGALURU'}
                        // errorLabel={false}
                        // {...field}
                        // error={errorMapper(error)}
                      />
                    </div>
                  </div> */}
                </Grid>
              </div>
              <div className="button-action-group">
                <CardActions style={{ marginLeft: '20px' }}>
                  {/* <div style={{ display: 'flex', marginLeft: '740px' }}> */}
                  <Grid container justifyContent="flex-end">
                    <Grid>
                      <Button
                        onClick={handleCancel}
                        variant="contained"
                        style={{
                          background: 'white',
                          marginRight: '13px',
                          boxShadow: 'none',
                          color: '#193389',
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                    <Grid>
                      <Button
                        variant="contained"
                        // onClick={handleCreateCase1}
                        onClick={handleSubmit}
                        color="primary"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                  {/* </div> */}
                </CardActions>
              </div>
            </Grid>
          </KenCard>
        </>
      ) : (
        <>
          <KenButton
            variant="contained"
            onClick={handleCancel}
            style={{ textTransform: 'capitalize' }}
          >
            Back
          </KenButton>
          <KenCard style={{ padding: '0px' }}>
            <Grid>
              <Grid item xs={12}>
                <div className={classes.heading}>
                  <b>Add your Requests</b>
                </div>
                <br />
                <div className={classes.content}>
                  Send in any request your College could help you with like
                  transcripts or provisional certificates.
                </div>
                <br />
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.inputhead}>TYPE</Typography>
                <KenSelect
                  // {...register('Type', {
                  //   required: 'Type is required',
                  // })}
                  // value={FormValues.typee}
                  name="Choose a category"
                  // required
                  select
                  label=""
                  onChange={e => {
                    setType(e.target.value);
                    setError(prev => {
                      return {
                        ...prev,
                        type: false,
                      };
                    });
                  }}
                  // labelClassName={classes.selectBox}
                  options={data}
                  value={type}
                  // required
                  // errorLabel={false}
                  // {...field}
                  // error={errorMapper(error)}
                />
                <div>
                  {error.type && type === '' ? (
                    <label className={classes.errorMessage}>
                      **Type Can't be Empty
                    </label>
                  ) : (
                    ''
                  )}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="format-required">
                  <Typography className={classes.inputhead}>
                    PRIORITY
                  </Typography>
                  <KenSelect
                    name="Choose a category"
                    // required
                    select
                    label=""
                    onChange={e => {
                      setPriority(e.target.value);
                      setError(prev => {
                        return {
                          ...prev,
                          priority: false,
                        };
                      });
                    }}
                    // labelClassName={classes.selectBox}
                    options={data1}
                    value={priority}
                    // errorLabel={false}
                    // {...field}
                    // error={errorMapper(error)}
                  />
                  <div>
                    {error.priority && priority === '' ? (
                      <label className={classes.errorMessage}>
                        **Priority Can't be Empty
                      </label>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="form-input-group">
                  <Typography className={classes.textLabel}>
                    REASON OR ADDITIONAL DETAILS
                  </Typography>
                  <TextField
                    fullWidth
                    label=""
                    value={value}
                    multiline
                    rows={4}
                    onChange={e => {
                      setValue(e.target.value);
                      setError(prev => {
                        return {
                          ...prev,
                          value: false,
                        };
                      });
                    }}
                    id="fullWidth"
                    variant="outlined"
                  />
                  {error.value && value === '' ? (
                    <label className={classes.errorMessage}>
                      **Reason Can't be Empty
                    </label>
                  ) : (
                    ''
                  )}
                </div>
              </Grid>

              <Grid item xs={12}>
                <div className="form-input-group-btn">
                  {/* <Button
                      variant="contained"
                      component="label"
                      className={classes.attachbutton}
                    > */}
                  {/* Attach File */}
                  <Base64
                    setBase64={setBase64}
                    setFile={setFile}
                    fileError={fileError}
                  />
                  {/* <input
                        hidden
                        accept="image/*"
                        multiple
                        type="file"
                        onChange={onChangeImageHandler}
                      /> */}
                  {/* </Button> */}
                  {fileError ? (
                    <span className={classes.errorMessage}>
                      **File size must be less than 2MB (Your file size is more
                      than 2MB)
                    </span>
                  ) : (
                    <span className="message-warning">
                      File size must be less than 2MB
                    </span>
                  )}
                </div>
                {file && (
                  <div className="form-input-group-btn">
                    <>
                      <img src={`${file.base64}`} width="200px" />
                    </>
                  </div>
                )}
              </Grid>
              <br />
              {/* <Grid item xs={12}>
                <div
                  className="message-warning"
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    fontSize: '13px',
                    lineHeight: '150%',
                  }}
                >
                  Confirm Your Details
                </div>
              </Grid> */}
              <br />
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>
                  PHONE NUMBER
                </Typography>
                <br />
                <TextField
                  label=""
                  fullWidth
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  id="fullWidth"
                  size="small"
                  variant="outlined"
                />
                <br />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>
                  YOUR EMAIL
                </Typography>
                <br />
                <TextField
                  label=""
                  fullWidth
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  id="fullWidth"
                  size="small"
                  variant="outlined"
                />
                <br />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>
                  ADDRESS LINE 1
                </Typography>
                <br />
                <TextField
                  label=""
                  fullWidth
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  id="fullWidth"
                  size="small"
                  variant="outlined"
                />
                <br />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>
                  ADDRESS LINE 2
                </Typography>
                <br />
                <TextField
                  label=""
                  fullWidth
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  id="fullWidth"
                  size="small"
                  variant="outlined"
                />
                <br />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>
                  PIN NUMBER
                </Typography>
                <br />
                <TextField
                  label=""
                  fullWidth
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  id="fullWidth"
                  size="small"
                  variant="outlined"
                />
                <br />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>COUNTRY</Typography>
                <KenSelect
                  name="Choose a category"
                  // required
                  select
                  label=""
                  // labelClassName={classes.selectBox}
                  options={data}
                  value={'India'}
                  // errorLabel={false}
                  // {...field}
                  // error={errorMapper(error)}
                />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>STATE</Typography>
                <KenSelect
                  name="Choose a category"
                  // required
                  select
                  label=""
                  // labelClassName={classes.selectBox}
                  options={data}
                  value={'Karnataka'}
                  // errorLabel={false}
                  // {...field}
                  // error={errorMapper(error)}
                />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Typography className={classes.inputhead}>CITY</Typography>
                <KenSelect
                  name="Choose a category"
                  // required
                  select
                  label=""
                  // labelClassName={classes.selectBox}
                  options={data}
                  value={'Bengaluru'}
                  // errorLabel={false}
                  // {...field}
                  // error={errorMapper(error)}
                />
              </Grid> */}
              <Grid item xs={12}>
                <div className="button-action-group">
                  <CardActions style={{ marginLeft: '20px' }}>
                    {/* <div style={{ display: 'flex', marginLeft: '740px' }}> */}
                    <Grid container justifyContent="flex-end">
                      <Grid>
                        <Button
                          onClick={handleCancel}
                          variant="contained"
                          style={{
                            background: 'white',
                            boxShadow: 'none',
                            color: '#193389',
                          }}
                        >
                          Cancel
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          color="primary"
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                    {/* </div> */}
                  </CardActions>
                </div>
              </Grid>
            </Grid>
          </KenCard>
        </>
      )}
    </div>
  );
};

export default AddYourRequest;
