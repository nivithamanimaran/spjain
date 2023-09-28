import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  TextareaAutosize,
  Typography,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import KenLoader from '../../../../components/KenLoader';
import KenSnackbar from '../../../../components/KenSnackbar';
import KenButton from '../../../../global_components/KenButton';
import { postFeedback } from '../../../../utils/ApiService';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  button: {
    borderRadius: '3px',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  back: {
    color: '#193389',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Work Sans',
    margin: 'auto',
  },
  pos: {
    marginBottom: 12,
    lineHeight: '18.77px',
  },
  sub: {
    marginLeft: '200px',
    marginTop: '-22px',
    fontSize: '16px',
    fontWeight: '600px',
    color: '#090F69',
    fontStyle: 'normal',
  },
  Slider: {
    width: '700px',
    marginLeft: '30px',
    [theme.breakpoints.down('md')]: {
      width: '300px',
      marginLeft: '0px',
    },
  },
  parameter: {
    marginTop: '10px',
  },
  titled: {
    fontFamily: 'Work sans',
    fontWeight: '600',
    fontSize: '18px',
    lineHeight: '21.11px',
    paddingLeft: '35px',
    paddingTop: '23px',
    color: '#092682',
    height: '70px',
  },
  one: {
    fontFamily: 'Work sans',
    fontSize: '16px',
    lineHeight: '24.8px',
    color: '#000',
    marginLeft: '21px',
    [theme.breakpoints.down("md")]:{
      marginLeft: '0px',
    }
  },
  two: {
    fontFamily: 'Work Sans',
    fontWeight: '400',
    fontSize: '12px',
    color: '#090F69',
    lineHeight: '100%',
    marginLeft: '15px',
  },
  three: {
    marginLeft: '648px',
    fontFamily: 'Work Sans',
    fontWeight: '400',
    fontSize: '12px',
    color: '#090F69',
    lineHeight: '100%',
  },
  four: {
    marginLeft: '32px',
    fontFamily: 'Work Sans',
    fontWeight: 'bold',
    fontSize: '11px',
    lineHeight: '100%',
    opacity: '50%',
  },
  five: {
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '19px',
  },
  six: {
    fontFamily: 'Work Sans',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#090F69',
  },
  seven: {
    fontFamily: 'Work Sans',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#090F69',
    marginLeft: '83px',
  },
  eight: {
    fontFamily: 'Work Sans',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#090F69',
  },
  nine: {
    fontFamily: 'Work Sans',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#090F69',
  },
  ten: {
    fontFamily: 'Work Sans',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#090F69',
  },
  des: {
    marginLeft: '35px',
    width: '450px',
    height: '108px',
    marginTop: '10px',
    fontSize: '14px',
    resize: 'none',
    height: '108px',
    paddingTop: '12px',
    paddingLeft: '12px',
    borderRadius: '8px',
  },
  typeHeader: {
    background: '#F1F5FA',
    padding: '20px 40px',
  },
  subLbl: {
    padding: '20px',
  },
  subText: {
    fontWeight: 600,
    fontSize: 18,
  },
  headerText: {
    color: '#092682',
    fontWeight: 600,
    fontSize: '18px',
  },
  boxHead: {
    fontSize: '16px',
    color: '#000',
    opacity: '0.5',
  },
  boxVal: {
    fontSize: '16px',
    color: '#092682',
    fontWeight: 600,
  },
  textarea: {
    width: '700px',
    margin: '15px 0px 0px 22px',
    padding: '8px',
    [theme.breakpoints.down("md")]:{
      width: '300px',
      margin: '15px 0px 0px 0px',
    }
  },
  parmHeader: {
    padding: '5px 30px',
  },
  missing: {
    color: 'red',
    fontSize: 10,
    marginLeft: 20,
  },
}));
export default function FeedbackForm(props) {
  const {
    data,
    selected,
    selected2,
    handleChange,
    onSubmit,
    setShowForm,
    fromFaculty,
    cardData,
    tabData,
    tabView,
    secondScreen,
    setTabView,
    reloadAPI,
    setReloadAPI,
    termDetails,
    row,
    setFormData,
    type,
  } = props;
  const [formArray, setFormArray] = useState([]);
  const history = useHistory();
  const [selectedArray, setSelectedArray] = useState({});
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('md'));
  const contactId = JSON.parse(localStorage.getItem('userDetails')).ContactId;
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const classes = useStyles();
  const ratingVal = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
  ];
  const ratingVal2 = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];
  const radioData = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];
  function valuetext(value) {
    return `${value}`;
  }
  useEffect(() => {
    if (data) {
      setFormArray(data);
      setSelectedArray(selected);
    }
  }, [data, selected]);

  const onChangeRating = (val, row, name, isMultiple) => {
    let tempData = [...formArray];
    tempData.map(item => {
      item.feeedbackOption.map(item2 => {
        if (item2.parameterId === row.parameterId) {
          if (isMultiple && item2.answer) {
            let answerArr = JSON.parse(item2.answer);
            console.log('answerArr', answerArr);
            item2.answer = JSON.stringify(
              answerArr.map(item3 => {
                if (item3.label === name) {
                  return { ...item3, value: val };
                }
                return item3;
              })
            );
          } else {
            item2.answer = val;
          }
          return (item2.changed = true);
        }
      });
      return item;
    });
    setFormArray([...tempData]);
  };
  const submitDialog = () => {
    if (formArray.length > 0) {
      const allChange = formArray[0]?.feeedbackOption.every(
        obj => obj.changed === true
      );
      if (allChange) {
        setOpen(true);
      } else {
        let newFormArray = formArray;
        newFormArray[0]?.feeedbackOption.map(item => {
          if (!item?.answer && item.mandatory) {
            return (item.showError = true);
          } else {
            return (item.showError = false);
          }
          return item;
        });
        console.log('newFormArray', newFormArray);
        setFormArray([...newFormArray]);
      }
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    let payload = [];
    formArray.map(item => {
      item.feeedbackOption.map(item2 =>
        payload.push({
          contactId: contactId,
          feedbackItemId: selected?.val?.Id || selected2?.val?.Id,
          programId: item.programId,
          recordType: item.feedbackType,
          termId: termDetails?.value || termDetails?.termId,
          courseOfferingId: fromFaculty
            ? selected?.val?.Course_Offering__c
            : null,
          feedbackMasterId:
            selected2?.feedBackMasterId ||
            selected?.val?.feedBackMasterId ||
            item.masterFeedBackId ||
            null,
          feedbackMasterChildId: item2?.parameterId,
          feedbackDate: selected2?.dueDate || selected?.dueDate,
          parameter: item2.questionLabel,
          rating: item2.rating,
          answer: item2.answer,
          courseId:
            secondScreen === true && type === 'Course' ? row?.courseId : null,
          facultyId:
            secondScreen === true && type === 'Faculty' ? row?.facultyId : null,
        })
      );
    });
    console.log('payload', payload);
    postFeedback(payload)
      .then(res => {
        setLoading(false);
        handleSnackbarOpen('success', 'Data is Inserted');
        handleClose();
        setTimeout(() => {
          setFormArray([]);
          setSelectedArray({});
          setTabView('table');
          setShowForm(false);
          setReloadAPI(!reloadAPI);
        }, 1400);
      })
      .catch(err => {
        setLoading(false);
        handleClose();
        console.log('err', err);
      });
  };

  useEffect(() => {
    if (formArray.length > 0) {
      const allChange =
        formArray[0]?.feeedbackOption &&
        formArray[0]?.feeedbackOption.every(obj => obj.changed === true);
      setDisableButton(!allChange);
    }
  }, [formArray]);
  return (
    <div>
      {loading ? <KenLoader /> : null}
      <KenSnackbar
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={5000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Bottom-Right"
      />
      <AppBar
        position="static"
        style={{
          backgroundColor: 'white',
          color: 'black',
          borderRadius: '8px',
          boxshadow: '0px 0px 0px 0px',
          marginBottom: 10,
        }}
      >
        {!isMobileScreen ? (
          <Grid container md={12}>
            <Grid container xs={11} style={{ padding: 16, rowGap: 16 }}>
              {cardData?.map((item, index) => (
                <Grid item xs={5}>
                  <Grid container xs={12}>
                    <Grid xs={3}>
                      <Typography className={classes.boxHead}>
                        {item.key}:
                      </Typography>
                    </Grid>
                    <Grid xs={9}>
                      <Typography className={classes.boxVal}>
                        {item.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item md={1}>
              <Grid item style={{ display: 'flex', height: '100%' }}>
                <Button
                  onClick={() => {
                    setTabView(secondScreen ? 'tabs' : 'table');
                    setShowForm(false);
                    setFormData(false);
                  }}
                  className={classes.back}
                  style={{
                    background: 'white',
                    color: '#193389',
                    fontWeight: 'bold',
                    border: '1px solid #193389',
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container md={12}>
            <Grid container xs={12} style={{ padding: 16, rowGap: 16 }}>
              {cardData?.map((item, index) => (
                <Grid item xs={12}>
                  <Grid container xs={12}>
                    <Grid xs={5}>
                      <Typography className={classes.boxHead}>
                        {item.key}:
                      </Typography>
                    </Grid>
                    <Grid xs={7}>
                      <Typography className={classes.boxVal}>
                        {item.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Grid
                item
                style={{ height: '100%', padding: '0px 0px 20px 20px' }}
              >
                <Button
                  onClick={() => {
                    setTabView(secondScreen ? 'tabs' : 'table');
                    setShowForm(false);
                    setFormData(false);
                  }}
                  className={classes.back}
                  style={{
                    background: 'white',
                    color: '#193389',
                    fontWeight: 'bold',
                    border: '1px solid #193389',
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </AppBar>
      <Card>
        {formArray &&
          formArray.map(item => {
            const groupedOptions = {};
            item?.feeedbackOption &&
              item?.feeedbackOption.forEach(option => {
                const sectionLabel = option.sectionLabel || 'null';
                const subLabel = option.sublabel || 'null';
                if (!groupedOptions[sectionLabel]) {
                  groupedOptions[sectionLabel] = {};
                }
                if (!groupedOptions[sectionLabel][subLabel]) {
                  groupedOptions[sectionLabel][subLabel] = [];
                }
                groupedOptions[sectionLabel][subLabel].push(option);
              });
            console.log('groupedOptions NEW', groupedOptions);
            return (
              <React.Fragment key={item.feedbackType}>
                <Grid spacing={2} className={classes.typeHeader}>
                  <Typography className={classes.headerText}>
                    Parameters{/* {item?.feedbackType} */}
                  </Typography>
                </Grid>
                {groupedOptions ? (
                  Object.entries(groupedOptions)?.map(
                    ([sectionLabel, subLabels]) => (
                      <CardContent key={sectionLabel}>
                        {sectionLabel !== 'null' && sectionLabel !== null ? (
                          <Grid spacing={2} className={classes.typeHeader}>
                            <Typography className={classes.headerText}>
                              {sectionLabel}
                            </Typography>
                          </Grid>
                        ) : null}
                        {Object.entries(subLabels)?.map(
                          ([subLabel, parameters]) => (
                            <React.Fragment key={subLabel}>
                              {subLabel !== 'null' && subLabel !== null && (
                                <Grid spacing={2} className={classes.subLbl}>
                                  <Typography className={classes.subText}>
                                    {subLabel}
                                  </Typography>
                                </Grid>
                              )}
                              {parameters.map((parameter, idx) => (
                                <React.Fragment key={parameter.questionLabel}>
                                  <Typography
                                    className={classes.one}
                                    style={{ marginTop: '20px' }}
                                  >
                                    {parameter.questionLabel}
                                  </Typography>
                                  {parameter.questionType === 'Rating' ? (
                                    <React.Fragment>
                                      <CardActions>
                                        {!isMobileScreen ? (
                                          <Typography>
                                            <span className={classes.two}>
                                              Poor
                                            </span>
                                            <span className={classes.three}>
                                              Excellent
                                            </span>
                                          </Typography>
                                        ) : (
                                          <Grid container>
                                            <Grid item xs={3}>
                                              <span className={classes.two}>
                                                Poor
                                              </span>
                                            </Grid>
                                            <Grid item xs={6} />
                                            <Grid item xs={3}>
                                              <span className={classes.two}>
                                                Excellent
                                              </span>
                                            </Grid>
                                          </Grid>
                                        )}
                                      </CardActions>
                                      <Slider
                                        className={classes.Slider}
                                        min={1}
                                        max={parameter.maxGrade}
                                        disabled={
                                          selected?.feedbackStatus !==
                                            'Submitted' &&
                                          selected?.status !== 'Submitted' &&
                                          row?.status !== 'Submitted'
                                            ? false
                                            : true
                                        }
                                        getAriaValueText={valuetext}
                                        defaultValue={
                                          parameter?.feedbackCollection?.answer
                                        }
                                        value={
                                          parameter?.feedbackCollection?.answer
                                        }
                                        aria-labelledby="discrete-slider-custom"
                                        step={null}
                                        marks={ratingVal.slice(
                                          0,
                                          parameter.maxGrade
                                        )}
                                        onChange={(event, value) => {
                                          onChangeRating(
                                            value,
                                            parameter,
                                            parameter.questionLabel,
                                            false
                                          );
                                        }}
                                      />
                                      {parameter?.showError ? (
                                        <Typography className={classes.missing}>
                                          This is a mandatory question
                                        </Typography>
                                      ) : null}
                                    </React.Fragment>
                                  ) : parameter.questionType === 'Yes/No' ? (
                                    <React.Fragment>
                                      <FormControl>
                                        <RadioGroup
                                          row={true}
                                          aria-label={parameter.questionLabel}
                                          disabled={
                                            selected?.feedbackStatus !==
                                              'Submitted' &&
                                            selected?.status !== 'Submitted' &&
                                            row?.status !== 'Submitted'
                                              ? false
                                              : true
                                          }
                                          name="cots"
                                          value={
                                            parameter?.feedbackCollection
                                              ?.answer
                                          }
                                          onChange={event => {
                                            onChangeRating(
                                              event.target.value,
                                              parameter,
                                              parameter.questionLabel,
                                              false
                                            );
                                          }}
                                        >
                                          {radioData.map(el => (
                                            <FormControlLabel
                                              key={el.value}
                                              style={{
                                                padding: '0px 10px',
                                                marginLeft: '10px',
                                              }}
                                              labelPlacement="start"
                                              value={el.value}
                                              control={<Radio />}
                                              label={el.label}
                                            />
                                          ))}
                                        </RadioGroup>
                                      </FormControl>
                                    </React.Fragment>
                                  ) : parameter.questionType === 'Comment' ? (
                                    <React.Fragment>
                                      <TextareaAutosize
                                        aria-label="minimum height"
                                        minRows={6}
                                        placeholder="Add a brief description"
                                        disabled={
                                          selected?.feedbackStatus !==
                                            'Submitted' &&
                                          selected?.status !== 'Submitted' &&
                                          row?.status !== 'Submitted'
                                            ? false
                                            : true
                                        }
                                        value={
                                          parameter?.feedbackCollection?.answer
                                        }
                                        onChange={event => {
                                          onChangeRating(
                                            event.target.value,
                                            parameter,
                                            parameter.questionLabel,
                                            false
                                          );
                                        }}
                                        className={classes.textarea}
                                      />
                                    </React.Fragment>
                                  ) : parameter.questionType ===
                                    'Multiple Choice' ? (
                                    <React.Fragment>
                                      <FormControl
                                        sx={{ m: 3 }}
                                        component="fieldset"
                                        variant="standard"
                                      >
                                        <FormGroup
                                          row={true}
                                          className={classes.textarea}
                                        >
                                          {JSON.parse(
                                            parameter?.feedbackCollection
                                              ?.answer
                                          ).map(({ label, value }) => (
                                            <FormControlLabel
                                              key={label}
                                              control={
                                                <Checkbox
                                                  checked={value}
                                                  onChange={event => {
                                                    onChangeRating(
                                                      event.target.checked,
                                                      parameter,
                                                      label,
                                                      true
                                                    );
                                                  }}
                                                  name={label}
                                                />
                                              }
                                              disabled={
                                                selected?.feedbackStatus !==
                                                  'Submitted' &&
                                                selected?.status !==
                                                  'Submitted' &&
                                                row?.status !== 'Submitted'
                                                  ? false
                                                  : true
                                              }
                                              label={label}
                                            />
                                          ))}
                                        </FormGroup>
                                      </FormControl>
                                    </React.Fragment>
                                  ) : parameter.questionType ===
                                    'Multiple Option Rating' ? (
                                    <React.Fragment>
                                      {JSON.parse(
                                        parameter?.feedbackCollection?.answer
                                      ).map(({ label, value }) => (
                                        <React.Fragment key={label}>
                                          <Typography
                                            className={classes.parmHeader}
                                          >
                                            {label}
                                          </Typography>
                                          <CardActions>
                                            <Typography>
                                              <span className={classes.two}>
                                                Poor
                                              </span>
                                              <span className={classes.three}>
                                                Excellent
                                              </span>
                                            </Typography>
                                          </CardActions>
                                          <Slider
                                            className={classes.Slider}
                                            min={1}
                                            max={
                                              parameter.feedbackCollection
                                                .maxGrade
                                            }
                                            defaultValue={value}
                                            disabled={
                                              selected?.feedbackStatus !==
                                                'Submitted' &&
                                              selected?.status !==
                                                'Submitted' &&
                                              row?.status !== 'Submitted'
                                                ? false
                                                : true
                                            }
                                            value={value}
                                            getAriaValueText={valuetext}
                                            aria-labelledby="discrete-slider-custom"
                                            step={null}
                                            marks={ratingVal2}
                                            onChange={(event, val) => {
                                              onChangeRating(
                                                val,
                                                parameter,
                                                label,
                                                true
                                              );
                                            }}
                                          />
                                        </React.Fragment>
                                      ))}
                                    </React.Fragment>
                                  ) : null}
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          )
                        )}
                      </CardContent>
                    )
                  )
                ) : (
                  <Typography>No Data</Typography>
                )}
              </React.Fragment>
            );
          })}
      </Card>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        {selected?.feedbackStatus !== 'Submitted' &&
          selected?.status !== 'Submitted' &&
          row?.status !== 'Submitted' && (
            <KenButton
              variant="primary"
              onClick={submitDialog}
              MuiAlert
              buttonClass={classes.button}
              // disabled={disableButton}
              endIcon={<CheckIcon />}
            >
              Submit
            </KenButton>
          )}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ color: '#193389', fontSize: '24px', fontWeight: 600 }}
          id="draggable-dialog-title"
        />
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the Feedback?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            color="primary"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
