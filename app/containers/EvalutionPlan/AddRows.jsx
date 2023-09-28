import { Button, Card, Grid, Typography } from '@material-ui/core';
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
import KenInputField from '../../global_components/KenInputField';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  addRowsCars: {
    padding: '20px',
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
    fontWeight: 600,
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
  componentBox: {
    border: '1px solid #E4E4E4',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  componentBox2: {
    border: '1px solid #E4E4E4',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    background: '#EBEFFF',
  },
  textField: {
    background: '#fff',
    border: '1px solid #E4E4E4',
    padding: 8,
    borderRadius: '8px',
  },
  cancelBtn: {
    '&:hover': {
      backgroundColor: '#fff !important',
      color: '#193389 !important',
      opacity: 1,
    },
  },
}));

const AddRows = props => {
  const {
    componentData,
    setLoading,
    trigger,
    setTrigger,
    status,
    tableStatus,
    setEditOption,
  } = props;
  const [data, setData] = useState([]);
  const [deletedData, setDeletedData] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [value, setValue] = useState('');
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    if (componentData && componentData?.length > 0) {
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
      setDialogOpen(false);
    }
  };
  const handleAddClick = (i, evaluation) => {
    if (
      data[i]['Course_Subcomponents__r'] &&
      data[i]['Course_Subcomponents__r']['records']
    ) {
      let dataContent = [...data];
      if (dataContent.length > 0) {
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
      }
    } else {
      let dataContent = [...data];
      if (dataContent.length > 0) {
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
        dataContent[i]['edit'] = true;
        setData(dataContent);
      }
    }
  };
  const handleDelete = id => {
    handleDialogOpen();
    setLoading(true);
    deleteSubComponent(id)
      .then(res => {
        setLoading(false);
      })
      .catch(err => {
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
        evaluation: data[i]?.Id,
        aggregationType: data[i]['Aggregation_Type_for_subcomponents__c'],
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

  const checkActivity = data => {
    const check = data => {
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        if (
          !obj.Integrate_with_Black_Board__c &&
          !obj.Integrate_with_Mettle__c
        ) {
          return true;
        }
      }
      return false;
    };
    var displayMessage = handleTotalAverage(data);
    if (check(data) && displayMessage.includes('')) {
      return 'Please select any 1 activity';
    } else return '';
  };

  return (
    <div>
      {data && (
        <Card className={classes.addRowsCars}>
          {data?.map((x, i) => {
            let records = x?.Course_Subcomponents__r?.records;
            let totalWeightage;
            let totalMarks;
            if (records?.length > 0) {
              const initialValue = 0;
              totalWeightage = records.reduce(function(a, b) {
                return Number(a) + Number(b?.Sub_Component_Weightage__c);
              }, initialValue);
              totalMarks = records.reduce(function(a, b) {
                return (
                  Number(a) + Number(b?.Maximum_Marks_for_the_Sub_Component__c)
                );
              }, initialValue);
              var displayMessage = handleTotalAverage(records);
              var displayCheck = checkActivity(records);
            }
            return (
              <div>
                <Grid
                  container
                  xs={12}
                  key={i}
                  className={
                    x?.expanded !== undefined && x?.expanded
                      ? classes.componentBox2
                      : classes.componentBox
                  }
                >
                  <Grid container xs={3}>
                    <Grid
                      item
                      style={{
                        display: 'flex',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-30%)',
                      }}
                    >
                      <Typography style={{ opacity: '50%' }}>Type: </Typography>
                      <Typography
                        style={{
                          marginLeft: 20,
                          color: '#092682',
                          fontWeight: 600,
                        }}
                      >
                        {x?.Name}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={3}>
                    <Grid
                      item
                      style={{
                        display: 'flex',
                        position: 'relative',
                        top: '50%',
                        transform: 'translateY(-30%)',
                      }}
                    >
                      <Typography style={{ opacity: '50%' }}>
                        Component weightage:
                      </Typography>
                      <Typography
                        style={{
                          marginLeft: 20,
                          color: '#092682',
                          fontWeight: 600,
                        }}
                      >
                        {x?.Weightage__c}&nbsp;%{' '}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={3}>
                    {x?.expanded !== undefined && x?.expanded ? (
                      <Grid item style={{ display: 'flex', width: '100%' }}>
                        <Typography
                          style={{
                            position: 'relative',
                            top: '50%',
                            transform: 'translateY(-30%)',
                            fontWeight: 500,
                            opacity: '100%',
                          }}
                        >
                          Aggregate Type :
                        </Typography>
                        {/* {x?.Aggregation_Type_for_subcomponents__c && ( */}
                        <div style={{ width: '40%', marginLeft: '20px' }}>
                          {x?.view !== undefined && x?.view ? (
                            <Typography
                              style={{
                                color: '#092682',
                                fontWeight: 600,
                                position: 'relative',
                                top: '42%',
                                transform: 'translateY(-30%)',
                              }}
                            >
                              {x?.Aggregation_Type_for_subcomponents__c}
                            </Typography>
                          ) : null}
                          {x?.edit !== undefined && x?.edit ? (
                            <KenSelect
                              disabled={value === i ? false : true}
                              options={[
                                // {
                                //   label:
                                //     x?.Aggregation_Type_for_subcomponents__c,
                                //   value:
                                //     x?.Aggregation_Type_for_subcomponents__c,
                                // },
                                { label: 'Sum', value: 'Sum' },
                              ]}
                              value={x?.Aggregation_Type_for_subcomponents__c}
                              onChange={event => {
                                event.stopPropagation();
                                let newArr = [...data];
                                newArr[i][
                                  'Aggregation_Type_for_subcomponents__c'
                                ] = event.target.value;
                                setData(newArr);
                                setValue(i);
                                setActiveButton(i);
                              }}
                              optionalLabel={false}
                            />
                          ) : null}
                        </div>
                        {/* )} */}
                      </Grid>
                    ) : null}
                  </Grid>
                  <Grid container xs={3} style={{ justifyContent: 'right' }}>
                    {status ? (
                      <>
                        {data[i]['expanded'] ? (
                          <Button
                            style={{
                              margin: '0px 10px',
                              backgroundColor: '#fff',
                              color: '#193389',
                              opacity: 1,
                              textTransform: 'capitalize',
                              borderRadius: 8,
                            }}
                            onFocus={event => event.stopPropagation()}
                            className={classes.cancelBtn}
                            onClick={event => {
                              event.stopPropagation();
                              if (data.length > 0) {
                                let newArr = [...data];
                                newArr[i]['expanded'] = false;
                                setData(newArr);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ textTransform: 'capitalize' }}
                            onClick={event => {
                              event.stopPropagation();
                              let current = false;
                              let newArr = [...data];
                              newArr[i]['view'] = true;
                              newArr[i]['expanded'] = true;
                              setData(newArr);
                              setValue(i);
                              setActiveButton(i);
                            }}
                          >
                            View
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        {x?.Course_Subcomponents__r === null ? (
                          <Button
                            color="primary"
                            variant="contained"
                            style={{ textTransform: 'capitalize' }}
                            onClick={event => {
                              event.stopPropagation();
                              handleAddClick(i, x.Id);
                              setValue(i);
                            }}
                            onFocus={event => event.stopPropagation()}
                          >
                            <AddCircleOutlineOutlinedIcon /> &nbsp;Add
                            Sub-Component
                          </Button>
                        ) : (
                          <div className="editBtn">
                            {x?.['expanded'] !== undefined &&
                            x?.['expanded'] ? (
                              <>
                                <Button
                                  className={classes.addSub}
                                  disabled={
                                    displayMessage === '' && displayCheck === ''
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
                                <Button
                                  style={{
                                    margin: '0px 10px',
                                    backgroundColor: '#fff',
                                    color: '#193389',
                                    opacity: 1,
                                    textTransform: 'capitalize',
                                    borderRadius: 8,
                                  }}
                                  onFocus={event => event.stopPropagation()}
                                  className={classes.cancelBtn}
                                  onClick={event => {
                                    event.stopPropagation();
                                    if (data.length > 0) {
                                      let newArr = [...data];
                                      newArr[i]['edit'] = false;
                                      newArr[i]['expanded'] = false;
                                      let filtered = newArr[i][
                                        'Course_Subcomponents__r'
                                      ].records.filter(item => item.Id !== '');
                                      if (filtered.length > 0) {
                                        newArr[i][
                                          'Course_Subcomponents__r'
                                        ].records = filtered;
                                      } else {
                                        newArr[i][
                                          'Course_Subcomponents__r'
                                        ] = null;
                                      }
                                      newArr.forEach(
                                        item => (item['disableEdit'] = false)
                                      );
                                      setData(newArr);
                                    }
                                    setTrigger(!trigger);
                                    setEditOption(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
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
                                  newArr.forEach(
                                    item => (item['disableEdit'] = true)
                                  );
                                  setData(newArr);
                                  setValue(i);
                                  setActiveButton(i);
                                  setEditOption(true);
                                }}
                                onFocus={event => event.stopPropagation()}
                                disabled={x.disableEdit}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </Grid>
                  {x?.expanded !== undefined && x?.expanded ? (
                    <Grid container xs={12} style={{ marginTop: 20 }}>
                      <Grid item xs={3}>
                        <Typography>Sub-component</Typography>
                        {x?.Course_Subcomponents__r?.records?.map(
                          (item, index) => {
                            return (
                              <div
                                style={{
                                  borderBottom:
                                    x?.view !== undefined && x?.view
                                      ? '1px solid #D2E1E9'
                                      : null,
                                }}
                              >
                                <div
                                  style={{
                                    padding: '14px 25px 10px 0px',
                                    width: '200px',
                                    display:
                                      x?.view !== undefined && x?.view
                                        ? 'grid'
                                        : 'block',
                                    rowGap:
                                      x?.view !== undefined && x?.view
                                        ? '5px'
                                        : '',
                                  }}
                                >
                                  {x?.view !== undefined && x?.view ? (
                                    <Typography
                                      style={{
                                        color: '#092682',
                                        fontWeight: 600,
                                        position: 'relative',
                                        top: '42%',
                                        transform: 'translateY(-30%)',
                                      }}
                                    >
                                      {item?.Name}
                                    </Typography>
                                  ) : (
                                    <KenInputField
                                      value={item?.Name}
                                      name="Name"
                                      onChange={e => handleChange(e, index, i)}
                                      className={classes.textField}
                                    />
                                  )}
                                  {item?.Name?.length > 100 ? (
                                    <span
                                      style={{
                                        fontSize: '9px',
                                        color: 'red',
                                      }}
                                    >
                                      not more than 100 character{' '}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>Marks</Typography>
                        {x?.Course_Subcomponents__r?.records?.map(
                          (item, index) => {
                            return (
                              <div
                                style={{
                                  borderBottom:
                                    x?.view !== undefined && x?.view
                                      ? '1px solid #D2E1E9'
                                      : null,
                                  height:
                                    x?.view !== undefined && x?.view
                                      ? '48px'
                                      : null,
                                }}
                              >
                                <div
                                  style={{
                                    padding: '14px 25px 10px 0px',
                                    width: 110,
                                    display:
                                      x?.view !== undefined && x?.view
                                        ? 'grid'
                                        : 'block',
                                    rowGap:
                                      x?.view !== undefined && x?.view
                                        ? '5px'
                                        : '',
                                  }}
                                >
                                  {x?.view !== undefined && x?.view ? (
                                    <Typography
                                      style={{
                                        color: '#092682',
                                        fontWeight: 600,
                                        position: 'relative',
                                        top: '42%',
                                        transform: 'translateY(-30%)',
                                      }}
                                    >
                                      {
                                        item?.Maximum_Marks_for_the_Sub_Component__c
                                      }
                                    </Typography>
                                  ) : (
                                    <KenInputField
                                      name="Maximum_Marks_for_the_Sub_Component__c"
                                      value={
                                        item?.Maximum_Marks_for_the_Sub_Component__c
                                      }
                                      onChange={e => {
                                        if (
                                          /^(?:\d{1,3})?$/.test(e.target.value)
                                        ) {
                                          handleChange(e, index, i);
                                        }
                                      }}
                                      className={classes.textField}
                                    />
                                  )}
                                  {Number(
                                    item?.Maximum_Marks_for_the_Sub_Component__c
                                  ) > 1000 ? (
                                    <span
                                      style={{ fontSize: '9px', color: 'red' }}
                                    >
                                      not more than 999
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </Grid>
                      <Grid item xs={3}>
                        <Typography>Sub-component weightage</Typography>
                        {x?.Course_Subcomponents__r?.records?.map(
                          (item, index) => {
                            return (
                              <div
                                style={{
                                  borderBottom:
                                    x?.view !== undefined && x?.view
                                      ? '1px solid #D2E1E9'
                                      : null,
                                  height:
                                    x?.view !== undefined && x?.view
                                      ? '48px'
                                      : null,
                                }}
                              >
                                <div
                                  style={{
                                    padding: '14px 25px 10px 0px',
                                    width: 110,
                                    display:
                                      x?.view !== undefined && x?.view
                                        ? 'grid'
                                        : 'block',
                                    rowGap:
                                      x?.view !== undefined && x?.view
                                        ? '5px'
                                        : '',
                                  }}
                                >
                                  {x?.view !== undefined && x?.view ? (
                                    <Typography
                                      style={{
                                        color: '#092682',
                                        fontWeight: 600,
                                        position: 'relative',
                                        top: '42%',
                                        transform: 'translateY(-30%)',
                                      }}
                                    >
                                      {item?.Sub_Component_Weightage__c !== null
                                        ? `${
                                            item?.Sub_Component_Weightage__c
                                          } %`
                                        : ''}
                                    </Typography>
                                  ) : (
                                    <KenInputField
                                      name="Sub_Component_Weightage__c"
                                      value={
                                        x?.edit == true
                                          ? item?.Sub_Component_Weightage__c
                                          : `${
                                              item?.Sub_Component_Weightage__c
                                            } %`
                                      }
                                      onChange={e => {
                                        if (
                                          /^(?:\d{1,3})?$/.test(e.target.value)
                                        ) {
                                          handleChange(e, index, i);
                                        }
                                      }}
                                      className={classes.textField}
                                    />
                                  )}
                                  {Number(item?.Sub_Component_Weightage__c) >
                                  100 ? (
                                    <span
                                      style={{ fontSize: '9px', color: 'red' }}
                                    >
                                      not more than 100%
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Select Activity</Typography>
                        <div
                          style={{
                            display: 'grid',
                            rowGap:
                              x?.view !== undefined && x?.view ? null : '5px',
                            marginTop:
                              x?.view !== undefined && x?.view ? null : '9px',
                          }}
                        >
                          {x?.Course_Subcomponents__r?.records?.map(
                            (item, index) => {
                              return (
                                <Grid
                                  container
                                  style={{
                                    padding: '10px 25px 10px 0px',
                                    borderBottom:
                                      x?.view !== undefined && x?.view
                                        ? '1px solid #D2E1E9'
                                        : null,
                                    height:
                                      x?.view !== undefined && x?.view
                                        ? '49px'
                                        : null,
                                  }}
                                >
                                  <Grid
                                    item
                                    className="accordionInnercontent"
                                    style={{
                                      height:
                                        x?.view !== undefined && x?.view
                                          ? null
                                          : '51px',
                                    }}
                                  >
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
                                        newArr[i]['Course_Subcomponents__r'][
                                          'records'
                                        ][index][
                                          'Integrate_with_Black_Board__c'
                                        ] = e.target.checked;
                                        setData(newArr);
                                        if (e.target.checked) {
                                          setCheckedData(checkedArr);
                                        }
                                      }}
                                    />
                                    BB
                                  </Grid>
                                  <Grid
                                    item
                                    className="accordionInnercontent"
                                    style={{
                                      marginLeft: 20,
                                      height:
                                        x?.view !== undefined && x?.view
                                          ? null
                                          : '51px',
                                    }}
                                  >
                                    <KenCheckbox
                                      name={`checked`}
                                      color="primary"
                                      disabled={!x?.edit}
                                      value={item.Integrate_with_Mettle__c}
                                      onChange={e => {
                                        let newArr = [...data];
                                        newArr[i]['Course_Subcomponents__r'][
                                          'records'
                                        ][index]['Integrate_with_Mettle__c'] =
                                          e.target.checked;
                                        setData(newArr);
                                      }}
                                    />
                                    Mettl
                                  </Grid>
                                  {x?.view !== undefined && x?.view ? null : (
                                    <Grid item style={{ marginLeft: '50px' }}>
                                      <RiDeleteBinLine
                                        className="delete"
                                        style={{
                                          height:
                                            x?.view !== undefined && x?.view
                                              ? '25px'
                                              : '51px',
                                        }}
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
                                  )}
                                </Grid>
                              );
                            }
                          )}
                        </div>
                        {tableStatus !== 'Received' ? (
                          <div>
                            <p
                              className="avg-alert"
                              style={{ textAlign: 'left' }}
                            >
                              {displayCheck || ''}
                            </p>
                          </div>
                        ) : null}
                      </Grid>
                    </Grid>
                  ) : null}
                  {x?.expanded !== undefined && x?.expanded && !x?.view ? (
                    <Grid container xs={12}>
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
                        <AddCircleOutlineOutlinedIcon /> &nbsp;Add More
                      </Button>
                    </Grid>
                  ) : null}
                  {x?.expanded !== undefined && x?.expanded ? (
                    <>
                      {x?.edit ? (
                        <>
                          <div
                            style={{
                              border: '1px solid #B2ADAD',
                              width: '90%',
                              margin: '30px 0px',
                            }}
                          />
                          <Grid container xs={12}>
                            <Grid item xs={3}>
                              <Grid item>
                                <Typography
                                  style={{
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    lineHeight: '50px',
                                  }}
                                >
                                  Total
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item xs={2}>
                              <div style={{ paddingRight: '25px', width: 110 }}>
                                <KenInputField
                                  value={totalMarks}
                                  name="totalMarks"
                                  disabled={true}
                                  className={classes.textField}
                                />
                              </div>
                            </Grid>
                            <Grid item xs={3}>
                              <div style={{ paddingRight: '25px', width: 110 }}>
                                <KenInputField
                                  value={`${totalWeightage || ''}%`}
                                  name="totalWeight"
                                  disabled={true}
                                  className={classes.textField}
                                />
                              </div>
                              <p
                                className="avg-alert"
                                style={{ textAlign: 'left' }}
                              >
                                {displayMessage || ''}
                              </p>
                            </Grid>
                            <Grid item xs={4} />
                          </Grid>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </Grid>
              </div>
            );
          })}

          <KenDialog
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
