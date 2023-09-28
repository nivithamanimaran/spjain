import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import ScoreSheet from '../../assets/Images/ScoreSheet.svg';
import {
  getBookedInterviewSlots,
  postAttendanceInterview,
} from '../../utils/ApiService';
import { getUserDetails } from '../../utils/helpers/storageHelper';
import { useSnackbar } from 'notistack';

const KenDialogBox = React.lazy(() =>
  import('../../global_components/KenDialogBox/index')
);
const KenLoader = React.lazy(() => import('../../components/KenLoader/index'));
const KenTabs = React.lazy(() => import('../../components/KenTabs'));
const KenButton = React.lazy(() => import('../../global_components/KenButton'));
const KenGrid = React.lazy(() => import('../../global_components/KenGrid'));
const KenSelect = React.lazy(() => import('../../global_components/KenSelect'));
const InterviewProcess = React.lazy(() =>
  import('./components/InterviewProcess')
);

const useStyles = makeStyles(theme => ({
  interviewSchedule: {
    '&>div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '&>div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '400%',
      },
    },
    '&>div>div>table>thead>tr>th>p': {
      [theme.breakpoints.down('sm')]: {
        textAlign: 'start',
        marginLeft: "11px"
      },
    },
  },
  interviewCompleted: {
    '&>div>div': {
      [theme.breakpoints.down('sm')]: {
        overflowX: 'auto',
      },
    },
    '&>div>div>table': {
      [theme.breakpoints.down('sm')]: {
        width: '250%',
      },
    },
    '&>div>div>table>thead>tr>th>p': {
      [theme.breakpoints.down('sm')]: {
        textAlign: 'start',
        marginLeft: "11px"
      },
    },
  },
  container: {
    background: theme.palette.KenColors.kenWhite,
  },
  select: {
    marginLeft: 'auto',
    width: '20%',
    marginBottom: '16px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  name: {
    color: theme.palette.KenColors.primary,
    fontSize: 14,
    fontWeight: 600,
  },
  rowValue: {
    color: theme.palette.KenColors.neutral400,
    fontSize: 12,
    fontWeight: 400,
  },
  scoreSheet: {
    textAlign: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function MyStudents(props) {
  props.setHeading("Interview")

  const classes = useStyles();
  const history = useHistory();
  const userDetails = getUserDetails();
  const [interviewScheduleData, setInterviewScheduleData] = useState([]);
  const [
    interviewScheduleCompletedData,
    setInterviewScheduleCompletedData,
  ] = useState([]);
  const [interviewScheduleDataCopy, setInterviewScheduleDataCopy] = useState(
    []
  );
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [studentIstRecordId, setStudentIstRecordId] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedFilterOption, SetSelectedFilterOption] = useState('None');
  const { enqueueSnackbar } = useSnackbar();

  const headerName = name => {
    return <Typography className={classes.name}>{name}</Typography>;
  };

  const fetchData = async () => {
    try {
      setLoader(true);
      let res = await getBookedInterviewSlots(userDetails?.ContactId);

      if (res?.success) {
        const data = [];
        const completedData = [];
        res?.data.forEach(el => {
          if (el?.isEvaluated === 'true') {
            completedData.push(el);
          } else if (el?.notAppeared === 'false') {
            data.push(el);
          }
        });
        setInterviewScheduleData([...data]);
        setInterviewScheduleDataCopy([...data]);
        setInterviewScheduleCompletedData([...completedData]);
        setLoader(false);
      }
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  useEffect(() => {
    if (interviewScheduleData) {
      handleFilterData(selectedFilterOption);
    }
  }, [selectedFilterOption]);

  const handleFilterData = value => {
    const currentDate = new Date();
    switch (value) {
      case 'None':
        {
          setInterviewScheduleData([...interviewScheduleDataCopy]);
        }
        break;

      case 'Today':
        {
          const interviewData = interviewScheduleDataCopy.filter(el => {
            const interviewDate = new Date(el.interviewDate);
            return interviewDate.toDateString() === currentDate.toDateString();
          });

          setInterviewScheduleData(interviewData);
        }
        break;

      case 'Tomorrow':
        {
          const dateRequired = new Date(currentDate);
          dateRequired.setDate(currentDate.getDate() + 1);

          const interviewData = interviewScheduleDataCopy.filter(el => {
            const interviewDate = new Date(el.interviewDate);
            return interviewDate.toDateString() === dateRequired.toDateString();
          });

          setInterviewScheduleData(interviewData);
        }
        break;

      case 'Yesterday':
        {
          const dateRequired = new Date(currentDate);
          dateRequired.setDate(currentDate.getDate() - 1);

          const interviewData = interviewScheduleDataCopy.filter(el => {
            const interviewDate = new Date(el.interviewDate);
            return interviewDate.toDateString() === dateRequired.toDateString();
          });

          setInterviewScheduleData(interviewData);
        }
        break;

      case 'Last 7 days':
        {
          const dateRequired = new Date(currentDate);
          dateRequired.setDate(currentDate.getDate() - 7);

          const interviewData = interviewScheduleDataCopy.filter(el => {
            const interviewDate = new Date(el.interviewDate);
            return (
              interviewDate >= dateRequired && interviewDate <= currentDate
            );
          });

          setInterviewScheduleData(interviewData);
        }
        break;

      case 'Last 15 days':
        {
          const dateRequired = new Date(currentDate);
          dateRequired.setDate(currentDate.getDate() - 15);

          const interviewData = interviewScheduleDataCopy.filter(el => {
            const interviewDate = new Date(el.interviewDate);
            return (
              interviewDate >= dateRequired && interviewDate <= currentDate
            );
          });

          setInterviewScheduleData(interviewData);
        }
        break;

      case 'Next 7 Days':
        {
          const dateRequired = new Date(currentDate);
          dateRequired.setDate(currentDate.getDate() + 8);

          const interviewData = interviewScheduleDataCopy.filter(el => {
            const interviewDate = new Date(el.interviewDate);
            return (
              interviewDate >= dateRequired && interviewDate <= currentDate
            );
          });

          setInterviewScheduleData(interviewData);
        }
        break;
    }
  };

  const handleAbsentStudent = async () => {
    try {
      const res = await postAttendanceInterview({
        istRecordID: studentIstRecordId,
      });
      if (res.success === true) {
        setOpen(false);
        setTrigger(!trigger);
        enqueueSnackbar('The data has been updated', { variant: 'success' });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  const column1 = [
    {
      Header: headerName('STUDENT NAME'),
      accessor: 'applicantName',
      Cell: ({ value, row }) => {
        return (
          <Typography
            className={classes.rowValue}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (
                row?.original?.applicationFormId !== null &&
                row?.original?.applicationId !== null
              ) {
                window.open(
                  `/studentDetailsInterview?applicationId=${
                    row?.original?.applicationId
                  }&applicationFormId=${row?.original?.applicationFormId}`,
                  '_blank'
                );
              } else {
                enqueueSnackbar('Something wrong with application', {
                  variant: 'warning',
                });
              }
            }}
          >
            {value}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('PROGRAM'),
      accessor: 'program',
      Cell: ({ value, row }) => {
        return <Typography className={classes.rowValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('DATE'),
      accessor: 'interviewDate',
      Cell: ({ value, row }) => {
        return <Typography className={classes.rowValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('ROUND'),
      accessor: 'round',
      Cell: ({ value, row }) => {
        return <Typography className={classes.rowValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('TIME'),
      accessor: 'startTime',
      Cell: ({ value, row }) => {
        return (
          <Typography className={classes.rowValue}>
            {moment
              .utc(`${row?.original?.interviewDate}T${value}`)
              .format('HH:mm A')}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('LINK'),
      accessor: 'meetingLink',
      Cell: ({ value, row }) => {
        return (
          <KenButton
            label="Join"
            variant="primary"
            style={{ borderRadius: 18 }}
            onClick={() => {
              window.open(value);
            }}
          />
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('SCORESHEET'),
      accessor: 'scoreSheet',
      Cell: ({ value, row }) => {
        return (
          <div className={classes.scoreSheet}>
            <img
              src={ScoreSheet}
              onClick={() => {
                history.push({
                  pathname: '/scoresheet',
                  data: row?.original,
                });
              }}
              alt="Scoresheet"
            />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('MARK ABSENT'),
      accessor: 'absent',
      Cell: ({ value, row }) => {
        return (
          <div
            className={classes.scoreSheet}
            onClick={() => {
              setStudentIstRecordId(row?.original?.istRecordId);
              setOpen(true);
            }}
          >
            <DoneAllIcon style={{ color: '#00218D', cursor: 'pointer' }} />
          </div>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const column2 = [
    {
      Header: headerName('STUDENT NAME'),
      accessor: 'applicantName',
      Cell: ({ value, row }) => {
        return (
          <Typography
            className={classes.rowValue}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (
                row?.original?.applicationFormId !== null &&
                row?.original?.applicationId !== null
              ) {
                history.push({
                  pathname: '/studentDetailsInterview',
                  state: row?.original,
                });
              } else {
                enqueueSnackbar('Something wrong with application', {
                  variant: 'warning',
                });
              }
            }}
          >
            {value}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('PROGRAM'),
      accessor: 'program',
      Cell: ({ value, row }) => {
        return <Typography className={classes.rowValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('DATE'),
      accessor: 'interviewDate',
      Cell: ({ value, row }) => {
        return <Typography className={classes.rowValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('ROUND'),
      accessor: 'round',
      Cell: ({ value, row }) => {
        return <Typography className={classes.rowValue}>{value}</Typography>;
      },
      disableGlobalFilter: true,
    },
    {
      Header: headerName('TIME'),
      accessor: 'startTime',
      Cell: ({ value, row }) => {
        return (
          <Typography className={classes.rowValue}>
            {moment
              .utc(`${row?.original?.interviewDate}T${value}`)
              .format('HH:mm A')}
          </Typography>
        );
      },
      disableGlobalFilter: true,
    },
  ];

  const filterOptions = [
    {
      label: 'None',
      value: 'None',
    },
    {
      label: 'Today',
      value: 'Today',
    },
    {
      label: 'Tomorrow',
      value: 'Tomorrow',
    },
    {
      label: 'Yesterday',
      value: 'Yesterday',
    },
    {
      label: 'Last 7 days',
      value: 'Last 7 days',
    },
    {
      label: 'Last 15 days',
      value: 'Last 15 days',
    },
    {
      label: 'Next 7 Days',
      value: 'Next 7 Days',
    },
  ];

  const data = [
    {
      title: 'INTERVIEW SCHEDULE',
      content: (
        <div>
          <Box className={classes.select}>
            <KenSelect
              options={filterOptions}
              value={selectedFilterOption}
              onChange={e => {
                SetSelectedFilterOption(e.target.value);
              }}
              label={'Filter'}
            />
          </Box>
          {interviewScheduleData.length > 0 ? (
            <div className={classes.interviewSchedule}>
              <KenGrid
                columns={column1}
                data={interviewScheduleData}
                toolbarDisabled={true}
                gridProps={{
                  getHeaderProps: () => ({
                    style: { background: '#F1F5FA' },
                  }),
                }}
              />
            </div>
          ) : (
            <h4>No Data found</h4>
          )}
        </div>
      ),
    },
    {
      title: 'INTERVIEW COMPLETED',
      content: (
        <div className={classes.interviewCompleted}>
          {interviewScheduleCompletedData.length > 0 ? (
            <KenGrid
              columns={column2}
              data={interviewScheduleCompletedData}
              toolbarDisabled={true}
              gridProps={{
                getHeaderProps: () => ({
                  style: { background: '#F1F5FA' },
                }),
              }}
            />
          ) : (
            <h4>No Data found</h4>
          )}
        </div>
      ),
    },
    {
      title: 'INTERVIEW PROCESS',
      content: <InterviewProcess />,
    },
  ];

  return (
    <React.Fragment>
      {loader && <KenLoader />}
      <Box>
        <Typography
          style={{
            marginBottom: 16,
            fontWeight: 400,
            color: '#505F79',
            opacity: 0.6,
            fontSize: 16,
          }}
        >
          Interview
        </Typography>
        <Box className={classes.container}>
          <KenTabs data={data} />
        </Box>
      </Box>
      <KenDialogBox
        open={open}
        handleClose={() => {
          setOpen(false);
        }}
        handleClickOpen={() => {
          setOpen(true);
        }}
        maxWidth="xs"
        title="CONFIRM"
        titleStyle={classes.titleHead}
        positiveButtonClick={() => {
          handleAbsentStudent();
        }}
        negativeButtonClick={() => {
          setOpen(false);
        }}
      >
        <div>
          <Typography>
            Are you certain you wish to mark this student as absent?
          </Typography>
        </div>
      </KenDialogBox>
    </React.Fragment>
  );
}
