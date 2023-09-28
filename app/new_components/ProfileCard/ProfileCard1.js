import {
  Box,
  Divider,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ProfilePic from '../../assets/avatar.png';
import React from 'react';
import KenButton from '../../global_components/KenButton';

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

export default function ProfileCard1(props) {
  const { profile, contactInfo } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const courseInfo = contactInfo?.Course?.find(
    el => el.cou?.hed__Status__c === 'Current'
  )?.cou;

  const attendance =
    contactInfo?.Course?.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue?.cou?.Attendacne__c || 0),
      0
    ) / contactInfo?.Course?.length;

  return (
    <div>
      {!isMobileScreen ? (
        <Grid container spacing={2} direction="column">
          <Grid item container spacing={2} alignItems="baseline">
            <Grid item>
              <Typography className={classes.typoName}>
                {profile?.Name}
              </Typography>
            </Grid>
            <Grid item>
            
            </Grid>{' '}
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>

          {profile?.Type !== 'Faculty' ? (
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
                  {f ? (
                    <img
                      src={`data:image/*;base64,${
                        contactInfo?.attachment[0]?.attachmentBody
                      }`}
                      style={{
                        width: '105px',
                        height: '110px',
                        borderRadius: '12px',
                      }}
                    />
                  ) : (
                    <img src={ProfilePic} width={60} />
                  )}
                </Grid>
                <Grid item container md={9} spacing={3} direction="column">
                  <Grid item>
                    <Typography className={classes.header}>
                      Department
                    </Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.departmnt}
                    </Typography>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Grid item>
                      <Typography className={classes.header}>
                        Semester
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {courseInfo?.Semesters__c}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.header}>
                        Attendance
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {attendance.toFixed(2) || 0}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.header}>GPA</Typography>
                      <Typography className={classes.subHeading}>
                        {courseInfo?.hed__Grade__c}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item md={1} /> */}
              <Grid item container spacing={3} md={6} direction="column">
                <Grid item container justifyContent="space-between" spacing={2}>
                  <Grid item>
                   
                  </Grid>
                  <Grid item>
                   
                  </Grid>
                  <Grid item>
                    <KenButton variant="primary">View ID Card</KenButton>
                  </Grid>
                </Grid>
                <div style={{ display: 'flex', marginLeft: '12px' }}>
                  <Grid item>
                   
                  </Grid>
                  <Grid
                    style={{ marginLeft: '65px' }}
                    item
                    container
                    justifyContent="space-between"
                  >
                    <Grid item zeroMinWidth={true}>
                      
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          ) : (
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
                  {contactInfo ? (
                    <img
                      src={`data:image/*;base64,${
                        contactInfo?.attachment[0]?.attachmentBody
                      }`}
                      style={{
                        width: '105px',
                        height: '110px',
                        borderRadius: '12px',
                      }}
                    />
                  ) : (
                    <img src={ProfilePic} width={60} />
                  )}
                </Grid>
                <Grid item container md={9} spacing={3} direction="column">
                  <Grid item container justifyContent="space-between">
                    <Grid item md={8}>
                      <Typography className={classes.header}>
                        DEPARTMENT
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.departmnt}
                      </Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Typography className={classes.header}>
                        ID NUMBER
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.IDNUmber}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Grid item md={8}>
                      <Typography className={classes.header}>role</Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.Role}
                      </Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Typography className={classes.header}>
                        courses
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo && contactInfo?.Courses}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
          
              <Grid
                item
                container
                spacing={3}
                md={6}
                direction="column"
                style={{ marginLeft: 20 }}
              >
                <Grid item container justifyContent="space-between">
                  <Grid item zeroMinWidth={true}>
                    <Typography className={classes.header}>
                      AFFILIATION STATUS
                    </Typography>
                    <Typography className={classes.statusGreen}>
                      {contactInfo?.Affilation.length > 0 &&
                      contactInfo?.Affilation[0]?.affili?.hed__Status__c ===
                        'Former'
                        ? 'InActive'
                        : 'Active'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid container spacing={2} direction="column">
          <Grid item container spacing={2} alignItems="baseline">
            <Grid item>
              <Typography className={classes.typoName}>
                {profile?.Name}
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
            <Grid item container justifyContent="space-between">
              <Grid item zeroMinWidth={true}>
                <KenButton variant="primary">View ID Card</KenButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          {profile?.Type !== 'Faculty' ? (
            <Grid item container spacing={5} direction="row">
              <Grid item container spacing={4} md={6} direction="row">
                <Grid item container spacing={2} md={12}>
                  <Grid item md={3}>
                    <img src={ProfilePic} width={60} />
                  </Grid>
                  <Grid item md={9}>
                    <Typography className={classes.header}>Course</Typography>
                    <Typography className={classes.subHeading}>
                      {courseInfo?.Course_Name__c}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container md={9} spacing={2} direction="column">
                  <Grid item container justifyContent="space-between">
                    <Grid item>
                      <Typography className={classes.header}>
                        Semester
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {courseInfo?.Semesters__c}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.header}>
                        Attendance
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {attendance.toFixed(2) || 0} %
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.header}>GPA</Typography>
                      <Typography className={classes.subHeading}>
                        {courseInfo?.hed__Grade__c}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            
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
                    {contactInfo?.VISASTATUS !== null && (
                      <Typography className={classes.statusYellow}>
                        {contactInfo?.VISASTATUS}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item>
                    <Typography className={classes.header}>
                      AFFILIATION STATUS
                    </Typography>
                    <Typography className={classes.statusGreen}>
                      {contactInfo?.Affilation?.length > 0 &&
                      contactInfo?.Affilation[0]?.affili?.hed__Status__c ===
                        'Former'
                        ? 'InActive'
                        : 'Active'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container justifyContent="space-between">
                  <Grid item zeroMinWidth={true}>
                    {profile?.Type !== 'Faculty' && (
                      <KenButton variant="primary">View ID Card</KenButton>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
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
                    src={ProfilePic}
                    style={{
                      width: '105px',
                      height: '110px',
                      borderRadius: '12px',
                    }}
                  />
                </Grid>
                <Grid item container md={9} spacing={3} direction="column">
                  <Grid item container justifyContent="space-between">
                    <Grid item md={8}>
                      <Typography className={classes.header}>
                        DEPARTMENT
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.departmnt}
                      </Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Typography className={classes.header}>
                        ID NUMBER
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.IDNUmber}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container justifyContent="space-between">
                    <Grid item md={8}>
                      <Typography className={classes.header}>role</Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.Role}
                      </Typography>
                    </Grid>
                    <Grid item md={3}>
                      <Typography className={classes.header}>
                        courses
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.Courses}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                container
                spacing={3}
                md={6}
                direction="column"
                style={{ marginLeft: 20 }}
              >
                <Grid item container justifyContent="space-between">
                  <Grid item zeroMinWidth={true}>
                    <Typography className={classes.header}>
                      AFFILIATION STATUS
                    </Typography>
                    <Typography className={classes.statusGreen}>
                      {contactInfo?.Affilation.length > 0 &&
                      contactInfo?.Affilation[0]?.affili?.hed__Status__c ===
                        'Former'
                        ? 'InActive'
                        : 'Active'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </div>
  );
}
