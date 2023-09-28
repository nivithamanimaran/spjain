import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  table: {
    border: '1px solid #DFE1E6',
  },
  tableRow: {
    border: '1px solid #DFE1E6',
    padding: 16,
  },
  answer: {
    width: 32,
    height: 32,
    borderRadius: '50%',
  },
  typoText: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.KenColors.neutral400,
  },
  correctAnswer: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: `1px solid ${theme.palette.KenColors.kenBlack}`,
  },
  typoCorrectAnswer: {
    color: theme.palette.KenColors.kenBlack,
  },
  chips: {
    background: '#DFE8FF',
    borderRadius: 43,
    padding: 8,
    marginRight: 8,
  },
  typoChip: {
    color: theme.palette.KenColors.primary,
    fontSize: 12,
  },
}));

const data = [
  {
    ques: `Which of the following set should be associated with weak entity set for weak entity to be meaningful?`,
    related: ['DBMS', 'MCQ'],
    answer: 'D',
    answerStyle: { color: '#00B25D', background: '#CCE9E4' },
    correctAnswer: 'D',
    marks: 1,
  },
  {
    ques: `Every weak entity must be linked to an identifying entity; in other words, the existence of the weak entity set is contingent on the presence of the identifying entity set. The weak entity set that the identifying entity set identifies is said to be owned by the identifying entity set. Owner entity set is another name for it.`,
    related: ['DBMS', 'MCQ'],
    answer: 'A',
    answerStyle: { color: '#EF4060', background: '#FFE8EC' },
    correctAnswer: 'D',
    marks: 1,
  },
  {
    ques: ` _______ indicates the maximum number of entities that can be involved in a relationship.`,
    related: ['DBMS', 'MCQ'],
    answer: 'C',
    answerStyle: { color: '#00B25D', background: '#CCE9E4' },
    correctAnswer: 'C',
    marks: 1,
  },
  {
    ques: `The traditional storage of data organized by the customer, stored in separate folders in filing cabinets is an example of ______________ type of ‘database’ management system.`,
    related: ['DBMS', 'MCQ'],
    answer: 'D',
    answerStyle: { color: '#EF4060', background: '#FFE8EC' },
    correctAnswer: 'B',
    marks: 1,
  },
  {
    ques: ` When the “ROLLUP” operator for expression or columns within a “GROUP BY” clause is used?`,
    related: ['DBMS', 'MCQ'],
    answer: 'C',
    answerStyle: { color: '#00B25D', background: '#CCE9E4' },
    correctAnswer: 'C',
    marks: 1,
  },
];

export default function QuestionReportTab() {
  const classes = useStyles();
  return (
    <Box p={1}>
      <table className={classes.table}>
        <tr>
          <th className={classes.tableRow}>
            <Typography className={classes.typoText}>Questions</Typography>
          </th>
          <th className={classes.tableRow}>
            <Typography className={classes.typoText}>Your Answer</Typography>
          </th>
          <th className={classes.tableRow}>
            <Typography className={classes.typoText}>Correct Answer</Typography>
          </th>
          <th className={classes.tableRow}>
            <Typography className={classes.typoText}>Marks</Typography>
          </th>
        </tr>
        {data.map((el, index) => {
          return (
            <tr>
              <td className={classes.tableRow}>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.typoText}>
                      {index + 1}. {el.ques}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <>
                      <Grid container>
                        {el.related.map(elem => {
                          return (
                            <Grid item className={classes.chips}>
                              <Typography className={classes.typoChip}>
                                {elem}
                              </Typography>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </>
                  </Grid>
                </Grid>
              </td>
              <td className={classes.tableRow}>
                <Box p={2}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={classes.answer}
                    style={el.answerStyle}
                  >
                    <Grid item>
                      <Typography>{el.answer}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </td>
              <td className={classes.tableRow}>
                <Box p={2}>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={classes.correctAnswer}
                  >
                    <Grid item>
                      <Typography className={classes.typoCorrectAnswer}>
                        {el.correctAnswer}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </td>
              <td className={classes.tableRow}>
                <Box p={2}>
                  <Grid container justifyContent="center">
                    <Grid item>
                      <Typography className={classes.typoText}>
                        {el.marks}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </td>
            </tr>
          );
        })}
      </table>
    </Box>
  );
}
