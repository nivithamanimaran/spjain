import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  Typography,
  useTheme,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
  Accordion,
  LinearProgress,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
// Material UI
// import LinearProgress from '@mui/material/LinearProgress';
// Global Components
import KenButton from '../../../global_components/KenButton/index';
import KenSnackBar from '../../../components/KenSnackbar';
import KenInputField from '../../../global_components/KenInputField';
import KenCard from '../../../global_components/KenCard';
import KenGrid from '../../../global_components/KenGrid';
import KenGridEditable from '../../../global_components/kenGridEditable/kenGridEditable';
import KenCheckbox from '../../../global_components/KenCheckbox/index';
import KenLoader from '../../../components/KenLoader';
import KenDialogBox from '../../../components/KenDialogBox';
import KenSelect from '../../../components/KenSelect';
import SubjectCard from '../components/SubjectCard';
// Icons
import { MdTimer, MdOutlineEditNote } from 'react-icons/md';
import { BiFilterAlt } from 'react-icons/bi';
import { RiFilePpt2Line } from 'react-icons/ri';
import { FaRegFilePdf } from 'react-icons/fa';
import { FiPlay, FiUsers } from 'react-icons/fi';
import { BsDownload } from 'react-icons/bs';
// Data
import AcademicData from './data.json';
import './style.scss';

const useStyles = makeStyles(theme => ({
  gridBox: {
    padding: '10px',
    overflow: 'hidden',
    height: '81vh',
  },
  containerBox: {
    background: '#fff',
    width: '100%',
    height: '80vh',
    borderRadius: '9px !important',
  },
  title: {
    fontSize: '11px',
    fontWeight: 600,
  },
  toolbar: {
    padding: '0px',
    width: '100%',
    borderBottom: '1px solid #D7DBE1',
    minHeight: '35px',
  },
  termBox: {
    background: '#FFF3DC',
    padding: '10px',
    textAlign: 'center',
  },
  sessionBox: {
    padding: '10px',
  },
  sessionHeader: {
    color: '#997AFF',
    fontSize: '13px',
    fontWeight: 600,
  },
  academicItems: {
    fontSize: '13px',
  },
  iconBase: {
    fontSize: '25px',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  downloadIcon: {
    fontSize: '17px',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  fileName: {
    fontSize: '13px',
    fontWeight: 600,
  },
  fileSubject: {
    fontSize: '11px',
    color: '#7A869A',
  },
  resource: {
    fontSize: '11px',
    color: '#7A869A',
    width: '100%',
    padding: '0px',
  },
  subjectCard: {
    padding: '10px !important',
  },
  iconBox: {
    height: '40px',
    width: '40px',
    margin: '5px',
  },
  subjectList: {
    height: '67vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `#d1d1d1`,
      opacity: '0.1',
      outline: `1px solid #d1d1d1`,
    },
  },
  resourceList: {
    height: '67vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `#d1d1d1`,
      opacity: '0.1',
      outline: `1px solid #d1d1d1`,
    },
  },
  subjectName: {
    inlineSize: '90px !important',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

export default function AcademicDashboard(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [currentTerm, setCurrentTerm] = useState('3');
  const [progressValue, setProgressValue] = useState(40);
  const [bufferProgress, setbufferProgress] = useState(60);
  const [academicBar, setAcademicBar] = useState([]);
  const [subjectBar, setSubjectBar] = useState([]);
  const [selectedAcademicBar, setSelectedAcademicBar] = useState('Assessments');
  const [sectionData, setSectionData] = useState([]);
  const profile = getUserDetails();
  const [user, setUser] = useState();

  React.useEffect(() => {
    setUser(profile);
    const academicBar = [];
    const subjectBar = [];
    const newData = [];
    Object.entries(AcademicData.FacultyDashboard).map((item, keyVal) => {
      academicBar.push({
        academicItem: item[0],
        data: item[1],
      });
    });
    Object.entries(AcademicData['My Subjects']).map((item, keyVal) => {
      subjectBar.push({
        key: item[0],
        data: item[1],
      });
    });
    setAcademicBar(academicBar);
    setSubjectBar(subjectBar);
    setSelectedAcademicBar(selectedAcademicBar);
    academicBar.forEach(el => {
      if (el.academicItem === selectedAcademicBar) {
        return newData.push(el);
      }
    });
    setSectionData(newData);
  }, [selectedAcademicBar]);
  const selectOverview = (e, selectedItem) => {
    setSelectedAcademicBar(selectedItem?.academicItem);
  };
  return (
    <Grid container xs={12}>
      <Grid container xs={4} className={classes.gridBox}>
        <div className="container-card">
          <KenCard className={classes.containerBox}>
            <Grid container xs={12}>
              <Toolbar className={classes.toolbar}>
                <Grid item xs={6} className={classes.headerLeft}>
                  <Typography
                    className={classes.title}
                    style={{ fontSize: '14px', fontFamily: 'Work Sans' }}
                  >
                    Academic Overview
                  </Typography>
                </Grid>
                <Grid item xs={6} className={classes.headerLeft}>
                  <Typography
                    className={classes.title}
                    style={{ color: '#00218D', textAlign: 'right' }}
                  >
                    View Academic History
                  </Typography>
                </Grid>
              </Toolbar>
              <Grid xs={12} style={{ margin: '5px 0px' }}>
                <Box className={classes.termBox}>
                  Current Term:{' '}
                  <span style={{ fontWeight: 600 }}>{currentTerm}</span>
                </Box>
              </Grid>
              <Grid xs={12} style={{ margin: '4px 0px' }}>
                <Box
                  className={classes.sessionBox}
                  style={{ border: '1px solid #D7DBE1' }}
                >
                  <Typography className={classes.sessionHeader}>
                    <MdTimer />
                    Sessions
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    valueBuffer={bufferProgress}
                  />
                  <Grid
                    container
                    xs={12}
                    style={{ width: '100%', marginTop: '15px' }}
                  >
                    <Grid container xs={6} style={{ marginTop: '8px' }}>
                      Total
                    </Grid>
                    <Grid
                      container
                      xs={6}
                      style={{ justifyContent: 'right', marginTop: '8px' }}
                    >
                      120
                    </Grid>
                    <Grid container xs={6} style={{ marginTop: '8px' }}>
                      Conducted
                    </Grid>
                    <Grid
                      container
                      xs={6}
                      style={{ justifyContent: 'right', marginTop: '8px' }}
                    >
                      80
                    </Grid>
                    <Grid container xs={6} style={{ marginTop: '8px' }}>
                      Attended
                    </Grid>
                    <Grid
                      container
                      xs={6}
                      style={{ justifyContent: 'right', marginTop: '8px' }}
                    >
                      40
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              {academicBar.map((items, index) => {
                return (
                  <Grid xs={12} style={{ margin: '5px 0px' }}>
                    <Box
                      className={classes.sessionBox}
                      onClick={e => {
                        selectOverview(e, items);
                      }}
                      style={{
                        border:
                          selectedAcademicBar != items?.academicItem
                            ? '1px solid #D7DBE1'
                            : '1px solid #00218d',
                      }}
                    >
                      <Typography
                        className={classes.academicItems}
                        style={
                          selectedAcademicBar != items?.academicItem
                            ? { color: '#000' }
                            : { color: '#00218d', fontWeight: 600 }
                        }
                      >
                        {items.academicItem} ({items.data.length})
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </KenCard>
        </div>
      </Grid>
      <Grid container xs={4} className={classes.gridBox}>
        <div className="container-card" style={{ width: '100%' }}>
          {sectionData.length > 0 ? (
            sectionData.map(data => {
              return (
                <KenCard className={classes.containerBox}>
                  <Grid container xs={12}>
                    <Toolbar className={classes.toolbar}>
                      <Grid item xs={6} className={classes.headerLeft}>
                        <Typography
                          className={classes.title}
                          style={{ fontSize: '14px', fontFamily: 'Work Sans' }}
                        >
                          {data.academicItem} ({data.data.length})
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className={classes.headerLeft}>
                        <Typography
                          className={classes.title}
                          style={{
                            color: '#00218D',
                            textAlign: 'right',
                            fontSize: '15px',
                          }}
                        >
                          <BiFilterAlt />
                        </Typography>
                      </Grid>
                    </Toolbar>
                  </Grid>
                  <div className={classes.resourceList}>
                    {data?.data.length > 0 ? (
                      data?.data.map(el => {
                        return (
                          <Grid
                            container
                            xs={12}
                            style={{
                              borderBottom: '1px solid #D7DBE1',
                              marginTop: '5px',
                            }}
                          >
                            {selectedAcademicBar === 'Resources' ? (
                              <>
                                <Grid xs={2}>
                                  {el.fileType === 'ppt' ? (
                                    <Box
                                      className={classes.iconBox}
                                      style={{ background: `${el.background}` }}
                                    >
                                      <RiFilePpt2Line
                                        className={classes.iconBase}
                                        style={{ color: `${el.color}` }}
                                      />
                                    </Box>
                                  ) : el.fileType === 'mp4' ? (
                                    <Box
                                      className={classes.iconBox}
                                      style={{ background: `${el.background}` }}
                                    >
                                      <FiPlay
                                        className={classes.iconBase}
                                        style={{ color: `${el.color}` }}
                                      />
                                    </Box>
                                  ) : el.fileType === 'pdf' ? (
                                    <Box
                                      className={classes.iconBox}
                                      style={{ background: `${el.background}` }}
                                    >
                                      <FaRegFilePdf
                                        className={classes.iconBase}
                                        style={{ color: `${el.color}` }}
                                      />
                                    </Box>
                                  ) : null}
                                </Grid>
                                <Grid
                                  xs={8}
                                  style={{ padding: '7px 0px 0px 10px' }}
                                >
                                  <Typography className={classes.fileName}>
                                    {el.fileName}.{el.fileType}
                                  </Typography>
                                  <Typography className={classes.fileSubject}>
                                    {el.subject}
                                  </Typography>
                                </Grid>
                                <Grid xs={2}>
                                  <Box style={{ height: '100%' }}>
                                    <BsDownload
                                      className={classes.downloadIcon}
                                    />
                                  </Box>
                                </Grid>
                              </>
                            ) : selectedAcademicBar === 'Assessments' ? (
                              <Grid container xs={12}>
                                <Grid xs={2}>
                                  <Box
                                    className={classes.iconBox}
                                    style={{ background: `${el.background}` }}
                                  >
                                    <MdOutlineEditNote
                                      className={classes.iconBase}
                                      style={{ color: `${el.color}` }}
                                    />
                                  </Box>
                                </Grid>
                                <Grid
                                  xs={7}
                                  style={{ padding: '0px 0px 0px 10px' }}
                                >
                                  <Typography className={classes.fileName}>
                                    {el.AssessmentName}
                                  </Typography>
                                  <Typography className={classes.fileSubject}>
                                    <p style={{ margin: 0, display: 'flex' }}>
                                      <span className={classes.subjectName}>
                                        {el.Subject}
                                      </span>
                                      <span
                                        className={classes.subjectName}
                                        style={{
                                          borderLeft: '1px solid #D7DBE1',
                                          paddingLeft: '5px',
                                        }}
                                      >
                                        {el.Course}
                                      </span>
                                    </p>
                                  </Typography>
                                </Grid>
                                <Grid xs={3}>
                                  <Typography
                                    className={classes.fileName}
                                    style={{ color: '#00218d' }}
                                  >
                                    {el.Status}
                                  </Typography>
                                  <Typography className={classes.fileSubject}>
                                    {el.DueDate}
                                  </Typography>
                                </Grid>
                              </Grid>
                            ) : null}
                          </Grid>
                        );
                      })
                    ) : (
                      <Grid
                        container
                        xs={12}
                        style={{ borderBottom: '1px solid #D7DBE1' }}
                      />
                    )}
                  </div>
                </KenCard>
              );
            })
          ) : (
            <KenCard className={classes.containerBox} />
          )}
        </div>
      </Grid>
      <Grid container xs={4} className={classes.gridBox}>
        <KenCard className={classes.containerBox}>
          <div className={classes.subjectScroll}>
            <SubjectCard user={user} module={'academics'} />
          </div>
        </KenCard>
      </Grid>
    </Grid>
  );
}
