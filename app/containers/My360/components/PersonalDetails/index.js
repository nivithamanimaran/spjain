import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, makeStyles, useTheme } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  getStudentInfo,
  saveStudentProfileInfo,
} from '../../../../utils/ApiService';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const KenInputField = React.lazy(() =>

  import('../../../../components/KenInputField')

);
const KenButton = React.lazy(() =>

  import('../../../../global_components/KenButton')

);
const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const KenSelect = React.lazy(() => import('../../../../components/KenSelect'));
const KenSnackBar = React.lazy(() =>
  import('../../../../components/KenSnackbar')
);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  details: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: "10px"
    },
    flexDirection: 'column',
  },
  heading: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.KenColors.link1,
  },
  key: {
    fontSize: 11,
    fontWeight: 600,
    color: theme.palette.KenColors.kenBlack,
    opacity: '0.5',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.KenColors.kenBlack,
    [theme.breakpoints.down('sm')]: {
      // marginLeft: 4,
    },
  },
  emailValue: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.KenColors.kenBlack,
    [theme.breakpoints.down('sm')]: {
      width: "136px"
    },
  },
  container: {
    [theme.breakpoints.up('sm')]: {
      maxHeight: 80,
    },
    [theme.breakpoints.only('sm')]: {
      maxHeight: 100,
    },
    gap: 2,
  },
  container1: {
    [theme.breakpoints.down('md')]: {
      paddingTop: '30px !important',
    },
  },
  mobResp: {
    [theme.breakpoints.down('md')]: {
      marginTop: '30px !important',
    },
  },
  container1: {
    [theme.breakpoints.down('md')]: {
      paddingTop: '30px !important',
    },
  },
  mobResp: {
    [theme.breakpoints.down('md')]: {
      marginTop: '30px !important',
    },
  },
  resp: {
    [theme.breakpoints.down('md')]: {
      marginTop: '0.5em',
    },
  },
}));

export default function PersonalDetails(props) {
  const { contactInfo, setContactInfo } = props;
  const user = getUserDetails();
  const classes = useStyles();
  const theme = useTheme();
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [studentProfileInfo, setStudentProfileInfo] = useState();
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [trigger, setTrigger] = useState(true);
  const [genderInfo, setGenderInfo] = useState({
    gender: contactInfo?.Gender,
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const genderOption = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Other',
      value: 'Other',
    },
  ];


  const handleGenderChange = event => {
    setGenderInfo({ ...genderInfo, gender: event.target.value });
  };
  const [bioInfo, setBioInfo] = useState({
    firstName: contactInfo?.firstName || null,
    middleName: contactInfo?.middleName || null,
    lastName: contactInfo?.lastName || null,
    gender: contactInfo?.Gender || null,
    BirthDate: contactInfo?.BirthDate || null,
    Nationality: contactInfo?.Nationality || null,
    CountryOfResidence: contactInfo?.CountryOfResidence || null,
    BirthPlace: contactInfo?.BirthPlace || null,
    Email: contactInfo?.Email || null,
    alternateEmail: contactInfo?.alternateEmail || null,
    Phone: contactInfo?.Phone || null,
    alternatePhone: contactInfo?.alternatePhone || null,
    PassportNumber: contactInfo?.PassportNumber || null,
    NationalIdNumber: contactInfo?.NationalIdNumber || null,
    TaxFileNum: contactInfo?.TaxFileNum || null,
    EmiratesIdNum: contactInfo?.EmiratesIdNum || null,
    Allergy: contactInfo?.Allergy || null,
    Others: contactInfo?.Others || null,
    BloodGroup: contactInfo?.BloodGroup || null,
    country: contactInfo?.address[0]?.country || null,
    pin: contactInfo?.address[0]?.pin || null,
    road: contactInfo?.address[0]?.road || null,
    flat: contactInfo?.address[0]?.flat || null,
    addressinfo: contactInfo?.address[0]?.addressRecordId || null,
  });
 
  const [isAccordionExpanded, setAccordionExpanded] = useState([
    true, // Bio Accordion
    true, // Home Address Accordion
    true, // Contact Details Accordion
    true, // Contact Details Accordion
    true, // Contact Details Accordion

  ]);
  const toggleAccordion = (index) => {
    const updatedExpandedState = [...isAccordionExpanded];
    updatedExpandedState[index] = !updatedExpandedState[index];
    setAccordionExpanded(updatedExpandedState);
  };

  const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/
  const validationSchema = Yup.object().shape({
    // PrimaryContact: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
    // SecondaryContact: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
    // ParentEmailId: Yup.string().email('Invalid email').required('Required'),
    firstName: Yup.string().max(35).test('no-number', 'Numbers are not allowed', value => {
      return !/\d/.test(value);
    }).required('Required'),
    middleName: Yup.string().required('Required').max(35).test('no-number', 'Numbers are not allowed', value => {
      return !/\d/.test(value);
    }),
    lastName: Yup.string().max(35).test('no-number', 'Numbers are not allowed', value => {
      return !/\d/.test(value);
    }).required('Required'),
    Gender: Yup.string().required('Required'),
    BirthDate: Yup.string().required('Required'),
    Nationality: Yup.string().required('Required').test('no-number', 'Numbers are not allowed', value => {
      return !/\d/.test(value);
    }),
    CountryOfResidence: Yup.string().test('no-number', 'Numbers are not allowed', value => {
      return !/\d/.test(value);
    }),
    BirthPlace: Yup.string().required('Required').test('no-number', 'Numbers are not allowed', value => {
      return !/\d/.test(value);
    }),
    flat: Yup.string().required('Required'),
    road: Yup.string().required('Required'),
    pin: Yup.number().required('Required').typeError('Pincode can only be a number').test('len', 'Pincode needs to be excatly 5 digits', val => val?.toString()?.length === 6),
    alternateEmail: Yup.string().required('Required').email('Invalid email'),
    alternatePhone: Yup.string().required('Required').matches(phoneRegExp, 'Phone number is not valid'),
    PassportNumber: Yup.string().required('Required'),
    NationalIdNumber: Yup.string().required('Required'),
    TaxFileNum: Yup.string().required('Required'),
    EmiratesIdNum: Yup.string().required('Required'),
    BloodGroup: Yup.string().required('Required'),
    Allergy: Yup.string().required('Required'),
    Others: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    // BirthPlace: Yup.string().test('no-number', 'Numbers are not allowed', value => {
    //   return !/\d/.test(value);
    // }),
    // Activities: Yup.string().test('no-number', 'Numbers are not allowed', value => {
    //   return !/\d/.test(value);
    // }),
    // Bio: Yup.string().test('no-number', 'Numbers are not allowed', value => {
    //   return !/\d/.test(value);
    // }),
    // Phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Required'),
  });
  const formik = useFormik({
    initialValues: {
      ContactNo: '',
      firstName: contactInfo?.firstName || '',
      middleName: contactInfo?.middleName || '',
      lastName: contactInfo?.lastName || '',
      Gender: contactInfo?.Gender || '',
      BirthDate: contactInfo?.BirthDate || '',
      Nationality: contactInfo?.Nationality || '',
      CountryOfResidence: contactInfo?.CountryOfResidence || '',
      BirthPlace: contactInfo?.BirthPlace || '',
      flat: contactInfo?.address[0]?.flat || '',
      road: contactInfo?.address[0]?.road || '',
      pin: contactInfo?.address[0]?.pin || '',
      alternateEmail: contactInfo?.alternateEmail || '',
      alternatePhone: contactInfo?.alternatePhone || '',
      PassportNumber: contactInfo?.PassportNumber || '',
      NationalIdNumber: contactInfo?.NationalIdNumber || '',
      TaxFileNum: contactInfo?.TaxFileNum || '',
      EmiratesIdNum: contactInfo?.EmiratesIdNum || '',
      BloodGroup: contactInfo?.BloodGroup || '',
      Allergy: contactInfo?.Allergy || '',
      Others: contactInfo?.Others || '',
      country: contactInfo?.address[0]?.country || "",
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      console.log(values);
      submitPersonalDetails(values)
    },
  });
  const hasErrors = Object.keys(formik.errors).length > 0;
  useEffect(() => {
    formik.setValues({
      ContactNo: '',
      firstName: contactInfo?.firstName || '',
      middleName: contactInfo?.middleName || '',
      lastName: contactInfo?.lastName || '',
      Gender: contactInfo?.Gender || '',
      BirthDate: contactInfo?.BirthDate || '',
      Nationality: contactInfo?.Nationality || '',
      CountryOfResidence: contactInfo?.CountryOfResidence || '',
      BirthPlace: contactInfo?.BirthPlace || '',
      flat: contactInfo?.address[0]?.flat || '',
      road: contactInfo?.address[0]?.road || '',
      pin: contactInfo?.address[0]?.pin || '',
      alternateEmail: contactInfo?.alternateEmail || '',
      alternatePhone: contactInfo?.alternatePhone || '',
      PassportNumber: contactInfo?.PassportNumber || '',
      NationalIdNumber: contactInfo?.NationalIdNumber || '',
      TaxFileNum: contactInfo?.TaxFileNum || '',
      EmiratesIdNum: contactInfo?.EmiratesIdNum || '',
      BloodGroup: contactInfo?.BloodGroup || '',
      Allergy: contactInfo?.Allergy || '',
      Others: contactInfo?.Others || '',
      country: contactInfo?.address[0]?.country || "",

    })

  }, [edit])

  const handleBioInfoChange = event => {
    const { name, value } = event.target;
    setBioInfo(prevBioInfo => ({
      ...prevBioInfo,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (trigger) {
      getStudentInfo(user.ContactId)
        .then(res => {
          setLoading(false);
          setContactInfo(res);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          setSnackbarSeverity('error');
        });
      setTrigger(false);
    }
  }, [trigger, user.ContactId]);

  const submitPersonalDetails = (values) => {
    // e.preventDefault();
    let payload = [
      {
        contactId: user.ContactId,
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        BirthDate: values.BirthDate,
        BirthPlace: values.BirthPlace,
        CountryOfResidence: values.CountryOfResidence,
        Email: contactInfo.Email,
        EmiratesIdNum: values.EmiratesIdNum,
        Gender: values.Gender,
        NationalIdNumber: values.NationalIdNumber,
        Nationality: values.Nationality,
        PassportNumber: values.PassportNumber,
        Phone: contactInfo.Phone,
        AlternateEmail: values.alternateEmail,
        AlternateContact: values.alternatePhone,
        TaxFileNum: values.TaxFileNum,
        NameOnInvoice: 'Student V',
        BloodGroup: values.BloodGroup,
        Allergy: values?.Allergy,

        Others: values.Others,
        ADDRESS: [
          {
            addressRecordId: contactInfo?.address[0]?.addressRecordId,
            pin: values.pin,
            country: values.country,
            flat: values.flat,
            road: values.road,
          },
        ],
        RELATIONSHIP: [
          {
            AnnualIncome: '10LPA',
            MotherOccupation: 'Employee',
            FatherOccupation: 'Employee',
            EmergencyContactNo: '9999999999',
            Status: 'Current',
          },
        ],
      },
    ];
    saveStudentProfileInfo(payload)
      .then(res => {
        setStudentProfileInfo(res);
        if (res.success === 'true') {
          setLoading(true);
          setEdit(false);
          setTrigger(true); // Trigger the useEffect to fetch updated student info
          enqueueSnackbar('The data has been successfully changed', {
            variant: 'success',
          });
        }
      })
      .catch(err => {
        setLoading(false);
        console.log('error', err);
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
        });
      });
  };

  return (
    <>
      {loading && <KenLoader />}
      <KenSnackBar
        severity={snackbarSeverity}
        message={snackbarMessage}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      {edit === false ? (
        <Box
          pl={2}
          pt={2}
          mt={5}
          mb={10}
          style={{
            background: '#FEFEFE',
            boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
            borderRadius: 8,
          }}
        >
          <Grid container spacing={2}>
            <Grid item md={12} sm={10} xs={12}>
              <>
                <Grid container>
                  <Grid
                    style={{ marginBottom: '20px' }}
                    item
                    md={10}
                    sm={10}
                    xs={8}
                  >
                    <Typography className={classes.heading}>Bio</Typography>
                  </Grid>
                  <Grid
                    style={{ marginBottom: '20px' }}
                    item
                    md={2}
                    sm={2}
                    xs={4}
                  >
                    <KenButton onClick={() => setEdit(true)} variant="primary">
                      Edit
                    </KenButton>
                  </Grid>
                </Grid>

                <Grid container direction="column" spacing={2}>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    className={classes.container}
                    style={{ marginBottom: '-30px' }}
                  >
                    <>
                      <Grid container justifyContent="space-between">
                        <Grid item md={3} sm={2} xs={6}>
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  First name
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.firstName}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid item md={3} sm={2} xs={6}>
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  middle name
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.middleName}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid item md={3} sm={2} xs={6}>
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  last name
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.lastName}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>

                        <Grid item md={3} sm={2} xs={6}>
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  GEnder{' '}
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.Gender}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    className={`${classes.container} ${classes.container1}`}
                  >
                    <>
                      <Grid container justifyContent="space-between">
                        <Grid item md={3} sm={2} xs={6}>
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  Date of birth
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.BirthDate}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid item md={3} sm={2} xs={6}>
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  nationality
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.Nationality}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          sm={2}
                          xs={6}
                          className={classes.resp}
                        >
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  country of residence
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.CountryOfResidence}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid
                          item
                          md={3}
                          sm={2}
                          xs={6}
                          className={classes.resp}
                        >
                          <>
                            <Grid container className={classes.details}>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.key}>
                                  birth place
                                </Typography>
                              </Grid>
                              <Grid item md={12} sm={12} xs={12}>
                                <Typography className={classes.value}>
                                  {contactInfo?.BirthPlace}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            spacing={3}
            style={{ marginTop: 20 }}
          >
            <Grid item md={12}>
              <Typography className={classes.heading}>Home Address</Typography>
            </Grid>
            <Grid item md={12} className={classes.container}>
              <>
                <Grid container justifyContent="space-between">
                  <Grid item md={3} sm={3} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            HOUSE/FLAT NO
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.address[0]?.flat}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>ROAD</Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.address[0]?.road}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            COUNTRY
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.address[0]?.country}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            PIN CODE
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.address[0]?.pin}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </>
            </Grid>
            <Grid item md={12}>
              <Typography className={classes.heading}>
                Contact Details
              </Typography>
            </Grid>
            <Grid item md={12} className={classes.container}>
              <>
                <Grid container justifyContent="space-between">
                  <Grid item md={3} sm={3} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            Personal email id
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography
                            className={classes.emailValue}
                          >
                            {contactInfo?.Email}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            alternate email id
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography
                            className={classes.emailValue}
                          >
                            {contactInfo?.alternateEmail}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            Mobile number
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.Phone}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            alternate Mobile number
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.alternatePhone}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            spacing={2}
            className={classes.mobResp}
          >
            <Grid item md={12}>
              <Typography className={classes.heading}>
                National ID Number
              </Typography>
            </Grid>
            <Grid item md={12} className={classes.container}>
              <>
                <Grid container justifyContent="space-between">
                  <Grid item md={3} sm={3} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            Passport number
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.PassportNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            national id number
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.NationalIdNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            tax file number(only for Australians)
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.TaxFileNum}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={3} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            emirates id number{' '}
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.EmiratesIdNum}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            spacing={2}
            className={classes.mobResp}
          >
            <Grid item md={12}>
              <Typography className={classes.heading}>Health</Typography>
            </Grid>
            <Grid item md={12} className={classes.container}>
              <>
                <Grid container gap="40px">
                  <Grid item md={3} sm={2} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            Blood group
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.BloodGroup}{' '}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={2} xs={6}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            Allergies
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.Allergy}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                  <Grid item md={3} sm={2} xs={6} className={classes.resp}>
                    <>
                      <Grid container className={classes.details}>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.key}>
                            Others
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <Typography className={classes.value}>
                            {contactInfo?.Others}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          pl={2}
          pt={2}
          mt={5}
          mb={10}
          style={{
            background: '#FEFEFE',

            boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
            borderRadius: 8,
          }}
          component={'form'}
          onSubmit={formik.handleSubmit}
        >
          <div>
            <Accordion
              square={false}
              style={{
                marginBottom: '10px',
                marginRight: '15px',
                boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
              }}
              expanded={isAccordionExpanded[0] || hasErrors}
              onChange={() => toggleAccordion(0)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}> Bio</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={10} xs={12}>
                    <>
                      <Grid container direction="column" spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          className={classes.container}
                          style={{ marginBottom: '10px' }}
                        >
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        First name
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={formik.values.firstName}
                                        errors={formik.errors.firstName}
                                        touched={formik.touched.firstName}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Middle name
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="Middle Name"
                                        name="middleName"
                                        value={formik.values.middleName}
                                        errors={formik.errors.middleName}
                                        touched={formik.touched.middleName}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Last name
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="Last Name"
                                        name="lastName"
                                        value={formik.values.lastName}
                                        errors={formik.errors.lastName}
                                        touched={formik.touched.lastName}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>

                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Gender
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenSelect
                                        name="Gender"
                                        placeholder="Gender"
                                        id="Gender"
                                        options={genderOption}
                                        errors={formik.errors.Gender}
                                        touched={formik.touched.Gender}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                        value={formik.values.Gender}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid
                          item
                          md={12}
                          className={classes.container}
                          style={{ marginBottom: '10px' }}
                        >
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Date Of Birth
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="Date Of Birth"
                                        name="BirthDate"
                                        type="date"
                                        value={formik.values.BirthDate}
                                        errors={formik.errors.BirthDate}
                                        touched={formik.touched.BirthDate}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Nationality
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="Nationality"
                                        name="Nationality"
                                        value={formik.values.Nationality}
                                        errors={formik.errors.Nationality}
                                        touched={formik.touched.Nationality}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Country of Residence
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="Country of Residence"
                                        name="CountryOfResidence"
                                        value={formik.values.CountryOfResidence}
                                        errors={formik.errors.CountryOfResidence}
                                        touched={formik.touched.CountryOfResidence}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Birth Place
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        // label="Middle Name"
                                        placeholder="Birth Place"
                                        name="BirthPlace"
                                        value={formik.values.BirthPlace}
                                        errors={formik.errors.BirthPlace}
                                        touched={formik.touched.BirthPlace}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              square={false}
              style={{
                marginBottom: '10px',
                marginRight: '15px',
                boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
              }}
              expanded={isAccordionExpanded[1] || hasErrors}
              onChange={() => toggleAccordion(1)} // Pass 1 for the Home Address Accordion
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Home Address
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={10} xs={12}>
                    <>
                      <Grid container direction="column" spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          className={classes.container}
                          style={{ marginBottom: '10px' }}
                        >
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        house/flat no
                                      </Typography>
                                    </Grid>

                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="HOUSE/FLAT NO"
                                        name="flat"
                                        value={formik.values.flat}
                                        errors={formik.errors.flat}
                                        touched={formik.touched.flat}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        road
                                      </Typography>
                                    </Grid>

                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="ROAD"
                                        name="road"
                                        value={formik.values.road}
                                        errors={formik.errors.road}
                                        touched={formik.touched.road}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>

                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        country
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="COUNTRY"
                                        name="country"

                                        value={formik.values.country}
                                        errors={formik.errors.country}
                                        touched={formik.touched.country}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={2} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        pin code
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="PIN CODE"
                                        name="pin"
                                        value={formik.values.pin}
                                        errors={formik.errors.pin}
                                        touched={formik.touched.pin}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              square={false}
              style={{
                marginBottom: '10px',
                marginRight: '15px',
                boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
              }}
              expanded={isAccordionExpanded[2] || hasErrors}
              onChange={() => toggleAccordion(2)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Contact Details
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={10} xs={12}>
                    <>
                      <Grid container direction="column" spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          className={classes.container}
                          style={{ marginBottom: '10px' }}
                        >
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Personal email id
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Personal email id"
                                        name="Email"
                                        value={contactInfo?.Email}
                                        onChange={handleBioInfoChange}
                                        disabled
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        alternate email id
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder=" Alternate email id"
                                        name="alternateEmail"
                                        value={formik.values.alternateEmail}
                                        errors={formik.errors.alternateEmail}
                                        touched={formik.touched.alternateEmail}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Mobile number
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder=" Mobile number"
                                        name="Phone"
                                        value={contactInfo?.Phone}
                                        onChange={handleBioInfoChange}
                                        disabled
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        alternate Mobile number
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Alternate Mobile number"
                                        name="alternatePhone"
                                        value={formik.values.alternatePhone}
                                        errors={formik.errors.alternatePhone}
                                        touched={formik.touched.alternatePhone}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              square={false}
              style={{
                marginBottom: '10px',
                marginRight: '15px',
                boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
              }}
              expanded={isAccordionExpanded[3] || hasErrors}
              onChange={() => toggleAccordion(3)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  National ID Number
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={10} xs={12}>
                    <>
                      <Grid container direction="column" spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          className={classes.container}
                          style={{ marginBottom: '10px' }}
                        >
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Passport number
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Passport number"
                                        name="PassportNumber"
                                        value={formik.values.PassportNumber}
                                        errors={formik.errors.PassportNumber}
                                        touched={formik.touched.PassportNumber}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        national id number
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="National Id Number"
                                        name="NationalIdNumber"
                                        value={formik.values.NationalIdNumber}
                                        errors={formik.errors.NationalIdNumber}
                                        touched={formik.touched.NationalIdNumber}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        tax file number(only for Australians)
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="tax file number(only for Australians)"
                                        name="TaxFileNum"
                                        value={formik.values.TaxFileNum}
                                        errors={formik.errors.TaxFileNum}
                                        touched={formik.touched.TaxFileNum}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={3} sm={3} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        emirates id number{' '}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Emirates Id Number"
                                        name="EmiratesIdNum"
                                        value={formik.values.EmiratesIdNum}
                                        errors={formik.errors.EmiratesIdNum}
                                        touched={formik.touched.EmiratesIdNum}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            <Accordion
              square={false}
              style={{
                marginBottom: '10px',
                marginRight: '15px',
                boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
              }}
              expanded={isAccordionExpanded[4] || hasErrors}
              onChange={() => toggleAccordion(4)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Health</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item md={12} sm={10} xs={12}>
                    <>
                      <Grid container direction="column" spacing={2}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                          className={classes.container}
                          style={{ marginBottom: '10px' }}
                        >
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={4} sm={4} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Blood group
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Blood group"
                                        name="BloodGroup"
                                        value={formik.values.BloodGroup}
                                        errors={formik.errors.BloodGroup}
                                        touched={formik.touched.BloodGroup}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={4} sm={4} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Allergies
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Allergies"
                                        name="Allergy"
                                        value={formik.values.Allergy}
                                        errors={formik.errors.Allergy}
                                        touched={formik.touched.Allergy}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                              <Grid item md={4} sm={4} xs={12}>
                                <>
                                  <Grid container className={classes.details}>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <Typography className={classes.key}>
                                        Others
                                      </Typography>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={6}>
                                      <KenInputField
                                        placeholder="Others"
                                        name="Others"
                                        value={formik.values.Others}
                                        errors={formik.errors.Others}
                                        touched={formik.touched.Others}
                                        onChange={e => {
                                          formik.handleChange(e)
                                          handleBioInfoChange(e);
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>

          <Grid
            container
            direction="column"
            spacing={2}
            style={{ marginTop: '10px' }}
          >
            <Grid item md={12} className={classes.container}>
              <>
                <Grid container alignItems="right" justifyContent="flex-end">
                  <Grid item>
                    <KenButton
                      onClick={() => setEdit(false)}
                      variant="outlined"
                      style={{ marginRight: '16px' }}
                    >
                      Cancel
                    </KenButton>
                    <KenButton
                      variant="primary"
                      type="submit"
                    // onClick={e => submitPersonalDetails(e)}
                    >
                      Save
                    </KenButton>
                  </Grid>
                </Grid>
              </>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
