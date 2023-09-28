import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import KenTabs from '../../../components/KenTabs';
import QuizAnalysis from './quizAnalysis';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PerformanceTab from './performaceTab';
import QuestionReportTab from './questionReportTab';
import SolutionTab from './solutionTab';

const useStyles = makeStyles(theme => ({
  containerFirst: {
    background: theme.palette.KenColors.kenWhite,
    margin: 4,
  },
  typoRankTitle: {
    color: theme.palette.KenColors.neutral400,
    fontWeight: 600,
    fontSiz: 14,
  },
  typoRank: {
    color: theme.palette.KenColors.kenBlack,
    fontSize: 48,
    fontWeight: 700,
  },
  typoTotalNumber: {
    color: theme.palette.KenColors.neutral100,
    fontSize: 28,
    fontWeight: 700,
  },
  accuracyContainer: {
    background: '#F4F5F7',
    padding: 8,
    borderRadius: 3,
  },
  icons: {
    fontSize: '18px',
    marginRight: '10px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function StudentPerformance() {
  const classes = useStyles();
  const tabs = [
    {
      title: (
        <Box className={classes.title}>
          <MenuBookIcon className={classes.icons} />
          <span>{`Performance `}</span>
        </Box>
      ),
      content: <PerformanceTab />,
    },
    {
      title: (
        <Box className={classes.title}>
          <MenuBookIcon className={classes.icons} />
          <span>{`Question Report `}</span>
        </Box>
      ),
      content: <QuestionReportTab />,
    },
    {
      title: (
        <Box className={classes.title}>
          <MenuBookIcon className={classes.icons} />
          <span>{`Solutions `}</span>
        </Box>
      ),
      content: <SolutionTab />,
    },
  ];

  return (
    <Box>
      <Grid container>
        <Grid item md={3}>
          <Box className={classes.containerFirst}>
            <Grid container spacing={2} justifyContent="space-around">
              <Grid item>
                <>
                  <Grid container direction="column" alignItems="center">
                    <Grid item>
                      <Typography className={classes.typoRankTitle}>
                        Your Rank
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.typoRank}>03</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Out of 75</Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item>
                <>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography className={classes.typoRankTitle}>
                        Your Score
                      </Typography>
                    </Grid>
                    <Grid item container alignItems="baseline">
                      <Typography className={classes.typoRank}>25</Typography>
                      <Typography className={classes.typoTotalNumber}>
                        /30
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.typoRankTitle}>
                        Accuracy
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      justifyContent="center"
                      className={classes.accuracyContainer}
                    >
                      <Typography className={classes.typoRankTitle}>
                        90.5%
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
            <QuizAnalysis />
          </Box>
        </Grid>
        <Grid item md={9}>
          <Box className={classes.containerFirst}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <KenTabs data={tabs} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
