import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import SportsIcon from '../../../../assets/svg/my360/extraActivites/sports.svg';
import { getAllCourseConnectionByContactId } from '../../../../utils/ApiService';

const KenLoader = React.lazy(() => import('../../../../components/KenLoader'));
const KenCard = React.lazy(() =>
  import('../../../../global_components/KenCard')
);
const KenGrid = React.lazy(() =>
  import('../../../../global_components/KenGrid')
);
const KenSelect = React.lazy(() =>
  import('../../../../global_components/KenSelect')
);
const CircularProgressWithLabel = React.lazy(() =>
  import('../../../../components/ChartWidgets/CircularProgressWithLabel')
);
const BaseCard = React.lazy(() => import('../../../../new_components/card'));

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
  headerValue: {
    fontSize: 14,
    marginRight: '15px',
    fontWeight: 400,
  },
  RightBox: {
    background: '#fff',
    width: '100%',
    background: '#fff !important',
    padding: '10px',
    [theme.breakpoints.down('sm')]: {
      padding: '0px !important',
    },
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      background: 'none !important',
    },
    '& div > div > table > thead': {
      background: '#F1F5FA',
    },
    '& div > div > table > thead > tr > th': {
      color: '#092682',
      fontSize: '14px',
      fontWeight: 'bold',
      borderBottom: 'none !important',
      textTransform: 'none !important',
      ['@media (max-width:600px)']: {
        fontSize: '9px',
      },
    },
    [theme.breakpoints.up('sm')]: {
      '& > div ': {
        boxShadow: 'none',
        border: '1px solid #D2E1E9',
      },
    },
    '& > div >div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '& > div >div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '230%',
      },
    },
    [theme.breakpoints.down('md')]: {
      maxHeight: '300px',
      overflowY: 'auto',
      overflowX:"hidden",
      padding:"6px"
    },
  },
  cardResp: {
    [theme.breakpoints.down('md')]: {
      marginBottom: '10px',
    },
  },
}));

export default function Achievements({ profile }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [active, setActive] = useState();
  const [formerData, setFormerData] = useState();
  const [currentData, setCurrentData] = useState();
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState();
  const [category, setCategory] = useState([]);
  const [loader, setLoader] = useState();
  const history = useHistory();
  const calculateAttendance = (presentClasses, totalClasses) => {
    if (totalClasses === 0) {
      return 'N/A';
    }

    const attendance = ((presentClasses / totalClasses) * 100).toFixed(2);
    return `${attendance}%`;
  };

  const column = [
    {
      Header: <Typography style={{ fontSize: '12px' }}>Course</Typography>,
      accessor: 'CourseName',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: <Typography style={{ fontSize: '12px' }}>Course Code</Typography>,
      accessor: 'CourseCode',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: <Typography style={{ fontSize: '12px' }}>Credits</Typography>,
      accessor: 'credit',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography className={classes.headerValue}>{value}</Typography>
          </div>
        );
      },
    },
    {
      Header: <Typography style={{ fontSize: '12px' }}>Grade</Typography>,
      accessor: 'courseOfferingSectionId',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography className={classes.headerValue}>{value}</Typography>{' '}
          </div>
        );
      },
    },
    {
      Header: (
        <Typography style={{ fontSize: '12px' }}>Total Attendance</Typography>
      ),
      accessor: 'presentnoOfclass',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        const attendance = (
          (value / row?.original?.totalnoOfclass) *
          100
        ).toFixed(2);
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {attendance === 'NaN' ? (
              <Typography className={classes.headerValue}>NA</Typography>
            ) : (
              <CircularProgressWithLabel
                value={attendance}
                label={attendance == '0.00' ? 'NA' : attendance}
              />
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (profile?.Type === 'Faculty') {
      setCategory(['Class Attendance', 'Class Taught']);
    }

    if (profile?.Type === 'Student') {
      setCategory(['Current', 'Previous']);
    }
  }, []);

  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getAllCourseConnectionByContactId(profile?.ContactId)
        .then(res => {
          const currentDataArray = [];
          const formerDataArray = [];
          const allData = [...res?.electiveCourses, ...res?.mandatoryCourses];
          allData?.forEach(el => {
            if (el?.affiliationStatus === 'Former') {
              formerDataArray?.push(el);
            } else {
              currentDataArray?.push(el);
            }
          });
          console.log(formerDataArray, currentDataArray);
          setFormerData([...formerDataArray]);
          setCurrentData([...currentDataArray]);
          setData([...currentDataArray]);
          setLoader(false);
          setActive('Current');
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, []);

  const handleData = elem => {
    if (elem === 'Current') {
      setData([...currentData]);
    } else if (elem === 'Previous') {
      setData([...formerData]);
    }
  };

  return (
    <Box mt={2}>
      {loader === true && <KenLoader />}
      <Grid container spacing={3} direction="row" className={classes.container}>
        <Grid item md={4} sm={4} xs={12}>
          <BaseCard>
            <Typography className={classes.title}>Courses</Typography>
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
                              console.log(el);
                              handleData(el);
                              setSelectedCategoryTitle(el);
                              setActive(el);
                            }}
                          >
                            <div style={{ display: 'flex' }}>
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
                  setSelectedCategory(data?.recordData[e.target.value]);
                  selectedCategoryTitle(el);
                }}
                required={true}
              />
            )}
          </BaseCard>
        </Grid>
        {isMobileScreen ? (
          <Grid item md={8} sm={8} xs={12}>
            <BaseCard>
              <Grid
                item
                justifyContent="space-between"
                style={{ display: 'flex' }}
                className={classes.RightBox}
              >
                {data?.length > 0 ? (
                  <Grid container spacing={2}>
                    {data.map(item => (
                      <Grid item xs={12} key={item.id}>
                        <KenCard
                          paperStyles={{ padding: 10, borderRadius: '4px' }}
                        >
                          <Grid container>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>
                                <b>Course</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>{item.CourseName}</Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>
                                <b>Course Code</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>{item.CourseCode}</Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>
                                <b>Credits</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>{item.credit}</Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>
                                <b>Grade</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={6} className={classes.cardResp}>
                              <Typography>
                                {item.courseOfferingSectionId}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography>
                                <b>Total Attendance</b>
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography>
                                {calculateAttendance(
                                  item.presentnoOfclass,
                                  item.totalnoOfclass
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </KenCard>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>No Data Found</Typography>
                )}
              </Grid>
            </BaseCard>
          </Grid>
        ) : (
          <Grid item md={8} sm={8} xs={12}>
            <BaseCard>
              <Grid
                item
                justifyContent="space-between"
                style={{ display: 'flex' }}
                className={classes.RightBox}
              >
                {data?.length > 0 ? (
                  <KenCard paperStyles={{ padding: 0, borderRadius: '4px' }}>
                    <KenGrid
                      columns={column}
                      data={data}
                      pagination={{ disabled: true }}
                      toolbarDisabled={true}
                      isCollasable={false}
                    />
                  </KenCard>
                ) : (
                  <Typography>No Data Found</Typography>
                )}
              </Grid>
            </BaseCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
