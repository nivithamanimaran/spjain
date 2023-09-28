import React, { useState } from 'react';
import { Box, useTheme, Grid, makeStyles, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import { useTranslation } from 'react-i18next';
import context from '../../../utils/helpers/context';
import {} from '../../../utils/ApiService';
import KenInputField from '../../../components/KenInputField';
import KenGrid from '../../../global_components/KenGrid';
import KenCard from '../../../global_components/KenCard';
import KenButton from '../../../global_components/KenButton';
const useStyles = makeStyles(theme => ({
  cartHeader: {
    backgroundColor: theme.palette.KenColors.kenWhite,
    height: 50,
    justifyContent: 'space-between',
    display: 'flex',
    paddingRight: 10,
  },
  cartBody: {
    backgroundColor: theme.palette.KenColors.kenWhite,
    padding: '21px 20px 50px',
    position: 'relative',
  },
  cardTitle: {
    lineHeight: '50px',
    color: '#00218D',
    fontSize: '18px',
  },
  tableComponent: {
    marginBottom: 10,
    width: '100%',
  },
}));
export default function FacultyFeedback(props) {
  return (
    <div>
      <FormikHoc {...props} />
    </div>
  );
}
const FacultyFeedbackDetails = props => {
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
  const [data, setData] = useState([]);
  const columns = [
    {
      Header: 'Particulars',
      accessor: 'Particulars',
      disableGlobalFilter: true,
    },
    {
      Header: 'Fee Amount (₹)',
      accessor: 'Fee_Amount',
      disableGlobalFilter: true,
    },
    {
      Header: 'Total Amount (₹)',
      accessor: 'Total_Amount',
      disableGlobalFilter: true,
    },
  ];
  const onPreview = props => {
    console.log('Data Preview', props);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box pl={1} className={classes.cartHeader}>
            <Typography className={classes.cardTitle}>
              {t('headings:Feedback')}{' '}
            </Typography>
          </Box>
        </Grid>
        <div className={classes.tableComponent}>
          <KenCard paperStyles={{ padding: 16 }}>
            <KenGrid
              columns={columns}
              data={data}
              pagination={{ disabled: true }}
              tableTotal={{ disabled: true, checkbox: true }}
              gridProps={{
                getRowProps: row => ({
                  onClick: () => onPreview(row.values),
                }),
              }}
              toolbarDisabled={true}
            />
          </KenCard>
        </div>
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
  })(FacultyFeedbackDetails);
  return <FormikForm {...props} />;
};
