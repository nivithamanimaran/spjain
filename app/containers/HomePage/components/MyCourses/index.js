
import React, { useState } from 'react';
import { Divider, Grid, makeStyles, Typography } from '@material-ui/core';
import { getCourseConnectionByContactId } from '../../../../utils/ApiService';

const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const BaseCard = React.lazy(() => import('../../../../new_components/card'));

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    border: '1px solid #e9ebf2',
    borderRadius: '4px',
    marginTop: '8px',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.KenColors.neutral900,
    marginBottom: 12,
  },
  credits: {
    fontWeight: 600,
    fontSize: 12,
    color: theme.palette.KenColors.neutral100,
    marginBottom: 12,
  },
  subjectTypeElective: {
    fontWeight: 500,
    fontSize: 12,
    color: theme.palette.KenColors.kenBlack,
    background: 'rgba(255, 122, 23, 0.25)',
    borderRadius: 4,
    padding: 4,
    width: 'fit-content',
  },
  subjectTypeMandatory: {
    fontWeight: 600,
    fontSize: 12,
    color: theme.palette.KenColors.kenBlack,
    background: 'rgba(82, 193, 90, 0.27)',
    borderRadius: 4,
    padding: 4,
    width: 'fit-content',
  },
  hide: {
    display: 'none',
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

export default function MyCourses({ profile }) {
  const classes = useStyles();
  const [courseData, setCourseData] = useState([]);
  const [loader, setLoader] = useState(false);
  React.useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getCourseConnectionByContactId(profile.ContactId)
        .then(res => {
          setLoader(false);
          const dataArr = [];
          res?.electiveCourses?.forEach(el => {
            dataArr.push({ ...el, subjectType: 'Elective' });
          });
          res?.mandatoryCourses?.forEach(el => {
            dataArr.push({ ...el, subjectType: 'Mandatory' });
          });
          setCourseData(dataArr);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);

  return (
    <BaseCard
      title="My Courses"
      rootStyles={{
        borderRadius: '12px',
        padding: 16,
      }}
    >
      <Divider style={{ marginTop: 16 }} />
      <div
        className={classes.scrollWrap}
        style={{
          height: '367px',
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
          {courseData && courseData.length > 0 ? (
            courseData.map(el => {
              return (
                <Grid item>
                  <>
                    <Grid
                      item
                      container
                      direction="column"
                      className={classes.container}
                    >
                      <Grid item>
                        <Typography className={classes.subjectName}>
                          {el?.CourseName}
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        item
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          {profile?.Type === 'Faculty' ? (
                            <Typography
                              className={classes.subjectTypeMandatory}
                            >
                              Current
                            </Typography>
                          ) : (
                            <Typography
                              className={
                                el.subjectType === 'Elective' ||
                                el.status === 'Upcoming'
                                  ? classes.subjectTypeElective
                                  : el.subjectType === null
                                  ? classes.hide
                                  : classes.subjectTypeMandatory
                              }
                            >
                              {el.subjectType}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item>
                          <Typography className={classes.credits}>
                            {el?.credit || 0} Credits
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              );
            })
          ) : (
            <Typography style={{ marginLeft: '10px' }}>
              No Courses found
            </Typography>
          )}
          <Grid />
        </Grid>
      </div>
    </BaseCard>
  );
}
