import React, { useState, useEffect } from 'react';
import '../../styles.scss';
import {
  Grid,
  makeStyles,
  Box,
  Button,
  Paper,
  IconButton,
  Card,
  Typography,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import {
  AiOutlineMinusSquare,
  AiOutlinePlusSquare,
  AiFillEye,
} from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import KenLoader from '../../../../../components/KenLoader';
import KenSnackBar from '../../../../../components/KenSnackbar';
import KenGrid from '../../../../../global_components/KenGrid';
import Routes from '../../../../../utils/routes.json';
import {
  getExamMarkBreakdown,
  getExamCourseList,
} from '../../../../../utils/ApiService';
const useStyles = makeStyles(theme => ({
  statusBox: {
    padding: '9px',
    textAlign: 'center',
    borderRadius: '4px',
  },
  cardHead: {
    display: 'flex',
    gap: 10,
  },
  cardHead2: {
    display: 'flex',
    gap: 50,
    padding: '15px 20px',
  },
  cardBox: {
    border: '1px solid #E4E4E4',
    width: '200px',
    margin: '0px 20px 16px',
    padding: 8,
  },
  cardHeadText: {
    textTransform: 'capitalize',
  },
  cardHeadText2: {
    fontWeight: 600,
  },
}));

export default function MarksUpload() {
  const [expanded, setExpanded] = useState(0);
  const [accordienCheck, setAccordienCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const columns = [
    {
      Header: 'Course',
      accessor: 'Course',
      disableGlobalFilter: true,
    },
    {
      Header: 'Section',
      accessor: 'Section',
      disableGlobalFilter: true,
    },
    {
      Header: 'Course Code',
      accessor: 'Course Code',
      disableGlobalFilter: true,
    },
    {
      Header: 'Term',
      accessor: 'Term',
      disableGlobalFilter: true,
    },
    {
      Header: 'Credit',
      accessor: 'Credit',
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ value, row }) => {
        return (
          <>
            <AiFillEye
              style={{ fontSize: '20px', color: '#090F69' }}
              onClick={e => handlePreview(e, row.original)}
            />
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const [data, setData] = useState({});
  const columns2 = [
    {
      Header: 'Student Name',
      accessor: 'Student Name',
      disableGlobalFilter: true,
    },
    {
      Header: 'Roll No',
      accessor: 'Roll No',
      disableGlobalFilter: true,
    },
    {
      Header: 'Academic Cycle',
      accessor: 'Academic Cycle',
      disableGlobalFilter: true,
    },
    {
      Header: 'Final Grade',
      accessor: 'Final Grade',
      disableGlobalFilter: true,
    },
    {
      Header: 'Action',
      accessor: 'action',
      Cell: ({ value, row }) => {
        return (
          <>
            <AiFillEye
              style={{ fontSize: '18px' }}
              onClick={e => handlePreviewDetailed(e, row.original)}
            />
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];
  const [previewData, setPreviewData] = useState([]);
  const [cardData, setCardData] = useState({});
  const [selectedRow, setSelectedRow] = useState({});
  const [preview, showPreview] = useState(false);
  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handlePreview = (e, row) => {
    const cardData = {
      Term: row?.Term,
      CourseCode: row['Course Code'],
      Course: row.subject,
      Section: row.Section,
      NoStudents: '-',
    };
    setCardData(cardData);
    if (row.course_Offering) {
      setLoading(true);
      getExamCourseList(row.course_Offering)
        .then(res => {
          if (res.length > 0) {
            let arrData = [];
            res.map(item => {
              arrData.push({
                'Student Name': item.hed__Contact__r.Name,
                'Roll No': item.hed__Contact__r.Registration_Number__c,
                'Academic Cycle': '-',
                'Final Grade': '-',
                Score: [
                  {
                    Type: 'Assignment',
                    marks: 18,
                    outOf: 20,
                    weightage: '5%',
                    SubTypes: [
                      {
                        label: 'Assignment 1',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Assignment 2',
                        marks: 6,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Assignment 3',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                    ],
                  },
                  {
                    Type: 'Quiz',
                    marks: 18,
                    outOf: 20,
                    weightage: '5%',
                    SubTypes: [
                      {
                        label: 'Quiz 1',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Quiz 2',
                        marks: 6,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Quiz 3',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                    ],
                  },
                  {
                    Type: 'Miscellaneous',
                    marks: 18,
                    outOf: 20,
                    weightage: '5%',
                    SubTypes: [
                      {
                        label: 'Miscellaneous 1',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Miscellaneous 2',
                        marks: 6,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Miscellaneous 3',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                    ],
                  },
                  {
                    Type: 'Mid Term Exam',
                    marks: 18,
                    outOf: 20,
                    weightage: '5%',
                    SubTypes: [
                      {
                        label: 'Mid Term Exam 1',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Mid Term Exam 2',
                        marks: 6,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Mid Term Exam 3',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                    ],
                  },
                  {
                    Type: 'Final Grade',
                    marks: 18,
                    outOf: 20,
                    weightage: '5%',
                    SubTypes: [
                      {
                        label: 'Final Grade 1',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Final Grade 2',
                        marks: 6,
                        outOf: 10,
                        weightage: '5%',
                      },
                      {
                        label: 'Final Grade 3',
                        marks: 8,
                        outOf: 10,
                        weightage: '5%',
                      },
                    ],
                  },
                ],
              });
            });
            setPreviewData(arrData);
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log(error);
        });
    }
    setPreviewData([]);
    setSelectedRow(row);
    showPreview(true);
  };
  const handlePreviewDetailed = (e, row) => {
    history.push({
      pathname: Routes.MarksUploadPreview,
      state: { selectedRow, row },
    });
  };

  useEffect(() => {
    let contactId = JSON.parse(localStorage.getItem('userDetails'))?.ContactId;
    setData([]);
    setLoading(true);
    getExamMarkBreakdown(contactId)
      .then(res => {
        console.log(res);
        if (res.length > 0) {
          let arrData = [];
          res.map(item => {
            let termName = item.Term_Code__c
              ? item.Term_Code__c.split('-')[2]
              : '-';
            arrData.push({
              Course: item?.hed__Course_Offering__r?.hed__Course__r?.Name,
              Program: '-',
              Batch: '-',
              Section: item.hed__Course_Offering__r.hed__Section_ID__c,
              'Course Code':
                item.hed__Course_Offering__r.hed__Course__r.hed__Course_ID__c,
              Term: item.Term_Code__c,
              Credit: item.hed__Course_Offering__r.hed__Course__r.Credits__c,
              course_Offering: item.hed__Course_Offering__r.Id,
              subject: item.hed__Course_Offering__r.hed__Course__r.Name,
              StudentList: [],
            });
          });
          let data = {
            Courses: arrData,
          };
          setData(data);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }, []);
  return (
    <Box className="cardlsitbox" style={{ marginBottom: '20px' }}>
      {loading ? <KenLoader /> : null}
      {Object.entries(data).map(([key, value], index) => {
        return (
          <Box style={{ marginTop: '20px' }}>
            <Accordion
              expanded={expanded === index}
              onChange={handleAccordionChange(index)}
            >
              <AccordionSummary expandIcon={accordienCheck}>
                <Grid container xs={12}>
                  <Grid item xs={11}>
                    <Typography>{key}</Typography>
                  </Grid>
                  <Grid item xs={1} style={{ textAlignLast: 'right' }}>
                    {expanded === index && accordienCheck ? (
                      <IconButton>
                        <IoIosArrowUp
                          size={20}
                          onClick={() => {
                            setExpanded(index);
                            setAccordienCheck(!accordienCheck);
                          }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton>
                        <IoIosArrowDown
                          size={20}
                          onClick={() => {
                            setExpanded(index);
                            setAccordienCheck(!accordienCheck);
                          }}
                        />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <Grid
                item
                xs={12}
                spacing={2}
                style={{ marginTop: '10px', padding: '0px 20px' }}
              >
                <KenGrid
                  columns={columns}
                  data={value}
                  pagination={{ disabled: false }}
                  toolbarDisabled={true}
                  isCollasable={false}
                  gridProps={{
                    getHeaderGroupProps: column => ({
                      style: { border: '1px solid #D2E1E9' },
                    }),
                    getHeaderProps: column => ({
                      style: {
                        background: '#090F690001A',
                        boxSizing: 'border-box',
                        color: '#090F6900099',
                        fontSize: 14,
                      },
                    }),
                    getColumnProps: column => ({
                      style: {
                        background: '#fff',
                        boxSizing: 'border-box',
                      },
                    }),
                  }}
                />
              </Grid>
            </Accordion>
            {preview && (
              <Paper style={{ marginTop: '20px' }}>
                <Grid container xs={12}>
                  <Grid item xs={12} className={classes.cardHead2}>
                    <Grid item className={classes.cardHead}>
                      <Typography className={classes.cardHeadText}>
                        Term:
                      </Typography>
                      <Typography className={classes.cardHeadText2}>
                        {cardData && cardData?.Term}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.cardHead}>
                      <Typography className={classes.cardHeadText}>
                        Course Code:
                      </Typography>
                      <Typography className={classes.cardHeadText2}>
                        {cardData && cardData?.CourseCode}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.cardHead}>
                      <Typography className={classes.cardHeadText}>
                        Course:
                      </Typography>
                      <Typography className={classes.cardHeadText2}>
                        {cardData && cardData?.Course}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.cardHead}>
                      <Typography className={classes.cardHeadText}>
                        Section:
                      </Typography>
                      <Typography className={classes.cardHeadText2}>
                        {cardData && cardData?.Section}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item className={classes.cardBox}>
                      <Typography className={classes.cardHeadText3}>
                        No. of Students:
                      </Typography>
                      <Typography className={classes.cardHeadText2}>
                        {cardData && cardData?.NoStudents}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} style={{ padding: '0px 20px' }}>
                    {previewData && (
                      <KenGrid
                        columns={columns2}
                        data={previewData}
                        pagination={{ disabled: false }}
                        toolbarDisabled={true}
                        isCollasable={false}
                        gridProps={{
                          getHeaderGroupProps: column => ({
                            style: { border: '1px solid #D2E1E9' },
                          }),
                          getHeaderProps: column => ({
                            style: {
                              background: '#090F690001A',
                              boxSizing: 'border-box',
                              color: '#090F6900099',
                              fontSize: 14,
                            },
                          }),
                          getColumnProps: column => ({
                            style: {
                              background: '#fff',
                              boxSizing: 'border-box',
                            },
                          }),
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
