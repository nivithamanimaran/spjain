import React, { useEffect, useState } from 'react';
import {
  Box,
  makeStyles,
  Paper,
  Typography,
  Grid,
  Divider,
  ButtonBase,
  Button,
  LinearProgress,
} from '@material-ui/core';
import KenInputField from '../../../components/KenInputField';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiOutlineCamera, AiOutlineEdit } from 'react-icons/ai';
import {
  getProfileImageData,
  saveStudentProfileImage,
  saveStudentProfileInfo,
} from '../../../utils/ApiService';
import './profile.css';
import KenLoader from '../../../components/KenLoader';
import imagePic from '../../../assets/imagePS.png'

const useStyles = makeStyles(theme => ({
  parentRoot: {
    borderRadius: '3px',
    margin: '32px 0px 32px 0px',
    position: 'relative',
    padding: '15px 25px 30px',
  },
  parentsRoot: {
    borderRadius: '3px',
    margin: '32px 0px 32px 0px',
    position: 'relative',
    // padding: '15px 25px 30px'
  },
  circle: {
    width: '100px',
    height: '100px',
    lineHeight: '100px',
    borderRadius: '50%',
    color: theme.palette.KenColors.shadowColor,
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
    fontSize: 'xxx-large',
  },
  profile: {
    position: 'absolute',
    top: '32px',
    left: '0px',
    right: '0px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  studentName: {
    fontWeight: 600,
    fontSize: '16px',
    color: theme.palette.KenColors.neutral900,
    marginTop: '8px',
  },
  rectangle: {
    height: '50px',
    background: 'linear-gradient(96.64deg, #B3D4FF 3.24%, #FED9D7 95.61%)',
    marginLeft: 10,
  },
  profileContainer: {
    position: 'relative',
  },
  heading: {
    padding: '16px',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '20px',
    color: theme.palette.KenColors.neutral100,
  },
  divInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  img: {
    padding: '0px 16px 16px 16px',
  },
  info: {
    marginBottom: 10,
    fontSize: '12px',
    color: `${theme.palette.KenColors.primary}`,
  },
  divider: {
    margin: '0px 0px 10px 0px',
  },
  menuItemDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.KenColors.neutral40,
    },
  },
  av: {
    width: '36px',
    height: '36px',
    lineHeight: '33px',
    borderRadius: '55%',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    background: `${theme.palette.KenColors.neutral100}`,
  },
  titleDetails: {
    color: `${theme.palette.KenColors.neutral400}`,
    fontSize: 10,
  },
  plainLink: {
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      margin: '30px',
    },
    parentRoot: {
      borderRadius: '3px',
      margin: '32px 0px 32px 0px',
      position: 'relative',
      backgroundColor: '#F4F6FC',
      // height: '100%',
      // marginTop: 0,
    },
  },
  activeMenuItem: {
    borderLeft: `3px solid ${theme.palette.KenColors.cardActiveBorderColor}`,
    borderRadius: 4,
    backgroundColor: theme.palette.KenColors.cardActiveBackground,
    '& $titleName': {
      color: theme.palette.KenColors.cardActiveColor,
    },
  },
  root: {
    padding: 10,
    marginBottom: 9,
  },
  timerBox: {
    background: theme.palette.KenColors.tertiaryGreen49,
    padding: 5,
    borderRadius: 3,
    width: 105,
  },
  timerText: {
    fontWeight: 600,
    fontSize: 24,
    color: theme.palette.KenColors.tertiaryGreen,
  },
  progressBarBox: {
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: '#E5E5E5',
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#27AE60',
    },
  },
  progressBar: {
    height: 8,
    borderRadius: 27,
  },
  colorPrimary: {
    backgroundColor: theme.palette.KenColors.neutral20,
  },
  barColorPrimary: {
    backgroundColor: theme.palette.KenColors.tertiaryGreen49,
  },
}));
const ProfileDetails = ({
  profileBasicUpdate,
  setProfileBasicUpdate,
  state,
  setState,
}) => {
  const [data, setData] = useState(state);
  const [image, setImage] = useState('');
  const [profileUpdateAcc, setProfileUpdateAcc] = useState(false);
  const [loading, setLoading] = useState(false);
  //  console.log('stateData', state)
  // console.log('profileUpdate', profileUpdate);
  const classes = useStyles();

  function handleChangeInput(evt) {
    const value = evt.target.value;
    console.log('vvvvvvvvvvvv', value);
    setData({
      ...data,
      [evt.target.name]: value,
    });
  }
  const handleProfileSave = () => {
    console.log('data==============>', data);
    saveStudentProfileInfo(data);
    setProfileUpdateAcc(false);
  };
  const getProfileImage = async () => {
    const user =  JSON.parse(localStorage.getItem('userDetails'))
    const ContactId = JSON.parse(localStorage.getItem('userDetails'))
    ?.ContactId;
    const res = await getProfileImageData(ContactId);
    console.log('getProfileImageData', res);
    setImage(res.files[res.files.length - 1]?.body);
  };

  const updateProfileImage = async data => {
    const user =  JSON.parse(localStorage.getItem('userDetails'))
    const ContactId = JSON.parse(localStorage.getItem('userDetails'))
    ?.ContactId;
    const imageData = await saveStudentProfileImage(data,ContactId);
    console.log('imageData', imageData);
    const datasss = await getProfileImage(ContactId);
    console.log('data', datasss)
    setLoading(false);
  };

  useEffect(() => {
    setData(state);
    const ContactId = JSON.parse(localStorage.getItem('userDetails'))
    ?.ContactId;
    getProfileImage(ContactId);
    // setLoading(true)
  }, [state, image]);
  console.log('loader', loading);
  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      console.log('img---------------------->', reader.result);
    };
    reader.onerror = function(error) {
      console.log('Error: ', error);
    };
  }

  const progressStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    color: '#27AE60',
  };
  const handleImage = e => {
    setLoading(true);
    let formData = new FormData();
    formData.append('signature', e.target.files[0]);
    updateProfileImage(formData);
  };
  return (
    <>
      {' '}
      {profileUpdateAcc ? (
        <Paper
          className={classes.parentsRoot}
          style={{ padding: '20px 25px', backgroundColor: '#fff' }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={11}>
              <h2>Basic Information</h2>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Button
                variant="contained"
                color="primary"
                style={{ minWidth: '100%' }}
                onClick={() => handleProfileSave()}
              >
                Save
              </Button>{' '}
            </Grid>

            <Grid item xs={11} sm={2}>
              <Paper
                className={classes.parentsRoot}
                style={{
                  height: '100%',
                  marginTop: 0,
                  paddingBottom: '35px',
                  marginBottom: 0,
                  // padding: '20px 25px',
                }}
              >
                {/* <BsFillPersonFill size={260} color="#D7DEE9" /> */}
                {loading && <KenLoader />}
                {image ? (
                  <img
                    style={{ width: '100%', height: '100%' }}
                    src={`data:image/png;base64,${image}`}
                    className="add_grp_image"
                  />
                ) : (
                  // <BsFillPersonFill
                  //   style={{
                  //     height: '100%',
                  //     width: '100%',
                  //     border: '1px solid #CCD1D8',
                  //   }}
                  //   color="#D7DEE9"
                  // />
                  <img
                  style={{ width: '100%', height: '100%' }}
                  src={imagePic}
                  className="add_grp_image"
                />
                )}
                <input
                  style={{
                    paddingTop: '10px',
                    paddingLeft: '2px',
                  }}
                  type="file"
                  // accept="image/*"
                  name="image"
                  id="file"
                  onChange={e => handleImage(e)}
                  // style="display: none;"
                />
                {/* <AiOutlineEdit
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#fff',
                  }}
                  size={23}
                  onClick={() => updateProfileImage()}
                /> */}
                {/* <input src='' > */}
                {/* <Button
                  // startIcon={<RiFilterLine />}
                  variant="contained"
                >
                  Upload <AiOutlineCamera style={{ marginLeft: '10px' }} />
                </Button> */}
              </Paper>
            </Grid>

            <Grid item xs={12} sm={10}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="First Name"
                    name="firstName"
                    value={data.firstName}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Middle Name"
                    name="middleName"
                    value={data.middleName}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Family/Last Name"
                    name="lastName"
                    value={data.lastName}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Gender"
                    name="Gender"
                    value={data.Gender}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Date of Birth"
                    name="BirthDate"
                    value={data.BirthDate}
                    dropdownColor="#FFFFFF"
                    type="date"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Nationality"
                    name="Nationality"
                    value={data.Nationality}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Country of Residence"
                    name="CountryOfResidence"
                    value={data.CountryOfResidence}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                    // onChange={handleChangedCredit}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Birth Place"
                    name="BirthPlace"
                    value={data.BirthPlace}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <KenInputField
                    label="Emirates City"
                    name="EmiratesCity"
                    value={data.EmiratesCity}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KenInputField
                    label="Email ID"
                    name="Email"
                    value={data.Email}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KenInputField
                    label="Alternate Email ID"
                    name="alternate_email"
                    value={data.Email}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KenInputField
                    label="Mobile Number"
                    name="Phone"
                    value={data.Phone}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KenInputField
                    label="Alternate Mobile Number"
                    name="Phone"
                    value={data.Phone}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KenInputField
                    label="Name On Voice"
                    name="NameOnInvoice"
                    value={data.NameOnInvoice}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      ) : (
        <Paper className={classes.parentRoot} style={{ background: '#fff' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={11}>
              <h2>Basic Information</h2>
            </Grid>
            <Grid item xs={12} sm={1} className="editButton">
              <AiOutlineEdit
                size={23}
                onClick={() => setProfileUpdateAcc(true)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              {/* <Paper variant="outlined"> */}
              {console.log('image', image)}
              {image ? (
                <img
                  style={{ width: '100%', height: '100%' }}
                  src={`data:image/png;base64,${image}`}
                  className="add_grp_image"
                />
              ) : (
                // <BsFillPersonFill
                //   style={{
                //     height: '100%',
                //     width: '100%',
                //     border: '1px solid #CCD1D8',
                //   }}
                //   color="#D7DEE9"
                // />
                <img
                style={{ width: '100%', height: '100%' }}
                src={imagePic}
                className="add_grp_image"
              />
              )}

              {/* </Paper> */}
            </Grid>
            <Grid item xs={12} sm={10} style={{ paddingLeft: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <h2>
                    {data.firstName?.toUpperCase()}{' '}
                    {data.lastName?.toUpperCase()}
                  </h2>
                  <h3 style={{ color: '#03248F' }}>BBA</h3>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <h3>Profile Completion</h3>
                  <Box style={progressStyle}>
                    <Box className={classes.progressBarBox}>
                      <LinearProgress
                        variant="determinate"
                        value={19}
                        style={{ width: '297px' }}
                        className={classes.progressBar}
                        // classes={{
                        //   colorPrimary: classes.colorPrimary,
                        //   barColorPrimary: classes.barColorPrimary,
                        // }}
                      />
                    </Box>
                    <Typography variant="span" style={{ alignItems: 'start' }}>
                      {13}%
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  
                </Grid>
                <Grid item xs={12} sm={6}>
                  
                </Grid> */}
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Gender:</b>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography>{data.Gender}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Birthday :</b>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography>{data.BirthDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Phone :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography>{data.Phone}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Nationality :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography>{data.Nationality}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Email :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography>{data.Email}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Birth Place :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography>{data.BirthPlace}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Country of Residence :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography>{data.CountryOfResidence}</Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <b className="text-size">Emirates City :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                <Typography>{'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <b className="text-size">Name On Invoice :</b>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography>{data.NameOnInvoice}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default ProfileDetails;
