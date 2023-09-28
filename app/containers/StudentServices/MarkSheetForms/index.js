import React, { useState , useEffect} from 'react';
import { Box, useTheme, Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import { useTranslation } from 'react-i18next';
import history from '../../../utils/history';
import Routes from '../../../utils/routes.json' 
import context from '../../../utils/helpers/context';
import { getMarksRequest, postMarksRequest } from '../../../utils/ApiService';
// import { KEY_USER } from '../../../../utils/constants';
import {
    postDashboardCases
  } from '../../../utils/ApiService';
import MarkSheetForms from './MarkSheetForm/index';
import KenLoader from '../../../components/KenLoader';

export default function BookFormCases(props) {
    return (
        <div>
            <FormikHoc {...props} />
        </div>
    );
}
const MarkSheetFormsDetails = props => {
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
        selectedCase
    } = props;

    const { handleSnackbarOpen } = React.useContext(context);
    const [loading, setLoading] = React.useState(false);

     const handleCancel = () => {
    history.push('/raiseRequest');
    window.location.reload();
};
    console.log("test", props)
    return (
      
        <Box mt={2}>
          { loading && <KenLoader /> }
            <MarkSheetForms  {...props} handleSubmit={handleSubmit} cancelItem={handleCancel} />
        </Box>
    );
};
const FormikHoc = props => {

    const [loading, setLoading] = React.useState(false);
    const { t } = useTranslation();
    const profile = getUserDetails().ContactId;
    const [formData, setFormData] = React.useState({});
    const [userDetails, setuserDetails]=React.useState([]);
    const [markSheetData, setMarkSheetData] = useState([]);

    useEffect(() => {
        const user = getUserDetails();
        getMarksRequest(user?.ContactId).then(res => {
            setMarkSheetData(res[0])
          console.log('res',res)
        });
      }, []);

    useEffect(() => {
        setLoading(true);
        const user = getUserDetails();
        console.log("user",user);
        setuserDetails(user);
    },[]);

    const MarkSheetCasesSchema = Yup.object({
        FirstName: Yup.string().required(t('Validations:Required')),
        Phone:Yup.string().required(t('Validations:Required')),
        Email: Yup.string().required(t('Validations:Required')),
        Term: Yup.string().required(t('Validations:Required')),
        Address:Yup.string().required(t('Validations:Required')),
        City:Yup.string().required(t('Validations:Required')),
    });
    const FormikForm = withFormik({
        mapPropsToValues: () => ({
          FirstName: userDetails.Name,
          Phone: userDetails.Phone,
          Email: userDetails.mail,
          Term: markSheetData?.Term__c ? markSheetData.Term__c: '',
          Address: markSheetData?.Address__c ? markSheetData.Address__c :'',
          City:markSheetData?.City__c? markSheetData.City__c:'',
          ContactId: userDetails.ContactId,
          formData: formData,
          setFormData: setFormData,
        }),
        validationSchema: MarkSheetCasesSchema,
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
            Type: 'Mark Sheet Request',
            RecordTypeId: '0121s000000CziNAAS',
            Priority: 'Medium',
          };
          postMarksRequest(payload)
            .then(res => {
              setLoading(true);
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
    })(MarkSheetFormsDetails);
    return <FormikForm {...props} />;
};