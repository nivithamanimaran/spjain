import {
  Box,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import KenButton from '../../../global_components/KenButton';

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    width: 32,
    height: 32,
    borderRadius: 3,
    marginRight: 8,
  },
  title: {
    color: theme.palette.KenColors.kenBlack,
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 16,
    marginLeft: -8,
  },
  typoQues: {
    color: theme.palette.KenColors.neutral400,
    fontSize: 14,
    fontWeight: 600,
  },
  options: {
    fontSize: 13,
  },
  typoExplanation: {
    color: '#2862FF',
    fontSize: 14,
    fontWeight: 600,
  },
}));

const quickNavData = [
  {
    buttonStyle: {
      background: '#CCE9E4',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#FFE8EC',
    },
    buttonTextStyle: {
      color: '#EF4060',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#FFE8EC',
    },
    buttonTextStyle: {
      color: '#EF4060',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#FFE8EC',
    },
    buttonTextStyle: {
      color: '#EF4060',
    },
  },
  {
    buttonStyle: {
      background: '#FFE8EC',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#EF4060',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
  {
    buttonStyle: {
      background: '#CCE9E4',
      padding: '0px 5px',
    },
    buttonTextStyle: {
      color: '#00B25D',
    },
  },
];

const solution = [
  {
    ques: `Which of the following set should be associated with weak entity set for weak entity to be meaningful?`,
    time: `1:58 Min`,
    options: [
      { title: 'A. Neighbour set' },
      { title: 'B. Strong entity set' },
      { title: 'C. Owner set' },
      {
        title: 'D. Identifying set',
        style: { background: '#F4F5F7' },
        typoStyle: { color: '#092682' },
      },
    ],
    index: 1,
    explanation: ` Every weak entity must be linked to an identifying entity; in other words, the existence of the weak entity set is contingent on the presence of the identifying entity set. The weak entity set that the identifying entity set identifies is said to be owned by the identifying entity set. Owner entity set is another name for it.`,
  },
  {
    ques: `Which of the following is the subset of SQL commands used to manipulate Oracle Structures, including tables?`,
    time: `1:58 Min`,
    index: 2,
    options: [
      {
        title: 'A. Data Described Language',
        style: { background: '#FFE8EC' },
        typoStyle: { color: '#EF4060' },
      },
      { title: 'B. Data Retrieval Language' },
      { title: 'C. Data Manipulation Language' },
      {
        title: 'D. Data Definition Language',
        style: { background: '#CCE9E4' },
        typoStyle: { color: '#00B25D' },
      },
    ],
    explanation: `DDLs are used to define schema and table characters and consist of commands that help in modifying. DML performs the change in the values of the relation.`,
  },
];

export default function SolutionTab() {
  const classes = useStyles();
  const [data, setData] = useState(solution[0]);
  const [value, setValue] = useState('D. Identifying set');
  return (
    <Box p={1}>
      <Box p={2} style={{ border: ' 1px solid #DFE1E6' }}>
        <Typography className={classes.title}>Quiz Navigation</Typography>
        <Grid container spacing={2} alignItems="center">
          {quickNavData.map((el, index) => {
            return (
              <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
                className={classes.buttonContainer}
                style={el.buttonStyle}
              >
                <Typography style={el.buttonTextStyle}>{index + 1}</Typography>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box mt={2}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography className={classes.typoQues}>
              {data.index}. {data.ques}
            </Typography>
          </Grid>
          <Grid item> Marks allotted: +1 Time Taken: {data.time}</Grid>
          <Grid item>
            <RadioGroup value={value} disabled>
              {data.options.map(el => {
                return (
                  <FormControlLabel
                    value={el.title}
                    control={<Radio />}
                    label={
                      <Typography
                        className={classes.options}
                        style={el.typoStyle}
                      >
                        {el.title}
                      </Typography>
                    }
                    style={el.style}
                  />
                );
              })}
            </RadioGroup>
          </Grid>
          <Grid item>
            <Typography className={classes.typoExplanation}>
              Explanation
            </Typography>
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: 13 }}>{data.explanation}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <Grid
          item
          container
          spacing={2}
          justifyContent="flex-end"
          // direction="column"
        >
          <Grid item>
            <KenButton
              variant="secondary"
              label="Previous Question"
              disabled={data.index === 1 && true}
              onClick={() => {
                setData(solution[0]);
                setValue('D. Identifying set');
              }}
            />
          </Grid>
          <Grid item>
            <KenButton
              variant="primary"
              label="Next Question"
              onClick={() => {
                setData(solution[1]);
                setValue('D. Data Definition Language');
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
