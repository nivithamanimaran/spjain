import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenButton from '../../../global_components/KenButton';
import CurrentEvluations from './CurrentEval/CurrentEvluations';
import HistoryEvluations from './HistoryEval/HistoryEvluations';
import './index.css';
import ResultEvaluatin from './ResultEval/ResultEvaluatin';
const EvaluationsHome = () => {
  const [screenValue, setScreenValue] = useState(1);

  const onhandleCurrutExam = () => {
    setScreenValue(1);
  };
  const onhandleReExam = () => {
    setScreenValue(2);
  };

  const onhandleResults = () => {
    setScreenValue(3);
  };

  return (
    <>
      <div>
        {' '}
        <KenButton
          onClick={onhandleCurrutExam}
          autoFocus
          variant="contained"
          buttonClass={screenValue === 1 ? 'btn_active' : 'btn'}
          style={{ marginRight: '20px' }}
        >
          Current
        </KenButton>
        <KenButton
          onClick={onhandleReExam}
          autoFocus
          variant="contained"
          buttonClass={screenValue === 2 ? 'btn_active' : 'btn'}
          style={{ marginRight: '20px' }}
        >
          History
        </KenButton>
        <KenButton
          onClick={onhandleResults}
          autoFocus
          variant="contained"
          buttonClass={screenValue === 3 ? 'btn_active' : 'btn'}
        >
          Results
        </KenButton>
      </div>
      <div>
        {screenValue === 1 && <CurrentEvluations />}
        {screenValue === 2 && <HistoryEvluations />}
        {screenValue === 3 && <ResultEvaluatin />}
      </div>
    </>
  );
};

export default EvaluationsHome;
