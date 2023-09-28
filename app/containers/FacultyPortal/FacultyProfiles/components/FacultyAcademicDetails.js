import React, { useEffect, useState } from 'react';
import {
  Box,
  makeStyles,
  Paper,
  Typography,
  Grid,
  Divider,
  ButtonBase,
  Button,
} from '@material-ui/core';
import KenInputField from '../../../../components/KenInputField';
import { AiOutlinePlus } from 'react-icons/ai';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  box1: {
    // maxWidth: 832,
    // minWidth: 400,
    position: 'relative',
  },
  healthGrid: {
    marginTop: theme.spacing(2),
  },
  grid: {
    minWidth: '13.8vw',
  },
  detailTitle1: {
    fontWeight: 600,
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.KenColors.neutral100,
    textTransform: 'uppercase',
  },
  back: {
    fontSize: '12px',
    '&:hover': {
      cursor: 'pointer',
    },
    marginLeft: '-8px',
  },
  iconBack: {
    height: 12,
  },
  loader: {
    minHeight: '100vh',
    minWidth: '100vh',
  },
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
  },
  boxContainer: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
    marginTop: '26px',
    paddingTop: '62px',
    paddingBottom: '30px',
  },
  boxContainer1: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
    marginTop: '26px',
  },
  imageSection: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
    marginTop: '26px',
  },
  innerTitle: {
    fontSize: 16,
    marginTop: '30px',
  },
  subHeaderTitle: {
    width: '100%',
  },
  ButtonStyle: {
    marginTop: '10px',
  },
}));

const FacultyAcademicDetails = ({ academicDetails, setAcademicDetails }) => {
  const [data, setData] = useState(academicDetails);
  const [academicDetailsPage, setAcademicDetailsPage] = useState(
    academicDetails
  );

  const idGenerater = () => {
    let id = Math.random()
      .toString(36)
      .substr(2, 9);
    return id;
  };
  const classes = useStyles();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handleChangeAcademic = (evt, i) => {
    console.log('evt.name', evt);
    setAcademicDetailsPage(
      academicDetailsPage.map((e, index) => {
        if (i == index) {
          return {
            ...e,
            res: { ...e.res, [evt.target.name]: evt.target.value },
          };
        } else {
          return { ...e, res: e.res };
        }
      })
    );
  };

  const addAcademicRow = () => {
    console.log('academicDetailsPage', academicDetailsPage);
    setAcademicDetailsPage(prevState => {
      return [
        ...prevState,
        {
          res: {
            attributes: {
              type: 'hed__Relationship__c',
              url:
                '/services/data/v54.0/sobjects/hed__Relationship__c/a0N1y000003WFh2EAG',
            },
            Id: idGenerater(),
            Qualification: '',
            Major: '',
            University: '',
            Year: '',
          },
        },
      ];
    });

    // setDeleteRow(true);
  };

  function handleChangeInput(evt) {
    const value = evt.target.value;
    console.log('vvvvvvvvvvvv', value);
    setData({
      ...data,
      [evt.target.name]: value,
    });
  }

  const deleteAcademicDetails = i => {
    setAcademicDetailsPage(prev => {
      return prev.filter(ab => {
        return ab.res.Id !== i;
      });
    });

    // ab.splice(i, 1);
    // setDeleteRow(true);
    // setDeleteRow(false);
  };

  useEffect(() => {
    setAcademicDetailsPage(academicDetails);
    // setRelationShipDetails([
    //   {
    //     res: {
    //       name: 'ab',
    //       link: 'sassa',
    //     },
    //   },
    // ]);
  }, [academicDetails]);
  return (
    <div>
      <Grid item xs={12} sm={12}>
        {/* <Typography variant="h6" className={classes.innerTitle}>
          Temporary Address
        </Typography>{' '} */}
        <Grid container spacing={2}>
          {academicDetailsPage?.map((academicData, index) => {
            return (
              <>
                <Grid item xs={12} sm={2}>
                  <KenInputField
                    label="Qualification"
                    name="qualification"
                    // value={'Qualification'}
                    value={academicData.res.qualification}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <KenInputField
                    label="Major /Minor"
                    name="major"
                    // value={'Major /Minor'}
                    value={academicData.res.major}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <KenInputField
                    label="University"
                    name="university"
                    // value={'University'}
                    value={academicData.res.university}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <KenInputField
                    label="Year"
                    name="year"
                    // value={'Year'}
                    value={academicData.res.year}
                    dropdownColor="#FFFFFF"
                    onChange={e => {
                      handleChangeInput(e);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3} style={{ marginTop: 23 }}>
                  {index === academicDetailsPage.length - 1 && index !== 0 && (
                    <>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForeverIcon />}
                        onClick={e =>
                          deleteAcademicDetails(academicData.res.Id)
                        }
                      >
                        {console.log('index1231', index)}
                        Delete
                      </Button>
                    </>
                  )}
                  {/* {relationshipAcc ? (
                      <KenInputField
                        label="Link"
                        name="link"
                        value={relData.res.link}
                        dropdownColor="#FFFFFF"
                        onChange={e => handleChangeRelation(e, index)}
                      />
                    ) : (
                      <>
                        <Typography>
                          <b>Qualification</b>
                        </Typography>
                        <br />
                        {relData.res.link}
                      </>
                    )} */}
                </Grid>
              </>
            );
          })}

          <Grid item xs={12} sm={3} style={{ marginTop: 23 }}>
            <Button
              onClick={addAcademicRow}
              variant="contained"
              color="primary"
              startIcon={<AiOutlinePlus />}
            >
              Add Row
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default FacultyAcademicDetails;
