import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import KenSelect from '../../../../global_components/KenSelect';
import KenButton from '../../../../global_components/KenButton';
import KenInputField from '../../../../global_components/KenInputField';
import KenTextField from '../../../../components/KenInputField';
import KenSnackBar from '../../../../components/KenSnackbar';
import KenDateTimePicker from '../../../../global_components/KenDateTimePicker';
import AchievementsData from './AchivementsData.json';
import './styles.scss';
import KenUploadButton from '../../../../global_components/KenUploadButton';
import { postContactAdditionaAchievements } from '../../../../utils/ApiService';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.KenColors.kenBlack,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: 24,
  },
  buttonCancel: {
    marginRight: 10,
  },
}));

export default function AddAchievements(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [data, setData] = useState(props.location.state.data);
  const [formData, setFormData] = useState([]);
  const [selectedQuerry, setSelectedQuerry] = useState('');
  const currentCategory = props.location.state.category;
  const history = useHistory();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const contactId = getUserDetails().ContactId;
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);
  useEffect(() => {
    if (currentCategory === 'Learning,Development') {
      setFormData(AchievementsData['Learning,Development']);
    } else {
      setFormData(AchievementsData[currentCategory]);
    }
  }, [data, selectedQuerry]);

  const handleCancel = () => {
    history.push({
      pathname: `/my360`,
      state: { tab: 'Achievements' },
    });
  };

  console.log(formData, selectedQuerry);

  const handleSubmit = () => {
    let data = [];
    if (selectedQuerry !== '') {
      formData.forEach(el => {
        if (el.selective === selectedQuerry) {
          data.push(el);
        }
      });
    } else {
      formData.forEach(el => {
        data.push(el);
      });
      const reformattedArray = formData.map(({ key, value }) => ({
        [key]: value,
      }));
      console.log('reformattedArray', reformattedArray);
    }
    console.log('handleSubmit', data);
    if (data.length > 0) {
      // let payload = [
      //   {
      //     TypePublication: selectedQuerry,
      //     TitleOfPaper: data.find(field => field.apiName === 'TitleOfPaperr')
      //       .value,
      //     Linkofpublication: data.find(
      //       field => field.apiName === 'Linkofpublication'
      //     ).value,
      //     Coauthor: data.find(field => field.apiName === 'Coauthor').value,
      //     journal: data.find(field => field.apiName === 'journal').value,
      //     publiNumber: data.find(field => field.apiName === 'publiNumber')
      //       .value,
      //     YearOfPublication: data.find(
      //       field => field.apiName === 'YearOfPublication'
      //     ).value,
      //     volume: data.find(field => field.apiName === 'volume').value,
      //     PAAGES: data.find(field => field.apiName === 'PAAGES').value,
      //     Publisher: data.find(field => field.apiName === 'Publisher').value,
      //     RecordType: '0121y000002Kde5AAC',
      //     CERTIFICATE: [
      //       {
      //         attachmentName: data.find(
      //           field => field.name === 'supportingDocuments'
      //         ).value[0].path,
      //         attachmentContentType: data.find(
      //           field => field.name === 'supportingDocuments'
      //         ).value[0].type,
      //         attachmentBody: '',
      //       },
      //     ],
      //   },
      // ];
      let payload = [];
      console.log(currentCategory);

      if (currentCategory === 'Grants') {
        payload = [
          {
            RecordType: '0121y000002KddqAAC',
            IssueBy:
              data.find(field => field.name === 'grantIssuedBy') !== undefined
                ? data.find(field => field.name === 'grantIssuedBy').value
                : '',
            GrantCurrency:
              data.find(field => field.name === 'grantCurrency') !== undefined
                ? data.find(field => field.name === 'grantCurrency').value
                : '',
            GrantIssuefor:
              data.find(field => field.name === 'grantIssuefor') !== undefined
                ? data.find(field => field.name === 'grantIssuefor').value
                : '',
            Grantamount:
              data.find(field => field.name === 'grantAmount') !== undefined
                ? data.find(field => field.name === 'grantAmount').value
                : '',
            GrantDescription:
              data.find(field => field.name === 'grantDescription') !==
              undefined
                ? data.find(field => field.name === 'grantDescription').value
                : '',
            CERTIFICATE: [
              {
                attachmentName:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].path
                    : 'NA',
                attachmentContentType:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].type
                    : '',
                attachmentBody: base64 || '',
              },
            ],
          },
        ];
      } else if (currentCategory === 'Patents') {
        payload = [
          {
            patentTitle:
              data.find(field => field.name === 'patentTitle') !== undefined
                ? data.find(field => field.name === 'patentTitle').value
                : '',
            PatentStatus:
              data.find(field => field.name === 'patentStatus') !== undefined
                ? data.find(field => field.name === 'patentStatus').value
                : '',
            ApplicationNumber:
              data.find(field => field.name === 'applicationNumber') !==
              undefined
                ? data.find(field => field.name === 'applicationNumber').value
                : '',
            FileOffice:
              data.find(field => field.name === 'patentFilingOffice') !==
              undefined
                ? data.find(field => field.name === 'patentFilingOffice').value
                : '',
            PatentNumber:
              data.find(field => field.name === 'patentNumber') !== undefined
                ? data.find(field => field.name === 'patentNumber').value
                : '',
            ClassficationCode:
              data.find(field => field.name === 'internationalPatentCode') !==
              undefined
                ? data.find(field => field.name === 'internationalPatentCode')
                    .value
                : '',
            PCTApplicationNo:
              data.find(field => field.name === 'PCTapplication') !== undefined
                ? data.find(field => field.name === 'PCTapplication').value
                : '',
            PCTPublicationNo:
              data.find(field => field.name === 'PCTpublication') !== undefined
                ? data.find(field => field.name === 'PCTpublication').value
                : '',
            PCTDescription:
              data.find(field => field.name === 'patentDescription') !==
              undefined
                ? data.find(field => field.name === 'patentDescription').value
                : '',
            RecordType: '0121y000002Kde0AAC',
            CERTIFICATE: [
              {
                attachmentName:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].path
                    : 'NA',
                attachmentContentType:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].type
                    : '',
                attachmentBody: base64 || '',
              },
            ],
          },
        ];
      } else if (currentCategory === 'Learning Development') {
        payload = [
          {
            TitleOfTraining:
              data.find(field => field.name === 'courseTitle') !== undefined
                ? data.find(field => field.name === 'courseTitle').value
                : '',
            ModeOfTraining:
              data.find(field => field.name === 'modeTraining') !== undefined
                ? data.find(field => field.name === 'modeTraining').value
                : '',
            Domain:
              data.find(field => field.name === 'trainingDomain') !== undefined
                ? data.find(field => field.name === 'trainingDomain').value
                : '',
            ConductedbY:
              data.find(field => field.name === 'trainingConductedBy') !==
              undefined
                ? data.find(field => field.name === 'trainingConductedBy').value
                : '',
            HaveFormal:
              data.find(field => field.name === 'formalEvaluation') !==
              undefined
                ? data.find(field => field.name === 'formalEvaluation').value
                : '',
            CertifiacteIssueBy:
              data.find(field => field.name === 'certificateIssuedBy') !==
              undefined
                ? data.find(field => field.name === 'certificateIssuedBy').value
                : '',
            Results:
              data.find(field => field.name === 'result') !== undefined
                ? data.find(field => field.name === 'result').value
                : '',
            RecordType: '0121y000002KddvAAC',
            CERTIFICATE: [
              {
                attachmentName:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].path
                    : 'NA',
                attachmentContentType:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].type
                    : '',
                attachmentBody: base64 || '',
              },
            ],
          },
        ];
      } else if (currentCategory === 'Consulting Projects') {
        payload = [
          {
            patentTitle: data.find(field => field.name === 'patentTitle').value,
            PatentStatus: data.find(field => field.name === 'patentStatus')
              .value,
            ApplicationNumber: data.find(
              field => field.name === 'applicationNumber'
            ).value,
            FileOffice: data.find(field => field.name === 'patentFilingOffice')
              .value,
            PatentNumber: data.find(field => field.name === 'patentNumber')
              .value,
            ClassficationCode:
              data.find(field => field.name === 'internationalPatentCode') !==
              undefined
                ? data.find(field => field.name === 'internationalPatentCode')
                    .value
                : '',
            PCTApplicationNo:
              data.find(field => field.name === 'PCTapplication') !== undefined
                ? data.find(field => field.name === 'PCTapplication').value
                : '',
            PCTPublicationNo:
              data.find(field => field.name === 'PCTpublication') !== undefined
                ? data.find(field => field.name === 'PCTpublication').value
                : '',
            PCTDescription:
              data.find(field => field.name === 'patentDescription') !==
              undefined
                ? data.find(field => field.name === 'patentDescription').value
                : '',
            RecordType: '0121y000002Kde0AAC',
            CERTIFICATE: [
              {
                attachmentName:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].path
                    : 'NA',
                attachmentContentType:
                  data.find(field => field.name === 'supportingDocuments') !==
                    undefined &&
                  data.find(field => field.name === 'supportingDocuments')
                    .value[0] !== undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].type
                    : '',
                attachmentBody: base64 || '',
              },
            ],
          },
        ];
      } else {
        payload = [
          {
            TypePublication: selectedQuerry,
            RecordType: '0121y000002Kde5AAC',
            TitleOfPaper:
              data.find(field => field.name === 'titlePaper') !== undefined
                ? data.find(field => field.name === 'titlePaper').value
                : '',
            Linkofpublication:
              data.find(field => field.name === 'linkPublication') !== undefined
                ? data.find(field => field.name === 'linkPublication').value
                : '',
            Coauthor:
              data.find(field => field.name === 'coAuthors') !== undefined
                ? data.find(field => field.name === 'coAuthors').value
                : '',
            journal:
              data.find(field => field.name === 'journal') !== undefined
                ? data.find(field => field.name === 'journal').value
                : '',
            publiNumber:
              data.find(field => field.name === 'number') !== undefined
                ? data.find(field => field.name === 'number').value
                : '',
            YearOfPublication:
              data.find(field => field.name === 'yearPublication') !== undefined
                ? data.find(field => field.name === 'yearPublication').value
                : '',
            volume:
              data.find(field => field.name === 'volume') !== undefined
                ? data.find(field => field.name === 'volume').value
                : '',
            PAAGES:
              data.find(field => field.name === 'pages') !== undefined
                ? data.find(field => field.name === 'pages').value
                : '',
            Publisher:
              data.find(field => field.name === 'publisher') !== undefined
                ? data.find(field => field.name === 'publisher').value
                : '',
            CERTIFICATE: [
              {
                attachmentName:
                  data.find(field => field.name === 'supportingDocuments') !==
                  undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].path
                    : '',
                attachmentContentType:
                  data.find(field => field.name === 'supportingDocuments') !==
                  undefined
                    ? data.find(field => field.name === 'supportingDocuments')
                        .value[0].type
                    : '',
                attachmentBody: base64,
              },
            ],
          },
        ];
      }
      if (payload.length > 0) {
        data = [];
        console.log(payload);
        postContactAdditionaAchievements(contactId, payload)
          .then(response => {
            console.log(response);
            handleSnackbarOpen('success', 'Successfully Submitted');
            if (response?.success === 'true') {
              return setTimeout(() => {
                history.push('/my360');
              }, 3000);
            }
          })
          .catch(error => {
            console.log(error);
            handleSnackbarOpen('error', 'Failed to Submit');
          })
          .finally(() => {});
      }
    }
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

  const handleOnChange = (e, type) => {
    const { name, value } = e.target;
    if (name === 'typePublication') {
      setSelectedQuerry(value);
    }
    let formDataCopy = [...formData];
    formDataCopy.find(el => el?.name === name).value = value;
    setFormData(formDataCopy);
  };

  const handleOnChangeDocuments = (name, files) => {
    let formDataCopy = [...formData];
    setFile(files[0]);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      const base64WithoutPrefix = reader.result.slice(
        reader.result.indexOf(',') + 1
      );
      setBase64(base64WithoutPrefix);
    };
    reader.onerror = error => {
      console.log('Error: ', error);
    };
    formDataCopy.find(el => el?.name === name).value = files;
    setFormData(formDataCopy);
  };

  console.log('selectedQuerry', selectedQuerry);
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
          <Box mt={2} className="achivements-tab">
            <Grid container direction="row" className={classes.container}>
              <Grid item xs={12}>
                <Grid container spacing={2} direction="row">
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography className={classes.title}>
                        {currentCategory.replace(/([a-z0-9])([A-Z])/g, '$1 $2')}
                      </Typography>
                      {/* <KenButton variant="primary" onClick={handleCancel}
              buttonClass={classes.buttonSubmit}>Back</KenButton>  */}
                    </div>
                  </Grid>

                  {formData?.length > 0
                    ? formData?.map((item, index) => {
                        return (
                          <>
                            {item?.inputType === 'KenSelect' ? (
                              <Grid
                                item
                                xs={12}
                                md={item?.width ? item?.width : 4}
                              >
                                <div
                                  className="select-box"
                                  style={item?.width ? { width: '50%' } : null}
                                >
                                  <KenSelect
                                    label={item.label}
                                    name={item.name}
                                    options={item.options}
                                    onChange={e =>
                                      handleOnChange(e, item?.inputType)
                                    }
                                    required={item.required}
                                  />
                                </div>
                              </Grid>
                            ) : null}
                            {item?.inputType === 'KenInput' ? (
                              <Grid item xs={12} md={4}>
                                <div className="text-box">
                                  <KenInputField
                                    required={item.required}
                                    disabled={item.disabled}
                                    onChange={e =>
                                      handleOnChange(e, item?.inputType)
                                    }
                                    name={item.name}
                                    value={item.value}
                                    label={item.label}
                                  />
                                </div>
                              </Grid>
                            ) : null}
                            {item?.inputType === 'KenDatePicker' ? (
                              <Grid item xs={12} md={6}>
                                <div className="date-picker">
                                  <KenDateTimePicker
                                    name={item.name}
                                    value={item.value}
                                    label={item.label}
                                    onChange={e =>
                                      handleOnChange(e, item?.inputType)
                                    }
                                  />
                                </div>
                              </Grid>
                            ) : null}
                            {item?.inputType === 'KenDocuments' ? (
                              <Grid item xs={12} md={6}>
                                <div className="text-box">
                                  <KenUploadButton
                                    required={item.required}
                                    disabled={item.disabled}
                                    onChange={handleOnChangeDocuments}
                                    name={item.name}
                                    value={item.value}
                                    label={item.label}
                                  />
                                </div>
                              </Grid>
                            ) : null}
                            {item?.inputType === 'KenTextArea' ? (
                              <Grid item xs={12} md={4}>
                                <div className="text-box">
                                  <KenTextField
                                    name={item.name}
                                    value={item.value}
                                    label={item.label}
                                    onChange={e =>
                                      handleOnChange(e, item?.inputType)
                                    }
                                    row={item.row}
                                  />
                                </div>
                              </Grid>
                            ) : null}
                            {/* Selective */}
                            {item?.inputType === 'KenSelectSelective' ? (
                              item?.selective === selectedQuerry ? (
                                <Grid item xs={12} md={4}>
                                  <div className="select-box">
                                    <KenSelect
                                      label={item.label}
                                      name={item.name}
                                      options={item.options}
                                      onChange={e =>
                                        handleOnChange(e, item?.inputType)
                                      }
                                      required={item.required}
                                    />
                                  </div>
                                </Grid>
                              ) : null
                            ) : null}
                            {item?.inputType === 'KenInputSelective' ? (
                              item?.selective === selectedQuerry ? (
                                <Grid item xs={12} md={4}>
                                  <div className="text-box">
                                    <KenInputField
                                      required={item.required}
                                      disabled={item.disabled}
                                      onChange={e =>
                                        handleOnChange(e, item?.inputType)
                                      }
                                      name={item.name}
                                      value={item.value}
                                      label={item.label}
                                    />
                                  </div>
                                </Grid>
                              ) : null
                            ) : null}
                            {item?.inputType === 'KenDocuments' ? (
                              item?.selective === selectedQuerry ? (
                                <Grid item xs={12} md={4}>
                                  <div className="text-box">
                                    <KenUploadButton
                                      required={item.required}
                                      disabled={item.disabled}
                                      onChange={handleOnChangeDocuments}
                                      name={item.name}
                                      value={item.value}
                                      label={item.label}
                                    />
                                  </div>
                                </Grid>
                              ) : null
                            ) : null}
                            {item?.inputType === 'KenTextAreaSelective' ? (
                              item?.selective === selectedQuerry ? (
                                <Grid item xs={12} md={4}>
                                  <div className="text-box">
                                    <KenTextField
                                      name={item.name}
                                      value={item.value}
                                      label={item.label}
                                      onChange={e =>
                                        handleOnChange(e, item?.inputType)
                                      }
                                      row={item.row}
                                    />
                                  </div>
                                </Grid>
                              ) : null
                            ) : null}
                            {item?.inputType === 'KenDatePicker' ? (
                              item?.selective === selectedQuerry ? (
                                <Grid item xs={12} md={4}>
                                  <div className="date-picker">
                                    <KenDateTimePicker
                                      name={item.name}
                                      value={item.value}
                                      label={item.label}
                                      onChange={e =>
                                        handleOnChange(e, item?.inputType)
                                      }
                                    />
                                  </div>
                                </Grid>
                              ) : null
                            ) : null}
                          </>
                        );
                      })
                    : null}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  xs={12}
                  style={{ marginTop: 24, justifyContent: 'right' }}
                >
                  <KenButton
                    variant="secondary"
                    onClick={handleCancel}
                    buttonClass={classes.buttonCancel}
                  >
                    Cancel
                  </KenButton>
                  <KenButton
                    variant="primary"
                    onClick={handleSubmit}
                    buttonClass={classes.buttonSubmit}
                  >
                    Submit
                  </KenButton>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </>
      }
    </div>
  );
}
