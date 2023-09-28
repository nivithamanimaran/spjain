import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KenButton from '../../../global_components/KenButton';
import Current from './Current';
import './index.css';
import History from './History';
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
      <div className="btn-main-div">
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
        >
          History
        </KenButton>
      </div>
      <div>
        {screenValue === 1 && <Current />}
        {screenValue === 2 && <History />}
      </div>
    </>
  );
};

export default MyExam;
