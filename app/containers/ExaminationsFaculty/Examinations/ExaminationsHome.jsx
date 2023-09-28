import {
  Button,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import KenGrid from '../../../global_components/KenGrid';
import KenCard from '../../../global_components/KenCard';
import './index.css';
import EditIcon from '../../../assets/ExamantionsFaculty/EditIcon.svg';

import ViewIconEye from '../../../assets/ExamantionsFaculty/ViewIconEye.svg';
import { useState } from 'react';
import AlertDialog from '../../../components/KenDialogBox';
// import RequestApplication from './RequestApplication';
// import { getRequestReExam } from '../../../utils/ApiService';
import { KEY_USER_DETAILS } from '../../../utils/constants';
import { getExamantionFaculty } from '../../../utils/ApiService';
import KenMagnifyingGlassLoader from '../../../global_components/KenMagnifyingGlassLoader/KenMagnifyingGlassLoader';

const ExaminationsHome = ({ openModel, setOpenModel }) => {
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));
  const kenTheme = useTheme();
  const isMobileScreen = useMediaQuery(kenTheme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(false);

  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   Program: 'GMBA',
    //   Term: '3rd Sem',
    //   Course: 'Artificial Intelligence',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: true,
    // },
    // {
    //   id: 2,
    //   Program: 'EMBA',
    //   Term: '5th Sem',
    //   Course: 'Python',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: false,
    // },
    // {
    //   id: 3,
    //   Program: 'BBA',
    //   Term: '6th Sem',
    //   Course: 'Graphic Design',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: true,
    // },
  ]);

  // Header
  const columns = [
    // {
    //   Header: '#',
    //   accessor: 'id',
    //   disableGlobalFilter: true,
    // },
    {
      Header: 'Program',
      accessor: 'Program',
      disableGlobalFilter: true,
    },

    {
      Header: `Course`,
      accessor: `Course`,
      disableGlobalFilter: true,
    },
    {
      Header: `Term`,
      accessor: `Term`,
      disableGlobalFilter: true,
    },
    {
      Header: `Action`,
      accessor: 'Action',
      Cell: ({ value, row }) => {
        return (
          <>
            {data[row.id].Status === false ? (
              <>
                {' '}
                <img src={EditIcon} />
              </>
            ) : (
              <img src={ViewIconEye} />
            )}
          </>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: `Status`,
      accessor: 'Status',
      Cell: ({ value, row }) => {
        return (
          <>
            {data[row.id].Status === false ? (
              <>
                {' '}
                <Button
                  variant="contained"
                  color="primary"
                  className="eligible_btn"
                >
                  {'Approved'}
                </Button>
                {/* <img src={QuestionMarkIcon} /> */}
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className=" not_eligible_btn"
              >
                {'Submitted'}
              </Button>
            )}
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const handleClose = () => {
    setOpenModel(false);
  };

  const getExamantionFacultyData = async () => {
    try {
      setLoading(true);
      const res = await getExamantionFaculty(studentDetails.ContactId);

      if (!res) {
        return;
      }

      console.log('resresresresresresres', res[0]?.CourseList);
      const data =
        res?.length === 0
          ? []
          : res[0]?.CourseList?.map(item => {
              console.log('itemitemitemitemitemitemitemitemitem', item);
              return {
                id: item.Id,
                Course: item.CourseName ? item.CourseName : '',
                Program: item.programeName ? item.programeName : '',
                Term: item.TermName ? item.TermName : '',
                // Date: item.exmDate,
                // Time: item.exmTime,
                Status: item.EligiblityStatus === 'Eligible' ? true : false,
                // Score: item.TotalMarks,
              };
            });
      setData(data);
      setLoading(false);
    } catch (error) {
      console.log('errorerror', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getExamantionFacultyData();
  }, []);

  return (
    <div className="table_main">
      {loading ? (
        <KenMagnifyingGlassLoader />
      ) : (
        <Grid container xs={12} className="table">
          <Grid container xs={12} style={{ padding: '5px' }} className="table">
            <Grid className="table_header haeder_title_text table_data_text">
              {isMobileScreen ? (
                data?.map(item => {
                  return (
                    <KenCard>
                      <Grid container>
                        <Grid xs={8}>
                          {item.Status === false ? (
                            <>
                              {' '}
                              <Button
                                variant="contained"
                                color="primary"
                                className="eligible_btn"
                              >
                                {'Approved'}
                              </Button>
                              {/* <img src={QuestionMarkIcon} /> */}
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              className=" not_eligible_btn"
                            >
                              {'Submitted'}
                            </Button>
                          )}
                        </Grid>
                        <Grid
                          xs={4}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {' '}
                          {item.Status === false ? (
                            <>
                              <img src={EditIcon} width={21} />
                            </>
                          ) : (
                            <img src={ViewIconEye} />
                          )}
                        </Grid>
                      </Grid>
                      <div className="content-div">
                        <Typography className="titleTextMobile">
                          Program
                        </Typography>
                        <Typography className="titleContentMobile">
                          {item.Program}
                        </Typography>
                      </div>
                      <div className="content-div">
                        <Typography className="titleTextMobile">
                          term
                        </Typography>
                        <Typography className="titleContentMobile">
                          {item.Term}
                        </Typography>
                      </div>
                      <div className="content-div">
                        <Typography className="titleTextMobile">
                          course
                        </Typography>
                        <Typography className="titleContentMobile">
                          {item.Course}
                        </Typography>
                      </div>
                    </KenCard>
                  );
                })
              ) : (
                <KenCard paperStyles={{ padding: 0 }}>
                  {/* {loading && <KenLoader />} */}

                  <KenGrid
                    columns={columns}
                    data={data}
                    pagination={{ disabled: true }}
                    toolbarDisabled={true}
                    isCollasable={false}
                    noDataText={'No Record Found'}
                    gridProps={{
                      getHeaderProps: cell => ({
                        style: {
                          width: '21%',
                        },
                      }),
                    }}
                  />
                </KenCard>
              )}
              <div />
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* Request Model Code Start Here */}
    </div>
  );
};

export default ExaminationsHome;
