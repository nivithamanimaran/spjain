import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import KenInputField from '../../../../../../components/KenInputField/index';
import KenButton from '../../../../../../global_components/KenButton';
const useStyles = makeStyles(theme => ({
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
    width: '100%',
    float: 'left',
    marginRight: '20px',
    display: 'flex',
    justifyContent: 'space-between',
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
export default function CaseDetailForm(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [selectOptions] = useState(['All']);
  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldTouched,
    setFieldValue,
    handleSubmit,
    cancelItem,
    data,
  } = props;
  console.log('values', values);
  const change = (name, e, index) => {
    e.persist();
    handleChange(e);
    setFieldValue(name, e.target.value);
    setFieldTouched(name, true, false);
    // if (name === 'shuffleInChoices' && e.target.checked === true) {
    //     values.shuffleInChoices = true
    //     setFieldValue(name, true);
    // }
  };
  const reopenCase = () => {};
  return (
    <Box data-testid="question-detail">
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={classes.addedQuestionHeader}
      >
        <Grid sm={12} x={12}>
          <div style={{ float: 'right' }}>
            <KenButton
              variant="primary"
              onClick={reopenCase}
              label={t('labels:Reopen Case')}
            />
          </div>
          <form onSubmit={values.handleChange} className={classes.form}>
            <Box md={2} className={classes.selectOptionBar}>
              <div style={{ marginRight: 10, width: '100%' }}>
                <KenInputField
                  required
                  rows={1}
                  label="Service Type"
                  name="ServiceType"
                  value={values.ServiceType}
                  onChange={change.bind(null, 'ServiceType')}
                  errors={errors?.ServiceType}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.ServiceType}
                />
              </div>
              <div style={{ marginRight: 0, width: '100%' }}>
                <KenInputField
                  required
                  rows={1}
                  label="Status"
                  name="Status"
                  value={values.Status}
                  onChange={change.bind(null, 'Status')}
                  errors={errors?.Status}
                  setFieldTouched={setFieldTouched}
                  touched={touched?.Status}
                />
              </div>
            </Box>
            <Box className={classes.classDisplayOne}>
              <KenInputField
                required
                rows={1}
                label="Subject"
                name="Subject"
                value={values.Subject}
                onChange={change.bind(null, 'Subject')}
                errors={errors?.Subject}
                setFieldTouched={setFieldTouched}
                touched={touched?.Subject}
              />
            </Box>
            <KenInputField
              multiline
              required
              rows={3}
              label="Description"
              placeholder="Type your description here..."
              name="Description"
              value={values.Description}
              onChange={change.bind(null, 'Description')}
              errors={errors?.Description}
              setFieldTouched={setFieldTouched}
              touched={touched?.Description}
            />
            <KenInputField
              multiline
              required
              rows={4}
              label="Feedback"
              placeholder="Type your Feedback here..."
              name="Feedback"
              value={values.Feedback}
              onChange={change.bind(null, 'Feedback')}
              errors={errors?.Feedback}
              setFieldTouched={setFieldTouched}
              touched={touched?.Feedback}
            />
            <Box className={classes.SubmitHead} />
            <Box className={classes.SubmitBtn}>
              <KenButton
                variant="secondary"
                onClick={cancelItem}
                label={t('labels:Cancel')}
              />{' '}
              &nbsp;
              <KenButton
                variant="primary"
                onClick={handleSubmit}
                label={t('labels:Submit')}
              />
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}
