import React, { useState } from 'react';
import {
  Divider,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ProfilePic from '../../assets/avatar.png';
import { getSignature } from '../../utils/ApiService';
import { KEY_FACULTY_PROFILE_IMAGE } from '../../utils/constants';
const KenButton = React.lazy(() => import('../../global_components/KenButton'));


const useStyles = makeStyles(theme => ({

  typoName: {
    color: theme.palette.KenColors.kenBlack,
    fontSize: 24,
    fontWeight: 600,
    marginTop: -14,
    [theme.breakpoints.up('xs')]: {
      marginTop: -5,
      fontSize: 18,
    },
  },
  divider: {
    background: '#F1F5F8',
    height: '2px',
    marginTop: -8,
  },
  header: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 11,
    color: theme.palette.KenColors.kenBlack,
    textAlign: 'left',
  },
  subHeading: {
    fontWeight: 400,
    fontSize: 16,
    color: theme.palette.KenColors.kenBlack,
    [theme.breakpoints.up('xs')]: {
      textAlign: 'start',
    },
  },
  statusGreen: {
    fontWeight: 600,
    fontSize: 12,
    background: 'rgba(82, 193, 90, 0.27)',
    borderRadius: 4,
    padding: 4,
    width: 'fit-content',
  },

}));

export default function ProfileCard(props) {
  const { profile, contactInfo, back } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [uploadedProfilePicture, setUploadedProfilePicture] = useState();
  const courseInfo = contactInfo?.Course?.find(
    el => el.cou?.hed__Status__c === 'Current'
  )?.cou;

  const attendance = contactInfo?.overallPresentPercentage;

  const semester = contactInfo?.semester?.split('-')[3];

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    if (user.Type === 'Faculty') {
      getSignature(user?.ContactId, KEY_FACULTY_PROFILE_IMAGE.TYPE).then(
        res => {
          const length = res?.files?.length;
          const lastElementOfFiles = res?.files[length - 1];
          setUploadedProfilePicture(lastElementOfFiles);
        }
      );
    }
  }, []);



  return (
    <div>
      {!isMobileScreen ? (
        <Grid container spacing={2} direction="column">
          <Grid item container alignItems="center">
            {back === true && (
              <Grid item>
                <ArrowBackIosIcon
                  onClick={() => {
                    history.back();
                  }}
                  style={{ marginTop: -8, marginRight: 8 }}
                />
              </Grid>
            )}
            <Grid item>
              <Typography className={classes.typoName}>
                {(profile && profile?.Name) || contactInfo
                  ? (contactInfo?.firstName === undefined
                    ? ''
                    : contactInfo?.firstName) +
                  ' ' +
                  (contactInfo?.lastName === undefined
                    ? ''
                    : contactInfo?.lastName)
                  : ''}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>

          {profile?.Type !== 'Faculty' ? (

            <Grid item container>
              <Grid item md={2}>
                {contactInfo && contactInfo?.attachment?.length > 0 ? (
                  <img
                    src={`data:image/png;base64, ${contactInfo?.attachment[
                      contactInfo?.attachment.length - 1
                    ]?.attachmentBody
                      }`}
                    style={{
                      width: '105px',
                      height: '110px',
                      borderRadius: '12px',
                    }}
                    marginLeft={-10}
                    alt="Profile Picture"
                  />
                ) : (
                  <img
                    src={ProfilePic}
                    style={{
                      width: '105px',
                      height: '110px',
                      borderRadius: '12px',
                    }}
                    alt="Profile Picture"
                  />
                )}
              </Grid>
              <Grid item md={8}>
                <Grid item container spacing={3} >
                  <Grid item md={4}>
                    <Typography className={classes.header}>Program</Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.departmnt || 'NA'}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>
                      Semester
                    </Typography>
                    <Typography className={classes.subHeading}>
                      {semester?.split(' ')[1] || 'NA'}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>
                      Attendance
                    </Typography>
                    <Typography className={classes.subHeading}>
                      {attendance + '%' || 'NA'}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>GPA</Typography>
                    <Typography className={classes.subHeading}>
                      {courseInfo?.hed__Grade__c || 'NA'}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>
                      ID Number
                    </Typography>
                    <Typography className={classes.header}>
                      {contactInfo?.IDNUmber || 'NA'}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>Campus</Typography>
                    <Typography>{contactInfo?.Campus}</Typography>

                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={2}/>

            </Grid>

          ) : (

            <Grid item container >
              <Grid item md={2}>
                {contactInfo &&
                  contactInfo?.attachment &&
                  contactInfo?.attachment[0] &&
                  contactInfo?.attachment[0]?.attachmentBody ? (
                  <img
                    src={`data:image/png;base64, ${uploadedProfilePicture?.body
                      }`}
                    style={{
                      width: '105px',
                      height: '110px',
                      borderRadius: '12px',
                    }}
                    marginLeft={-10}
                  />
                ) : (
                  <img src={ProfilePic} width={109} />
                )}
              </Grid>
              <Grid item md={8}>
                <Grid item container spacing={3}>
                  <Grid item md={4}>
                    <Typography className={classes.header}>
                      Area of Expertise
                    </Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.departmnt}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>
                      ID NUMBER
                    </Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.IDNUmber}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>
                      courses
                    </Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.Courses}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>Status</Typography>
                    <Typography
                      style={{ width: '64px' }}
                      className={classes.statusGreen}
                    >
                      {contactInfo?.Status || 'NA'}
                    </Typography>

                  </Grid>
                  <Grid item md={4}>
                    <Typography className={classes.header}>Campus</Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.Campus}
                    </Typography>

                  </Grid>

                </Grid>

              </Grid>
              <Grid item md={2}/>

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
          </Grid>
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          {profile?.Type !== 'Faculty' ? (
            <Grid item container spacing={5} direction="row">
              <Grid item container spacing={4} md={6} direction="row">
                <Grid item container spacing={2} md={12}>
                  <Grid item md={3} style={{ marginRight: '24px' }}>
                    {contactInfo && contactInfo?.attachment?.length > 0 ? (
                      <img
                        src={`data:image/png;base64, ${contactInfo?.attachment[
                          contactInfo?.attachment.length - 1
                        ]?.attachmentBody
                          }`}
                        style={{
                          width: '105px',
                          height: '110px',
                          borderRadius: '12px',
                        }}
                        marginLeft={-10}
                        alt="Profile Picture"
                      />
                    ) : (
                      <img
                        src={ProfilePic}
                        style={{
                          width: '105px',
                          height: '110px',
                          borderRadius: '12px',
                        }}
                        alt="Profile Picture"
                      />
                    )}
                  </Grid>
                  <Grid item md={6} xs={4}>
                    <Typography className={classes.header}>Program</Typography>
                    <Typography className={classes.subHeading}>
                      {contactInfo?.departmnt || 'NA'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container md={9} spacing={2} direction="column">
                  <Grid item container justifyContent="space-between">
                    <Grid item xs={6} style={{ marginBottom: '20px' }}>
                      <Typography className={classes.header}>
                        Semester
                      </Typography>
                      <Typography className={classes.subHeading}>IV</Typography>
                    </Grid>
                    <Grid item xs={6} style={{ marginBottom: '20px' }}>
                      <Typography className={classes.header}>
                        Attendance
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {attendance + '%' || 'NA'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ marginBottom: '20px' }}>
                      <Typography className={classes.header}>GPA</Typography>
                      <Typography className={classes.subHeading}>
                        {courseInfo?.hed__Grade__c || 'NA'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ marginBottom: '20px' }}>
                      <Typography className={classes.header}>
                        ID NUMBER
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.IDNUmber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography className={classes.header}>Campus</Typography>
                      <Typography>{contactInfo?.Campus}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {profile?.Type !== 'Faculty' && (
                        <KenButton variant="primary">View ID Card</KenButton>
                      )}
                    </Grid>
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
                alignItems="center"
                gap="12px"
              >
                <Grid item md={3} style={{ marginRight: '24px' }}>
                  {contactInfo &&
                    contactInfo?.attachment &&
                    contactInfo?.attachment[0] &&
                    contactInfo?.attachment[0]?.attachmentBody ? (
                    <img
                      src={`data:image/png;base64, ${uploadedProfilePicture?.body
                        }`}
                      style={{
                        width: '105px',
                        height: '110px',
                        borderRadius: '12px',
                      }}
                      marginLeft={-10}
                      alt="Profile Picture"
                    />
                  ) : (
                    <img src={ProfilePic} width={109} alt="Profile Picture" />
                  )}
                </Grid>
                <Grid
                  item
                  container
                  md={9}
                  spacing={3}
                  direction="column"
                  style={{ alignItems: 'center' }}
                >
                  <Grid item container justifyContent="space-between">
                    <Grid item md={8}>
                      <Typography className={classes.header}>
                        Area of Expertise
                      </Typography>
                      <Typography className={classes.subHeading}>
                        {contactInfo?.departmnt}
                      </Typography>
                    </Grid>
                    <Grid item md={4}>
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
                    <Grid item md={4} style={{ marginRight: '20px' }}>
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
              <Grid item container spacing={3} md={6} direction="column">
                <Grid item container justifyContent="space-between">
                  <Grid item zeroMinWidth={true}>
                    <Typography className={classes.header}>
                      AFFILIATION STATUS
                    </Typography>
                    <Typography className={classes.statusGreen}>
                      {contactInfo !== undefined &&
                        contactInfo?.length > 0 &&
                        contactInfo?.Affilation?.[0]?.affili?.hed__Status__c ===
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
