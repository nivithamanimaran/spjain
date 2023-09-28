import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import profile1 from '../../assets/Images/profile.jpg';
import KenButton from '../../global_components/KenButton';
import { AiFillFacebook, AiOutlineInstagram } from 'react-icons/ai';
import { Tab } from '@material-ui/core';
import TabList from '@material-ui/lab/TabList';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import PersonalDetails1 from './PersonalDetails1';
import Summary from '../Profile/Summary';
import Mentorship from './Mentorship';
import KenDatePicker from '../../components/KenDatePicker';
import Referals from './Referals';
import DatePicker from 'react-datepicker';
import KenSelect from '../../components/KenSelect';
import { postProfile, getStudentInfo } from '../../utils/ApiService';
import { useEffect } from 'react';

const EditProfile = () => {
  const [value, setValue] = React.useState('1');
  const { ContactId } = JSON.parse(localStorage.getItem('userDetails'));
  const [startDate, setStartDate] = useState(new Date());
  const [userData, setUserData] = useState({});
  const [Graduated, setGraduated] = useState('');
  const [Degree, setDegree] = useState('');
  const [Location, setLocation] = useState('');
  const [Occupation, setOccupation] = useState('');
  const [Company, setCompany] = useState('');
  const [Title, setTitle] = useState('');
  const [Hobbies, setHobbies] = useState('');
  const [lik, setlik] = useState('');
  const [fb, setfb] = useState('');
  const [DateOfBirth, setDateOfBirth] = useState('');
  const [Gender, setGender] = useState('');
  const [Bloodgroup, setBloodgroup] = useState('');
  const [twitter, settwitter] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleChange = (event, newValue) => {
    // console.log('GraduatedGraduatedGraduated', Graduated);
    // const sendData = [
    //   {
    //     id: localStorage.getItem('alumniId'),
    //     DateOfBirth: startDate,
    //     Gender: Gender,
    //     Bloodgroup: Bloodgroup,
    //     GraduateIn: Graduated,
    //     Degree: Degree,
    //     CurrentClocation: Location,
    //     CurrentOccupation: Occupation,
    //     CurrentCompany: Company,
    //     CurrentTitle: Title,

    //     Linkedin: lik,
    //     FaceBook: fb,
    //     Twiteer: twitter,
    //   },
    // ];
    // postProfile(sendData)
    //   .then(res => {
    //     handleSnackbarOpen(
    //       'success',
    //       'Your event details have been sent to Admin for approval. After approval, you will see the event added in the list.'
    //     );
    //   })
    //   .catch(error => {
    //     handleSnackbarOpen('error', error.message);
    //   });
    setValue(newValue);
  };
  useEffect(() => {
    getStudentInfo(ContactId).then(res => {
      const profileDetails = {
        BirthDate: res.BirthDate,
        CountryOfResidence: res.CountryOfResidence,
        Email: res.Email,
        firstName: res.firstName,
        Gender: res.Gender,
        lastName: res.lastName,
        Phone: res.Phone,
      };
      setUserData(profileDetails);
    });
  }, []);
  const allPrograms = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const BloodGroup = [
    { label: 'A+', value: 'A+' },
    { label: 'B+', value: 'B+' },
    { label: 'O+', value: 'O+' },

    { label: 'B-', value: 'B-' },
  ];
  return (
    <div className="profile-main-div">
      <Grid
        container
        spacing={2}
        style={{ borderBottom: '1px solid', paddingBottom: '10px' }}
      >
        <Grid item md={3} xs={12} className="profile-img-main">
          <img className="profile-img" src={profile1} alt="" />
        </Grid>
        <Grid
          item
          md={9}
          xs={12}
          sm={10}
          style={{ position: 'relative', height: '100%' }}
        >
          <div className="profile-personal-div">
            <div className="profile-name-main-div">
              <div className="profile-name-text">
                {userData.firstName} {userData.lastName}
              </div>
            </div>
            <Grid
              container
              spacing={1}
              xs={12}
              style={{ marginTop: 50 }}
              className="edit-graduate-div"
            >
              <Grid item xs={12} md={4}>
                <KenDatePicker
                  name={'dob'}
                  label="DATE OF BIRTH"
                  value={userData.BirthDate}
                  required={false}
                  onChange={e => setStartDate(e)}
                />
              </Grid>
              <Grid item xs={12} md={3} className="gender-div">
                <KenSelect
                  name="program"
                  required={true}
                  label="GENDER"
                  select
                  onChange={e => setGender(e.target.value)}
                  // labelClassName={classes.selectBox}
                  options={allPrograms}
                  value={userData.Gender}
                />
              </Grid>
              <Grid item xs={12} md={3} className="gender-div">
                <KenSelect
                  name="program"
                  required
                  select
                  label="BLOOD GROUP"
                  onChange={e => setBloodgroup(e.target.value)}
                  // labelClassName={classes.selectBox}
                  options={BloodGroup}
                  value={Bloodgroup}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          borderTop: 1,
          paddingTop: '20px',
        }}
      >
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            className="profile-tab-list"
          >
            <Tab label="Summary" value="1" className="profile-tab-name" />
            <Tab
              label="PERSONAL DETAILS"
              value="2"
              className="profile-tab-name"
            />
            <Tab label="Mentorship" value="3" className="profile-tab-name" />
            <Tab
              label="Extra Curiculars"
              value="4"
              className="profile-tab-name"
            />
            <Tab label="Sports/ Clubs" value="5" className="profile-tab-name" />
            <Tab label="Cases" value="6" className="profile-tab-name" />
            <Tab label="Referrals" value="7" className="profile-tab-name" />
          </TabList>
          <TabPanel value="1">
            <Summary
              Graduated={Graduated}
              setGraduated={setGraduated}
              Degree={Degree}
              setDegree={setDegree}
              Location={Location}
              setLocation={setLocation}
              Occupation={Occupation}
              setOccupation={setOccupation}
              Company={Company}
              setCompany={setCompany}
              Title={Title}
              setTitle={setTitle}
              lik={lik}
              setlik={setlik}
              fb={fb}
              setfb={setfb}
              twitter={twitter}
              settwitter={settwitter}
            />
          </TabPanel>
          <TabPanel value="2">
            <PersonalDetails1 />
          </TabPanel>
          <TabPanel value="3">
            <Mentorship />
          </TabPanel>
          <TabPanel value="7">
            <Referals />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default EditProfile;
