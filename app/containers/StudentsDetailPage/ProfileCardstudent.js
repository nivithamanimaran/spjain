import {
  Divider,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePic from '../../assets/avatar.png';
import KenButton from '../../global_components/KenButton';
import { getStudentInfo } from '../../utils/ApiService';

const useStyles = makeStyles(theme => ({
  typoProfile: {
    color: theme.palette.KenColors.link1,
    fontSize: 14,
    fontWeight: 500,
  },
  typoName: {
    color: theme.palette.KenColors.kenBlack,
    fontSize: 24,
    fontWeight: 600,
  },
  divider: {
    background: '#F1F5F8',
    height: '2px',
  },
  header: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 11,
    color: theme.palette.KenColors.kenBlack,
  },
  subHeading: {
    fontWeight: 400,
    fontSize: 16,
    color: theme.palette.KenColors.kenBlack,
  },
  statusGreen: {
    fontWeight: 600,
    fontSize: 12,
    background: 'rgba(82, 193, 90, 0.27)',
    borderRadius: 4,
    padding: 4,
    width: 'fit-content',
  },
  statusYellow: {
    fontWeight: 600,
    fontSize: 12,
    background: 'rgba(255, 203, 20, 0.31)',
    borderRadius: 4,
    padding: 4,
    width: 'fit-content',
  },
}));

export default function ProfileCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { contactId } = useParams();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setDatass] = useState({
    Course: [],
    attachment: [],
  });

  useEffect(() => {
    const ContactId = contactId;
    getStudentInfo(ContactId).then(res => {
      // let data=Object.entries(rs.data.courseOffering)[0][1];
      setDatass(res);
    });
  }, []);
  // console.log(data, 'nnnnnnnnn');

  return (
    <div>
      {!isMobileScreen ? (
        <Grid container spacing={2} direction="column">
          <Grid item container spacing={2} alignItems="baseline">
            <Grid item>
              <Typography className={classes.typoName}>
                {data?.firstName + ' ' + data?.lastName}
              </Typography>
            </Grid>
            {/* <Grid item>
                <Typography className={classes.typoProfile}>
                  View full profile ››
                </Typography>
              </Grid> */}
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item container spacing={5} direction="row">
            <Grid
              item
              container
              spacing={4}
              md={6}
              direction="row"
              style={{ alignItems: 'center' }}
            >
              <Grid item md={3} style={{ marginRight: '20px' }}>
                <img
                  src={
                    data?.attachment[0]?.attachmentBody
                      ? `data:image/${data?.attachment[0]?.attachmentContentType?.toLowerCase()};base64,` +
                        data?.attachment[0]?.attachmentBody
                      : ProfilePic
                  }
                  style={{
                    width: '105px',
                    height: '110px',
                    borderRadius: '12px',
                  }}
                />
              </Grid>
              <Grid item container md={8} spacing={3} direction="column">
                <Grid item>
                  <Typography className={classes.header}>Course</Typography>
                  <Typography className={classes.subHeading}>
                    {data?.Course[0]?.cou.Course_Name__c}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.header}>ID NUMBER</Typography>
                  <Typography className={classes.subHeading}>
                    {data?.IDNUmber}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container spacing={4} md={3} direction="row">
              <Grid item md={6}>
                <Typography className={classes.header}>Semester</Typography>
                <Typography className={classes.subHeading}>
                  {data?.Course[0]?.cou.Semesters__c}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Typography className={classes.header}>Attendance</Typography>
                <Typography className={classes.subHeading}>
                  {data?.Course[0]?.cou.Attendacne__c}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Typography className={classes.header}>GPA</Typography>
                <Typography className={classes.subHeading}>
                  {data?.Course[0]?.cou.hed__Grade__c}
                </Typography>
              </Grid>
              <Grid item md={6}>
                <Typography className={classes.header}>
                  Total credits
                </Typography>
                <Typography className={classes.subHeading}>8</Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              spacing={4}
              md={3}
              justifyContent="center"
              direction="row"
            >
              <Grid container justifyContent="center" item md={12}>
                <Grid>
                  <Typography className={classes.header}>Status</Typography>
                  <Typography className={classes.statusGreen}>
                    On Track
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="center"
                item
                md={12}
                style={{ marginLeft: '48px' }}
              >
                <Grid>
                  <Typography className={classes.header}>
                    AFFILIATION STATUS
                  </Typography>
                  <Typography className={classes.statusGreen}>
                    Active
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} direction="column">
          <Grid item container spacing={2} alignItems="baseline">
            <Grid item>
              <Typography className={classes.typoName}>
                Mrinalini Santosh
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                style={{ cursor: 'pointer' }}
                className={classes.typoProfile}
              >
                View full profile ››
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid item container spacing={5} direction="row">
            <Grid item container spacing={4} md={6} direction="row">
              <Grid item container spacing={2} md={12}>
                <Grid item md={3}>
                  <img src={ProfilePic} width={60} />
                </Grid>
                <Grid item md={9}>
                  <Typography className={classes.header}>Course</Typography>
                  <Typography className={classes.subHeading}>
                    Bachelors of Business Administration
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container md={9} spacing={2} direction="column">
                <Grid item container justifyContent="space-between">
                  <Grid item>
                    <Typography className={classes.header}>Semester</Typography>
                    <Typography className={classes.subHeading}>III</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.header}>
                      Attendance
                    </Typography>
                    <Typography className={classes.subHeading}>77%</Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.header}>GPA</Typography>
                    <Typography className={classes.subHeading}>3.9</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item md={1} /> */}
            <Grid item container spacing={3} md={6} direction="column">
              <Grid item container justifyContent="space-between" spacing={2}>
                <Grid item>
                  <Typography className={classes.header}>Status</Typography>
                  <Typography className={classes.statusGreen}>
                    On Track
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.header}>
                    VISA STATUS
                  </Typography>
                  <Typography className={classes.statusYellow}>
                    Action Required
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.header}>
                    AFFILIATION STATUS
                  </Typography>
                  <Typography className={classes.statusGreen}>
                    Active
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container justifyContent="space-between">
                <Grid item zeroMinWidth={true}>
                  <KenButton variant="primary">View ID Card</KenButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
