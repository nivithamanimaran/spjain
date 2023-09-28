import { Box, Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import './viewSession.css';

const ViewSession = props => {
  const {
    courseName,
    startTime,
    endTime,
    facultyName,
    facilityName,
    activityType,
    modeOfDelivery,
  } = props;
  const { t } = useTranslation();

  return (
    <Box>
      <div className="mainDiv">
        <div
          className="childDiv"
          style={{ fontWeight: 600, fontSize: 14, margin: '0 auto' }}
        >
          {courseName}
          {/* - {sessionName} */}
          <p style={{ fontSize: 12, fontWeight: 400, color: 'gray' }}>
            Activity Type: {activityType}
          </p>
          <p style={{ fontSize: 12, fontWeight: 400, color: 'gray' }}>
            Mode Of Delivery: {modeOfDelivery}
          </p>
        </div>
      </div>

      <div className="mainDiv">
        <AiOutlineClockCircle
          color="#00218D"
          size={20}
        />
        <div className="childDiv">
          {startTime} - {endTime}
        </div>
      </div>
      <div className="mainDiv">
        <GiTeacher color="#00218D" size={20} />

        <div className="childDiv">{facultyName ? facultyName : 'N/A'}</div>
      </div>
      <div className="mainDiv">
        <FaChalkboardTeacher color="#00218D" size={20} />
        <div className="childDiv">{facilityName ? facilityName : 'N/A'}</div>
      </div>
      <Grid container style={{ justifyContent: 'center', paddingBottom: 10 }}>
        <Grid item className={''} />

      </Grid>
    </Box>
  );
};

export default ViewSession;
