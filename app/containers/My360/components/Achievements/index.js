import {
  Box,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import BaseCard from '../../../../new_components/card';
import FootballIcon from '../../../../assets/svg/my360/extraActivites/football.svg';
import SportsIcon from '../../../../assets/svg/my360/extraActivites/sports.svg';
import FlagIcon from '../../../../assets/svg/my360/extraActivites/flag.svg';
import AcademicsIcon from '../../../../assets/svg/my360/extraActivites/AcademicsIcon.svg';
import OtherIcon from '../../../../assets/svg/my360/extraActivites/otherIcon.svg';
// import  fro
import KenSelect from '../../../../global_components/KenSelect';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  getContactAdditionalInfoDataAchievements,
  getContactAdditionalInfodetails,
  getStudentContactAdditional,
} from '../../../../utils/ApiService';
import KenLoader from '../../../../components/KenLoader';
import KenButton from '../../../../global_components/KenButton';
import AlertDialog from '../../../../components/KenDialogBox';
import AddAChivements1 from './AddAChivements1';

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
  typoCategory: {
    fontWeight: 500,
    lineHeight: '22px',
    color: theme.palette.KenColors.kenBlack,
    marginLeft: 26,
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
  categoryContainerActive: {
    padding: 18,
    border: `1px solid #092682`,
    borderRadius: '4px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function Achievements(props) {
  console.log(props);
  const { contactId, profile } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState();
  const [category, setCategory] = useState([]);
  const [loader, setLoader] = useState();
  const [active, setActive] = useState();
  const [openModel, setOpenModel] = useState(false);
  const [recordData, setRecordData] = useState('');

  const handleOpen = selectedCategoryTitles => {
    setRecordData(selectedCategoryTitles);
    setOpenModel(true);
  };
  const handleClose = () => {
    setOpenModel(false);
  };
  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getStudentContactAdditional(profile?.ContactId)
        .then(res => {
          setLoader(false);
          setData(res?.data);
          const sortedCategory = Object.keys(res?.data).sort();
          const categoriesArray = [...sortedCategory];
          const otherIndex = categoriesArray?.findIndex(el => el === 'Others');
          categoriesArray?.splice(otherIndex, 1);
          const awardsIndex = categoriesArray?.findIndex(el => el === 'Awards');
          categoriesArray?.splice(awardsIndex, 1);

          const certificateIndex = categoriesArray.findIndex(
            el => el === 'Certificate'
          );
          categoriesArray?.splice(certificateIndex, 1);
          // sortedCategory.forEach((el, index) => {
          //   if (index !== otherIndex) selectedCategory.push(el);
          // });

          // sortedCategory.forEach((el, index) => {
          //   if (index !== otherIndex) categoriesArray.push(el);
          //   if (index !== awardsIndex) categoriesArray.push(el);
          //   if (index !== certificateIndex) categoriesArray.push(el);
          // });
          if (otherIndex > 0) {
            categoriesArray?.push('Others');
          }
          // let selectedTitle = categoriesArray[0]
          setSelectedCategoryTitle(categoriesArray[0]);
          setActive(categoriesArray[0]);
          setCategory([...categoriesArray]);
          setSelectedCategory(res?.data[categoriesArray[0]]);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);

  const CatagoryIcon = {
    Sports: SportsIcon,
    Clubs: FlagIcon,
    Academics: AcademicsIcon,
    Others: OtherIcon,
  };

  return (
    <Box mt={2}>
      {loader === true && <KenLoader />}
      <AlertDialog
        open={openModel}
        handleClose={handleClose}
        positiveButtonText={false}
        dialogActionFlag={false}
        dialogContentStyle={{ width: 'auto' }}
      >
        <AddAChivements1
          openModel={openModel}
          setOpenModel={setOpenModel}
          handleClose={handleClose}

          // value={value}
          // setValue={setValue}
          // postCurruntInviExamantionReject={postCurruntInviExamantionReject}
        />
      </AlertDialog>
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
                              setSelectedCategoryTitle(el);
                              setActive(el);
                            }}
                          >
                            <Grid item>
                              <img
                                src={CatagoryIcon[el]}
                                style={{ height: 20 }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography className={classes.typoCategory}>
                                {el}
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
            ) : (
              <KenSelect
                label={'Select Category'}
                options={category?.map(el => {
                  return { label: el, value: el };
                })}
                onChange={e => {
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
            <Grid container justifyContent="space-between">
              <Grid item>
                <Typography className={classes.title}>
                  {selectedCategoryTitle || 'Achievements'}
                </Typography>
              </Grid>
              <Grid item>
                <KenButton
                  variant="primary"
                  onClick={() => {
                    handleOpen(selectedCategoryTitle);
                  }}
                  // disabled={selectedCategoryTitle === undefined}
                >
                  Add
                </KenButton>
              </Grid>
            </Grid>

            <Grid container spacing={2} direction="column">
              {data?.Certificates && data?.Awards && (
                <Grid item style={{ marginBottom: 16 }}>
                  <>
                    <Grid container spacing={2}>
                      {data?.Awards && (
                        <Grid
                          item
                          className={classes.rewards}
                          style={{ height: 20, marginRight: 8 }}
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
                                <Grid item>
                                  <Typography className={classes.typoClubName}>
                                    <img
                                      style={{ height: 20, paddingRight: 16 }}
                                      src={CatagoryIcon[selectedCategoryTitle]}
                                    />
                                    {el?.Name}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.typoClubName}>
                                    {el?.Description}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </>
                          </Grid>
                          <Grid item container justifyContent="space-between">
                            <Grid item>
                              <Typography className={classes.typoRole}>
                                Role: {el?.Role}
                              </Typography>
                            </Grid>
                            {/* <Grid item>
                              <Typography className={classes.typoCertificate}>
                                View Certificate
                              </Typography>
                            </Grid> */}
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
