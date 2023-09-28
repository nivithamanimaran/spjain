/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect } from 'react';
import { Box, Grid, makeStyles, Button } from '@material-ui/core';
import Schedule from './components/Schedule/index';
import {
  getStudentInfo,
} from '../../utils/ApiService';

import { getUserDetails } from '../../utils/helpers/storageHelper';
import '../App/styles.scss';
import { useTranslation } from 'react-i18next';
import context from '../../utils/helpers/context';
import history from '../../utils/history';
import configContext from '../../utils/helpers/configHelper';

const BaseCard = React.lazy(() => import('../../new_components/card'));
const ProfileCard = React.lazy(() => import('../../new_components/ProfileCard'));
const MyCourses = React.lazy(() => import('./components/MyCourses'));
const EventUpdates = React.lazy(() => import('./components/EventUpdates'));
const KenLoader = React.lazy(() => import('../../components/KenLoader'));

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      padding: '0px 0px 20px 0px',
    },
  },
  grid: {
    [theme.breakpoints.only('xs')]: {
      margin: '0px 0px 0px -8px',

      '& > .MuiGrid-item': {
        padding: 8,
      },
    },
  },
  cardHandler: {
    position: 'relative',
    height: '100%',
  },
  maskWrap: {
    position: 'relative',
    height: '100%',
  },
  containerBox: {
    height: '100%',
    padding: '5px',
  },
  activityTab: {
    position: 'relative',
  },
}));

export default function HomePage(props) {
  const { handleLoader, handleSnackbarOpen } = React.useContext(context);
  const { config } = React.useContext(configContext);
  const { t } = useTranslation();
  const classes = useStyles();
  const { drawerChanges, setHeading } = props;
  const [schedule, setSchedule] = useState();
  const [user, setUser] = useState();
  const [contactInfo, setContactInfo] = useState();

  const [activityUrls, setActivityUrls] = useState();
  //state for loader
  const [loading, setLoading] = React.useState(false);

  const toggleLoader = val => {
    setLoading(val);
  };
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    history.push('/accountDetail');
    window.location.reload();
  };
  
  React.useEffect(() => {
    drawerChanges('show');
  }, []);
  let profile = getUserDetails();

  useEffect(() => {
    if (profile) {
 
      setUser(profile);
  
    }
  }, []);

  React.useEffect(() => {
    handleLoader(true);
    getStudentInfo(profile.ContactId)
      .then(res => {
        handleLoader(false);
        setContactInfo(res);
      })
      .catch(err => {
        console.log(err);
        handleLoader(false);
      });
  }, []);

  return (
    <>
      <Box>
        {loading && <KenLoader />}

        <Grid className={classes.root}>
          <Grid container md={12} spacing={2}>
            <Grid item md={12}>
              {profile && (
                <BaseCard>
                  <ProfileCard contactInfo={contactInfo} profile={profile} />
                </BaseCard>
              )}
            </Grid>

            <Grid item container direction="row" spacing={2}>
              <Grid item md={4} xs={12}>
                <MyCourses profile={profile} />
              </Grid>
              <Grid item md={4} xs={12}>
                {user && (
                  <BaseCard
                    rootStyles={{
                      height: '450px',
                      padding: 16,
                      boxShadow: '0px 1px 40px rgba(0, 0, 0, 0.05)',
                      borderRadius: 12,
                    }}
                  >
                    <Schedule
                      data={schedule}
                      toggleLoader={toggleLoader}
                      activityUrls={activityUrls}
                      style={{ padding: '0px' }}
                    />
                  </BaseCard>
                )}
              </Grid>

              <Grid item md={4} xs={12}>
                <BaseCard
                  rootStyles={{
                    height: '450px',
                    boxShadow: '0px 1px 40px rgba(0, 0, 0, 0.05)',
                    borderRadius: 12,
                  }}
                >
                  <EventUpdates profile={profile} setHeading={setHeading} />
                </BaseCard>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </>
  );
}
