import { Box, Typography, makeStyles, Grid } from '@material-ui/core';
import React from 'react';
import {
  getAllEvents,
  getAllRegisterEvents,
} from '../../../../utils/ApiService';
import EventRow from './EventRow';
import UpcomingEventsView from './UpcomingEventsView';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  container: {
    padding: '0px',
    maxHeight: '50vh',
    minHeight: '45vh',
    overflowY: 'scroll',
  },
  semiTitle: {
    color: theme.palette.KenColors.neutral400,
    fontSize: 12,
    marginLeft: 12,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function UpcomingEvents(props) {
  const user = getUserDetails();
  const styles = useStyles();
  const [events, setEvents] = React.useState();

  const onClickAll = () => {
    getAllEvents().then(res => {
      if (user?.ContactId) {
        getAllRegisterEvents(user?.ContactId).then(resp => {
          for (let evnt of res) {
            for (let regis of resp) {
              if (regis.EventId === evnt.Id) {
                evnt.type = 'Registered';
              }
            }
          }
          let arr = res.map(el => {
            if (el?.type) {
              return { ...el };
            } else {
              return { ...el, type: 'Un-Registered' };
            }
          });
          setEvents(arr);
        });
      }
    });
  };

  React.useEffect(() => {
    onClickAll();
  }, []);

  const handleSelected = (e, name) => {
    switch (name) {
      case 'all':
        // onClickAll();//hardcore
        getAllRegisterEvents(user.ContactId).then(res => {
          setEvents(res);
        });
        break;
      case 'registered':
        getAllRegisterEvents(user.ContactId).then(res => {
          setEvents(res);
        });
        break;
      case 'unregistered':
        getAllEvents().then(resData => {
          getAllRegisterEvents(user.ContactId).then(resp => {
            for (let evnt of res) {
              for (let regis of resp) {
                if (regis.EventId === evnt.Id) {
                  evnt.type = 'Registered';
                }
              }
            }
            let arr = [];
            res.forEach(el => {
              if (!el?.type) {
                arr.push(el);
              }
            });
            setEvents(arr);
          });
        });
        break;
    }
  };

  return (
    <UpcomingEventsView
      events={events}
      handleSelected={handleSelected}
      style={{ padding: '0px' }}
    />
  );
}
