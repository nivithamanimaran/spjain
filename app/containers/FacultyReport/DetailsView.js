import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  GetStudentDetailTermWiseByStudentId,
  GetComponentData,
  getStudentListByCourseOffering,
  getStudentScoreList,
} from '../../utils/ApiService';
import { withRouter } from 'react-router-dom';
import { Newtable } from './NewTable';
import {
  Grid,
  AppBar,
  makeStyles,
  Box,
  Toolbar,
  Typography,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  Card,
  CardContent,
  Paper,
} from '@material-ui/core';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KenLoader from '../../components/KenLoader';
import KenCard from '../../global_components/KenCard';

function DetailsView(props) {
  let { subjectValue, subComponentData } = props;
  const useStyles = makeStyles(theme => ({
    breadCrumbWrapper: {
      margin: '15px 0',
    },
    header: {
      background: '#ffffff',
      color: theme.palette.KenColors.primary,
      marginTop: '20px',
    },
    title: {
      fontSize: 18,
      fontWeight: 600,
    },
    holidayButton: {
      textTransform: 'none',
      fontWeight: 'bold',
      marginRight: '5px',
    },
    fitlerButton: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
    sortingSection: {
      display: 'grid',
      gap: '10px',
      gridTemplateColumns: 'repeat(7, 1fr)',
    },
    mainActions: {
      textAlign: 'right',
    },
    popOverHeading: {
      width: '100%',
      fontSize: '14px',
      fontWeight: '400',
      color: '#02195E',
    },
    tableBodyStyle: {
      fontSize: '12px',
      color: '#7A869A',
    },
    tableBodyStyleIgnoreHoliday: {
      fontSize: '12px',
      color: '#7A869A',
      padding: '0px',
    },
    textInputFieldDropDown: {
      background: 'transparent',
      borderRadius: '4px',
      color: '#000',
    },
    textInputField: {
      background: 'transparent',
      borderRadius: '4px',
      color: '#000',
    },
    kenDateTimePickerColor: {
      backgroundColor: '#fff',
    },
    tabs: {
      '& .MuiPaper-root': {
        padding: '0px',
        backgroundColor: 'red',
      },
    },
  }));
  const classes = useStyles();
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <AiFillCaretDown /> : <AiFillCaretRight />}
          </span>
        ),
      },
      {
        Header: 'Student Name',
        accessor: 'studentName',
      },

      {
        Header: 'Max',
        accessor: 'maximumMarks',
      },
      {
        Header: 'Obtained',
        accessor: 'marksObtained',
      },
      {
        Header: 'Percentage',
        accessor: 'percentage',
      },
      {
        Header: 'Grade',
        accessor: 'calculatedLetterGrade',
      },
      {
        Header: 'Final Grade',
        accessor: 'finalLetterGrade',
      },
      // {
      //   Header: 'Finalize mark',
      //   accessor: 'finalizeMark',
      // },
      {
        Header: 'Status',
        accessor: 'passFailStatus',
      },
    ],
    []
  );
  // console.log(studentId);
  const [loading, setLoading] = useState(false);
  const userDetails = localStorage.getItem('userDetails');
  const [dataLoader, setDataLoader] = useState('');
  useEffect(() => {
    let termID = subComponentData[0]?.termId;
    setLoading(true);
    if (termID != undefined) {
      setDataLoader('Fetching...');
      getStudentScoreList(termID)
        .then(res => {
          if (res.length > 0) {
            setData(res);
          }
          setLoading(false);
        })
        .catch(() => {
          setDataLoader('No Data');
          setLoading(false);
          setData([]);
        });
    } else {
      setData([]);
      setLoading(false);
    }
  }, [subComponentData]);

  const renderComponents = useCallback(
    ({ row }) => <ComponentsMarksTable studentData={row.original} />, //<CurrentTerms studentData={row?.original} />
    []
  );
  return (
    <div>
      {loading && <KenLoader />}
      {data.length > 0 ? (
        <Box>
          <div className="cardlsitbox">
            <KenCard
              elevation={0}
              paperStyles={{
                padding: 16,
                paddingLeft: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <Newtable
                columns={columns}
                data={data}
                dataLoader={dataLoader}
                renderComponents={renderComponents}
              />
            </KenCard>
          </div>
        </Box>
      ) : null}
    </div>
  );
}
export default withRouter(DetailsView);

const ComponentsMarksTable = ({ studentData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState('');
  const columns = useMemo(
    () => [
      {
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <AiFillCaretDown /> : <AiFillCaretRight />}
          </span>
        ),
      },
      {
        Header: 'Component',
        accessor: 'ComponentName',
      },
      {
        Header: 'Max Marks',
        accessor: 'TotalMarks',
      },
      {
        Header: 'Marks Obtained',
        accessor: 'MarksObtined',
      },
      {
        Header: 'Marks In course',
        accessor: 'marksObtainedCourseLevel',
      },
    ],
    []
  );
  useEffect(() => {
    const id = studentData?.studentId;
    const courseOfferingId = studentData?.courseOfferingId;
    if (courseOfferingId) {
      setDataLoader('Fetching...');
      setLoading(true);
      GetComponentData(id, courseOfferingId)
        .then(res => {
          console.log('subject', res); //data.componentList
          setData(res);
          setDataLoader('No Data');
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setDataLoader('No Data');
        });
    }
  }, []);

  const renderRowSubComponent = useCallback(
    ({ row }) => <SubComponentsMarksTable data={row.original} />,
    []
  );

  return (
    <>
      {loading && <KenLoader />}
      <Newtable
        columns={columns}
        data={data}
        dataLoader={dataLoader}
        renderComponents={renderRowSubComponent}
      />
    </>
  );
};

function SubComponentsMarksTable({ data }) {
  const columns = useMemo(
    () => [
      {
        Header: 'Sub Component',
        accessor: 'SubComponentName',
      },
      {
        Header: 'Max Marks',
        accessor: 'SubTotalMarks',
      },
      {
        Header: 'Marks Obtained',
        accessor: 'Marksobtained',
      },
      {
        Header: 'Component Marks',
        accessor: 'marksInComponent',
      },
      {
        id: 'scoresFinalized',
        Header: 'Scores Finalized',
        accessor: d => d?.scoresFinalized?.toString(),
        disableGlobalFilter: false,
      },
    ],
    []
  );
  const [loading, setLoading] = useState(false);
  const [dataLoader, setDataLoader] = useState('');

  useEffect(() => {
    if (data.Subcomponent.length === 0) {
      setDataLoader('No Data');
    } else {
      setDataLoader('');
    }
  }, [data]);
  return (
    <>
      {loading && <KenLoader />}
      <Newtable
        data={data?.Subcomponent}
        columns={columns}
        dataLoader={dataLoader}
      />
    </>
  );
}
