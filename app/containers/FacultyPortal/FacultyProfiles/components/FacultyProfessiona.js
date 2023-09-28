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

const FacultyProfessiona = ({}) => {
  // const [data, setData] = useState(state);
  const classes = useStyles();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const idGenerater = () => {
    let id = Math.random()
      .toString(36)
      .substr(2, 9);
    return id;
  };
  const [facultyProfessionDetails, setFacultyProfssionDetails] = React.useState(
    [
      {
        res: {
          attributes: {
            type: 'hed__Relationship__c',
            url:
              '/services/data/v54.0/sobjects/hed__Relationship__c/a0N1y000003WFh2EAG',
          },
          Id: idGenerater(),
          name: '',
          link: '',
        },
      },
    ]
  );

  const [facultyProfessionPage, setFacultyProfessionPage] = useState(
    facultyProfessionDetails
  );
  const [relationshipAcc, setRelationshipAcc] = useState(true);
  const [deleteRow, setDeleteRow] = useState(false);

  const handleChangeRelation = (evt, i) => {
    console.log('evt.name', evt);
    setFacultyProfessionPage(
      facultyProfessionPage.map((e, index) => {
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

  // function handleChangeInput(evt) {
  //   const value = evt.target.value;
  //   console.log('vvvvvvvvvvvv', value);
  //   // setData({
  //   //   ...data,
  //   //   [evt.target.name]: value,
  //   // });
  // }

  const addRow = () => {
    setFacultyProfessionPage(prevState => {
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
            name: '',
            link: '',
          },
        },
      ];
    });
  };

  const deleteRowHandle = i => {
    setFacultyProfessionPage(prev => {
      return prev.filter(ab => {
        return ab.res.Id !== i;
      });
    });
  };

  useEffect(() => {
    setFacultyProfessionPage(facultyProfessionDetails);
  }, [facultyProfessionDetails]);
  return (
    <div>
      <Box>
        <Grid item xs={12} sm={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} />
            {facultyProfessionPage.map((relData, index) => {
              return (
                <>
                  <Grid item xs={12} sm={4}>
                    <KenInputField
                      label="Name"
                      name="name"
                      value={relData.res.name}
                      dropdownColor="#FFFFFF"
                      onChange={e => handleChangeRelation(e, index)}
                    />
                    {/* {relationshipAcc ? (
                      <KenInputField
                        label="Name"
                        name="name"
                        value={relData.res.name}
                        dropdownColor="#FFFFFF"
                        onChange={e => handleChangeRelation(e, index)}
                      />
                    ) : (
                      <>
                        <Typography>
                          <b>Parent Information</b>
                        </Typography>
                        <br />
                        {relData.res.name}
                      </>
                    )} */}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <KenInputField
                      label="Link"
                      name="link"
                      value={relData.res.link}
                      dropdownColor="#FFFFFF"
                      onChange={e => handleChangeRelation(e, index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3} style={{ marginTop: 23 }}>
                    {index === facultyProfessionPage.length - 1 && index !== 0 && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteForeverIcon />}
                          onClick={e => deleteRowHandle(relData.res.Id)}
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
          </Grid>
          <Grid item xs={12} sm={3} style={{ marginTop: 23 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={e => addRow(e)}
            >
              + Add Row
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default FacultyProfessiona;
