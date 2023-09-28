import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { MagnifyingGlass } from 'react-loader-spinner';

import VisibilityIcon from '@material-ui/icons/Visibility';
import KenGrid from '../../../../global_components/KenGrid';
import KenCard from '../../../../global_components/KenCard';
import '../index.css';
import QuestionMarkIcon from '../../../../assets/Examantions/QueIcon.svg';
import {
  getCurrentEvalExamantionFaculty,
  getStudentReExam,
} from '../../../../utils/ApiService';
import { KEY_USER_DETAILS } from '../../../../utils/constants';
import KenLoader from '../../../../global_components/KenLoader';
import KenMagnifyingGlassLoader from '../../../../global_components/KenMagnifyingGlassLoader/KenMagnifyingGlassLoader';

const HistoryEvluations = () => {
  const [loading, setLoading] = useState(false);
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));

  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   Term: 'Term 1',
    //   Course: 'Artificial Intelligence',
    //   Program: 'GMBA',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: true,
    // },
    // {
    //   id: 2,
    //   Term: 'Term 1',
    //   Course: 'Artificial Intelligence',
    //   Program: 'BBA',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: false,
    // },
    // {
    //   id: 3,
    //   Term: 'Term 1',
    //   Course: 'Artificial Intelligence',
    //   Program: 'EMBA',
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
      Header: `Program`,
      accessor: `Program`,
      disableGlobalFilter: true,
    },

    {
      Header: 'Course',
      accessor: 'Course',
      disableGlobalFilter: true,
    },
    {
      Header: 'Term',
      accessor: 'Term',
      disableGlobalFilter: true,
    },

    {
      Header: `Date`,
      accessor: `Date`,
      disableGlobalFilter: true,
    },
    {
      Header: `Time`,
      accessor: `Time`,
      disableGlobalFilter: true,
    },

    {
      Header: `Status`,
      accessor: 'Status',
      Cell: ({ value, row }) => {
        return (
          <>
            {row.original.envReqStatus === 'Reject' && (
              <>
                {' '}
                <Button
                  variant="contained"
                  color="primary"
                  className="not_eligible_btn"
                >
                  {'Rejected'}
                </Button>
                <Tooltip title="Reason for Rejection" placement="top-end">
                  <img src={QuestionMarkIcon} />
                </Tooltip>
              </>
            )}
            {row.original.envReqStatus === 'Accept' && (
              <Button
                variant="contained"
                color="primary"
                className="eligible_btn"
              >
                {'Accepted'}
              </Button>
            )}{' '}
            {row.original.envReqStatus == null && (
              <Button
                variant="contained"
                color="primary"
                className="eligible_btn"
              >
                {'Pending'}
              </Button>
            )}
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const getCurruntEvalExamantionFacultyHistoryData = async () => {
    try {
      setLoading(true);

      const res = await getCurrentEvalExamantionFaculty(
        studentDetails.ContactId
      );

      if (!res) {
        return;
      }

      const data =
        res.length === 0
          ? []
          : res?.data[0]?.ExamDetails?.map(item => {
              return {
                id: item.id,
                Course: item.CoursName,
                Program: item.ProgramePlan,
                Term: item.TermName,
                Date: item.exmdate,
                Time: item.exmTime,
                isEligible: false,
                envReqStatus: item.envReqStatus,
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
    getCurruntEvalExamantionFacultyHistoryData();
  }, []);

  return (
    <div className="table_main">
      {loading ? (
        <KenMagnifyingGlassLoader />
      ) : (
        <Grid container xs={12} className="table">
          <Grid container xs={12} style={{ padding: '5px' }} className="table">
            <Grid className="table_header haeder_title_text table_data_text">
              <KenCard paperStyles={{ padding: 0 }}>
                <KenGrid
                  columns={columns}
                  data={data}
                  pagination={{ disabled: true }}
                  toolbarDisabled={true}
                  isCollasable={false}
                  noDataText={'No Record Found'}
                  styleprops={{ width: '150px' }}
                  gridProps={{
                    getHeaderProps: cell => ({
                      style: {
                        width: '17%',
                      },
                    }),
                  }}
                />
              </KenCard>
              <div />
            </Grid>
          </Grid>
        </Grid>
      )}
      {console.log('loading', loading)}
    </div>
  );
};

export default HistoryEvluations;
