import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import KenGrid from '../../../global_components/KenGrid';
import KenCard from '../../../global_components/KenCard';
import './index.css';
import QuestionMarkIcon from '../../../assets/Examantions/QueIcon.svg';
import InformationIcon from '../../../assets/Examantions/Information.svg';
import { useState } from 'react';
import AlertDialog from '../../../components/KenDialogBox';
import RequestApplication from './RequestApplication';
import { getRequestReExam } from '../../../utils/ApiService';
import { KEY_USER_DETAILS } from '../../../utils/constants';

const MyRequests = ({ openModel, setOpenModel }) => {
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));

  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   Type: 'Answer Sheet',
    //   Term: '3rd Sem',
    //   Course: 'Applied Physics',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: true,
    // },
    // {
    //   id: 2,
    //   Type: 'Re-Evaluation',
    //   Term: '5th Sem',
    //   Course: 'Physiology',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   Status: false,
    // },
    // {
    //   id: 3,
    //   Type: 'Re-Test',
    //   Term: '6th Sem',
    //   Course: 'French',
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
      Header: 'Type',
      accessor: 'Type',
      disableGlobalFilter: true,
    },
    {
      Header: `Term`,
      accessor: `Term`,
      disableGlobalFilter: true,
    },
    {
      Header: `Course`,
      accessor: `Course`,
      disableGlobalFilter: true,
    },
    {
      Header: `Date`,
      accessor: `Date`,
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
                  className="not_eligible_btn"
                >
                  {'Unpaid'}
                </Button>
                <img src={QuestionMarkIcon} />
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                className="eligible_btn"
              >
                {'Assigned'}
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

  const getgetRequestReExam = async () => {
    try {
      const res = await getRequestReExam(studentDetails.ContactId);
      // setLoading(true);

      if (!res) {
        return;
      }

      // const data =
      //   res.length === 0
      //     ? []
      //     : res?.map(item => {
      //         return {
      //           id: item.CourseName,
      //           Course: item.CourseName,
      //           ExamType: item.TypeofExam,
      //           ExamMode: item.ModeOfExam,
      //           Date: item.exmDate,
      //           Time: item.exmTime,
      //           isEligible: item.EligiblityStatus === 'Eligible' ? true : false,
      //           Score: item.TotalMarks,
      //         };
      //       });
      // setData(data);
      // setLoading(false);
    } catch (error) {
      console.log('errorerror', error);
    }
  };
  useEffect(() => {
    getgetRequestReExam();
  }, []);

  return (
    <div className="table_main">
      {/* <Grid className="apply-btn-grid">
        <Button
          variant="contained"
          color="primary"
          className="apply-btn-text"
          onClick={() => {
            setOpenModel(true);
          }}
        >
          {'Apply'}
        </Button>{' '}
        <img src={InformationIcon} />
      </Grid> */}
      <Grid container xs={12} className="table">
        <Grid container xs={12} style={{ padding: '5px' }} className="table">
          <Grid className="table_header haeder_title_text table_data_text">
            <KenCard paperStyles={{ padding: 0 }}>
              {/* {loading && <KenLoader />} */}

              <KenGrid
                columns={columns}
                data={data}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
                noDataText={'No Record Found'}
              />
            </KenCard>
            <div />
          </Grid>
        </Grid>
      </Grid>
      {/* Request Model Code Start Here */}
      <AlertDialog
        open={openModel}
        handleClose={handleClose}
        positiveButtonText={false}
        dialogActionFlag={false}
        dialogContentStyle={{ width: 'auto' }}
      >
        <RequestApplication
          openModel={openModel}
          setOpenModel={setOpenModel}
          handleClose={handleClose}
        />
      </AlertDialog>
    </div>
  );
};

export default MyRequests;
