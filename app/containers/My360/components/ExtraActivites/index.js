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
import FlagIcon from '../../../../assets/svg/my360/extraActivites/flag.svg';
import KenSelect from '../../../../global_components/KenSelect';
import KenLoader from '../../../../components/KenLoader';
import { getContactAdditionalInfoDataExtra } from '../../../../utils/ApiService';
import KenButton from '../../../../global_components/KenButton';
// import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExtraAdd from './ExtraAdd';

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.KenColors.link1,
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '20px',
    marginBottom: 24,
  },
  payLaterButton: {
    marginRight: '15px',
    fontFamily: 'Work Sans',
    fontSize: '16px',
    fontWeight: '500',
    color: '#193389',
    textTransform: 'capitalize',
  },
  ctaButton: {
    marginTop: '30px',
    // marginBottom: '15px',
    // paddingBottom: '20px',
  },
  contentEnd: {
    display: 'flex',
    justifyContent: 'end',
  },
  payNowButton: {
    // marginRight: '15px',
    fontFamily: 'Work Sans',
    fontSize: '16px',
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
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
}));
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);
// const data = [
//   {
//     category: 'Clubs',
//     icon: FootballIcon,
//     data: [
//       {
//         clubName: 'Club Name',
//         facultyIncharge: 'Faculty Incharge',
//         isParticipant: 'Participant',
//       },
//       {
//         clubName: 'Club Name',
//         facultyIncharge: 'Faculty Incharge',
//         isParticipant: 'Non Participant',
//       },
//       {
//         clubName: 'Club Name',
//         facultyIncharge: 'Faculty Incharge',
//         isParticipant: 'Participant',
//       },
//     ],
//   },
//   {
//     category: 'Sports',
//     icon: SportsIcon,
//     data: [
//       {
//         clubName: 'Club Name',
//         facultyIncharge: 'Faculty Incharge',
//         isParticipant: 'Participant',
//       },
//       {
//         clubName: 'Club Name',
//         facultyIncharge: 'Faculty Incharge',
//         isParticipant: 'Non Participant',
//       },
//       {
//         clubName: 'Club Name',
//         facultyIncharge: 'Faculty Incharge',
//         isParticipant: 'Participant',
//       },
//     ],
//   },
// ];

export default function ExtraActivites({ profile }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState();
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [category, setCategory] = useState([]);
  const [loader, setLoader] = useState();

  useEffect(() => {
    if (profile?.ContactId) {
      setLoader(true);
      getContactAdditionalInfoDataExtra(profile?.ContactId)
        .then(res => {
          console.log(res);
          setLoader(false);
          setData({ ...res?.data });
          setCategory(Object.keys(res?.data));
          setSelectedCategory(res?.data[Object.keys(res?.data)[0]]);
        })
        .catch(err => {
          console.log(err);
          setLoader(false);
        });
    }
  }, [profile]);

  return (
    <Box mt={2}>
      {loader === true && <KenLoader />}
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
                            className={classes.categoryContainer}
                            onClick={() => {
                              setSelectedCategory(data[el]);
                              setSelectedCategoryTitle(el);
                            }}
                          >
                            <Grid item>
                              {el === 'Sports' ? (
                                <img src={FootballIcon} />
                              ) : (
                                <img src={FlagIcon} />
                              )}
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
                  <Typography style={{ padding: 16 }}>
                    {' '}
                    No Data Found
                  </Typography>
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
                  {selectedCategoryTitle || 'Extra Curricular Activities'}
                </Typography>
              </Grid>
              <Grid item>
                <KenButton
                  variant="primary"
                  onClick={handleClickOpen}
                  // onClick={() => {
                  //   handleOpen(selectedCategoryTitle);
                  // }}
                  // disabled={selectedCategoryTitle === undefined}
                >
                  Add
                </KenButton>
                <Dialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                >
                  <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    Add Achievements
                  </DialogTitle>
                  <DialogContent style={{ width: '400px' }}>
                    <ExtraAdd />
                    <Grid
                      container
                      className={`${classes.ctaButton} ${classes.contentEnd}`}
                    >
                      <KenButton
                        onClick={handleClose}
                        autoFocus
                        buttonClass={classes.payLaterButton}
                      >
                        Cancel
                      </KenButton>{' '}
                      <KenButton
                        // onClick={postCurruntInviExamantionReject}
                        autoFocus
                        variant="contained"
                        buttonClass={classes.payNowButton}
                      >
                        Submit
                      </KenButton>
                    </Grid>
                  </DialogContent>
                  {/* <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                      Save changes
                    </Button>
                  </DialogActions> */}
                </Dialog>
              </Grid>
            </Grid>
            <Grid container spacing={2} direction="column">
              {selectedCategory && selectedCategory.length > 0 ? (
                selectedCategory?.map(el => {
                  return (
                    <Grid item>
                      <>
                        <Grid
                          container
                          direction="row"
                          // justifyContent="space-between"
                          alignItems="center"
                          className={classes.cardContainer}
                        >
                          {' '}
                          <Grid item style={{ marginRight: '15px' }}>
                            <img src={FlagIcon} />
                          </Grid>
                          <Grid item>
                            <>
                              <Grid container direction="column" spacing={1}>
                                {/* <Grid item>
                                  <img src={FlagIcon} />
                                </Grid> */}
                                <Grid item>
                                  <Typography className={classes.typoClubName}>
                                    {el?.ClubName}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography
                                    className={classes.typoFacultyIncharge}
                                  >
                                    {el?.FacultyIncharge}
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography
                                    className={
                                      el.Participation === 'Participant'
                                        ? classes.typoIsParticipantGreen
                                        : classes.typoIsParticipantYellow
                                    }
                                  >
                                    {el?.Participation}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </>
                          </Grid>
                        </Grid>
                      </>
                    </Grid>
                  );
                })
              ) : (
                <Typography>No Data Found</Typography>
              )}
            </Grid>
          </BaseCard>
        </Grid>
      </Grid>
    </Box>
  );
}
