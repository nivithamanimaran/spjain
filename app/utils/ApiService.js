import axios from 'axios';
import moment from 'moment';
import UrlEndPoints from './urlEndPoints.json';
import {
  KEY_ACCESS_TOKEN,
  KEY_CONFIG_URL,
  KEY_DATE_FORMAT,
  KEY_LOGIN_ACCESS_TOKEN,
  TOKEN_URL_REPORT_CARD,
  KEY_REFRESH_TOKEN,
  REFRESH_URL,
  KEY_COURSE,
} from './constants';
import AlertDialog from '../components/KenDialogBox';
import history from './history';
// import LogoutPopup from './LogoutPopup';
import { logOut } from './helpers/storageHelper';
import { id } from 'date-fns/locale';

let appConfig;
export let axiosInstance;
const configUrl = KEY_CONFIG_URL;
let paymentInstance;
let integrationInstance;

const getInsConfig = config => {
  return config;
};

export const getSessionData = async (contactId, courseOfferingId) => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/SessionData/?facultyId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getContactAdditionalInfoData = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/ContactAdditionalInfoData/${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getContactAdditionalInfoDataExtra = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/ContactAdditionalInfoData/?contactId=${contactId}&Categorey=Activity`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getRequestComplaintsdata = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;

  const query = encodeURIComponent(
    `/services/apexrest/RequestComplaintsdata/?ContactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  console.log('23423242', res?.data);
  return res && res.data ? res.data : null;
};

export const getStudentSessionData = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/SessionData/?contactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};
export const deleteSubComponent = async data => {
  const path = `${appConfig.integrationUrl}/sf/exam/delete/subcomponent`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const postCourseComponent = async data => {
  const path = `${appConfig.integrationUrl}/sf/exam/admin/cousesubcomponet`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};
export const postFacultysubmit = async data => {
  const path = `${appConfig.integrationUrl}/sf/exam/faculty/courseOffer/update`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const bbCourse = async id => {
  const path = `${
    appConfig.integrationUrl
  }/sf/exam/create/course/evaluation/component`;
  const res = await axiosInstance.post(`${path}`, id);
  return res && res.data ? res.data : null;
};

export const getCourseComponent = async courseOfferingId => {
  const path = `${
    appConfig.integrationUrl
  }/sf/exam/coursecomponent/${courseOfferingId}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};
export const getSection = async contactid => {
  const path = `${
    appConfig.integrationUrl
  }/sf/exam/faculty/section/${contactid}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const getCourseConnectionByContactId = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/courseconnectionByContactId/?contactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getAllCourseConnectionByContactId = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/allCourseconnectionByContactId/?contactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getAllEventsData = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/eventsData/?contactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getAxiosInstance = async data => {
  appConfig = data[0]?.config;
  if (axiosInstance) {
    return axiosInstance;
  }
  axiosInstance = axios.create({
    baseURL: `${appConfig.apiBaseUrl}`,
    timeout: 15000,
  });

  axiosInstance.interceptors.request.use(req => {
    const token = localStorage.getItem(KEY_ACCESS_TOKEN);
    req.headers['access-token'] = localStorage.getItem(KEY_LOGIN_ACCESS_TOKEN);
    req.headers.Authorization = `Bearer ${token}`;
    return req;
  });

  //Response interceptor for API calls
  axiosInstance.interceptors.response.use(
    resp => {
      return resp;
    },
    async function(error) {
      if (localStorage.refresh_token) {
        const url = REFRESH_URL;
        let access_token = localStorage.getItem('access_token');
        const instance = await getIntegrationInstance();
        try {
          const res = await instance.post(
            url,
            {
              refreshToken: localStorage.refresh_token,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            }
          );
          localStorage.setItem(
            KEY_LOGIN_ACCESS_TOKEN,
            res?.data?.accessToken?.token
          );
          localStorage.setItem(
            KEY_REFRESH_TOKEN,
            res?.data?.refreshToken?.token
          );
        } catch (err) {
          logOut(history);
          window.location.reload();
          //history.push('/');
          // <AlertDialog
          //   title="SESSION EXPIRED"
          //   children="Session Expired Please Login Again"
          //   open="true"
          //   handleClose={() => history.push('/')}
          //   dialogActionFlag="true"
          //   positiveButtonText="LOGIN"
          // />;
        }
      }
      console.log('ApiService: Interceptor: ', error);
      if (!error.response?.config && error.response?.status !== 401) {
        return error;
      }
      var config = {
        method: 'get',
        // baseURL: `${appConfig.apiBaseUrl}/token?grant_type=client_credentials`,
        // headers: {
        //   Authorization: `Basic ${appConfig.tokenHeader}`,
        // },
        baseURL: `${appConfig.tokenUrl}`,
      };
      return axios(config).then(function(response) {
        localStorage.setItem(KEY_ACCESS_TOKEN, response.data.access_token);
        error.response.config.headers['Authorization'] = `Bearer ${
          response.data.access_token
        }`;
        return axios(error.response.config);
      });
    }
  );
};
export const getSubcomponentScoresBySubComponentId = async SubComponentId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/SubcomponentScores/?subcomponentId=${SubComponentId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};
export const postValidateSession = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/validateSession`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};
export const postFaq = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/FAQ/`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};
export const postCreateCase = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/getCase/`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};
export const validateSubcomponentScores = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `services/apexrest/validateSubcomponentScores`
  );
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};

export const getIntegrationInstance = async () => {
  if (integrationInstance) {
    return integrationInstance;
  }
  integrationInstance = axios.create({
    baseURL: `${appConfig.bbbmiddleware}`,
    timeout: 15000,
  });

  integrationInstance.interceptors.request.use(req => {
    const token = localStorage.getItem(KEY_ACCESS_TOKEN);
    req.headers.Authorization = `Bearer ${token}`;
    req.headers['access-token'] = localStorage.getItem(KEY_LOGIN_ACCESS_TOKEN);
    return req;
  });

  //Response interceptor for API calls
  integrationInstance.interceptors.response.use(
    resp => {
      return resp;
    },
    async function(error) {
      var config = {
        method: 'get',
        baseURL: `${appConfig.tokenUrl}`,
      };
      return axios(config).then(function(response) {
        localStorage.setItem(KEY_ACCESS_TOKEN, response?.data?.access_token);
        error.response.config.headers['Authorization'] = `Bearer ${
          response?.data?.access_token
        }`;
        return axios(error.response.config);
      });
    }
  );
  return integrationInstance;
};

export const createQuiz = async data => {
  const res = await axios.post(
    `${appConfig.lmsURL}/${UrlEndPoints.createQuiz}`,
    data,
    {
      headers: {
        Authorization: `${appConfig.lmsToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return res && res.data ? res.data : null;
};

export const getPaymentInstance = async data => {
  appConfig = await getInsConfig(data[0].config);
  paymentInstance = await axios.create({
    baseURL: `${appConfig.paymentBaseUrl}`,
    timeout: 15000,
  });
};

// Request interceptor for API calls

const ApiService = (method, url, config = null) => {
  switch (method) {
    case 'get':
      return axiosInstance.get(url);

    case 'post':
      return axiosInstance.post(url, config.body || {});

    case 'put':
      return axiosInstance.post(url, config.body ? config.body : null);

    case 'delete':
      return axiosInstance.delete(url);

    default:
      console.log('axios default: ', method, url, config);
      break;
  }
};

export const PaymentApiService = (method, url, config = null) => {
  switch (method) {
    case 'get':
      return paymentInstance.get(url);

    case 'post':
      return paymentInstance.post(url, config.body || {});

    case 'put':
      return paymentInstance.post(url, config.body ? config.body : null);

    case 'delete':
      return paymentInstance.delete(url);

    default:
      console.log('axios default: ', method, url, config);

      break;
  }
};

export const getWhoAmI = async contactId => {
  const res = await axiosInstance.get(
    `/${UrlEndPoints.WhoAmI}?emailId=${contactId}`
  );
  return res && res.data ? res.data : null;
};

export const authenticate = async email => {
  const res = await axiosInstance.get(
    `/${UrlEndPoints.authenticate}?UniqueId=${email}`
  );
  return res && res.data ? res.data : null;
};

export const getStudentDetails = async contactId => {
  const res = await axiosInstance.get(`/${UrlEndPoints.contact}/${contactId}`);
  return res && res.data ? res.data : null;
};

export const getStudentInfo = async contactId => {
  const res = await axiosInstance.get(
    `${
      appConfig.integrationUrl
    }/salesforce?endpoint=services/apexrest/ContactDetail/${contactId}`
  );
  // https://api-v2.ken42.com/sp-jain/stage/pfs/salesforce?endpoint=services/apexrest/ContactDetail/0031y00000KwGxrAAF
  // https://api-v2.ken42.com/sp-jain/stage/pfs/salesforce?endpoint=services/apexrest/ContactDetail/0031y00000KwGxrAAF
  return res && res.data ? res.data : null;
};
export const getProfileImageData = async courseOfferingId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `services/apexrest/ContactAttachment/?recordId=${courseOfferingId}&fileName=passportPhoto`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};
export const saveStudentEducationInfo = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/EducationHistoryApi`);
  const res = await axiosInstance.post(`${path}${query}`, { records: data });
  return res && res.data ? res.data : null;
};

export const saveStudentProfileImage = async (data, contactId) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };
  const path = `${appConfig.integrationUrl}`;
  const query = `/report/signature?programEnrollmentId=${contactId}&fileName=passportPhoto`;

  const res = await axiosInstance.post(`${path}${query}`, data, headers);
  return res && res.data ? res.data : null;
};

export const saveStudentAddressInfo = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/Address`);
  const newData = data.map(ele => {
    return ele.add;
  });
  const res = await axiosInstance.post(`${path}${query}`, { records: newData });
  return res && res.data ? res.data : null;
};

export const saveStudentRelationInfo = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/Relationship`);

  const newData = data.map(ele => {
    return ele.res;
  });
  const res = await axiosInstance.post(`${path}${query}`, { records: newData });
  return res && res.data ? res.data : null;
};
export const getGradingDetails = async gradingId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/SubjectScores?courseOfferingId=${gradingId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};
export const saveStudentProfileInfo = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/ContactDetail`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};

export const getFacultyDetails = async academicProgramId => {
  const res = await axiosInstance.get(
    `${UrlEndPoints.faculty}/${academicProgramId}`
  );
  return res && res.data ? res.data : null;
};

export const getAllCourses = async (contactId, programId) => {
  const res = await axiosInstance.get(
    `${UrlEndPoints.getallcourse}/${contactId}/${programId}`
  );
  return res && res.data ? res.data : null;
};

export const getSchedule = async contactId => {
  const res = await axiosInstance.get(
    `/${UrlEndPoints.whyiamhere}/${contactId}`
  );

  return res && res.data ? res.data : null;
};

export const getEvents = async ContactID => {
  const res = await axiosInstance.get(`/${UrlEndPoints.event}/${ContactID}`);
  return res && res.data ? res.data : null;
};

export const getStudents = async courseOfferingId => {
  const path = `/${UrlEndPoints.getstudent}/${courseOfferingId.trim()}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const getStudentsBySection = async (programPlanId, section) => {
  const path = `/${
    UrlEndPoints.studentBySection
  }/${programPlanId.trim()}/${section}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const postAttendance = async data => {
  const res = await axiosInstance.post(
    `/${UrlEndPoints.submit_attendance}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const getAbsentParentDetails = async data => {
  const res = await axiosInstance.post(
    `/${UrlEndPoints.absent_parent_details}`,
    data
  );
  return res && res.data ? res.data : null;
};
export const sendSms = async data => {
  const res = await axios.get(`${appConfig.smsbaseURL}send_to=${data}`);
  return res && res.data ? res.data : null;
};
// get courses for faculty
export const getCourses = async facultyID => {
  const path = `/${UrlEndPoints.getcourse}/${facultyID?.trim()}`;
  const res = await axiosInstance?.get(path);
  return res && res.data ? res.data : null;
};

// get grade details
export const getGradeDetails = async () => {
  const path = `/${UrlEndPoints.gradeType}`;
  const res = await axiosInstance?.get(path);
  return res && res.data ? res.data : null;
};

// get exam details
export const getExamDetails = async () => {
  const path = `/${UrlEndPoints.examType}`;
  const res = await axiosInstance?.get(path);
  return res && res.data ? res.data : null;
};

// scholastic grade distribution

export const getScholasticGrade = async () => {
  const path = `/${UrlEndPoints.scholasticGradeDistribution}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const getCoScholasticGrade = async () => {
  const path = `/${UrlEndPoints.coScholasticGradeDistribution}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const getMarketplaceURL = async params => {
  const path = `/${UrlEndPoints.marketplace}`;
  const res = await integrationInstance.get(`${path}?${params}`);
  return res && res.data ? res.data : null;
};

//Get payment schedule
// export const getPaymentSchedule = async (contactId, orgID) => {
//   const path = `/${
//     UrlEndPoints.pendingFees
//   }/${contactId.trim()}?orgId=${orgID.trim()}`;
//   const res = await paymentInstance.get(path);
//   return res && res.data ? res.data : null;
// };

//Get payment history
export const getPaymentHistory = async (contactId, orgID) => {
  const path = `/${
    UrlEndPoints.paymentHistory
  }/${contactId.trim()}?orgId=${orgID.trim()}`;
  const res = await paymentInstance.get(path);
  return res && res.data ? res.data : null;
};

export const payNow = async data => {
  const path = `/${UrlEndPoints.paynow}?orgId=${appConfig.orgID}`;
  const res = await paymentInstance.post(path, data);
  return res && res.data ? res.data : null;
};

export const addPay = async data => {
  const path = `/${UrlEndPoints.addPayment}`;
  const res = await paymentInstance.post(path, data);
  return res && res.data ? res.data : null;
};

export const feesInfo = async (contactID, orgID) => {
  const path = `/${
    UrlEndPoints.feesinfo
  }/${contactID.trim()}?orgId=${orgID.trim()}`;
  const res = await paymentInstance.get(path);
  return res && res.data ? res.data : null;
};

export const getParentDetails = async phoneNo => {
  const path = `/${UrlEndPoints.parent}/${phoneNo.trim()}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const facultyActivities = async (
  contactID,
  connectionID,
  startDate,
  endDate
) => {
  startDate =
    startDate ||
    moment()
      .subtract(6, 'month')
      .format(KEY_DATE_FORMAT)
      .toLowerCase();
  endDate =
    endDate ||
    moment()
      .add(6, 'months')
      .format(KEY_DATE_FORMAT)
      .toLowerCase();
  const data = {
    useridnumber: contactID,
    connectionid: connectionID,
    modtype: '',
    startdate: startDate,
    enddate: endDate,
  };
  const res = await axios.post(
    `${appConfig.lmsURL}/${UrlEndPoints.activities}`,
    data,
    {
      headers: {
        Authorization: `${appConfig.lmsToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return res && res.data ? res.data : null;
};

export const StudentActivities = async (
  contactID,
  connectionID,
  startDate,
  endDate
) => {
  startDate =
    startDate ||
    moment()
      .subtract(6, 'month')
      .format(KEY_DATE_FORMAT)
      .toLowerCase();
  endDate =
    endDate ||
    moment()
      .add(6, 'months')
      .format(KEY_DATE_FORMAT)
      .toLowerCase();
  const data = {
    useridnumber: contactID,
    connectionid: connectionID,
    modtype: '',
    startdate: startDate,
    enddate: endDate,
  };
  const res = await axios.post(
    `${appConfig.lmsURL}/${UrlEndPoints.studentactivities}`,
    data,
    {
      headers: {
        Authorization: `${appConfig.lmsToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return res && res.data ? res.data : null;
};

export const getConfig = async () => {
  // const path = `${window.location.host}`;
  const path = 'sp-jain-stg-portal.ken42.com';
  const res = await axios.get(`${configUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const putAccountDetails = async (studentId, data) => {
  const path = `${UrlEndPoints.accountDetails}`;
  const res = await axios.put(
    `${appConfig.paymentBaseUrl}/${path}/${studentId}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const getAccountDetails = async studentId => {
  const path = `${UrlEndPoints.accountDetails}`;
  const res = await axios.get(
    `${appConfig.paymentBaseUrl}/${path}/${studentId}?orgId=${appConfig.orgID}`
  );
  return res && res.data ? res.data : null;
};

export const getOtp = async params => {
  const path = `otp`;
  const res = await axiosInstance.get(`${appConfig.smsURL}/${path}?${params}`);
  return res && res.data ? res.data : null;
};

export const subscribe = async data => {
  const path = `notification/subscribeWeb`;
  const res = await axiosInstance.post(
    `${appConfig.firebaseBaseURL}/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const unsubscribe = async data => {
  const path = `notification/unsubscribeWeb`;
  const res = await axiosInstance.post(
    `${appConfig.firebaseBaseURL}/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const getValidateOtp = async params => {
  const path = `/validateotp`;
  const res = await axiosInstance.get(`${appConfig.smsURL}/${path}?${params}`);
  return res && res.data ? res.data : null;
};

// TODO: remove hardcode
export const sendMail = async data => {
  const path = `email`;
  const res = await axiosInstance.post(
    `https://api.ken42.com/vks/pfs/v1/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const getAllEvents = async params => {
  const path = `admin/events`;
  const res = await axiosInstance.get(
    `${appConfig.integrationUrl}/${path}?recordId=${params}`
  );
  return res && res.data ? res.data : null;
};
export const requestForOTP = async payload => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/PFSOtp/send?contact=${payload}`
  )}`;
  const res = await axiosInstance.post(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const verifyOTP = async payload => {
  const path = `salesforce?endpoint=/services/apexrest/PFSOtp/verify&contact=${
    payload.id
  }&otpentered=${payload.otp}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  var cour = res.data.userCourse;
  localStorage.setItem(KEY_COURSE, JSON.stringify(cour));

  return res && res.data ? res.data : null;
};

export const getGradingDetailsByStudentId = async StudentId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/SubjectScores?studentId=${StudentId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};
export const GetStudentDetailTermWiseByStudentId = async (
  StudentId,
  TermName
) => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/GetStudentDetailTermWise?studentId=${StudentId}&term=${TermName}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getTermDetails = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/TermsHistory?contactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const GetComponentData = async (StudentId, courseOfferingId) => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/Componentdata/?StudentId=${StudentId}&courseOfferingId=${courseOfferingId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const GetfetchEnrollmentAffliationByContactId = async StudentId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/fetchEnrollmentAffliationByContactId/?contactId=${StudentId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getAllRegisterEvents = async contactId => {
  const res = await axiosInstance.get(
    `${appConfig.apiBaseUrl}/event/${contactId}`
  );
  return res && res.data ? res.data : null;
};
export const getReportCardDetails = async (
  contactId,
  programEnrollmentId,
  loginContactId
) => {
  const path = `report/details`;
  const res = await axiosInstance.get(
    `${
      appConfig.integrationUrl
    }/${path}?contactId=${contactId}&programEnrollmentId=${programEnrollmentId}&loginContactId=${loginContactId}`
  );
  return res && res.data ? res.data : null;
};

// Query Comments

export const getCommentsById = async id => {
  if (!id) return;
  const path = `/${UrlEndPoints.comments}/${id}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const postComments = async (ContactId, Comment, ParentId) => {
  const path = `/${UrlEndPoints.comments}`;
  const res = await axiosInstance.post(path, { ContactId, Comment, ParentId });
  return res && res.data ? res.data : null;
};
export const postBreakdownMarks = async data => {
  const path = '/submit-additional-grade-pfs';
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const getEventDetails = async (eventId, contactId) => {
  const res = await axiosInstance.get(
    `${appConfig.apiBaseUrl}/eventsubsciber/${eventId}/${contactId}`
  );
  return res && res.data ? res.data : null;
};

export const registersEvent = async payload => {
  const res = await axiosInstance.post(
    `${appConfig.apiBaseUrl}/subscribeevent`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const unRegistersEvent = async eventId => {
  const res = await axiosInstance.delete(
    `${appConfig.apiBaseUrl}/unsubscibeevent/${eventId}`
  );
  return res && res.data ? res.data : null;
};

export const postScholasticMarks = async data => {
  const path = '/submit-main-grade-pfs';
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const getInstituteFeedbackDetails = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/api/InstitueFeedback/${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postInstituteFeedbackDetails = async payload => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    ` /services/apexrest/api/InstituteFeedbackCollection`
  );
  const res = await axiosInstance.post(`${path}${query}`, payload);
  return res && res.data ? res.data : null;
};

export const postScholasticMainMarks = async data => {
  const path = '/submit-grade-pfs';
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const postCoScholasticMarks = async data => {
  const path = '/submit-coscholastic-pfs';
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const getStudentListDetails = async (
  courseOfferingId,
  loginContactId
) => {
  const path = `/report/grades`;
  const res = await axiosInstance.get(
    `${
      appConfig.integrationUrl
    }${path}?courseOfferingId=${courseOfferingId}&loginContactId=${loginContactId}`
  );
  return res && res.data ? res.data : null;
};

export const getSignature = async (programEnrollmentId, fileName) => {
  const path = `/report/signature`;
  const res = await axiosInstance.get(
    `${
      appConfig.integrationUrl
    }${path}?programEnrollmentId=${programEnrollmentId}&fileName=${fileName}`
  );
  return res && res.data ? res.data : null;
};

export const uploadSignature = async (programEnrollmentId, fileName, data) => {
  const path = `/report/signature`;

  const apiUrl = `${
    appConfig.integrationUrl
  }${path}?programEnrollmentId=${programEnrollmentId}&fileName=${fileName}`;

  let formData = new FormData();
  formData.append('signature', data);

  const res = await axiosInstance.post(apiUrl, formData);
  return res && res.data ? res.data : null;
};

export const getConsolidatedMarks = async (classId, sectionName) => {
  const path = `/report/consolidatedReports`;
  const res = await axiosInstance.get(
    `${
      appConfig.integrationUrl
    }${path}?classId=${classId}&sectionName=${sectionName}`
  );
  return res && res.data ? res.data : null;
};

//Timetable---------------------------------------------------------------------------------

//Get all time blocks
export const getAllTimeBlocks = async instituteId => {
  const path = `/alltimeblock`;
  const res = await axiosInstance.get(
    `${appConfig.apiBaseUrl}${path}/${instituteId}`
  );
  return res && res.data ? res.data : null;
};

//get teacher time table
export const getTimetableByContactId = async (date, instituteId, contactId) => {
  let formattedDate;
  if (date instanceof Date) {
    formattedDate = moment(date).format('YYYY-MM-DD');
  }
  const path = `/facultytimetable`;
  const res = await axiosInstance.get(
    `${
      appConfig.apiBaseUrl
    }${path}/${formattedDate}/${instituteId}/${contactId}`
  );
  return res && res.data ? res.data : null;
};

// SalesforceAPIs
export const getSalesforceData = async data => {
  const path = encodeURIComponent(`${data}`);
  const res = await axiosInstance.get(
    `${appConfig.integrationUrl}/salesforce?endpoint=/services/apexrest/${path}`
  );
  return res && res.data ? res.data : null;
};

export const getSalesforceBaseData = async data => {
  const path = encodeURIComponent(`${data}`);
  const res = await axiosInstance.get(
    `${appConfig.integrationUrl}/salesforce?endpoint=${path}`,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    }
  );
  return res && res.data ? res.data : null;
};
// Fee Management Common
export const getStudentDetailsByContact = async data => {
  return getSalesforceData(`StudentDetailAPI/${data}`);
};
// My Cart
export const getFeeInventoryByContact = async data => {
  return getSalesforceData(`FeeScheduleAPI/?contactId=${data}`);
};
export const postFeeInventoryByContact = async (params, data) => {
  const path = encodeURIComponent(`CartDefaultFee/${params}`);
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/salesforce?endpoint=services/apexrest/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};
export const postMannual = async (params, data) => {
  const path = encodeURIComponent(`manualfee/payment/${params}`);
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/salesforce?endpoint=services/apexrest/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const postManualFeeByContact = async (params, data) => {
  const path = encodeURIComponent(`StudentReconciliationAPI/${params}`);
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/salesforce?endpoint=${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

// Fee Schedule
export const getActiveFeeByContact = async data => {
  return getSalesforceData(`activefee?contactId=${data}`);
};

export const getFeeScheduleByContact = async data => {
  return getSalesforceData(`PaymentSchedule/?contactId=${data}`);
};

// Fee Payment
export const getFeePaymentByContact = async data => {
  return getSalesforceData(`FeeLineItem/${data}`);
};

// Offer Letter Fee Api
export const getOfferLetterFeeByContact = async data => {
  return getSalesforceData(`OfferLetterAPI/${data}`);
};

export const postFeePaymentByContact = async data => {
  const path = encodeURIComponent(`payment_links`);
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/payment_links`,
    data
  );
  return res && res.data ? res.data : null;
};

// My Transactions
export const getMyTransactionsByContact = async data => {
  return getSalesforceData(`transactions?contactId=${data}`);
};

export const getMyReceiptsByContact = async data => {
  return getSalesforceBaseData(`services/data/v53.0/sobjects/Attachment`);
};

export const getMyReceiptsByAttachmentID = async data => {
  return getSalesforceBaseData(
    `services/data/v53.0/sobjects/Attachment/${data}/Body`
  );
};
//get timetable (student/parent)
export const getTimetable = async (date, instituteId) => {
  let formattedDate;
  if (date instanceof Date) {
    formattedDate = moment(date).format('YYYY-MM-DD');
  }
  const path = `/gettimetable`;
  const res = await axiosInstance.get(
    `${appConfig.apiBaseUrl}${path}/${formattedDate}/${instituteId}`
  );
  return res && res.data ? res.data : null;
};

export const getAttendancePercentage = async data => {
  const path = encodeURIComponent(`getAttendancePercentage?${data}`);
  const res = await axiosInstance.get(
    `${appConfig.integrationUrl}/${
      UrlEndPoints.attendancePercentage
    }?api=${path}`
  );
  return res && res.data ? res.data : null;
};

export const getStudentListByCourseOffering = async courseId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/studentsByCourseOffering?CourseOfferingId=${courseId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getStudentScoreList = async termId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SubjectScores?termId=${termId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const createSubcomponentScores = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `services/apexrest/createSubcomponentScores`
  );
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};
export const getAttendanceByCourseOffering = async (
  courseId,
  startTime,
  endTime,
  dateval
) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/attendanceByCourseOffering?CourseOfferingId=${courseId}&startTime=${startTime}&endTime=${endTime}&dateval=${dateval}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postAttendanceByCourseOffering = async data => {
  const path = `api=attendanceByCourseOffering`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/sf/createData?${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

//HDFC Payment

export const postFeePaymentUsingHdfc = async data => {
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/hdfc/payments/initiate`,
    data
  );
  return res;
};

//Fly Wire Payment
export const postFeePaymentUsingFlywire = async data => {
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/payments/flywire/initiate`,
    data
  );
  return res && res.data ? res.data : null;
};

export const getCourseEnrollment = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/CoursesByContactActiveEnrol?contactId=${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getCourseOfferingByCourseAndTerm = async payload => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/CourseOfferingByCourseAndTerm?TermId=${
      payload.TermId
    }&CourseId=${payload.CourseId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postCourseEnrolmentByTerm = async payload => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `services/apexrest/createCourseEnrolmentByTerm`
  );
  const res = await axiosInstance.post(`${path}${query}`, payload);
  return res && res.data ? res.data : null;
};
// Completed Enrollment
export const getCompletedEnrollment = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/courseconnectionByContactId?contactId=${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getSubjectAndSubComponent = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/CourseEvaluationComponent?courseOfferingId=${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
// Student Feedback Form
export const getStudentFeedbackDetails = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/api/FacultyFeedback/${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getProgramFeedbackDetails = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/api/ProgramFeedback/${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postStudentFeedbackDetails = async payload => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/api/FacultyFeedback`);
  const res = await axiosInstance.post(`${path}${query}`, payload);
  return res && res.data ? res.data : null;
};
export const postProgramFeedbackDetails = async payload => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`/services/apexrest/api/ProgramFeedback`);
  const res = await axiosInstance.post(`${path}${query}`, payload);
  return res && res.data ? res.data : null;
};

export const postProgramFeedbackCollection = async payload => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/api/ProgramFeedbackCollection/`
  );
  const res = await axiosInstance.post(`${path}${query}`, payload);
  return res && res.data ? res.data : null;
};

export const postInstituteFeedbackCollection = async payload => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/api/InstituteFeedbackCollection`
  );
  const res = await axiosInstance.post(`${path}${query}`, payload);
  return res && res.data ? res.data : null;
};

export const checkPaymentStatus = async data => {
  const res = await axiosInstance.get(
    `${appConfig.integrationUrl}/payments/transaction?transactionId=${data}`
  );
  return res && res.data ? res.data : null;
};

export const getAttendanceClassConducted = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/AttendanceCount/${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getContactAdditionalInfoDataAchievements = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/ContactAdditionalInfoData/?contactId=${contactId}&Categorey=Achievements`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

export const getContactAdditionalInfoDataAchievementsFaculty = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `/services/apexrest/ContactAdditional/?contactId=${contactId}&Categorey=Achievements`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};

//getStudents count
export const getStudentsCount = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/courseConnectionsPerStudents/?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

//get Events Data
export const getEventsData = async eventId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/eventsData${eventId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getEventRegisteredData = async eventId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/EventRegistration${eventId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getEventsFiltersData = async () => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/eventDropdownValues`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const postEventsData = async (data, contactId) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/eventsData/?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

// Cancel registered event
export const cancelRegration = async eventId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/eventpostData/?EvID=${eventId}`
  )}`;
};

// GET BOOK REQUEST
export const getBookRequest = async (ContactId, AppID) => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=GetCase/${ContactId}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};
export const DeleteCase = async recordID => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=getCase/?recordId=${recordID}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const deleteEvent = async (eventId, contactId) => {
  const path = `${
    appConfig.integrationUrl
  }/salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/EventRegistration?eventId=${eventId}&contactId=${contactId}`
  )}`;
  const res = await axiosInstance.delete(path);
  return res && res.data ? res.data : null;
};

//POST BOOK REQUEST
export const postBookRequest = async data => {
  const path = `${appConfig.integrationUrl}/sf/case`;
  const res = await axiosInstance.post(path, data);
  return res && res.data ? res.data : null;
};
export const postDashboardCases = async data => {
  const path = `${
    appConfig.integrationUrl
  }/salesforce?endpoint=services/data/v53.0/sobjects/Case`;
  const res = await axiosInstance.post(path, data);
  return res && res.data ? res.data : null;
};
export const updateDashboardQuery = async (caseID, data) => {
  const path = `${
    appConfig.integrationUrl
  }/salesforce?endpoint=services/data/v53.0/sobjects/Case/${caseID}`;
  const res = await axiosInstance.patch(path, data);
  return res && res.data ? res.data : null;
};
// GET CASE HISTORY
export const getCaseHistory = async (caseID, AppID) => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=GetCaseHistory/${caseID}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};
// GET CASE
export const getCase = async (caseID, open, type) => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=getCase/?StudentId=${caseID}&OpenCLosed=${
    open ? open : ''
  }&Type=${type ? type : ''}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const getCaseByRequestId = async caseID => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=getCase/?RequestId=${caseID}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};

export const getFaqList = async (caseID, topic) => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=FAQ/?StudentId=${caseID}&topic=${topic}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};
// GET CaseBYTypeAndReqID
export const getCaseBYTypeAndReqID = async (type, caseID) => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=/getCase/?Types=${type}&ReqId=${caseID}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};
//POST MARKS REQUEST
export const postMarksRequest = async data => {
  const path = `${appConfig.integrationUrl}/sf/case`;
  const res = await axiosInstance.post(path, data);
  return res && res.data ? res.data : null;
};
// GET MARKS REQUEST
export const getMarksRequest = async (ContactId, AppID) => {
  const path = `${
    appConfig.integrationUrl
  }/sf/getData?api=GetCase/${ContactId}`;
  const res = await axiosInstance.get(path);
  return res && res.data ? res.data : null;
};
//get Additional InfoData
export const getAdditionalInfoData = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ContactAdditionalInfoData/?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getAttendanceInfo = async (
  contactId,
  startDate = '',
  endDate = ''
) => {
  const query = encodeURIComponent(
    `services/apexrest/StudentAttendanceData?contactId=${contactId}&StartDate=${startDate}&EndDate=${endDate}`
  );
  const res = await axiosInstance.get(
    `${appConfig.integrationUrl}/salesforce?endpoint=${query}`
  );
  return res && res.data ? res.data : null;
};

export const getHolidayData = async id => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/campusHolidays/?studentId=${id}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
// Attendance events
export const getAttendanceEvent = async (
  contactId,
  courseOffering = '',
  startDate = '',
  endDate = ''
) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/attendancebyStudent/?contactId=${contactId}&courseOfferingId=${courseOffering}&startDate=${startDate}&endDate=${endDate}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
//get session list with filters
export const getSessionListFilter = async (
  startDate,
  endDate,
  courseOfferingId
) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SessionData/?attendance=true&startDate=${startDate}&endDate=${endDate}&courseOfferingId=${courseOfferingId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
//get session list with filters
export const getattendancePerSession = async sessionId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/attendancePerSession/?sessionId=${sessionId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
//post attendance event
export const postAttendanceEvent = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/createAttendanceEvent`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};
export const postEventRegister = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/EventRegistration`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};

//list of session
export const getSessionList = async courseOfferingId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SessionData/?attendance=false&facultyId=${courseOfferingId} `
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getSessionViaData = async data => {
  // const path = `salesforce?endpoint=/services/apexrest/SessionData/?attendance=false&facultyId=${id}&startDate=${startDate}T5:30:00.000Z&endDate=${endDate}T5:30:00.000Z`
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SessionData/?${data}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getSessionDataViaContactId = async (id, startDate, endDate) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SessionData/?attendance=false&facultyId=${id}&startDate=${startDate}T5:30:00.000Z&endDate=${endDate}T5:30:00.000Z`
  )}`;
  // const path = `salesforce?endpoint=${encodeURIComponent(
  //   `/services/apexrest/SessionData/?${data}`
  // )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
//list of students
export const getStudentList = async CourseOfferingId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/studentsByCourseOffering?CourseOfferingId=${CourseOfferingId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getEventRegister = async eventId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/EventRegistration${eventId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getRetestReval = async studentId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/examsRelatedToStudent/?studentId=${studentId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getFacultyContactAdditional = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/facultyContactAdditional/?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getStudentContactAdditional = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ContactAdditionalInfodetails/?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

// export const postRetestReval = async data => {
//   const path = `salesforce?endpoint=${encodeURIComponent(
//     `services/apexrest/CreateRevaluationData`
//   )}`;
//   const res = await axiosInstance.post(
//     `${appConfig.integrationUrl}/${path}`,
//     data
//   );
//   return res && res.data ? res.data : null;
// };

export const postRetestReval = async data => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(`services/apexrest/CreateRevaluationData`);
  const res = await axiosInstance.post(`${path}${query}`, data);
  return res && res.data ? res.data : null;
};

export const getBookedInterviewSlots = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/faculty/retrieve/facultybookedslots?facultyid=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getInterviewQuestions = async (appId, round) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/faculty/retrieve/questionnaire?applicationid=${appId}&round=${round}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postInterviewScore = async payload => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/faculty/save/interviewscore`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getForeignExchangeRate = async () => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ForeignExchangeRate`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getStudentSessionFeedbackDetails = async contactID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SessionFeedbackSetupData/?studentId=${contactID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getStudentCurrentExam = async StudentID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/StudentCurrentExam/?StudentID=${StudentID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getStudentReExam = async StudentID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/StudentReExam/?StudentId=${StudentID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getRequestReExam = async StudentID => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/RequestStatus/?StudentID=${StudentID}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getCourseList = async () => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/CourseLIST/`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postRequestReExam = async (StudentID, payload) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/RequestStatus/?StudentId=${StudentID}`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

// Faculty Examanitions
export const getExamantionFaculty = async FacultyId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/SubjectDetails/?FacultyId=${FacultyId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getCurrentInviExamantionFaculty = async FacultyId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ExamDeatilsBaesedFaculty/?facultyId=${FacultyId}&RoleType=Invigilator`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getCurrentEvalExamantionFaculty = async FacultyId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ExamDeatilsBaesedFaculty/?facultyId=${FacultyId}&RoleType=Evaluator`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postCurruntInviExamantionFacAccept = async (
  FacultyId,
  payload
) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ExamDeatilsBaesedFaculty/?facultyId=${FacultyId}&RoleType=Invigilator`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const postCurruntEvalExamantionFacAccept = async (
  FacultyId,
  payload
) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ExamDeatilsBaesedFaculty/?facultyId=${FacultyId}&RoleType=Evaluator`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};
//
export const postContactAdditionaAchievements = async (contactID, payload) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ContactAdditional/?contactId=${contactID}&Categorey=Achievements`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};
export const postContactAdditionaAchievementsStudent = async payload => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/createAchievement`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getCurrencyExchange = async () => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ForeignExchangeRate`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getFilterByDateTransactions = async (studentID, payload) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/ActualPayment/${studentID}`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getPFSCourseDocumentList = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/facultyOnboardings/retrieve/pfsCourseDocumentList?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const postSaveCourseDocument = async payload => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/facultyOnboarding/saveCourseDocument`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getPaymentSchedule = async (contactId, orgID) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/${contactId.trim()}?orgId=${orgID.trim()}`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export default ApiService;

// Feedback Screens
export const getFeedBackScheduleData = async (termid, contactid) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/FeedBackScheduleData/?termId=${termid}&contactId=${contactid}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getFeedBackScheduleDividedData = async (scheduleid, contactid) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/FeedBackScheduleDividedData/?feedBackScheduleId=${scheduleid}&contactId=${contactid}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getFeedBackData = async (scheduleid, contactid) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/FeedBackData/?feedBackScheduleId=${scheduleid}&contactId=${contactid}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getFeedBackSpecificData = async (
  scheduleid,
  contactid,
  type,
  courseid
) => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/FeedBackData/?feedBackScheduleId=${scheduleid}&contactId=${contactid}&category=${type}&courseId=${courseid}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postFeedback = async payload => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/createFeedbackCollection`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getFacultyFeedbackData = async contactid => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/courseconnectionByContactId/?contactId=${contactid}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getTransactionDetails = async contactId => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/activefee/retrieve/transaction?contactId=${contactId}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getFeeReceipt = async data => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/api/salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/portalfee/retrieve/receipt?transactionid=${data}`
  )}`;
  const res = await axiosInstance.get(`${path}`);
  return res && res.data ? res.data : null;
};

export const postManualPayment = async data => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/api/salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/manualfee/payment`
  )}`;
  const res = await axiosInstance.post(`${path}`, data);
  return res && res.data ? res.data : null;
};

export const getEvent = async () => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/pfs/sf/event/get/event`;
  const res = await axiosInstance.get(path);
  return res.data;
};

export const getEventById = async id => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/pfs/sf/event/get/single/event/${id}`;
  const res = await axiosInstance.get(path);
  return res.data;
};

export const getApplicationByApplicationId = async id => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/api/salesforce?endpoint=/services/apexrest/portal/retrieve/application?applicationid=${id}`;
  const res = await axiosInstance.get(path);
  return res.data;
};

export const getFormDataByFormId = async id => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/api/salesforce?endpoint=services/apexrest/portal/retrieve/form?formid=${id}`;
  const res = await axiosInstance.get(path);
  return res.data;
};

export const getSOPDetailsByApplicationId = async id => {
  const path = `https://api-v2.ken42.com/sp-jain/stage/pfs/sf/application/get/essay/${id}`;
  const res = await axiosInstance.get(path);
  return res.data;
};

export const postAttendanceInterview = async body => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/faculty/save/attendance`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    body
  );
  return res.data;
};

export const getFeedbackNew = async contactid => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/feedback?contactid=${contactid}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getExamsData = async id => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `/services/apexrest/examsportal/retrieve/exam?contactId=${id}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getQuestionPaperList = async examid => {
  const path = `sf/get/exam/faculty/questionPapers/exam/${examid}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getQuestionPaperDoc = async id => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/examsportal/retrieve/document?docid=${id}`
  )}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const postQuestionPaper = async data => {
  const path = `salesforce?endpoint=${encodeURIComponent(
    `services/apexrest/examsportal/save/questionPaper`
  )}`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    data
  );
  return res && res.data ? res.data : null;
};

export const getInvigilatorRequest = async contactid => {
  const path = `sf/exam/faculty/invigilatorRequest/${contactid}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getInvigilatorPostExam = async contactid => {
  const path = `sf/exam/faculty/invigilatorPostExam/${contactid}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getEvaluatorRequest = async contactid => {
  const path = `sf/exam/faculty/evaluatorRequest/${contactid}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getEvaluatorAnswersheet = async (contactid, acceptance) => {
  const path = `sf/exam/faculty/evaluatorAnswersheet/${contactid}/${acceptance}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getExamConnections = async examid => {
  const path = `sf/exam/faculty/examConnections/${examid}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const postInvigilationAction = async payload => {
  const path = `sf/exam/invigilator/action`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};
export const getExamInvigilator = async (examid, facilityId) => {
  const path = `sf/exam/invigilator/${examid}/${facilityId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getExamInvigilatorMisconduct = async (examid, facilityId) => {
  const path = `sf/exam/invigilator/get/misconduct/${examid}/${facilityId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const postInvigilatorMisconduct = async payload => {
  const path = `sf/exam/invigilator/post/misconduct`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getExamInvigilatorAttachment = async invigilatorId => {
  const path = `sf/exam/get/attchment/${invigilatorId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postInvigilatorAttachment = async payload => {
  const path = `sf/exam/invigilator/update/student/file`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};
export const postEvaluationAction = async payload => {
  const path = `sf/exam/Evaluation/action`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const getExamMarkBreakdown = async contactId => {
  const path = `sf/exam/mark/breakdown/${contactId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getExamCourseList = async courseOfferingId => {
  const path = `sf/exam/course/list/${courseOfferingId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getExamConnection = async examId => {
  const path = `sf/get/exam/connection/${examId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const postExamConnectionAttachment = async payload => {
  const path = `sf/post/exam/connection/attachment`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};
export const getCurrentExam = async contactId => {
  const path = `sf/get/exam/student/current/exam/${contactId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};
export const getHallTicket = async contactId => {
  const path = `${appConfig.integrationUrl}/salesforce?endpoint=`;
  const query = encodeURIComponent(
    `services/apexrest/examsportal/retrieve/hallTicket?contactId=${contactId}`
  );
  const res = await axiosInstance.get(`${path}${query}`);
  return res && res.data ? res.data : null;
};
export const getReExam = async contactId => {
  const path = `sf/get/exam/student/current/reexam/${contactId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const getMyRequest = async contactId => {
  const path = `sf/get/exam/student/myrequest/${contactId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postMyRequest = async payload => {
  const path = `sf/post/exam/student/myrequest/post`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};

export const marksBreak = async contactId => {
  const path = `sf/exam/mark/breakdown/${contactId}`;
  const res = await axiosInstance.get(`${appConfig.integrationUrl}/${path}`);
  return res && res.data ? res.data : null;
};

export const postSubstitute = async payload => {
  const path = `/sf/exam/invigilator/action`;
  const res = await axiosInstance.post(
    `${appConfig.integrationUrl}/${path}`,
    payload
  );
  return res && res.data ? res.data : null;
};
