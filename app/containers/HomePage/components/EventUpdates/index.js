import React, { useEffect, useState } from 'react';
import { Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import CalendarIcon from '../../../../assets/svg/homepage/calendar.svg';
import { useHistory } from 'react-router-dom';
import { getEvent } from '../../../../utils/ApiService';

const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const BaseCard = React.lazy(() => import('../../../../new_components/card'));

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    border: '1px solid #e9ebf2',
    borderRadius: '4px',
    marginTop: '8px',
  },
  typoEventType: {
    color: theme.palette.KenColors.neutral400,
    fontSize: 12,
    lineHeight: '150%',
    fontWeight: 400,
    marginBottom: 4,
  },
  typoEventDes: {
    color: theme.palette.KenColors.gradeSectionHeaderLabel,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '150%',
    marginBottom: 8,
    [theme.breakpoints.down('xs')]: {
      marginTop: 8,
    },

  },
  resp: {
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  background: {
    '&:hover': {
      backgroundColor: '#F4F6FF',
    },
  },
  scrollWrap: {
    overflowY: 'auto',
    zIndex: 5000,
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 6px #F1F1F1`,
      webkitBoxShadow: `inset 0 0 6px #F1F1F1`,
      backgroundColor: `inset 0 0 6px #F1F1F1`,
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `#7F7F7F`,
      opacity: '0.7',
      borderRadius: 4,
      outline: `1px solid #7F7F7F`,
    },
  },
}));

export default function EventUpdates({ profile }) {
  const history = useHistory();
  const [eventId, setEventId] = useState('');
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    getEvent().then(res => {
      setEventData(res);
    });
  }, []);

  console.log('1234', eventData);

  return (
    <BaseCard
      title="Events & Updates"
      rootStyles={{
        borderRadius: '12px',
        padding: 16,
      }}
    >
      <Divider style={{ marginTop: 16 }} />
      <div
        className={classes.scrollWrap}
        style={{
          height: '350px',
          cursor: 'pointer',
          overflowX: 'hidden',
        }}
      >
        {loader === true && <KenLoader />}
        <Grid
          style={{ marginTop: '10px', paddingRight: '10px' }}
          container
          direction="column"
          spacing={2}
        >
          {eventData && eventData?.length > 0 ? (
            eventData.map(el => {
              return (
                <Grid item>
                  <>
                    <Grid
                      item
                      container
                      direction="row"
                      onClick={() => {
                        history.push(`/SpecificEvent?eventId=${el?.Id}`);
                      }}
                      className={classes.container}
                    >
                      <Grid item className={classes.icon} xs={2}>
                        <img src={CalendarIcon} />
                      </Grid>
                      <Grid item xs={10} className={classes.resp}>
                        <Typography className={classes.typoEventDes}>
                          {el.Name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              );
            })
          ) : (
            <Typography style={{ marginLeft: 8 }}>No Data Found</Typography>
          )}
        </Grid>
      </div>
    </BaseCard>
  );
}
