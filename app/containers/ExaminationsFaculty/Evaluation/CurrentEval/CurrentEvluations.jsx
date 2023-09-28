import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import KenGrid from '../../../../global_components/KenGrid';
import KenCard from '../../../../global_components/KenCard';
// import '../../Evaluation/index.css';
import '../index.css';
import AcceptIcon from '../../../../assets/ExamantionsFaculty/AcceptIcon.svg';
import rejectIcon from '../../../../assets/ExamantionsFaculty/rejectIcon.svg';

import { KEY_USER_DETAILS } from '../../../../utils/constants';
// import { getStudentCurrentExam } from '../../../../utils/ApiService';
import KenLoader from '../../../../global_components/KenLoader';
import AlertDialog from '../../../../components/KenDialogBox';
import RejectReason from './RejectReason';
import {
  getCurrentEvalExamantionFaculty,
  postCurruntEvalExamantionFacAccept,
  postCurruntInviExamantionFacAccept,
} from '../../../../utils/ApiService';
import KenMagnifyingGlassLoader from '../../../../global_components/KenMagnifyingGlassLoader/KenMagnifyingGlassLoader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const useStyles = makeStyles(theme => ({}));

const CurrentEvluations = () => {
  const [openModel, setOpenModel] = useState(false);
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [recordId, setRecordId] = React.useState(null);
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState([
    // {
    //   id: 1,
    //   Course: 'Artificial Intelligence',
    //   Program: 'GMBA',
    //   Term: 'Term 1',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   isEligible: true,
    //   Score: 'N/A',
    // },
    // {
    //   id: 2,
    //   Course: 'Artificial Intelligence',
    //   Program: 'GMBA',
    //   Term: 'Term 2',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   isEligible: false,
    //   Score: '98/100',
    // },
    // {
    //   id: 3,
    //   Course: 'Artificial Intelligence',
    //   Program: 'GMBA',
    //   Term: 'Term 1',
    //   Date: '17-08-2022',
    //   Time: '09:00 AM',
    //   isEligible: true,
    //   Score: '86/100',
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
      Header: 'Course',
      accessor: 'Course',
      disableGlobalFilter: true,
    },
    {
      Header: `Term`,
      accessor: `Term`,
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

    // {
    //   Header: 'Score',
    //   accessor: 'Score',
    //   disableGlobalFilter: true,
    // },
    {
      Header: `Eligibility`,
      accessor: 'Eligibility',
      Cell: ({ value, row }) => {
        return (
          <>
            {console.log('rowrowrowrow', row.original, value)}

            {row.original.envReqStatus !== null ? (
              <>
                {/* {console.log()} */}
                {row.original.envReqStatus === 'Reject' ? (
                  <>
                    {' '}
                    <Button
                      variant="contained"
                      color="primary"
                      className="not_eligible_btn"
                    >
                      {'Reject'}
                    </Button>
                    {/* <img src={QuestionMarkIcon} /> */}
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="eligible_btn"
                  >
                    {'Accept'}
                  </Button>
                )}
              </>
            ) : (
              <Grid container xs={12}>
                <Grid xs={5}>
                  <img
                    // onClick={() => {
                    //   setOpenModel(true);
                    // }}
                    onClick={() => {
                      postCurruntInviExamantionAccept(row.original.id);
                    }}
                    style={{ cursor: 'pointer' }}
                    src={AcceptIcon}
                  />
                </Grid>
                <Grid xs={6}>
                  {' '}
                  <img
                    onClick={() => {
                      handleOpen(row.original.id);
                    }}
                    style={{ cursor: 'pointer' }}
                    src={rejectIcon}
                  />{' '}
                </Grid>
              </Grid>
            )}
          </>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const handleOpen = id => {
    setRecordId(id);
    setOpenModel(true);
  };
  const postCurruntInviExamantionAccept = async id => {
    try {
      const payload = [
        {
          id: id,
          envReqStatus: 'Accept',
        },
      ];

      const res = await postCurruntEvalExamantionFacAccept(
        studentDetails.ContactId,
        payload
      );

      if (!res) {
        return;
      }
      getCurruntEvalExamantionFacultyData();
    } catch (error) {
      console.log('errorerror', error);
      setLoading(false);
    }
  };

  const postCurruntInviExamantionReject = async () => {
    try {
      if (value === '') {
        toast.warn('Please add the reason', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        return;
      } else {
        const payload = [
          {
            id: recordId,
            envReqStatus: 'Reject',
            Reason: value,
          },
        ];

        const res = await postCurruntEvalExamantionFacAccept(
          studentDetails.ContactId,
          payload
        );

        if (!res) {
          return;
        }
        // alert(res);
        getCurruntEvalExamantionFacultyData();
      }
      // setLoading(true);
    } catch (error) {
      console.log('errorerror', error);
      setLoading(false);
    }
  };

  const getCurruntEvalExamantionFacultyData = async () => {
    try {
      setLoading(true);
      const res = await getCurrentEvalExamantionFaculty(
        studentDetails.ContactId
      );
      // setLoading(true);

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
    getCurruntEvalExamantionFacultyData();
  }, []);

  const handleClose = () => {
    setOpenModel(false);
  };
  return (
    <>
      {' '}
      {loading ? (
        <KenMagnifyingGlassLoader />
      ) : (
        <div className="table_main">
          <ToastContainer />
          <Grid container xs={12} className="table">
            <Grid
              container
              xs={12}
              style={{ padding: '5px' }}
              className="table"
            >
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
          <AlertDialog
            open={openModel}
            handleClose={handleClose}
            positiveButtonText={false}
            dialogActionFlag={false}
            dialogContentStyle={{ width: 'auto' }}
          >
            <RejectReason
              openModel={openModel}
              setOpenModel={setOpenModel}
              handleClose={handleClose}
              value={value}
              setValue={setValue}
              postCurruntInviExamantionReject={postCurruntInviExamantionReject}
            />
          </AlertDialog>
        </div>
      )}{' '}
    </>
  );
};

export default CurrentEvluations;
