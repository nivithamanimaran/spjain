import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenButton from '../../../global_components/KenButton';
import CurrentExam from './CurrentExam';
import './index.css';
import ReExam from './ReExam';
const MyExam = () => {
  const [screenValue, setScreenValue] = useState(1);

  const onhandleCurrutExam = () => {
    setScreenValue(1);
  };
  const onhandleReExam = () => {
    setScreenValue(2);
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
          Current Exam
        </KenButton>
        <KenButton
          onClick={onhandleReExam}
          autoFocus
          variant="contained"
          buttonClass={screenValue === 2 ? 'btn_active' : 'btn'}
        >
          Re-Exam
        </KenButton>
      </div>
      <div>
        {screenValue === 1 && <CurrentExam />}
        {screenValue === 2 && <ReExam />}
      </div>
    </>
  );
};

export default MyExam;
