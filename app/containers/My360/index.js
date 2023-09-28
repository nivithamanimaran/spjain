import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import {
  getStudentInfo,
} from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';

const MyPath = React.lazy(() => import('./components/MyPath'));
const MyPathFaculty = React.lazy(() => import('./components/MyPath/faculty'));
const PersonalDetails = React.lazy(() => import('./components/PersonalDetails'));
const KenLoader = React.lazy(() => import('../../components/KenLoader'));
const KenTabs = React.lazy(() => import('../../components/KenTabs'));
const BaseCard = React.lazy(() => import('../../new_components/card'));
const ProfileCard = React.lazy(() => import('../../new_components/ProfileCard/index'));
import { useLocation } from 'react-router-dom';

export default function My360(props) {
  props.setHeading("My 360")
  const user = getUserDetails();
  const [contactInfo, setContactInfo] = useState();
  const [loader, handleLoader] = useState();
  const location = useLocation();
  const [TabVal, setTabVal] = useState(location?.state?.profilevalue?location?.state?.profilevalue:0);
  const TabDataStudent = [
    {
      title: 'My Path',
      content: <MyPath profile={user} />,
    },

    {
      title: 'Personal Details',
      content: (
        <PersonalDetails
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
        />
      ),
    },
  ];
  const TabDataFaculty = [
    {
      title: 'My Path',
      content: <MyPathFaculty profile={user} />,
    },
    {
      title: 'Personal Details',
      content: (
        <PersonalDetails
          contactInfo={contactInfo}
          setContactInfo={setContactInfo}
        />
      ),
    },
  ];

  React.useEffect(() => {
    if (props.location.state?.tab) {
      if (props.location.state?.tab === 'Achievements') {
        setTabVal(2);
      }
    }
    handleLoader(true);

    getStudentInfo(user.ContactId)
      .then(res => {
        handleLoader(false);
        setContactInfo(res);
      })
      .catch(err => {
        console.error();(err);
        handleLoader(false);
      });
  }, [props]);

  return (
    <div>
      <Grid container spacing={2}>
        {loader === true && <KenLoader />}
        <Grid item md={12}>
          <BaseCard>
            <ProfileCard profile={user} contactInfo={contactInfo} />
          </BaseCard>
        </Grid>
        <Grid item md={12}>
          <KenTabs
            data={user?.Type === 'Faculty' ? TabDataFaculty : TabDataStudent}
            tabValue={ TabVal}
            tabPanelProps={{
              style: { background: '#F4F5F7' },
            }}
            rootStyles={{
              background: '#F4F5F7',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
