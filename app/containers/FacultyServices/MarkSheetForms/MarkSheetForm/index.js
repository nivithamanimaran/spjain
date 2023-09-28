import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import KenInputField from '../../../../components/KenInputField/index';
import KenSelect from '../../../../components/KenSelect';
import KenTextArea from '../../../../global_components/KenTextArea';
import KenButton from '../../../../global_components/KenButton';
import { GrAttachment } from 'react-icons/gr';
import history from '../../../../utils/history'
import Routes from '../../../../utils/routes.json'
import Cities from '../../../../utils/i18next/locale/cities.json';
import StateCityJson  from '../../../../utils/i18next/locale/StateCities.json';
import './style.scss';
import { getMarksRequest, postMarksRequest } from '../../../../utils/ApiService';
import { useAppContext } from '../../../../utils/contextProvider/AppContext';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
import KenLoader from '../../../../components/KenLoader/index';
const useStyles = makeStyles(theme => ({
  addedQuestionHeader: {
    padding: 16,
    background: '#ffffff',
  },
  root: {
    display: 'flex',
  },
  questionLabel: {
    color: theme.palette.KenColors.neutral900,
    width: '100%',
    borderBottom: `1px solid ${theme.palette.KenColors.assessmentBorder}`,
    paddingBottom: 5,
    marginBottom: 10,
  },
  questionContent: {
    marginLeft: 3,
  },
  selectOptionBar: {
    width: '50%',
    float: 'left',
    marginRight: '20px',
  },
  form: {
    position: 'relative',
  },
  SubmitHead: {
    marginTop: '2px',
  },
  SubmitBtn: {
    float: 'right',
    marginTop: '20px',
  },
}));
export default function CaseForm(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  // const [selectOptions] = useState(["All"]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  // const [userDetails, setuserDetails]=React.useState();
  const [markSheetData, setMarkSheetData]=useState();
  const citiesOption = Cities.city;
  const [city, setCity] = useState([]);
  /* const {
    state: { userDetails },
  } = useAppContext(); */
  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldTouched,
    setFieldValue,
    handleSubmit,
    cancelItem,
    selectedCase,
  } = props;
  console.log('values', values);

  const getCities = (value) => {
    
    const cityStates = StateCityJson.states.find(
      (state) => state.value === (value ? value : "Karnataka")
    );
    let districts = cityStates?.districts || [];
    let cities = [];
    districts.forEach((district) => {
      cities.push({
        label: district,
        value: district,
      });
    });
    // console.log("cities", cities);
    return cities;
  };

  const getStates = (value) => {
    const statesObject = CountryStateJson.countries.find(
      (country) => country.country === value
    );
    let statesArray = statesObject?.states || [];
    let statesOfValue = [
      {
        label: "State",
        value: "State",
      },
    ];
    statesArray.map((state) => {
      statesOfValue.push({
        label: state,
        value: state,
      });
    });
    return statesOfValue;
  };
  const change = (name, e, index) => {
    e.persist();
    handleChange(e);
    if (name === 'City') {
      setCityName(e.target.value);
    }
    setFieldValue(name, e.target.value);
    setFieldTouched(name, true, false);
    e.preventDefault();
  };

  const handleCancel = () => {
    history.push('/raiseRequest');
    window.location.reload();
};
 
useEffect(() => {
  const user = getUserDetails();
  setLoading(true);
  getMarksRequest(user?.ContactId).then(res => {
    setLoading(false);
    res.forEach(el =>{
      if(el.Type == "Mark Sheet Request"){
        setMarkSheetData(el.Type)
        console.log('res',el.Type)
      }
    })
    
  }).catch(err=>{
    setLoading(false);
  });
}, []);
  // useEffect(() => {
  //     setLoading(true);
  //     const user = getUserDetails();
  //     console.log("user",user);
  //     setuserDetails(user);
  // });

  useEffect(() => {
    let cityDetails = [];
    citiesOption.forEach(el => {
      cityDetails.push({
        label: el.name,
        value: el.name,
      });
    });
    setCity(cityDetails);
  }, []);

  return (
    <div className={classes.root}>
      {loading ? <KenLoader /> : null}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid sm={12} x={12} className={classes.addedQuestionHeader}>
            <form
              onSubmit={values.handleChange}
              className={classes.form}
              class="caseform"
            >
              <div className="formCaseWrap">
                <Grid item xs={4}>
                  <Box md={2} className={classes.classDisplayOne} />
                </Grid>
                <div className={classes.root}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <KenInputField
                        required
                        label="First Name"
                        name="FirstName"
                        value={values.FirstName}
                        onChange={change.bind(null, 'FirstName')}
                        errors={errors?.FirstName}
                        setFieldTouched={setFieldTouched}
                        touched={touched?.FirstName}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <KenInputField
                        required
                        label="Phone Number"
                        name="Phone"
                        value={values.Phone}
                        onChange={change.bind(null, 'Phone')}
                        errors={errors?.Phone}
                        setFieldTouched={setFieldTouched}
                        touched={touched?.Phone}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <KenInputField
                        required
                        label="Email-Id"
                        name="Email"
                        value={values.Email}
                        onChange={change.bind(null, 'Email')}
                        errors={errors?.Email}
                        setFieldTouched={setFieldTouched}
                        touched={touched?.Email}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <KenInputField
                        required
                        label="Term"
                        name="Term"
                        value={values.Term}
                        onChange={change.bind(null, 'Term')}
                        errors={errors?.Term}
                        setFieldTouched={setFieldTouched}
                        touched={touched?.Term}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <KenInputField
                        multiline
                        required
                        row={2}
                        label="Address"
                        placeholder="Type your address here..."
                        name="Address"
                        value={values.Address}
                        onChange={change.bind(null, 'Address')}
                        errors={errors?.Address}
                        setFieldTouched={setFieldTouched}
                        touched={touched?.Address}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <KenSelect
                        placeholder="Select"
                        inputBaseRootClass={classes.inputBaseClass}
                        className={classes.selectDrawer}
                        options={StateCityJson.states}
                        label="State"
                        name="State"
                        value={values.State}
                        onChange={change.bind(null, 'State')}
                        variant="outline"
                        defaultValue={() => {
                          setFieldValue('Karnataka');
                          return 'Karnataka';
                        }}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    
                    <Grid item xs={6}>
                      <KenSelect
                        placeholder="Select"
                        inputBaseRootClass={classes.inputBaseClass}
                        className={classes.selectDrawer}
                        options={getCities(values.State)}
                        label="City"
                        name="City"
                        value={values.City}
                        onChange={change.bind(null, 'City')}
                        variant="outline"
                        defaultValue={() => {
                          setFieldValue('Bengaluru');
                          return 'Bengaluru';
                        }}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </Grid>
                    <Grid item xs={6}>
                    <Box className={classes.SubmitBtn}>
                  <KenButton
                    variant="secondary"
                    onClick={handleCancel}
                    label={t('labels:Cancel')}
                  />{' '}
                  &nbsp;
                  {cityName === "Bengaluru (Bangalore) Rural"  || cityName === "Bengaluru (Bangalore) Urban" ? (
                    <>
                      <KenButton
                        variant="primary"
                        onClick={handleSubmit}
                        label={t('labels:Pick_Up_MarkSheets')}
                        disabled={markSheetData === "Mark Sheet Request"?true:false}
                      />
                    </>
                  ) : (
                    <KenButton
                      variant="primary"
                      onClick={handleSubmit}
                      label={t('labels:Dispatch_MarkSheets')}
                      disabled={markSheetData === "Mark Sheet Request"?true:false}
                    />
                  )}
                </Box>
</Grid>
                  </Grid>
                </div>
                {/* <KenButton
                            variant="secondary"
                            style={{ border: 'none' }}
                            onClick={cancelItem}
                            label={t('labels:')}                        >
                            <Typography container >
                                <GrAttachment /> <span className={classes.questionContent}>Upload File</span>
                            </Typography>
                        </KenButton> */}
               {/*  <Box className={classes.SubmitBtn}>
                  <KenButton
                    variant="secondary"
                    onClick={handleCancel}
                    label={t('labels:Cancel')}
                  />{' '}
                  &nbsp;
                  { cityName === "Bengaluru (Bangalore) Rural"  || cityName === "Bengaluru (Bangalore) Urban" ? (
                    <>
                      <KenButton
                        variant="primary"
                        onClick={handleSubmit}
                        label={t('labels:Pick_Up_MarkSheets')}
                      />
                    </>
                  ) : (
                    <KenButton
                      variant="primary"
                      onClick={handleSubmit}
                      label={t('labels:Dispatch_MarkSheets')}
                    />
                  )}
                </Box> */}
              </div>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
