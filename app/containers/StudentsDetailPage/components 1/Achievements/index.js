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

import FootballIcon from '../../../../assets/svg/my360/extraActivites/football.svg';
import SportsIcon from '../../../../assets/svg/my360/extraActivites/sports.svg';
import otherIcon from '../../../../assets/svg/my360/extraActivites/otherIcon.svg';
import AcademicsIcon from '../../../../assets/svg/my360/extraActivites/AcademicsIcon.svg';

import FlagIcon from '../../../../assets/svg/my360/extraActivites/flag.svg';
import KenSelect from '../../../../global_components/KenSelect';
import { getContactAdditionalInfoDataAchievements } from '../../../../utils/ApiService.js';
import Kencard from '../../../../global_components/KenCard';
import { useParams } from 'react-router-dom';

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
  awardsTitle: {
    fontFamily: 'Work Sans',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '23px',
    color: '#193389',
  },
}));

const data1 = [
  {
    category: 'Clubs',
    icon: FootballIcon,
    data: [
      {
        type: 'Football',
        des: 'Inter college tournament winner in football.',
        role: 'Role: Team Captain',
      },
      {
        type: 'Cricket',
        des: 'Inter college tournament winner in Cricket.',
        role: 'Role: Bowler',
      },
      {
        type: 'Hockey',
        des: 'Inter college tournament winner in Hockey.',
        role: 'Role: Goal Keaper',
      },
    ],
  },
  {
    category: 'Sports',
    icon: SportsIcon,
    data: [
      {
        type: 'Football',
        des: 'Inter college tournament winner in football.',
        role: 'Role: Team Captain',
      },
      {
        type: 'Cricket',
        des: 'Inter college tournament winner in Cricket.',
        role: 'Role: Bowler',
      },
      {
        type: 'Hockey',
        des: 'Inter college tournament winner in Hockey.',
        role: 'Role: Goal Keaper',
      },
    ],
  },
];

const CatagroiesIcons = {
  Sports: SportsIcon,
  Other: otherIcon,
  Clubs: FlagIcon,
  Academics: AcademicsIcon,
};

export default function Achievements() {
  const classes = useStyles();
  const theme = useTheme();
  const { contactId } = useParams();
  const [data, setData] = useState([]);
  const [subIndex, setSubIndex] = useState(0);
  const [achievements, setAchievements] = useState({
    award: '',
    certificates: '',
  });

  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  useEffect(() => {
    getContactAdditionalInfoDataAchievements(contactId).then(res => {
      console.log(res, 'n--->');
      setAchievements({
        ...achievements,
        award: res?.data?.Awards,
        certificates: res?.data?.Certificates,
      });
      if (res.data?.acwrapper) {
        let dta = Object.keys(res.data?.acwrapper);
        let arr = [];
        dta.map((s, i) => {
          arr.push({
            category: s,
            icon: SportsIcon,
            data: res.data?.acwrapper[s],
          });
        });
        console.log('arr-->', arr);
        setData(arr);
      }
    });
  }, []);
  console.log('some', achievements);
  return (
    <Box mt={2}>
      <Grid container spacing={3} direction="row" className={classes.container}>
        <Grid item md={4} sm={4} xs={12}>
          <BaseCard>
            <Typography className={classes.title}>Categories</Typography>
            {!isMobileScreen ? (
              <Grid container spacing={2} direction="column">
                {data.map((el, i) => {
                  return (
                    <Grid item md={12} sm={12} onClick={() => setSubIndex(i)}>
                      <>
                        <Grid container className={classes.categoryContainer}>
                          <Grid item>
                            <img src={CatagroiesIcons[el.category]} />
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
            <Typography className={classes.title}>Achievements</Typography>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Kencard
                  paperStyles={{
                    boxShadow: '0px 1px 20px 0px #0000000D',
                    background: '#fafafa',
                    border: '1px solid #e4e4e4',
                  }}
                >
                  <Typography className={classes.awardsTitle}>
                    {achievements.award !== undefined && achievements.award}
                  </Typography>
                  <Typography>Awards</Typography>
                </Kencard>
              </Grid>
              <Grid item md={3}>
                <Kencard
                  paperStyles={{
                    boxShadow: '0px 1px 20px 0px #0000000D',
                    background: '#fafafa',
                    border: '1px solid #e4e4e4',
                  }}
                >
                  <Typography className={classes.awardsTitle}>
                    {achievements.certificates !== undefined &&
                      achievements.certificates}
                  </Typography>
                  <Typography>Certification</Typography>
                </Kencard>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              direction="column"
              style={{ marginTop: '1em' }}
            >
              {data.length > 0 &&
                data[subIndex]?.data.map(el => {
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
                                    <img src={FootballIcon} /> {el.type}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.typoClubName}>
                                    {el.Description}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography className={classes.typoRole}>
                                    {el.Role}
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
                })}
            </Grid>
          </BaseCard>
        </Grid>
      </Grid>
    </Box>
  );
}
