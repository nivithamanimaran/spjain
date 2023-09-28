import { Button, Card, Grid, TextField, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import {
  deleteSubComponent,
  postCourseComponent,
  bbCourse,
} from '../../utils/ApiService';
import KenCheckbox from '../../global_components/KenCheckbox';
import KenDialog from '../../global_components/KenDialogBox';
import KenTextLabel from '../../global_components/KenTextLabel';
import KenSelect from '../../global_components/KenSelect';
import './add.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  addRowsCars: {
    padding: '10px',
    marginTop: '20px',
    [theme.breakpoints.down('xs')]: {
      padding: '5px',
      // marginTop: '20px',
    },
  },
  label: {
    padding: '10px 0px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '10px',
    },
  },
  viewEditSaveGrid: {
    display: 'flex',
    // justifyContent: 'end',
    marginTop: 18,
    position: 'relative',
    top: '-15px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '10px',
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  dialogText: {
    textAlign: 'center',
    fontSize: '20px',
    fontFamily: 'Work Sans',
    fontWeight: '500',
  },
  dialog: {
    '& .MuiDialogContent-dividers': {
      border: 'none !important',
    },
    '& .MuiDialogActions-root ': {
      justifyContent: 'center !important',
    },
    '& .MuiPaper-root.MuiDialog-paper.MuiDialog-paperScrollPaper.MuiDialog-paperWidthSm.MuiDialog-paperFullWidth.MuiPaper-elevation24.MuiPaper-rounded': {
      maxWidth: '30% !important',
    },
    '& .MuiButton-outlinedPrimary': {
      border: 'none !important',
    },
  },
  addSub: {
    background: '#193389',
    color: 'white',
    borderRadius: '8px',
    textTransform: 'capitalize',
  },
}));

const AddRows = props => {
  const { componentData, setLoading, trigger, setTrigger, status } = props;
  const [data, setData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [value, setValue] = useState('');
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    if (componentData?.length > 0) {
      setData(componentData);
    }
  }, [componentData, trigger]);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (text, item, i, index) => {
    if (text === 'save') {
      let newArr = [...data];
      handleSaveClick(i);
      setData(newArr);
      if (deletedData?.length > 0) {
        handleDelete(deletedData);
      }
      // if (checkedData?.length > 0) {
      //   bbCourse(checkedData)
      //     .then(res => {
      //       console.log(res);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // }
      setDialogOpen(false);
    }
  };

  const handleAddClick = (i, evaluation) => {
    if (
      data[i]['Course_Subcomponents__r'] &&
      data[i]['Course_Subcomponents__r']['records']
    ) {
      let dataContent = [...data];
      dataContent[i]['Course_Subcomponents__r']['records'].push({
        Id: '',
        Name: '',
        Maximum_Marks_for_the_Sub_Component__c: '',
        Sub_Component_Weightage__c: '',
        Integrate_with_Black_Board__c: false,
        Integrate_with_Mettle__c: false,
        evaluation: evaluation,
      });
      dataContent[i]['expanded'] = true;
      setData(dataContent);
    } else {
      let dataContent = [...data];
      let newArr = {
        records: [],
      };
      newArr.records.push({
        Id: '',
        Name: '',
        Maximum_Marks_for_the_Sub_Component__c: '',
        Sub_Component_Weightage__c: '',
        Integrate_with_Black_Board__c: false,
        Integrate_with_Mettle__c: false,
        evaluation: evaluation,
      });
      dataContent[i]['Course_Subcomponents__r'] = newArr;
      dataContent[i]['expanded'] = true;
      setData(dataContent);
    }
  };

  const handleDelete = id => {
    handleDialogOpen();
    setLoading(true);
    console.log('deletedData', id);
    deleteSubComponent(id)
      .then(res => {
        console.log(res);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleChange = (e, index, i) => {
    const { name, value } = e.target;
    let dataContent = [...data];
    let filterVal;
    if (name !== 'Name') {
      if (/^\d*\.?\d*$/.test(value)) {
        filterVal = value;
      }
    } else {
      filterVal = value;
    }
    dataContent[i]['Course_Subcomponents__r']['records'][index][
      name
    ] = filterVal;

    setData(dataContent);
  };
  const handleSaveClick = i => {
    let payLoad = [];
    data[i]['Course_Subcomponents__r']['records'].map(d => {
      payLoad.push({
        id: d?.Id ? d?.Id : '',
        name: d?.Name,
        maximum_mark: d?.Maximum_Marks_for_the_Sub_Component__c,
        sub_weightage: d?.Sub_Component_Weightage__c,
        integrate_bb: d?.Integrate_with_Black_Board__c,
        integrate_mettle: d?.Integrate_with_Mettle__c,
        evaluation: d?.evaluation,
      });
    });
    if (payLoad.length > 0) {
      setLoading(true);
      postCourseComponent(payLoad)
        .then(res => {
          setLoading(false);
          setValue('');
          if (data.length > 0) {
            let newArr = [...data];
            newArr[i]['edit'] = false;
          }
          setActiveButton(null);
          setTrigger(!trigger);
        })
        .catch(err => {
          setLoading(false);
          setValue('');
          if (data.length > 0) {
            let newArr = [...data];
            newArr[i]['edit'] = false;
          }
          setTrigger(!trigger);
          setActiveButton(null);
        });
    }
  };
  const handleTotalAverage = data => {
    let avg = 0;
    let check = data.some(evr => evr.Sub_Component_Weightage__c === null);
    data?.map(s => {
      avg = avg + Number(s.Sub_Component_Weightage__c);
    });
    let message = `${avg}% (Percentage is not adding up to 100%) `;
    if (avg > 100) {
      return message;
    } else if (avg < 100) {
      return message;
    } else return '';
  };
  return (
    <div>
      {data && (
        <Card className={classes.addRowsCars}>
          {data?.map((x, i) => {
            return (
              <div className="contentdivbox" key={i}>
                <Accordion
                  style={{ boxShadow: 'none' }}
                  expanded={x?.expanded ? x?.expanded : false}
                  onClick={() => {
                    let newArr = [...data];
                    newArr[i]['expanded'] = !x?.expanded;
                    setData(newArr);
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ padding: '0px' }}
                  >
                    <Grid
                      container
                      spacing={8}
                      alignItems="center"
                      // justifyContent="space-between"
                    >
                      <Grid item xs={12} md={4}>
                        <div className={classes.label}>Type</div>
                        <div className="lableBack">
                          <KenTextLabel
                            label={
                              <Typography
                                style={{ width: '290px' }}
                                className="lableText"
                              >
                                {' '}
                                {x?.Name}
                              </Typography>
                            }
                          />
                        </div>
                        <div className="dilogbttndivopen">
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ textTransform: 'capitalize' }}
                            onClick={event => {
                              event.stopPropagation();
                              handleAddClick(i, x.Id);
                            }}
                            disabled={value === i ? false : true}
                            onFocus={event => event.stopPropagation()}
                          >
                            <AddCircleOutlineOutlinedIcon /> &nbsp;Add
                            Sub-Component
                          </Button>
                        </div>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={1}
                        style={{
                          display: 'flex',
                          // justifyContent: 'end',
                          marginTop: 18,
                          position: 'relative',
                          top: '-15px',
                        }}
                      >
                        <div className="lableBack">
                          <KenTextLabel
                            label={
                              <Typography className="lableText1">
                                {' '}
                                {x?.Weightage__c}&nbsp;%{' '}
                              </Typography>
                            }
                          />
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        className={classes.viewEditSaveGrid}
                      >
                        {status ? (
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ textTransform: 'capitalize' }}
                          >
                            View
                          </Button>
                        ) : (
                          <>
                            {x.edit == true ? (
                              <Grid container spacing={2}>
                                <Grid item>
                                  <div className="editBtn">
                                    <Button
                                      className={classes.addSub}
                                      disabled={
                                        handleTotalAverage(
                                          x?.Course_Subcomponents__r?.records
                                        ) == ''
                                          ? false
                                          : true
                                      }
                                      onClick={event => {
                                        event.stopPropagation();
                                        setSelectedItem({
                                          ...selectedItem,
                                          alertText: 'save',
                                          i: i,
                                          index: '',
                                        });
                                        let arr = [...data];
                                        let openDialog =
                                          arr[i]['Course_Subcomponents__r'][
                                            'records'
                                          ]?.length > 0
                                            ? arr[i]['Course_Subcomponents__r'][
                                                'records'
                                              ]?.some(
                                                s =>
                                                  s.Name?.length > 100 ||
                                                  s.Name?.length < 1 ||
                                                  handleTotalAverage(
                                                    x?.Course_Subcomponents__r
                                                      ?.records
                                                  ) != ''
                                              )
                                            : true;
                                        setDialogOpen(!openDialog);
                                      }}
                                      onFocus={event => event.stopPropagation()}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </Grid>
                                <Grid item>
                                  <Button
                                    style={{
                                      textTransform: 'capitalize',
                                    }}
                                    variant="text"
                                    onClick={event => {
                                      event.stopPropagation();
                                      let newArr = [...data];
                                      newArr[i]['edit'] = false;
                                      console.log(newArr, 'kkkkkkkk');
                                      setData(newArr);
                                      setTrigger(!trigger);
                                      setValue('');
                                      setActiveButton(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </Grid>
                              </Grid>
                            ) : (
                              <div className="editBtn">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  style={{ textTransform: 'capitalize' }}
                                  onClick={event => {
                                    event.stopPropagation();
                                    let newArr = [...data];
                                    let confirm = x?.edit ? x?.edit : false;
                                    newArr[i]['edit'] = !confirm;
                                    newArr[i]['expanded'] = true;
                                    console.log(newArr, 'kkkkkkkk');
                                    setData(newArr);
                                    setValue(i);
                                    setActiveButton(i);
                                  }}
                                  onFocus={event => event.stopPropagation()}
                                  disabled={
                                    activeButton !== null && activeButton !== i
                                  }
                                >
                                  Edit
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    className="accordionadd"
                  >
                    <Grid container className="firstContent">
                      <Grid item md={4}>
                        Aggregate Type :
                      </Grid>
                      <Grid item md={2}>
                        {x?.Aggregation_Type_for_subcomponents__c && (
                          <div className="lableBack">
                            {/* <KenTextLabel
                              label={
                                <Typography className="lableText">
                                  {' '}
                                  {x?.Aggregation_Type_for_subcomponents__c}
                                </Typography>
                              }
                            /> */}
                            <KenSelect
                              style={{ width: '80%' }}
                              disabled={value === i ? false : true}
                              options={[
                                {
                                  label:
                                    x?.Aggregation_Type_for_subcomponents__c,
                                  value:
                                    x?.Aggregation_Type_for_subcomponents__c,
                                },
                              ]}
                              value={x?.Aggregation_Type_for_subcomponents__c}
                              optionalLabel={false}
                            />
                          </div>
                        )}
                      </Grid>
                    </Grid>
                    {x?.Course_Subcomponents__r?.records?.map((item, index) => {
                      return (
                        <Grid container className="secondContent" key={index}>
                          <Grid item md={2} className="accordionInnercontent">
                            {x?.edit == true ? (
                              <>
                                <TextField
                                  className="percentname"
                                  name="Name"
                                  value={item?.Name}
                                  disabled={!x?.edit}
                                  onChange={e => handleChange(e, index, i)}
                                  InputProps={{ disableUnderline: true }}
                                />
                                {item?.Name?.length > 100 ? (
                                  <span
                                    style={{ fontSize: '9px', color: 'red' }}
                                  >
                                    not more than 100 character{' '}
                                  </span>
                                ) : null}
                              </>
                            ) : (
                              item?.Name
                            )}
                          </Grid>
                          <Grid item md={2} className="accordionInnercontent">
                            Marks&nbsp;&nbsp;
                            <TextField
                              className="percentamountadd"
                              type="number"
                              style={{
                                backgroundColor:
                                  x?.edit == true ? '#fff' : '#E4E4E4',
                              }}
                              disabled={!x?.edit}
                              name="Maximum_Marks_for_the_Sub_Component__c"
                              value={
                                item?.Maximum_Marks_for_the_Sub_Component__c
                              }
                              onChange={e => handleChange(e, index, i)}
                              InputProps={{ disableUnderline: true }}
                            />
                            {Number(
                              item?.Maximum_Marks_for_the_Sub_Component__c
                            ) > 1000 ? (
                              <span style={{ fontSize: '9px', color: 'red' }}>
                                not more than 999
                              </span>
                            ) : null}
                          </Grid>
                          <Grid item md={2} className="accordionInnercontent">
                            <TextField
                              className="percentamountper"
                              type={x?.edit == true ? 'number' : 'text'}
                              style={{
                                backgroundColor:
                                  x?.edit == true ? '#fff' : '#E4E4E4',
                                color: 'black',
                              }}
                              disabled={!x?.edit}
                              name="Sub_Component_Weightage__c"
                              value={
                                x?.edit == true
                                  ? item?.Sub_Component_Weightage__c
                                  : `${item?.Sub_Component_Weightage__c} %`
                              }
                              onChange={e => handleChange(e, index, i)}
                              InputProps={{ disableUnderline: true }}
                            />
                            &nbsp;&nbsp;{x?.edit == true && '%'}
                            {Number(item?.Sub_Component_Weightage__c) > 100 ? (
                              <span style={{ fontSize: '9px', color: 'red' }}>
                                not more than 100%
                              </span>
                            ) : null}
                          </Grid>
                          <Grid item md={2}>
                            Create Activity in:
                          </Grid>
                          <Grid item md={1} className="accordionInnercontent">
                            <KenCheckbox
                              name={`checked`}
                              color="primary"
                              disabled={!x?.edit}
                              value={item.Integrate_with_Black_Board__c}
                              onChange={e => {
                                let newArr = [...data];
                                let checkedArr = [...checkedData];
                                checkedArr.push({
                                  name: item?.Name,
                                  course_id: x?.Id,
                                });
                                newArr[i]['Course_Subcomponents__r']['records'][
                                  index
                                ]['Integrate_with_Black_Board__c'] =
                                  e.target.checked;
                                setData(newArr);
                                if (e.target.checked) {
                                  setCheckedData(checkedArr);
                                }
                              }}
                            />
                            BB
                          </Grid>
                          <Grid item md={1} className="accordionInnercontent">
                            <KenCheckbox
                              name={`checked`}
                              color="primary"
                              disabled={!x?.edit}
                              value={item.Integrate_with_Mettle__c}
                              onChange={e => {
                                let newArr = [...data];
                                newArr[i]['Course_Subcomponents__r']['records'][
                                  index
                                ]['Integrate_with_Mettle__c'] =
                                  e.target.checked;
                                setData(newArr);
                              }}
                            />
                            Mettl
                          </Grid>
                          {x?.edit == true ? (
                            <Grid
                              item
                              md={2}
                              className="icon"
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Grid
                                container
                                spacing={2}
                                style={{ flexDirection: 'column' }}
                              >
                                <Grid
                                  item
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <RiDeleteBinLine
                                    className="delete"
                                    onClick={event => {
                                      event.stopPropagation();
                                      let deleteArr = [...deletedData];
                                      let arr = [...data];
                                      deleteArr.push({ Id: item?.Id });
                                      arr[i]['Course_Subcomponents__r'][
                                        'records'
                                      ].splice(index, 1);
                                      setData(arr);
                                      setDeletedData(deleteArr);
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          ) : null}
                        </Grid>
                      );
                    })}
                    <p className="avg-alert">{`${handleTotalAverage(
                      x?.Course_Subcomponents__r?.records
                    )}`}</p>
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })}
          <KenDialog
            // title={
            //   <Typography variant="h6" className={classes.dialogHeader}>
            //     Confirmation
            //   </Typography>
            // }
            buttonTransform={'capitalize'}
            open={dialogOpen}
            dialogStyle={classes.dialog}
            // icon={<RiCheckFill />}
            handleClose={() => handleDialogClose()}
            negativeButtonClick={() => handleDialogClose()}
            positiveButtonClick={() => {
              if (selectedItem?.alertText === 'save') {
                handleDialogOpen(
                  'save',
                  selectedItem,
                  selectedItem?.i,
                  selectedItem?.index
                );
              } else {
                handleDialogOpen(
                  'delete',
                  selectedItem,
                  selectedItem?.i,
                  selectedItem?.index
                );
              }
            }}
            positiveButtonText="Confirm"
            negativeButtonText="Cancel"
          >
            <p className={classes.dialogText}>
              {selectedItem?.alertText == 'save'
                ? 'Are you sure you want to Save?'
                : 'Are you sure you want to Submit ?'}
            </p>
          </KenDialog>
        </Card>
      )}
    </div>
  );
};

export default AddRows;
