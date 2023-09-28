import React, { useState } from 'react';
import KenSelect from '../../components/KenSelect';
import KenCard from '../../global_components/KenCard';
import KenButton from '../../global_components/KenButton';
import KenGrid from '../../global_components/KenGrid';
import KenCardWithoutpadding from '../../components/KenCard/KenCard2';

import SplitButton from './SplitButton';

import {
  Box,
  Grid,
  Paper,
  makeStyles,
  AppBar,
  Toolbar,
  Button,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import KenGridEditable from '../../global_components/kenGridEditable/kenGridEditable';

import {
  getCompletedEnrollment,
  getSubjectAndSubComponent,
} from '../../utils/ApiService';
import { useEffect } from 'react';
import KenDialogBox from '../../components/KenDialogBox';
import { RiCheckFill } from 'react-icons/ri';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { Link } from 'react-router-dom';
import GradebookData from '../Gradebook/data.json';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import DetailsView from './DetailsView';
import Overview from './Overview';
const useStyles = makeStyles(theme => ({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
  header: {
    background: 'transparent',
    color: theme.palette.KenColors.primary,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'end',
  },
  headerBtn: {
    margin: '0 5px',
  },
  leftBox: {
    width: '100%',
    background: '#fff !important',
    padding: '10px',
    overflowY: 'auto',
  },
  RightBox: {
    background: '#fff',
    width: '100%',
    background: '#fff !important',
    padding: '10px',
  },
  sideCardTitle: {
    marginTop: '0px',
    color: '#0077FF',
    fontSize: '14px',
    fontWeight: 600,
  },
  sideCardVal: {
    margin: '0px',
  },
  selectTableCell: {
    textAlign: 'right !important',
  },
  gradeComp: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  uploadbtn: {
    padding: '9px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  totalBorder: {
    height: '35px !important',
    borderBottom: '1px solid #000',
    marginTop: '20px',
  },
  buttonDiv: {
    height: '26px',
    padding: '20px',
  },
}));

export default function FacultyReport() {
  const classes = useStyles();

  const [subjectOpt, setSubjectOpt] = useState([]);
  const [subjectValue, setSubjectValue] = useState('');
  const [open, setOpen] = useState(false);
  const [addSubjectDialog, setAddSubjectDialog] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [subComponentData, setsubComponentData] = useState([]);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  useEffect(() => {
    const data = [];
    const data2 = [];
    const data3 = [];
    GradebookData['Grading Components'].map(item => {
      data.push({
        GradeComponent: item.label,
        Percentage: item.percentage,
        item: item.data,
      });
    });
    setData(data);
    GradebookData['Grade Points'].map(item => {
      data2.push({
        'Grade Name': item['Grade Name'],
        Range: item['Range'],
        'Grade Point': item['Grade Point'],
      });
    });
    setData2(data2);
    GradebookData['Subjects'].map(item => {
      data3.push({
        gradeType: item.label,
        SubjectCode: item.SubjectCode,
        Credits: item.Credits,
      });
    });
    setData3(data3);
  }, []);
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  useEffect(() => {
    const id = userDetails.ContactId;
    getCompletedEnrollment(id)
      .then(res => {
        console.log(res);
        const subject = [];
        let response = Object.values(res);
        if (response.length > 0) {
          response.map(items => {
            items.map(item => {
              subject.push({
                label: item.CourseName,
                value: item.courseOfferingId,
              });
            });
          });
          setSubjectOpt(subject);
          let target = { target: subject[0] };
          onChangeSubject(target);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const onChangeSubject = e => {
    setSubjectValue(e.target.value);
    getSubjectAndSubComponent(e.target.value).then(res => {
      const SubComponent = [];
      if (res?.success === 'true') {
        res.data.map(items => {
          SubComponent.push({
            componentId: items.id,
            componentName: items.componentName,
            termId: items.termId,
            termName: items.termName,
            CourseSubComponentWrapper: items.CourseSubComponentWrapper.map(
              item => {
                return {
                  componentId: item.SubComponentId,
                  componentName: item.subComponentName,
                  childNode: true,
                };
              }
            ),
          });
        });
      }
      console.log('SubComponent', SubComponent);
      setsubComponentData(SubComponent);
    });
  };
  const addSubject = () => {
    setOpen(true);
    setAddSubjectDialog(true);
    console.log('subjectValue', subjectValue);
  };

  const columns = [
    {
      Header: '',
      accessor: 'GradeComponent',
      disableGlobalFilter: true,
    },
    {
      Header: '',
      accessor: 'Percentage',
      disableGlobalFilter: true,
    },
  ];

  const getTreeItemsFromData = treeItems => {
    return (
      treeItems.length > 0 &&
      treeItems.map(treeItemData => {
        let children;
        if (
          treeItemData.CourseSubComponentWrapper &&
          treeItemData.CourseSubComponentWrapper.length > 0
        ) {
          children = getTreeItemsFromData(
            treeItemData?.CourseSubComponentWrapper
          );
        }
        if (treeItemData.childNode === true) {
          return (
            <Link to={`/studentsBySubComponent/${treeItemData.componentId}`}>
              <TreeItem
                key={treeItemData.componentId}
                nodeId={treeItemData.componentId}
                label={treeItemData.componentName}
                children={children}
              />
            </Link>
          );
        } else {
          return (
            <TreeItem
              key={treeItemData.componentId}
              nodeId={treeItemData.componentId}
              label={treeItemData.componentName}
              children={children}
            />
          );
        }
      })
    );
  };
  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };

  return (
    <div>
      <Paper className={classes.uploadbtn} style={{ marginBottom: '20px' }}>
        <Grid container>
          <Grid
            item
            xs={2}
            style={{
              justifyContent: 'left',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <KenSelect
              value={subjectValue}
              options={subjectOpt}
              placeholder={'Select'}
              //  required={true}
              label="Select Subject"
              onChange={e => {
                onChangeSubject(e);
              }}
            />
          </Grid>
          <Grid
            item
            xs={10}
            style={{
              display: 'flex',
              justifyContent: 'end',
              gridColumnGap: '10px',
              alignItems: 'center',
            }}
          >
            {/* <SplitButton
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              buttonClass={classes.buttonDiv}
            /> */}
            <KenButton
              variant="primary"
              buttonClass={classes.buttonDiv}
              onClick={addSubject}
            >
              Add/Edit Marks
            </KenButton>
          </Grid>
        </Grid>
      </Paper>
      {/* {selectedIndex === 0 && <Overview subjectValue={subjectValue} />}
      {selectedIndex === 1 && <DetailsView subjectValue={subjectValue} />} */}
      <DetailsView
        subjectValue={subjectValue}
        subComponentData={subComponentData}
      />
      <KenDialogBox
        title={
          <Typography variant="h6" className={classes.dialogHeader}>
            Add & Edit Subject
          </Typography>
        }
        open={addSubjectDialog}
        icon={<RiCheckFill />}
        handleClose={() => setAddSubjectDialog(false)}
        negativeButtonClick={() => setAddSubjectDialog(false)}
        positiveButtonClick={() => setAddSubjectDialog(false)}
        positiveButtonText="Submit"
        negativeButtonText="Cancel"
        dividers
      >
        <Grid container xs={12}>
          <DataTreeView treeItems={subComponentData} />
        </Grid>
      </KenDialogBox>
    </div>
  );
}
