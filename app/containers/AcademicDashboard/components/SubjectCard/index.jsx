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
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KenCard from '../../../../global_components/KenCard';
// Icons
import { BiPencil } from 'react-icons/bi';
import { GrDocumentText } from 'react-icons/gr';
import { FiUsers } from 'react-icons/fi';
// Data
import AcademicData from '../../data.json';
import '../..//style.scss';

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
    // borderBottom: '1px solid #D7DBE1',
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
  icons: {
    color: '#090F69',
    fontSize: '14px',
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
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `#787878`,
      opacity: '0.1',
      outline: `1px solid #787878`,
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
      backgroundColor: `#787878`,
      opacity: '0.1',
      outline: `1px solid #787878`,
    },
  },
  subjectName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  star: {
    textAlign: 'right',
    width: '100%',
    float: 'right',
    marginRight: '11px',
    fontSize: '17px',
  },
  headerLeft: {
    width: '100%',
    justifyContent: 'space-between',
  },
}));

const CircularProgressProp = props => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        width: '40px',
      }}
      style={props.module === 'dashboard' ? { left: '16%' } : { left: '0%' }}
    >
      <CircularProgress
        variant="determinate"
        value={props?.value}
        style={{ width: '100%', height: '100%' }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};
export default function SubjectCard(props) {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { user, module } = props;
  const [loading, setLoading] = React.useState(false);
  const [subjectBar, setSubjectBar] = useState([]);

  React.useEffect(() => {
    const subjectBar = [];
    Object.entries(AcademicData['My Subjects']).map((item, keyVal) => {
      subjectBar.push({
        key: item[0],
        data: item[1],
      });
    });
    setSubjectBar(subjectBar);
  }, []);
  const handleViewSubject = () => {
    user?.Type === 'Student'
      ? history.push('/academics')
      : history.push('/facultyAcademics');
  };

  const showSubjectDetail = (e, item, index) => {
    console.log('e, item, index', e, item, index);
    history.push({
      pathname: `/class`,
      state: { data: subjectBar, selected: item },
    });
  };
  return (
    <Grid container xs={12}>
      <div className="container-card">
        <Grid container xs={12}>
          <Toolbar className={classes.toolbar}>
            <Grid item container xs={12} className={classes.headerLeft}>
              <Typography
                className={classes.title}
                style={{ fontSize: '14px', fontFamily: 'Work Sans' }}
              >
                {user?.Type === 'Student' ? 'MY SUBJECTS' : 'MY CLASSES'} (
                {subjectBar != undefined ? subjectBar?.length : 0})
              </Typography>
              <Typography
                style={{ fontSize: '13px', cursor: 'pointer' }}
                onClick={handleViewSubject}
              >
                View All
              </Typography>
            </Grid>
          </Toolbar>
        </Grid>
        <Grid
          container
          xs={12}
          className={classes.subjectList}
          style={
            module === 'dashboard' ? { height: '45vh' } : { height: '67vh' }
          }
        >
          {subjectBar.map((item, index) => {
            return (
              <Grid container xs={6} style={{ padding: '5px' }}>
                <div className="subjectCard">
                  <KenCard className="subject-card">
                    <Grid
                      xs={12}
                      style={{
                        height: '55px',
                        background: `${item.data.background}`,
                        padding: '10px',
                        marginBottom: '5px',
                        position: 'relative',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, 0%)',
                        borderRadius: '9px',
                        textAlign: 'center',
                      }}
                      onClick={e => showSubjectDetail(e, item, index)}
                    >
                      {item.data['Subject Name']}
                    </Grid>
                    <Grid container xs={12}>
                      <Grid
                        xs={4}
                        style={{
                          overflow: 'hidden',
                          borderRight: '1px solid #d7dbe1',
                        }}
                      >
                        <CircularProgressProp
                          value={item.data.percentage}
                          module={module}
                        />
                      </Grid>
                      <Grid container xs={8} style={{ paddingLeft: '3px' }}>
                        <Grid xs={10}>
                          <Typography className={classes.resource}>
                            <GrDocumentText className={classes.icons} />{' '}
                            Resource:
                          </Typography>
                        </Grid>
                        <Grid xs={2}>
                          <Typography className={classes.resource}>
                            {item.data['resource']}{' '}
                          </Typography>
                        </Grid>
                        <Grid xs={10}>
                          <Typography className={classes.resource}>
                            <BiPencil className={classes.icons} /> Activities:
                          </Typography>
                        </Grid>
                        <Grid xs={2}>
                          <Typography className={classes.resource}>
                            {item.data['activities']}{' '}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {user?.Type != 'Student' ? (
                      <Grid
                        container
                        xs={12}
                        style={{
                          borderTop: '1px solid #D7DBE1',
                          paddingTop: '10px',
                        }}
                      >
                        <Grid xs={6}>{item.data.class}</Grid>
                        <Grid xs={6} style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              background: '#D7DBE1',
                              padding: '3px',
                              borderRadius: '4px',
                            }}
                          >
                            <FiUsers /> <b>{item.data.NoOfStudents}</b>
                          </span>
                        </Grid>
                      </Grid>
                    ) : null}
                  </KenCard>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </div>
    </Grid>
  );
}
