import React, { useState } from 'react';
import { Box, useTheme, Grid, makeStyles, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import { useTranslation } from 'react-i18next';
import context from '../../../utils/helpers/context';
import {} from '../../../utils/ApiService';
import KenInputField from '../../../components/KenInputField';
import KenButton from '../../../global_components/KenButton';
import feedbackData from './data.json';
import '../DashboardCases/CaseForm/style.scss';
const useStyles = makeStyles(theme => ({
  headBox: {
    backgroundColor: theme.palette.KenColors.kenWhite,
    padding: 20,
  },
  heading: {
    color: theme.palette.KenColors.neutral900,
    fontWeight: '600',
  },
  subHead: {
    fontSize: 12,
    paddingRight: 15,
    color: theme.palette.KenColors.neutral900,
  },
  actionBtn: {
    borderRadius: '50%',
  },
  feedHead: {
    fontWeight: 600,
    textTransform: 'uppercase',
  },
}));
export default function FeedbackForm(props) {
  return (
    <div>
      <FormikHoc {...props} />
    </div>
  );
}
const FeedbackFormDetails = props => {
  const theme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldTouched,
    setFieldValue,
    handleSubmit,
    handleBack,
    cancelItem,
  } = props;
  const { handleSnackbarOpen } = React.useContext(context);
  const change = (name, e, index) => {
    e.persist();
    handleChange(e);
    setFieldValue(name, e.target.value);
    setFieldTouched(name, true, false);
    e.preventDefault();
  };
  function FeedbackItem({ data }) {
    const classes = useStyles();
    return (
      <Box py={1}>
        <Grid container justify="space-around">
          <Grid item xs={10}>
            <div style={{ display: 'flex' }}>
              <Typography className={classes.feedItemGrid}>
                {data.sno}
              </Typography>
              <Typography className={classes.feedItemGrid}>
                {data.title}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={2}>
            <Rating
              name="rating"
              value={data.rating}
              onChange={change.bind(null, 'rating')}
              precision={0.5}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>
    );
  }
  const submitFeedback = () => {};
  return (
    <>
      <Grid item md={12}>
        <Box className={classes.headBox} autoPageSize>
          <Grid container direction="column" spacing={3}>
            <Grid item container direction="row" md={12} spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <KenInputField
                  required
                  rows={1}
                  label="Batch"
                  name="batch"
                  value={values.batch}
                  onChange={change.bind(null, 'batch')}
                  errors={errors?.batch}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.batch}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KenInputField
                  required
                  rows={1}
                  label="Term"
                  name="term"
                  value={values.term}
                  onChange={change.bind(null, 'term')}
                  errors={errors?.term}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.term}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KenInputField
                  required
                  rows={1}
                  label="Subject Code and Title"
                  name="subCode"
                  value={values.subCode}
                  onChange={change.bind(null, 'subCode')}
                  errors={errors?.subCode}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.subCode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <KenInputField
                  required
                  rows={1}
                  label="Specialization/Section"
                  name="specialisation"
                  value={values.specialisation}
                  onChange={change.bind(null, 'specialisation')}
                  errors={errors?.specialisation}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.specialisation}
                />
              </Grid>
              {/* <Grid item xs={12} sm={6} md={4}>
                <KenInputField
                  required
                  rows={1}
                  label="Term 1"
                  name="term"
                  value={values.term}
                  onChange={change.bind(null, 'term')}
                  errors={errors?.term}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.term}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={4}>
                <KenInputField
                  required
                  rows={1}
                  label="Name of Faculty"
                  name="facultyName"
                  value={values.facultyName}
                  onChange={change.bind(null, 'facultyName')}
                  errors={errors?.facultyName}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.facultyName}
                />
              </Grid>
              <Grid item md={12}>
                <Typography className={classes.feedHead}>
                  Point Scale:
                </Typography>
                <Grid container direction="column" spacing={3}>
                  <Grid item container direction="row" md={12} spacing={3}>
                    {feedbackData &&
                      feedbackData?.Instructions.map(feed => (
                        <Grid item xs={12} sm={6} md={2}>
                          <div className="point-scale">
                            <Typography className={`${feed.class}`}>
                              {feed.title}
                            </Typography>
                            <Rating
                              name="rating"
                              defaultValue={feed.rating}
                              className={`${feed.class}`}
                              precision={0.5}
                              disabled={true}
                              size="small"
                            />
                          </div>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={12}>
                <Typography className={classes.feedHead}>Subject:</Typography>
                {feedbackData &&
                  feedbackData?.Subject.map(feed => (
                    <FeedbackItem data={feed} />
                  ))}
              </Grid>
              <Grid item md={12}>
                <Typography className={classes.feedHead}>Faculty:</Typography>
                {feedbackData &&
                  feedbackData?.Faculty.map(feed => (
                    <FeedbackItem data={feed} />
                  ))}
              </Grid>
              <Grid item md={12} style={{ width: '100%' }}>
                <div style={{ float: 'right' }}>
                  <KenButton
                    variant="primary"
                    className={[classes.headerBtn, classes.btnLabels].join(' ')}
                    onClick={() => submitFeedback()}
                    label={t(`labels: Submit Feedback`)}
                    style={{ marginRight: 20 }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};
const FormikHoc = props => {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const profile = getUserDetails().ContactId;
  const [formData, setFormData] = React.useState({});
  const FeedbackFormSchema = Yup.object().shape({});
  const FormikForm = withFormik({
    mapPropsToValues: () => ({
      formData: formData,
      setFormData: setFormData,
    }),
    validationSchema: FeedbackFormSchema,
    handleSubmit: values => {},
    setFormData: setFormData,
    formData: formData,
  })(FeedbackFormDetails);
  return <FormikForm {...props} />;
};
