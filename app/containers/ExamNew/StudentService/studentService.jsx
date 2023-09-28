import { Card, CardContent, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AnswerSheet from '../../../assets/AnswerSheet.png';
import Exams from '../../../assets/Exams.png';
import Exchange from '../../../assets/Exchange.png';
import Revaluation from '../../../assets/Revaluation.png';
import Withdrawal from '../../../assets/Widhdrawl.png';
import WithdrawlRequest from './WithdrawlRequest';
import ExchangeProgram from './ExchangeProgram';
import { useState } from 'react';
import AnswerSheetRequest from './AnswerSheetRequest';
import RevaluationRequest from './RevaluationRequest';
import ExamRequest from './ExamRequest';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    borderRadius: '8px',
  },
  header: {
    color: '#193389',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '15px',
  },
  bodytext: {
    color: '#193389',
    fontSize: '12px',
    fontWeight: 500,
  },
  image: {
    width: '9%',
    marginBottom: '10px',
  },
}));

const contentData = [
  {
    title: 'Answer Sheet',
    description: 'Request answer sheet',
    image: AnswerSheet,
  },
  {
    title: 'Revaluation',
    description: 'Apply for revaluation',
    image: Revaluation,
  },
  {
    title: 'Exams',
    description: 'Request an exam',
    image: Exams,
  },
  {
    title: 'Withdrawl',
    description: 'Withdraw from a course',
    image: Withdrawal,
  },
  {
    title: 'Program Exchange',
    description: 'Apply for program exchange',
    image: Exchange,
  },
];

export default function StudentService  (props){
  props?.setHeading("Student Service")
  const classes = useStyles();
  const [selectedContent, setSelectedContent] = useState(null);

  const handleCardClick = content => {
    setSelectedContent(content);
  };

  const handleGoBack = () => {
    setSelectedContent(null);
  };

  return (
    <div className={classes.root}>
      {!selectedContent ? (
        <Grid container spacing={2}>
          {contentData.map((content, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                className={classes.card}
                onClick={() => handleCardClick(content.title)}
              >
                <CardContent>
                  <img
                    src={content.image}
                    alt={content.title}
                    className={classes.image}
                  />
                  <div className={classes.header}>{content.title}</div>
                  <div className={classes.bodytext}>{content.description}</div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          {selectedContent === 'Withdrawl' && (
            <WithdrawlRequest onGoBack={handleGoBack} />
          )}
          {selectedContent === 'Program Exchange' && (
            <ExchangeProgram onGoBack={handleGoBack} />
          )}
          {selectedContent === 'Answer Sheet' && (
            <AnswerSheetRequest onGoBack={handleGoBack} />
          )}
          {selectedContent === 'Revaluation' && (
            <RevaluationRequest onGoBack={handleGoBack} />
          )}
          {selectedContent === 'Exams' && (
            <ExamRequest onGoBack={handleGoBack} />
          )}
        </>
      )}
    </div>
  );
};


