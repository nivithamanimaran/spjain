import React, { useState } from 'react';
import { Box, useTheme, Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { getUserDetails } from '../../../../../utils/helpers/storageHelper';
import { useTranslation } from 'react-i18next';
import context from '../../../../../utils/helpers/context';
// import { KEY_USER } from '../../../../utils/constants';
import CaseDetailForm from './CaseDetailForm/index';

export default function CaseDetails(props) {
    return (
        <div>
            <FormikHoc {...props} />
        </div>
    );
}
const CaseDetailsMain = props => {
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
        data
    } = props;

    const { handleSnackbarOpen } = React.useContext(context);

    const handleCancel = () => {
        history.push(`/${Routes.home}`);
    };
    console.log("test", props)
    return (
        <Box mt={2}>
            <CaseDetailForm  {...props} handleSubmit={handleSubmit} cancelItem={cancelItem} />
        </Box>
    );
};
const FormikHoc = props => {

    const [loading, setLoading] = React.useState(false);
    const { t } = useTranslation();
    const profile = getUserDetails().ContactId;
    const [formData, setFormData] = React.useState({});

    const DashboardCasesSchema = Yup.object().shape({
        SubType: Yup.string().required(t('Validations:Required')),
        Subject: Yup.string().required(t('Validations:Required')),
        Description: Yup.string().required(t('Validations:Required')),
    });
    const FormikForm = withFormik({
        mapPropsToValues: () => ({
            SubType: "",
            ServiceType: props?.data?.hed__Category__c,
            Subject: props?.data?.Subject,
            Description: props?.data?.Description,
            Feedback: props?.data?.Feedback,
            Status: props?.data?.Status,
            formData: formData,
            setFormData: setFormData,
        }),
        validationSchema: DashboardCasesSchema,
        handleSubmit: values => {
            setLoading(true);
            let payload = {
                "subType": values.SubType,
                "subject": values.Subject,
                "description": values.Description,
                "serviceType": values.serviceType
            }
            setLoading(false);
        },
        setFormData: setFormData,
        formData: formData,
    })(CaseDetailsMain);
    return <FormikForm {...props} />;
};