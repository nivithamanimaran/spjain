import React, { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  getAllCourseConnectionByContactId,
  getStudentsCount,
} from '../../../../utils/ApiService';

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
const BaseCard = React.lazy(() => import('../../../../new_components/card'));
const CircularProgressWithLabel = React.lazy(() =>
  import('../../../../components/ChartWidgets/CircularProgressWithLabel')
);

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
    '& > div ': {
      boxShadow: 'none',
      border: '1px solid #D2E1E9',
    },
    '& > div >div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '& > div >div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '200%',
      },
    },
    '& > div >div>div>table>thead>tr>th:nth-child(1)': {
      [theme.breakpoints.down('sm')]: {
        textAlign:"start",
        paddingLeft: "12px"
      },
    },
    '& > div >div>div>table>thead>tr>th:nth-child(2)': {
      [theme.breakpoints.down('sm')]: {
        textAlign:"start",
        paddingLeft: "12px"
      },
    },
    '& > div >div>div>table>thead>tr>th:nth-child(4)': {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: "12px"
      },
    },
    '& > div >div>div>table>thead>tr>th:nth-child(5)': {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: "9px"
      },
    },
  },
  activeCourses: {
    color: '#193389',
    fontWeight: 600,
    fontSize: 18,
  },
  courseName: {
    color: theme.palette.KenColors.kenBlack,
    fontWeight: 600,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 24,
  },
}));

export default function MyPathFaculty({ profile }) {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [active, setActive] = useState('Class Attendance');
  const [formerData, setFormerData] = useState();
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState();
  const [category, setCategory] = useState(['Class Attendance']);
  const [loader, setLoader] = useState();

  const column = [
    {
      Header: <Typography style={{ fontSize: '12px' }}>Term</Typography>,
      accessor: 'termName',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: (
        <Typography style={{ fontSize: '12px' }}>Subject Name</Typography>
      ),
      accessor: 'subject',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography className={classes.headerValue}>{value}</Typography>
          </div>
        );
      },
    },
    {
      Header: (
        <Typography style={{ fontSize: '12px' }}>Subject Code</Typography>
      ),
      accessor: 'subjectCode',
      disableGlobalFilter: true,
      Cell: ({ value }) => {
        return <Typography className={classes.headerValue}>{value}</Typography>;
      },
    },
    {
      Header: (
        <Typography style={{ fontSize: '12px', width: '48px' }}>
          Section
        </Typography>
      ),
      accessor: 'grade',
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
        <Typography style={{ fontSize: '12px', textAlign: 'center' }}>
          Average Feedback
        </Typography>
      ),
      accessor: 'totalAttendance',
      Cell: ({ value, row }) => {
        return (
          <div style={{ marginLeft: 30 }}>
            <CircularProgressWithLabel
              value={value}
              label={value == '0.0' ? 'NA' : value}
            />
          </div>
        );
      },
    },
  ];

  const getCurrentAttendanceData = () => {
    setLoader(true);
    let data = [];
    getStudentsCount(profile?.ContactId)
      .then(res => {
        if (res?.message !== 'No Data Found') {
          let details = Object.entries(res?.data?.courseOffering);
          console.log(details);
          details?.forEach((el, index) => {
            let courseDetailsArray = el[0]?.split('_');
            console.log(courseDetailsArray);
            let totalAttendance = 0;
            if (el[1] !== null && Array.isArray(el[1])) {
              let sumAttendance = el[1]?.reduce(
                (acc, currentValue) => acc + currentValue?.Attendacne,
                0
              );
              totalAttendance = sumAttendance / el[1]?.length;
            }
            data?.push({
              // ...el,
              sessionName: index + 1,
              courseName: courseDetailsArray[3],
              termName: courseDetailsArray[2],
              subject: courseDetailsArray[3],
              grade: courseDetailsArray[4],
              subjectCode: courseDetailsArray[5],
              totalAttendance: totalAttendance.toFixed(1),
            });
          });
        } else {
          // setNoData('You are upto date!');
        }
        data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setData(data);
        setActive('Class Attendance');
        setLoader(false);
      })
      .catch(err => {
        setData([]);
        setLoader(false);
      });
  };

  const getFormerCourseData = () => {
    setLoader(true);
    getAllCourseConnectionByContactId(profile?.ContactId)
      .then(res => {
        const formerDataArray = [];
        const allData = [...res?.electiveCourses, ...res?.mandatoryCourses];
        allData?.forEach(el => {
          if (el?.affiliationStatus === 'Former') {
            formerDataArray?.push(el?.CourseName);
          }
        });
        let data = formerDataArray.filter(
          (item, index) => formerDataArray.indexOf(item) === index
        );
        setFormerData([...data]);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    if (active === 'Class Attendance') {
      getCurrentAttendanceData();
    } else if (active === 'Class Taught') {
      getFormerCourseData();
    }
  }, [active]);

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
        <Grid item md={8} sm={8} xs={12}>
          <BaseCard>
            {active === 'Class Attendance' ? (
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
            ) : (
              <Grid container spacing={2} direction="row">
                <Grid item md={12}>
                  <Typography className={classes.activeCourses}>
                    Active Courses
                  </Typography>
                </Grid>
                <Grid item md={12}>
                  <>
                    <Grid container flexDirection="row" spacing={2}>
                      {formerData?.map(el => {
                        return (
                          <Grid item md={12}>
                            <Typography className={classes.courseName}>
                              {el}
                            </Typography>
                            <Divider style={{}} />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                </Grid>
              </Grid>
            )}
          </BaseCard>
        </Grid>
      </Grid>
    </Box>
  );
}
