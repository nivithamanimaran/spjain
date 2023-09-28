import React, { useState, useEffect } from 'react';
import { Box, useTheme, Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import { useTranslation } from 'react-i18next';
import context from '../../../utils/helpers/context';
import history from '../../../utils/history';
import { getBookRequest, postBookRequest } from '../../../utils/ApiService';
import { useAppContext } from '../../../utils/contextProvider/AppContext';
import Routes from '../../../utils/routes.json';
// import { KEY_USER } from '../../../../utils/constants';
import { postDashboardCases } from '../../../utils/ApiService';
import BookForms from './BookForm/index';

export default function BookFormCases(props) {
  return (
    <div>
      <FormikHoc {...props} />
    </div>
  );
}
const BookFormsDetails = props => {
  const theme = useTheme();

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
    selectedCase,
  } = props;
  console.log('values', values);

  const { handleSnackbarOpen } = React.useContext(context);

  /* const handleSubmit = () => {
        let payload = {
          ContactId: '0035j00000J6Nf1AAF',
          SuppliedPhone: '9043824743',
          SuppliedEmail: 'abdul.hameed@alliance.edu.in',
          Status: 'New',
          Term__c: 'Term 1',
          Address__c: 'No. 14, 2nd Cross',
          City__c: 'Mumbai',
          Origin: 'Student Portal',
          Type: 'Book Request',
          RecordTypeId: '0125j000000ZuCgAAK',
          Priority: 'Medium',
        };
        postBookRequest(payload).then(res => {
          console.log(res);
        });
      }; */
  const handleCancel = () => {
    history.push('/raiseRequest');
    window.location.reload();
  };
  console.log('test', props);
  return (
    <Box mt={2}>
      <BookForms
        {...props}
        handleSubmit={handleSubmit}
        cancelItem={handleCancel}
      />
    </Box>
  );
};
const FormikHoc = props => {
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const profile = getUserDetails().ContactId;
  const [formData, setFormData] = React.useState({});
  const [userDetails, setuserDetails] = React.useState([]);
  const [bookData, setBookData] = useState([]);
  const { state } = useAppContext();

  useEffect(() => {
    const user = getUserDetails();
    getBookRequest(user?.ContactId).then(res => {
      setBookData(res[0]);
      console.log('res', res);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const user = getUserDetails();
    // console.log("user",user);
    setuserDetails(user);
  }, []);

  const BookFormCasesSchema = Yup.object({
    FirstName: Yup.string().required(t('Validations:Required')),
    Phone: Yup.string().required(t('Validations:Required')),
    Email: Yup.string().required(t('Validations:Required')),
    Term: Yup.string().required(t('Validations:Required')),
    Address: Yup.string().required(t('Validations:Required')),
    City: Yup.string().required(t('Validations:Required')),
  });
  const FormikForm = withFormik({
    mapPropsToValues: () => ({
      FirstName: userDetails.Name,
      Phone: userDetails.Phone,
      Email: userDetails.mail,
      Term: bookData?.Term__c ? bookData.Term__c: '',
      Address: bookData?.Address__c ? bookData.Address__c :'',
      City:bookData?.City__c? bookData.City__c:'',
      ContactId: userDetails.ContactId,
      formData: formData,
      setFormData: setFormData,
    }),
    validationSchema: BookFormCasesSchema,
    handleSubmit: values => {
      setLoading(true);
      let payload = {
        Service_Type: props.selectedCase,
        ContactId: userDetails.ContactId,
        // FirstName: values.FirstName,
        SuppliedPhone: values.Phone,
        SuppliedEmail: values.Email,
        Status: 'New',
        Term__c: values.Term,
        Address__c: values.Address,
        City__c: values.City,
        Origin: 'Student Portal',
        Type: 'Book Request',
        RecordTypeId: '0121s000000CzUXAA0',
        Priority: 'Medium',
      };
      postBookRequest(payload)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });

      setLoading(false);
    },
    setFormData: setFormData,
    formData: formData,
  })(BookFormsDetails);
  return <FormikForm {...props} />;
};
