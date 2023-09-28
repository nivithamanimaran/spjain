import {
  Box,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import BaseCard from '../../../../new_components/card';
import { useHistory } from 'react-router-dom';
import FootballIcon from '../../../../assets/svg/my360/extraActivites/football.svg';
import SportsIcon from '../../../../assets/svg/my360/extraActivites/sports.svg';
import ConsultingIcon from '../../../../assets/svg/my360/achievements/consulting.svg';
import GrantsIcon from '../../../../assets/svg/my360/achievements/grants.svg';
import ConferenceIcon from '../../../../assets/svg/my360/achievements/conference.svg';
import LearningIcon from '../../../../assets/svg/my360/achievements/learing.svg';
import PatentsIcon from '../../../../assets/svg/my360/achievements/patents.svg';
import PublicationsIcon from '../../../../assets/svg/my360/achievements/publications.svg';
import FlagIcon from '../../../../assets/svg/my360/extraActivites/flag.svg';
import AcademicsIcon from '../../../../assets/svg/my360/extraActivites/AcademicsIcon.svg';
import OtherIcon from '../../../../assets/svg/my360/extraActivites/otherIcon.svg';
import KenSelect from '../../../../global_components/KenSelect';
import KenButton from '../../../../global_components/KenButton';
import {
  getContactAdditionalInfoDataAchievementsFaculty,
  getFacultyContactAdditional,
} from '../../../../utils/ApiService';
import KenLoader from '../../../../components/KenLoader';
import { getUserDetails } from '../../../../utils/helpers/storageHelper';
const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.KenColors.link1,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: 24,
  },
  categoryContainer: {
    padding: 18,
    border: `1px solid #E4E4E4`,
    borderRadius: '4px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  categoryContainerActive: {
    padding: 18,
    border: `1px solid #092682`,
    borderRadius: '4px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  typoCategory: {
    fontWeight: 500,
    lineHeight: '22px',
    color: theme.palette.KenColors.kenBlack,
    marginLeft: 26,
    textOverflow: 'ellipsis',
  },
  cardContainer: {
    border: '1px solid #E4E4E4',
    borderRadius: '8px',
    padding: 30,
  },
  typoClubName: {
    color: theme.palette.KenColors.kenBlack,
    fontWeight: 600,
    fontSize: 14,
  },
  typoFacultyIncharge: {
    color: '#737373',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
  },
  typoRole: {
    fontSize: 14,
    color: theme.palette.KenColors.kenBlack,
  },
  typoCertificate: {
    color: '#193389',
    fontWeight: 500,
    fontSize: 14,
  },
  buttonAchievements: {
    height: 30,
  },
  rewards: {
    padding: 30,
    width: 200,
    border: '1px solid #E4E4E4',
    boxShadow: '0px 1px 20px rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  rewardTitle: {
    textTransform: 'uppercase',
    color: '#808080',
    fontWeight: 600,
    fontSize: 11,
    marginBottom: 8,
  },
  rewardNo: {
    textTransform: 'uppercase',
    color: theme.palette.KenColors.kenBlack,
    fontWeight: 600,
    fontSize: 20,
  },
}));

export default function Achievements({ profile }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [active, setActive] = useState();
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState();
  const [category, setCategory] = useState([]);
  const [loader, setLoader] = useState();
  const history = useHistory();

  const handleSelectCategory = (e, el) => {
    setSelectedCategory(data?.acwrapper[el]);
    setSelectedData(el);
    setActive(true);
  };

  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getFacultyContactAdditional(profile?.ContactId)
        .then(res => {
          setLoader(false);
          setData({ ...res?.data });
          setCategory(Object.keys(res?.data).sort());
          let title = Object.keys(res?.data).sort()
          const sortedCategory = Object.keys(res?.data).sort();
          const otherIndex = sortedCategory.findIndex(el => el === 'Other');
          const selectedCategory = [];
          sortedCategory.forEach((el, index) => {
            if (index !== otherIndex) selectedCategory.push(el);
          });
          if (otherIndex > 0) {
            selectedCategory.push('Other');
          }
          setSelectedCategoryTitle(title?.length > 0 && title[0]);
          setCategory(selectedCategory);
          setActive(selectedCategory[0]);
          setSelectedCategory(res?.data[Object.keys(res?.data).sort()[0]]);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);

  const handleAddAchievement = () => {
    // setAddAchievement(true);
    history.push({
      pathname: `/addAchievements`,
      state: { category: selectedCategoryTitle },
    });
  };

  const CatagoryIcon = {
    'Conferences, Conclaves and Seminars': ConferenceIcon,
    'Consulting Projects': ConsultingIcon,
    Grants: GrantsIcon,
    'Learning,Development': LearningIcon,
    Patents: PatentsIcon,
    Publications: PublicationsIcon,
  };

  return (
    <Box mt={2}>
      {loader === true && <KenLoader />}
      <Grid container spacing={3} direction="row" className={classes.container}>
        <Grid item md={4} sm={4} xs={12}>
          <BaseCard>
            <Typography className={classes.title}>Categories</Typography>
            {!isMobileScreen ? (
              <Grid container spacing={2} direction="column">
                {category && category?.length > 0 ? (
                  category?.map(el => {
                    return (
                      <Grid item md={12} sm={12}>
                        <>
                          <Grid
                            container
                            className={
                              el === active
                                ? classes.categoryContainerActive
                                : classes.categoryContainer
                            }
                            onClick={() => {
                              setSelectedCategory(data[el]);
                              // setSelectedData(el);

                              setSelectedCategoryTitle(el);
                              setActive(el);
                            }}
                          >
                            <div style={{ display: 'flex' }}>
                              <Grid item>
                                <img src={CatagoryIcon[el]} />
                              </Grid>
                              <Grid item>
                                <Typography className={classes.typoCategory}>
                                  {el}
                                </Typography>
                              </Grid>
                            </div>
                          </Grid>
                        </>
                      </Grid>
                    );
                  })
                ) : (
                  <Typography style={{ padding: 16 }}>No Data Found</Typography>
                )}
              </Grid>
            ) : (
              <KenSelect
                label={'Select Category'}
                options={category?.map(el => {
                  return {
                    label: el,
                    value: el,
                  };
                })}
                onChange={(e, el) => {
                  setSelectedCategory(data[e.target.value]);
                  selectedCategoryTitle(el);
                }}
                required={true}
              />
            )}
          </BaseCard>
        </Grid>
        <Grid item md={8} sm={8} xs={12}>
          <BaseCard>
            <Grid
              item
              justifyContent="space-between"
              style={{ display: 'flex' }}
            >
              <Typography className={classes.title}>Achievements</Typography>
              {profile.Type === 'Faculty' ? selectedCategoryTitle !== null ? <KenButton
                variant="primary"
                onClick={handleAddAchievement}
                buttonClass={classes.buttonAchievements}
              // disabled={selectedCategoryTitle === undefined}
              >
                Add
              </KenButton> : null : null}
            </Grid>
            {data?.Certificates && data?.Awards && (
              <Grid item style={{ marginBottom: 16 }}>
                <>
                  <Grid container spacing={2}>
                    {data?.Awards && (
                      <Grid
                        item
                        className={classes.rewards}
                        style={{ marginRight: 20, marginLeft: 8 }}
                      >
                        <Typography className={classes.rewardTitle}>
                          awards
                        </Typography>
                        <Typography className={classes.rewardNo}>
                          {data?.Awards}
                        </Typography>
                      </Grid>
                    )}
                    {data?.Certificates && (
                      <Grid item className={classes.rewards}>
                        <Typography className={classes.rewardTitle}>
                          certification
                        </Typography>
                        <Typography className={classes.rewardNo}>
                          {data?.Certificates}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </>
              </Grid>
            )}
            <Grid container spacing={2} direction="column">
              {selectedCategory && selectedCategory.length > 0 ? (
                selectedCategory?.map(el => {
                  return (
                    <Grid item md={12}>
                      <>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-end"
                          className={classes.cardContainer}
                        >
                          <Grid item>
                            <>
                              <Grid container direction="column" spacing={1}>
                                <Grid item md={12}>
                                  <Typography className={classes.typoClubName}>
                                    <img
                                      src={CatagoryIcon[el?.Type]}
                                    />{' '}
                                    {el?.Name}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.typoClubName}>
                                    {el?.Description}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.typoRole}>
                                    Role: {el?.Role}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </>
                          </Grid>
                          <Grid item>
                            <Typography className={classes.typoCertificate}>
                              View Certificate
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                  );
                })
              ) : (
                <Typography style={{ padding: 16 }}>No Data Found</Typography>
              )}
            </Grid>
          </BaseCard>
        </Grid>
      </Grid>
    </Box>
  );
}
