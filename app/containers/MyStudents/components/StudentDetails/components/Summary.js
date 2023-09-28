import { useContext, useEffect, useState } from 'react';
import { TABLET_BREAKPOINT } from '../../../../../utils/constants';
import { getSplitName } from '../../../../../utils/helpers/stringHelper';
// import PrintIcon from '@mui/icons-material/Print';
import useReactToPrint from 'react-to-print';
import { useRef } from 'react';
import React from 'react';
import ReactToPrint from 'react-to-print/lib';
// import SummaryToPrint from './summaryToPrint';
import {
  Grid,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
  Box,
  Divider,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import {
  getApplicationByApplicationId,
  getFormDataByFormId,
} from '../../../../../utils/ApiService';
import KenCard from '../../../../../global_components/KenCard';
import KenLoader from '../../../../../components/KenLoader';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(theme => ({
  formContainer: {
    height: 'calc(100% - 16px)',
    paddingTop: theme.spacing(7.125),
    overflow: 'auto',
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      paddingTop: theme.spacing(3),
    },
  },
  stepLabel: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: '20px',
  },
  sectionLabel: {
    fontWeight: 400,
    fontSize: '20px',
  },
  sectionSubLabel: {
    color: '#7A869A',
    fontWeight: 400,
    fontSize: 18,
    fontWeight: 500,
  },
  footerContainer: {
    position: 'absolute',
    bottom: '0px',
    padding: '16px',
    paddingRight: '223px',
    minHeight: 76,
    // height: "100px",
    left: '0px',
    right: '0px',
    overflow: 'hidden',
    background: '#FFFFFF',
    boxShadow:
      '10px 0px 20px rgba(0, 0, 0, 0.04), 2px 0px 6px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
    // backgroundColor: "blue",
  },
  container: {
    position: 'absolute',
    top: '270px',
    bottom: '0px',
    left: '0px',
    right: '0px',
  },
  paymentContainer: {
    padding: '16px 223px',
  },
  fieldNameValue: {
    wordBreak: 'break-word',
    fontWeight: 400,
    fontSize: '16px',
  },
  fieldName: {
    color: '#7A869A',
    fontSize: '16px',
  },
  fieldValue: {
    color: '#061938',
  },
  fieldContainer: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      flexDirection: 'column',
      'align-items': 'flex-start',
      'justify-content': 'flex-start',
      'max-width': '100%',
      display: 'flex',
      width: '100%',
      'padding-top': '0 !important',
    },
  },
  fieldKeyContainer: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      width: '40%',
      'font-style': 'normal',
      'font-weight': '400',
      'font-size': '16px',
      'line-height': '150%',
      'text-transform': 'capitalize',
      color: '#7A869A',
    },
  },
  fieldValueContainer: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      width: '60%',
      'font-style': 'normal',
      'font-weight': '400',
      'font-size': '16px',
      'line-height': '150%',
      color: '#061938',
    },
  },
  divider: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      margin: '5px auto 16px 0',
    },
  },
  dividerContainer: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      margin: '5px',
    },
  },
  dividerWrapper: {
    [theme.breakpoints.down(TABLET_BREAKPOINT)]: {
      margin: '0px',
      paddingTop: '0 !important',
    },
  },
}));

const KenSummary = React.forwardRef((props, ref) => {
  const location = useLocation();
  //   const { data } = props;
  const classes = useStyles();
  const [formJson, setFormJson] = useState();
  const [data, setData] = useState();
  const [loader, setLoader] = useState();
  const theme = useTheme();
  //   const { formState, formDispatch } = useContext(FormContext);
  const isMobileScreen = useMediaQuery(
    theme.breakpoints.down(TABLET_BREAKPOINT)
  );
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const query = new URLSearchParams(location.search);
  const applicationId = query.get('applicationId');
  const applicationFormId = query.get('applicationFormId');

  const fetchData = async () => {
    try {
      setLoader(true);
      const res = await getApplicationByApplicationId(applicationId);
      if (res.success) {
        setData(res?.data);
        const formRes = await getFormDataByFormId(applicationFormId);
        if (formRes.success) {
          setFormJson(JSON.parse(formRes?.data?.formMetadata));
          setLoader(false);
        }
      }
    } catch (err) {
      console.log(err?.response);
      enqueueSnackbar(
        (err &&
          err?.response &&
          err?.response?.data &&
          err?.response?.data?.errorMessages &&
          err?.response?.data?.errorMessages[0]?.errorMessage) ||
          'Something went wrong',
        {
          variant: 'error',
        }
      );
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   const checkFormOptions = value => {
  //     let combinedValues = [];
  //     Object.values(applicationState.formOptions).map(el => {
  //       if (Array.isArray(el)) {
  //         combinedValues.push(...el);
  //       }
  //     });
  //     if (combinedValues.some(el => el.value === value)) {
  //       return combinedValues.find(el => el.value === value)?.label;
  //     } else if (value === 'true' || value === 'false') {
  //       return value === 'true' ? 'Yes' : 'No';
  //     } else {
  //       return value;
  //     }
  //   };

  const getFieldValue = fieldName => {
    try {
      //convert names to executable to get value
      const name = 'data[' + fieldName + ']';
      const keysArray = getSplitName(name, '', true) || [];
      let str = '';
      keysArray.map((item, index) => {
        if (index === 0) {
          str = item;
        } else {
          if (isNaN(item)) {
            str = `${str}["${item}"] && ${str}["${item}_select"] || ${str}["${item}"] && ${str}["${item}"]`;
          } else {
            str = `${str}[${item}] && ${str}[${item}]`;
          }
        }
      });
      //   console.log('final str', str);
      // console.log("type::::", field.type, field);
      // if (field.type === "addMultiple") {
      //    return data['newApplicantRelations1'][0]['firstName']
      // }
      //   return checkFormOptions(eval(str)); //covert string to executable
      eval(str);
    } catch {
      console.log('error in eval');
    }
  };

  const getNestedData = (name, structure) => {
    console.log(name, structure);
    const flatStructureData = structure.map(a => {
      return { name: a?.name, label: a?.label };
    });
    let dataByName;
    if (/\d/.test(name)) {
      dataByName = getFieldValue(name);
    } else {
      dataByName = data[name] || [];
    }
    const allData = dataByName?.map(el => {
      let obj = {};
      flatStructureData?.forEach(item => {
        console.log(item.name);
        obj[item.label] =
          item.name.includes('semesterNumber') ||
          item.name.includes('yearNumber')
            ? el[(item?.name)]?.replace(/\D/g, '')
            : el[(item?.name)];
      });
      return obj;
    });
    return allData;
  };

  return (
    <KenCard>
      {loader && <KenLoader />}
      <div ref={ref}>
        <Box p={2}>
          <Typography
            align="left"
            marginBottom={isMobileScreen ? 0 : theme.spacing(4)}
            className={classes.stepLabel}
          >
            Summary
          </Typography>

          {/* {applicationState?.applicationData?.application?.applicationNumber && (
          <Grid container pt={2} pb={2}>
            <Grid item md={3}>
              <Typography
                className={`${classes.fieldName} ${classes.fieldNameValue}`}
                variant="h5"
                style={{ textAlign: 'left' }}
              >
                Application Number
              </Typography>
            </Grid>
            <Grid item md={3}>
              <Typography
                className={`${classes.fieldValue} ${classes.fieldNameValue}`}
                variant="h5"
              >
                {
                  applicationState?.applicationData?.application
                    ?.applicationNumber
                }
              </Typography>
            </Grid>
          </Grid>
        )} */}

          <Box pt={1}>
            {formJson?.map(step => {
              return (
                <>
                  <Grid container spacing={2}>
                    {step?.sections?.map((section, index) => {
                      return (
                        <>
                          {section.sectionVisible === true && (
                            <>
                              <Grid item xs={12}>
                                <Box>
                                  {section?.sectionName && (
                                    <Typography
                                      align="left"
                                      marginBottom={
                                        isMobileScreen
                                          ? theme.spacing(1)
                                          : theme.spacing(4)
                                      }
                                      className={classes.sectionLabel}
                                    >
                                      {section?.sectionName}
                                    </Typography>
                                  )}
                                  {section?.subSectionName && (
                                    <Typography
                                      align="left"
                                      marginBottom={
                                        isMobileScreen
                                          ? theme.spacing(1)
                                          : theme.spacing(4)
                                      }
                                      className={classes.sectionSubLabel}
                                      variant="body2"
                                    >
                                      {section?.subSectionName}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>

                              {/* <Box key={section.sectionId}> */}
                              {/* <Grid container spacing={6} rowSpacing={4}> */}
                              {section.fields.map((field, fieldIndex) => {
                                return field?.metaData?.addMultiple === true ? (
                                  <Grid
                                    item
                                    container
                                    xs={12}
                                    md={12}
                                    spacing={3}
                                  >
                                    <>
                                      {getNestedData(
                                        field.name,
                                        field.fieldsArray
                                      )?.map(
                                        (nestedField, nestedFieldIndex) => {
                                          return (
                                            nestedField &&
                                            Object.keys(nestedField).map(
                                              (keyName, keyIndex) => {
                                                if (
                                                  nestedField[keyName] !==
                                                    null &&
                                                  keyName !== 'undefined'
                                                )
                                                  console.log(
                                                    keyName,
                                                    nestedField[keyName],
                                                    nestedField
                                                  );
                                                return (
                                                  <>
                                                    <Grid
                                                      item
                                                      container
                                                      xs={12}
                                                      md={6}
                                                      spacing={1}
                                                      className={
                                                        classes.fieldContainer
                                                      }
                                                    >
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={6}
                                                        textAlign="left"
                                                        className={
                                                          classes.fieldKeyContainer
                                                        }
                                                      >
                                                        <Typography
                                                          className={`${
                                                            classes.fieldName
                                                          } ${
                                                            classes.fieldNameValue
                                                          }`}
                                                          variant="h5"
                                                        >
                                                          {keyName}
                                                        </Typography>
                                                      </Grid>
                                                      <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={6}
                                                        textAlign="left"
                                                        className={
                                                          classes.fieldValueContainer
                                                        }
                                                      >
                                                        <Typography
                                                          className={`${
                                                            classes.fieldValue
                                                          } ${
                                                            classes.fieldNameValue
                                                          }`}
                                                          variant="h5"
                                                        >
                                                          {nestedField[keyName]}
                                                        </Typography>
                                                      </Grid>
                                                    </Grid>
                                                    {Object.keys(nestedField)
                                                      ?.length -
                                                      1 ===
                                                      keyIndex &&
                                                      getNestedData(
                                                        field.name,
                                                        field.fieldsArray
                                                      )?.length -
                                                        1 !==
                                                        nestedFieldIndex && (
                                                        <Grid
                                                          item
                                                          xs={12}
                                                          className={
                                                            classes.dividerContainer
                                                          }
                                                        >
                                                          <Divider
                                                            className={
                                                              classes.divider
                                                            }
                                                          />
                                                        </Grid>
                                                      )}
                                                  </>
                                                );
                                              }
                                            )
                                          );
                                        }
                                      )}
                                    </>
                                    {/* </Typography> */}
                                    {/* </Grid> */}
                                  </Grid>
                                ) : field?.fieldId ? (
                                  <>
                                    {getFieldValue(field.name) && (
                                      <Grid
                                        item
                                        container
                                        xs={12}
                                        md={6}
                                        spacing={2}
                                        className={classes.fieldContainer}
                                      >
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          textAlign="left"
                                          className={classes.fieldKeyContainer}
                                        >
                                          <Typography
                                            className={`${classes.fieldName} ${
                                              classes.fieldNameValue
                                            }`}
                                            variant="h5"
                                          >
                                            {field?.label}
                                          </Typography>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={6}
                                          textAlign="left"
                                          className={
                                            classes.fieldValueContainer
                                          }
                                        >
                                          <Typography
                                            className={`${classes.fieldValue} ${
                                              classes.fieldNameValue
                                            }`}
                                            variant="h5"
                                          >
                                            {field && getFieldValue(field.name)}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    )}
                                    {field?.ui?.divider && (
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        className={classes.dividerContainer}
                                      >
                                        <Divider className={classes.divider} />
                                      </Grid>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {field?.options.map(el => {
                                      return (
                                        <>
                                          {getFieldValue(
                                            `${field.name}${el.fieldId}`
                                          ) && (
                                            <Grid
                                              item
                                              container
                                              xs={12}
                                              md={6}
                                              spacing={2}
                                              className={classes.fieldContainer}
                                            >
                                              <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={6}
                                                textAlign="left"
                                                className={
                                                  classes.fieldKeyContainer
                                                }
                                              >
                                                <Typography
                                                  className={`${
                                                    classes.fieldName
                                                  } ${classes.fieldNameValue}`}
                                                  variant="h5"
                                                >
                                                  {el?.label}
                                                </Typography>
                                              </Grid>
                                              <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={6}
                                                textAlign="left"
                                                className={
                                                  classes.fieldValueContainer
                                                }
                                              >
                                                <Typography
                                                  className={`${
                                                    classes.fieldValue
                                                  } ${classes.fieldNameValue}`}
                                                  variant="h5"
                                                >
                                                  {el &&
                                                    getFieldValue(
                                                      `${field.name}${
                                                        el.fieldId
                                                      }`
                                                    )}
                                                </Typography>
                                              </Grid>
                                            </Grid>
                                          )}
                                          {field?.ui?.divider && (
                                            <Grid
                                              item
                                              xs={12}
                                              sm={12}
                                              md={12}
                                              lg={12}
                                              className={
                                                classes.dividerContainer
                                              }
                                            >
                                              <Divider
                                                className={classes.divider}
                                              />
                                            </Grid>
                                          )}
                                        </>
                                      );
                                    })}
                                  </>
                                );
                              })}
                              {/* </Grid> */}
                              {/* {step?.sections?.length - 1 !== index && ( */}
                              <Grid
                                item
                                xs={12}
                                className={classes.dividerWrapper}
                              >
                                <Box
                                  mt={3}
                                  mb={6}
                                  className={classes.dividerContainer}
                                >
                                  <Divider className={classes.divider} />
                                </Box>
                              </Grid>
                              {/* )} */}
                              {/* </Box> */}
                            </>
                          )}
                        </>
                      );
                    })}
                  </Grid>
                </>
              );
            })}
          </Box>
        </Box>
      </div>
    </KenCard>
  );
});

const SummaryStudent = props => {
  const componentRef = useRef();

  return (
    <div>
      <KenSummary {...props} />
      {/* <ReactToPrint
        pageStyle="@size: 11.0in 8.5in; !important;"
        // pageStyle="@page { size: 2.5in 4in }"

        trigger={() => (
          <Grid container justifyContent="space-between">
            <Grid item />
            <Grid item alignItems="right" mb={-5}>
              <PrintIcon />
            </Grid>
          </Grid>
        )}
        content={() => componentRef.current}
        removeAfterPrint={true}
        copyStyles={true} 
      />
      {/* <div style={{ display: 'none' }}>
        <SummaryToPrint ref={componentRef} {...props} />
      </div> */}
    </div>
  );
};

export default SummaryStudent;
