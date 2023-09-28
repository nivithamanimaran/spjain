import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Breadcrumbs, Grid, Paper, Radio } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import KenButton from '../../../global_components/KenButton';
import RatingTable from '../../../components/RatingTable';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  amtTable: {
    width: '100%',
    height: 10,
  },
  cartBody: {
    padding: '20px',
    position: 'relative',
    backgroundColor: '#edeff1',
  },
  amtTable: {
    width: '100%',
    height: 10,
  },
  tableData1: {
    width: '80%',
    textAlign: 'left',
  },
  table: {
    padding: '10px',
  },
  studentInfo: {
    // color: "#00218D",
    fontSize: '14px',
    width: '25%',
    textAlign: 'left',
  },
  studentsInfo: {
    color: '#00218D',
    fontSize: '14px',
  },
  tableData: {
    width: '20%',
    textAlign: 'left',
  },
  breadCrumbWrapper: {
    margin: '15px 0',
    fontFamily: "'Work Sans'", 
    fontStyle: "normal", 
    fontWeight: "400", 
    fontSize: "16px", 
    lineHeight: "22px", 
    display: "flex", 
    alignItems: "center", 
    color: "#092682"
  },
}));

export default function CenteredGrid() {
  const classes = useStyles();
  const [radioVal, setRadioVal] = React.useState([
    { id: 1, value: false },
    { id: 2, value: false },
    { id: 3, value: false },
    { id: 4, value: false },
    { id: 5, value: false },
    { id: 6, value: false },
    { id: 7, value: false },
    { id: 8, value: false },
    { id: 9, value: false },
    { id: 10, value: false },
  ]);
  const arrayBreadCrumb = [
    {
      head: 'My Feedback',
      color: "#505F79",
      url:"/facultFeedBack"

    },
    {
      head: 'GMBA-Business Analytics',
    },
  ];
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item md={12}>
          <Box className={classes.breadCrumbWrapper}>
            <BreadCrumb array={arrayBreadCrumb} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Box>
              <div
                style={{
                  display: 'flex',
                  marginBottom: 10,
                  textAlign: 'initial',
                  paddingLeft: '15px',
                }}
              >
                <Grid item container xs={4}>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentInfoTitle}>
                      Faculty Name :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentsInfo}>
                      Mantraraj Naik
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container xs={4}>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentInfoTitle}>
                      Program Name :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentsInfo}>
                      Global MBA
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: 10,
                  textAlign: 'initial',
                  paddingLeft: '15px',
                }}
              >
                <Grid item container xs={4}>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentInfoTitle}>
                      Subject Name :
                    </Typography>
                  </Grid>
                  <Grid itemxs={12} md={6}>
                    <Typography className={classes.studentsInfo}>
                      Business Analytics
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item container xs={4}>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentInfoTitle}>
                      Subject Code :
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.studentsInfo}>
                      MBA-0001
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Box>
            <RatingTable
              parameters={[
                'Course Structure',
                'Planning + Coordination',
                'Student Behavior',
                'Resources + Support',
                'Tech Infrastructure',
              ]}
            />
          </Paper>
        </Grid>
        {/* <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Box>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Grid item xs={4}>
                  <Typography className={classes.studentsInfo}>
                    Faculty Name : Mantraraj Naik
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.studentsInfo}>
                    Program Name : Global MBA
                  </Typography>
                </Grid>
                {<Typography className={classes.studentInfo}>
                                {t('headings:Student_Category')}: {studentCategory}
                            </Typography>}
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <Grid item xs={4} style={{ paddingLeft: '23px' }}>
                  <Typography className={classes.studentsInfo}>
                    Subject Name : Business Analytics
                  </Typography>
                </Grid>
                <Grid item xs={4} style={{ paddingRight: '25px' }}>
                  <Typography className={classes.studentsInfo}>
                    Subject Code : MBA-0001
                  </Typography>
                </Grid>
                <Typography className={classes.studentInfo}>
                                {t('headings:Student_Category')}: {studentCategory}
                            </Typography>
              </div>
            </Box>
            <Box className={classes.table}>
              <table className={classes.amtTable}>
                <Box pl={1} className={classes.cartBody}>
                  <tr
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <th className={classes.tableData}>Parameters</th>
                    <th
                      className={classes.tableData1}
                      style={{ textAlign: 'center' }}
                    >
                      Rating
                    </th>
                    <th className={classes.studentInfo}>Submit Date</th>
                    <th className={classes.studentInfo}>Last Modified Date</th>
                  </tr>
                </Box>
                <tbody>
                  <tr
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <td
                      className={classes.tableData}
                      style={{ padding: '10px' }}
                    >
                      <Typography style={{ fontSize: '15px' }}>
                        Course Structure
                      </Typography>
                    </td>
                    <td
                      className={classes.tableData1}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      {radioVal.map((item, i) => {
                        return (
                          <div key={i}>
                            {item.id}
                            <Radio
                              color="primary"
                              name="radio"
                              value={item.value}
                              onChange={e => {
                                radioChange(e, i, item);
                              }}
                            />
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <td
                      className={classes.tableData}
                      style={{ padding: '10px' }}
                    >
                      <Typography style={{ fontSize: '15px' }}>
                        Planning + Coordination
                      </Typography>
                    </td>
                    <td
                      className={classes.tableData1}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      {radioVal.map((item, i) => {
                        return (
                          <div key={i}>
                            {item.id}
                            <Radio
                              color="primary"
                              name="value"
                              value={item.value}
                              onChange={e => {
                                radioChange(e, i, item);
                              }}
                            />
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <td
                      className={classes.tableData}
                      style={{ padding: '10px' }}
                    >
                      <Typography style={{ fontSize: '15px' }}>
                        Student Behaviour
                      </Typography>
                    </td>
                    <td
                      className={classes.tableData1}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      {radioVal.map((item, i) => {
                        return (
                          <div key={i}>
                            {item.id}
                            <Radio
                              color="primary"
                              name="value"
                              value={item.value}
                              onChange={e => {
                                radioChange(e, i, item);
                              }}
                            />
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <td
                      className={classes.tableData}
                      style={{ padding: '10px' }}
                    >
                      <Typography style={{ fontSize: '15px' }}>
                        Resource + Support
                      </Typography>
                    </td>
                    <td
                      className={classes.tableData1}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      {radioVal.map((item, i) => {
                        return (
                          <div key={i}>
                            {item.id}
                            <Radio
                              color="primary"
                              name="value"
                              value={item.value}
                              onChange={e => {
                                radioChange(e, i, item);
                              }}
                            />
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                  <tr
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <td
                      className={classes.tableData}
                      style={{ padding: '10px' }}
                    >
                      <Typography style={{ fontSize: '15px' }}>
                        Tech Infrastructure
                      </Typography>
                    </td>
                    <td
                      className={classes.tableData1}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                      }}
                    >
                      {radioVal.map((item, i) => {
                        return (
                          <div key={i}>
                            {item.id}
                            <Radio
                              color="primary"
                              name={'value' + i}
                              value={item.value}
                              onChange={e => {
                                radioChange(e, i, item);
                              }}
                            />
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: 'end', paddingRight: '15px' }}>
                <KenButton
                  // className={classes.btnLabels}
                  variant="primary"
                  // style={{ height: 36, marginRight: '10px' }}
                >
                  Submit
                </KenButton>
              </div>
            </Box>
          </Paper>
        </Grid> */}
      </Grid>
    </div>
  );
}
