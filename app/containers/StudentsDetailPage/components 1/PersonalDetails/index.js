import { Box, Grid, makeStyles, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import ProfilePic from '../../../../assets/avatar.png';

const useStyles = makeStyles(theme => ({
  details: {
    [theme.breakpoints.only('xs')]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexDirection: 'column',
  },
  heading: {
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.KenColors.link1,
  },
  key: {
    fontSize: 11,
    fontWeight: 600,
    color: theme.palette.KenColors.kenBlack,
    opacity: '0.5',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    fontWeight: 500,
    color: theme.palette.KenColors.kenBlack,
    [theme.breakpoints.only('xs')]: {
      marginLeft: 4,
    },
  },
  container: {
    // [theme.breakpoints.up('sm')]: {
    //   maxHeight: 80,
    // },
    // [theme.breakpoints.only('sm')]: {
    //   maxHeight: 100,
    // },
  },
}));

export default function PersonalDetails() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = theme.breakpoints.only('xs');
  return (
    <Box mt={2} mb={5}>
     <Grid item container spacing={4} md={6} direction="row" style={{alignItems:"center"}}>
                            <Grid item md={3} style={{marginRight:"20px"}}>
          <img src={ProfilePic} style={{width:"105px",height:"110px",borderRadius:"12px"}}
                    />
        </Grid>
        <Grid item md={11} sm={10} xs={12}>
          <>
            <Grid container direction="column" spacing={2}>
              <Grid item md={12} sm={12}>
                <Typography className={classes.heading}>Bio</Typography>
              </Grid>
              <Grid item md={12} xs={12} className={classes.container}>
                <>
                  <Grid container justifyContent="space-between">
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              Name to be printed on degree
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Mrinalini Avinash Santhosh
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              First name
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Mrinalini
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              middle name
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Avinash
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              last name
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Santhosh
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>

                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              GEnder{' '}
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Male{' '}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={12} className={classes.container}>
                <>
                  <Grid container justifyContent="space-between">
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              Date of birth
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              12/08/1998
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              nationality
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Indian
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              country of residence
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              India
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              birth place
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              Bangalore
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                    <Grid item md={2} sm={2} xs={12}>
                      <>
                        <Grid container className={classes.details}>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.key}>
                              Emirates city
                            </Typography>
                          </Grid>
                          <Grid item md={12} sm={12} xs={6}>
                            <Typography className={classes.value}>
                              XYZ{' '}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item md={12}>
          <Typography className={classes.heading}>Health</Typography>
        </Grid>
        <Grid item md={12} className={classes.container}>
          <>
            <Grid container justifyContent="space-between">
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        Blood group
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>O+ve </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>Allergies</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Pollen, Weasing
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>Others</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Pollen, Weasing
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item md={12}>
          <Typography className={classes.heading}>Permanent Address</Typography>
        </Grid>
        <Grid item md={12} className={classes.container}>
          <>
            <Grid container justifyContent="space-between">
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        house/flat no
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>00/00 </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>road</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>suburb</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>country</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>India</Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>pin code</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>000000</Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item md={12}>
          <Typography className={classes.heading}>Current Address</Typography>
        </Grid>
        <Grid item md={12} className={classes.container}>
          <>
            <Grid container justifyContent="space-between">
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        house/flat no
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>00/00 </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>road</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>suburb</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>country</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>India</Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={2} sm={2} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>pin code</Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>000000</Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item md={12}>
          <Typography className={classes.heading}>Contact Details</Typography>
        </Grid>
        <Grid item md={12} className={classes.container}>
          <>
            <Grid container justifyContent="space-between">
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        Personal email id
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        xyz@gmail.com
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        alternate email id
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        xyz@gmail.com
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        Mobile number
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        0000000000
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        alternate Mobile number
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        0000000000
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item md={12}>
          <Typography className={classes.heading}>
            National ID Number
          </Typography>
        </Grid>
        <Grid item md={12} className={classes.container}>
          <>
            <Grid container justifyContent="space-between">
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        Passport number
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        0000000000
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        national id number
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        0000000000
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        tax file number(only for Australians)
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        0000000000
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        emirates id number{' '}
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        0000000000
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={2}>
        <Grid item md={12}>
          <Typography className={classes.heading}>
            Parent Information
          </Typography>
        </Grid>
        <Grid item md={12} className={classes.container}>
          <>
            <Grid container justifyContent="space-between">
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        Qualification
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        languages spoken at home
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        Qualification
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
              <Grid item md={3} sm={3} xs={12}>
                <>
                  <Grid container className={classes.details}>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.key}>
                        languages spoken at home
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={6}>
                      <Typography className={classes.value}>
                        Lorem ipsum is a dummy text
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              </Grid>
            </Grid>
          </>
        </Grid>
      </Grid>
    </Box>
  );
}
