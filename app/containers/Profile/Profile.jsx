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
import React, { useEffect } from 'react';
import { useState } from 'react';
import profile1 from '../../assets/Images/profile.jpg';
import KenButton from '../../global_components/KenButton';
import { AiFillFacebook, AiOutlineInstagram } from 'react-icons/ai';
import { Tab } from '@material-ui/core';
import TabList from '@material-ui/lab/TabList';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import PersonalDetails1 from './PersonalDetails1';
import { Navigate, useLocation, useHistory } from 'react-router-dom';
import Routes from '../../utils/routes.json';
import { KEY_SEVERITY } from '../../utils/constants';
import context from '../../utils/helpers/context';
import './profile.scss';
import {
  getStudentDetails,
  getFacultyDetails,
  getAllCourses,
  getStudentInfo,
} from '../../utils/ApiService';
import { useMediaQuery } from '@material-ui/core';
import KenLoader from '../../components/KenLoader';

const Profile = props => {
  const [value, setValue] = React.useState('1');
  const [data, setData] = useState('');
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = React.useState(false);
  const [studentData, setStudentData] = React.useState();
  const [getPrograms, setGetPrograms] = React.useState();
  const [AcademicProgram, setAcademicProgram] = React.useState();
  const [teacherDetails, setTeachersDetail] = React.useState();
  const [programid, setProgramId] = React.useState();
  const [addressDetails, setAddressDetails] = useState([]);
  const [relationshipDetails, setRelationShipDetails] = React.useState([]);
  const [details, setDetails] = useState({});
  const { contactId } = props.match.params;
  const { handleLoader, handleSnackbarOpen } = React.useContext(context);
  const [state, setState] = React.useState({});
  const navigate = useLocation();
  const history = useHistory();
  // const [fileName, setfileName] = useState("");
  // const [Graduated, setGraduated] = useState("");
  // const [Degree, setDegree] = useState("");
  // const [Location, setLocation] = useState("");
  // const [Occupation, setOccupation] = useState("");
  // const [Company, setCompany] = useState("");
  // const [Title, setTitle] = useState("");
  // const [Hobbies, setHobbies] = useState("")
  // const [lik, setlik] = useState("");
  // const [fb, setfb] = useState("");
  // const [twitter, settwitter] = useState("");
  const handleChange = (event, newValue) => {
    // console.log("GraduatedGraduatedGraduated", Graduated)
    // const sendData = [
    //   {
    //     "id": localStorage.getItem("alumniId"),
    //     "DateOfBirth": "2022-05-15",
    //     "Gender": "male",
    //     "Bloodgroup": "B+",
    //     "GraduateIn": "2018",
    //     "Degree": "MSc.",
    //     "CurrentClocation": "a0072000005oav3AAA",
    //     "CurrentOccupation": "Salesfroce Developer",
    //     "CurrentCompany": "Salesfroce",
    //     "CurrentTitle": "Sr.Manager",

    //     "Linkedin": "Https://linkedin.com",
    //     "FaceBook": "https://facebook.com",
    //     "Twiteer": "https://twiteer.com"
    //   }
    // ]

    // formData.append('EventCover', fileName[0]);

    // postProfile(formData).then((res) => {
    //   // handleSnackbarOpen('success', "Your event details have been sent to Admin for approval. After approval, you will see the event added in the list.");

    // }).catch((error) => {
    //   // handleSnackbarOpen('error', error.message);

    // })
    setValue(newValue);
  };
  // useEffect(() => {
  //   setLoading(true)
  //   const alumniid = localStorage.getItem("alumniId");
  //   getProfoileDetails(alumniid).then((res) => {
  //     console.log("alumniIdalumniIdalumniIdalumniIdalumniId", res)
  //     setData(res[0])
  //     setLoading(false)
  //   }).catch(() => {
  //     setLoading(false)
  //   })
  // }, [])
  React.useEffect(() => {
    getStudentData();
    getStudentInfoData();
  }, []);
  const getStudentData = async () => {
    setLoading(true);
    try {
      const res = await getStudentDetails(contactId);
      if (res && res.Program_Enrollment) {
        const array = res.Program_Enrollment.map(item => {
          return {
            label: item.Academic_Program,
            value: item.Id,
          };
        });
        setStudentData(res);
        setGetPrograms(array);
        const current =
          res.Program_Enrollment.find(item => item.Status === 'Current') ||
          res.Program_Enrollment[0];
        setAcademicProgram(current.Academic_Program);
        setProgramId(current.Id);

        // setAcedemicProgramId(current.hed__Account__c);
        const faculty = await getFacultyDetails(current.hed__Account__c);
        if (faculty) {
          setTeachersDetail(faculty);
        } else {
          setLoading(false);
          handleSnackbarOpen(KEY_SEVERITY.error, t('Faculty_Not_Found'));
          console.log('Faculty not found');
        }
        const course = await getAllCourses(contactId, current.Id);
        if (course) {
          setTabOptions(course);
          setLoading(false);
        } else {
          setLoading(false);
          handleSnackbarOpen(KEY_SEVERITY.error, t('Course_Not_Found'));
        }
      } else {
        setLoading(false);
        handleSnackbarOpen(KEY_SEVERITY.error, t('Student_Not_Found'));
      }
    } catch (err) {
      console.log('Error in Fetching student data', err);
      setLoading(false);
      handleSnackbarOpen(KEY_SEVERITY.error, t('Student_Not_Found'));
    }
  };

  const getStudentInfoData = async () => {
    const res = await getStudentInfo(contactId);
    console.log('ressssssss', res);
    const profileDetails = {
      BirthDate: res.BirthDate,
      CountryOfResidence: res.CountryOfResidence,
      Email: res.Email,
      firstName: res.firstName,
      Gender: res.Gender,
      lastName: res.lastName,
      Phone: res.Phone,
    };

    // let a = res[1].map(e => e.edHis);
    const arry = ['12th', 'Graduate', 'Post Graduate'];
    setState(profileDetails);
    const newEducationDetails = res.educationHistory.map(e => e.edHis);
    const output = newEducationDetails.map(({ Name, ...rest }) => rest);
    // const newArray = output.filter((eee, index) => {
    //   return eee.Level__c == arry[index]
    // })
    let gData = [];
    let realData = [];
    [1, 2, 3].map((e, ind) => {
      gData = output.filter((eee, index) => {
        return eee.Level__c == arry[ind];
      });
      realData.push(gData[0]);
    });
    console.log('realData', realData);
    // const newArray = [0,1,2].map((eData) => {
    //   return  output.filter((ele, i) => {
    //     return ele.Level__c == arry[i]
    //     })
    // })
    // console.log('newArray', newArray);
    setDetails(realData);
    setRelationShipDetails(res.relationship);
    setAddressDetails([]);
  };

  console.log('datadatadatadata', data);
  return (
    <div className="profile-main-div">
      {loading && <KenLoader />}
      {!isMobileScreen ? (
        <Grid container spacing={2}>
          <Grid item md={3} xs={12} sm={10} className="profile-img-main">
            <img src={profile1} alt="" className="profile-img" />
          </Grid>
          <Grid item md={9} xs={12} sm={10}>
            <div className="profile-personal-div">
              <div className="profile-name-main-div">
                <div className="profile-name-text">
                  {state.firstName} {state.lastName}
                </div>

                <div className="profile-btn">
                  <Typography className="profile-bar">
                    20% Profile Complete
                  </Typography>
                  <KenButton
                    variant="primary"
                    onClick={() => {
                      history.push(`/${Routes.editProfile}`);
                    }}
                  >
                    Edit Profile
                  </KenButton>
                </div>
              </div>
              <div className="graduate-div">
                <div>
                  <span className="title-div">Graduated In</span>
                  <div className="value-div">{data.graduationYear}</div>
                </div>
                <div>
                  <span className="title-div">Degree</span>
                  <div className="value-div">{data.Degree}</div>
                </div>
                <div>
                  <span className="title-div">Current Location</span>
                  <div className="value-div">{data.WorkAddress}</div>
                </div>
                <div>
                  <span className="title-div">Current Occupation</span>
                  <div className="value-div">{data.Designation}</div>
                </div>
                <div>
                  <span className="title-div">Current Company</span>
                  <div className="value-div">{data.Company}</div>
                </div>
              </div>
              <div className="personal-details">
                <div>
                  <span className="title-div">Current Title</span>
                  <div className="value-div">{data.department}</div>
                </div>
                <div>
                  <span className="title-div">Hobbies & Interests</span>
                  <div className="value-div">{data.Hobbies}</div>
                </div>
                <div>
                  <span className="title-div">Social Connect</span>
                  <div className="value-div">
                    {
                      <AiFillFacebook
                        style={{ color: 'black', fontSize: 25 }}
                        onClick={data.facebook}
                      />
                    }
                    <AiOutlineInstagram
                      style={{ color: 'black', fontSize: 25 }}
                      onClick={data.Instagram}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10} md={3}>
            <img src={profile1} alt="" className="profile-img" />
          </Grid>
          <Grid item xs={12} sm={10} md={9}>
            <div className="profile-personal-div">
              <div className="profile-name-main-div">
                <div className="profile-name-text">
                  {state.firstName} {state.lastName}
                </div>
                <div className="profile-btn">
                  <Typography className="profile-bar">
                    20% Profile Complete
                  </Typography>
                  <KenButton
                    variant="primary"
                    onClick={() => {
                      history.push(`/${Routes.editProfile}`);
                    }}
                    style={{ fontSize:'10px'}}
                  >
                    Edit Profile
                  </KenButton>
                </div>
              </div>
              <Grid container spacing={2} style={{marginTop:"20px"}}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Graduated In</span>
                        <div className="value-div">{data.graduationYear}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Degree</span>
                        <div className="value-div">{data.Degree}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Current Location</span>
                        <div className="value-div">{data.WorkAddress}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Current Occupation</span>
                        <div className="value-div">{data.Designation}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Current Company</span>
                        <div className="value-div">{data.Company}</div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Current Title</span>
                        <div className="value-div">{data.department}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Hobbies & Interests</span>
                        <div className="value-div">{data.Hobbies}</div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div>
                        <span className="title-div">Social Connect</span>
                        <div className="value-div" style={{marginTop:"10px"}}>
                          <AiFillFacebook
                            style={{ color: 'black', fontSize: 25 }}
                            onClick={data.facebook}
                          />
                          <AiOutlineInstagram
                            style={{ color: 'black', fontSize: 25 }}
                            onClick={data.Instagram}
                          />
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', borderTop: 1 }}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            className="profile-tab-list"
          >
            <Tab
              label="PERSONAL DETAILS"
              value="1"
              className="profile-tab-name"
            />
            <Tab
              label="Extra Curiculars"
              value="2"
              className="profile-tab-name"
            />
            <Tab label="Sports/ Clubs" value="2" className="profile-tab-name" />
            <Tab label="Cases" value="2" className="profile-tab-name" />
          </TabList>
          <TabPanel value="1" className="tab-description-main">
            <PersonalDetails1 />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default Profile;
