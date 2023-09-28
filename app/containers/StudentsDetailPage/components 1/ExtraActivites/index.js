import {
  Box,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import BaseCard from '../../../../new_components/card';
import {
  getCompletedEnrollment,
  getContactAdditionalInfoData,
} from '../../../../utils/ApiService';
import FootballIcon from '../../../../assets/svg/my360/extraActivites/football.svg';
import SportsIcon from '../../../../assets/svg/my360/extraActivites/sports.svg';
import FlagIcon from '../../../../assets/svg/my360/extraActivites/flag.svg';
import KenSelect from '../../../../global_components/KenSelect';
import KenGrid from '../../../../global_components/KenGrid';
import KenCard from '../../../../global_components/KenCard';
import CircularProgressWithLabel from '../../../../components/ChartWidgets/CircularProgressWithLabel';
import KenLoader from '../../../../components/KenLoader';

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
    fontSize: 20,
  },
  typoFacultyIncharge: {
    color: '#737373',
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
  },
  typoIsParticipantGreen: {
    background: 'rgba(82, 193, 90, 0.27)',
    borderRadius: '4px',
    padding: '4px',
    fontSize: 12,
    fontWeight: 500,
    color: theme.palette.KenColors.kenBlack,
    width: 'fit-content',
  },
  typoIsParticipantYellow: {
    background: 'rgba(255, 239, 182, 0.27)',
    borderRadius: '4px',
    padding: '4px',
    fontSize: 12,
    fontWeight: 500,
    color: theme.palette.KenColors.kenBlack,
    width: 'fit-content',
  },
  header: {
    fontSize: 15,
    fontWeight: 600,
    color: '#092682',
    textDecoration: 'none',
    // border: 'solid 1px',
    padding: '0px',
    // width: '100px'
  },
  tableborder: {
    border: 'solid 2px',
    borderRadius: '5px',
    borderColor: '#F1F5FA',
  },
}));

const data = [
  {
    category: 'Clubs',
    icon: FootballIcon,
    data: [
      {
        clubName: 'Club Name',
        facultyIncharge: 'Faculty Incharge',
        isParticipant: 'Participant',
      },
      {
        clubName: 'Club Name',
        facultyIncharge: 'Faculty Incharge',
        isParticipant: 'Non Participant',
      },
      {
        clubName: 'Club Name',
        facultyIncharge: 'Faculty Incharge',
        isParticipant: 'Participant',
      },
    ],
  },
  {
    category: 'Sports',
    icon: SportsIcon,
    data: [
      {
        clubName: 'Club Name',
        facultyIncharge: 'Faculty Incharge',
        isParticipant: 'Participant',
      },
      {
        clubName: 'Club Name',
        facultyIncharge: 'Faculty Incharge',
        isParticipant: 'Non Participant',
      },
      {
        clubName: 'Club Name',
        facultyIncharge: 'Faculty Incharge',
        isParticipant: 'Participant',
      },
    ],
  },
];

export default function ExtraActivites({ contactId }) {
  const classes = useStyles();
  const theme = useTheme();
  const [exdata, setexdata] = useState([]);
  const [data, setData] = useState();
  const [loader, setLoader] = useState();

  useEffect(() => {
    setLoader(true);
    getCompletedEnrollment(contactId)
      .then(res => {
        if (res?.message !== 'No Data Found') {
          setData([...res?.electiveCourses, ...res?.mandatoryCourses]);
          setLoader(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const CommonCell = row => {
    return (
      <>
        <Typography
          style={{
            fontSize: '14px',
            paddingLeft: '15px',
            width: '150px',
          }}
        >
          {row.value}
        </Typography>
      </>
    );
  };
  const columns = [
    {
      Header: <Typography className={classes.header}>Subject</Typography>,
      accessor: 'CourseName',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Faculty</Typography>,
      accessor: 'FacultyName',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
    {
      Header: <Typography className={classes.header}>Attendance</Typography>,
      accessor: 'Tax_Amount__c',
      disableGlobalFilter: true,
      Cell: ({ value, row }) => {
        return (
          <div
            style={{
              paddingLeft: '15px',
              width: '150px',
            }}
          >
            <CircularProgressWithLabel value={(76 / 100) * 100} label="76%" />
          </div>
        );
      },
    },
    {
      Header: <Typography className={classes.header}>Credits</Typography>,
      accessor: 'credit',
      disableGlobalFilter: true,
      Cell: CommonCell,
    },
  ];
  const datas = exdata.map(s => {
    return {
      Course_Name__c: s.cou.Course_Name__c,
      Faculty_Name__c: s.cou.Faculty_Name__c,
      hed__Credits_Attempted__c: s.cou.hed__Credits_Attempted__c,
    };
  });
  return (
    <Box mt={2}>
      {loader === true && <KenLoader />}
      <KenCard>
        {data?.length > 0 ? (
          <div className={classes.tableborder}>
            <KenGrid
              columns={columns}
              data={data}
              pagination={{ disabled: true }}
              tableTotal={{ disabled: true, checkbox: true }}
              getRowProps={{ selected: true }}
              toolbarDisabled={true}
              gridProps={{
                getHeaderProps: cell => ({
                  style: {
                    background: '#F1F5FA',
                    border: 'solid 1px',
                    borderColor: '#F1F5FA',
                  },
                }),
                getCellProps: cell => ({
                  style: {
                    border: 'solid 1px',
                    borderColor: '#F1F5FA',
                  },
                }),
              }}
            />
          </div>
        ) : (
          <Typography>No Data Found</Typography>
        )}
      </KenCard>
      {/* <Grid container spacing={3} direction="row" className={classes.container}>
        <Grid item md={4} sm={4} xs={12}>
          <BaseCard>
            <Typography className={classes.title}>Categories</Typography>
            {!isMobileScreen ? (
              <Grid container spacing={2} direction="column">
                {data.map(el => {
                  return (
                    <Grid item md={12} sm={12}>
                      <>
                        <Grid container className={classes.categoryContainer}>
                          <Grid item>
                            <img src={el.icon} />
                          </Grid>
                          <Grid item>
                            <Typography className={classes.typoCategory}>
                              {el.category}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <KenSelect
                label={'Select Category'}
                options={data.map(el => {
                  return { label: el.category, value: el.category };
                })}
                required={true}
              />
            )}
          </BaseCard>
        </Grid>
        <Grid item md={8} sm={8} xs={12}>
          <BaseCard>
            <Typography className={classes.title}>Clubs</Typography>
            <Grid container spacing={2} direction="column">
              {data[0].data.map(el => {
                return (
                  <Grid item>
                    <>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        className={classes.cardContainer}
                      >
                        <Grid item>
                          <>
                            <Grid container direction="column" spacing={1}>
                              <Grid item>
                                <Typography className={classes.typoClubName}>
                                  {el.clubName}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography
                                  className={classes.typoFacultyIncharge}
                                >
                                  {el.facultyIncharge}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography
                                  className={
                                    el.isParticipant
                                      ? classes.typoIsParticipantGreen
                                      : classes.typoIsParticipantYellow
                                  }
                                >
                                  {el.isParticipant}
                                </Typography>
                              </Grid>
                            </Grid>
                          </>
                        </Grid>
                        <Grid item>
                          <img src={FlagIcon} />
                        </Grid>
                      </Grid>
                    </>
                  </Grid>
                );
              })}
            </Grid>
          </BaseCard>
        </Grid>
      </Grid> */}
    </Box>
  );
}
