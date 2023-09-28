import { Card, Grid, Typography } from '@material-ui/core';
import React from "react";

const PersonalDetails1 = () => {
  return (

    <Grid container
    >
      <Grid item md={6} xs={12} className="about-div-main">

        <Typography className="about-name-tab">About</Typography>
        <Typography className="about-name-description">In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.</Typography>

        <Card className="note-div">
          <div className="note-main-div">
            <Typography className="note-fact">NOTE/FUN FACT</Typography>
            <Typography className="note-fact-description">Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print</Typography>
          </div>
        </Card>
      </Grid>
      <Grid item md={3} xs={12} className="about-div-main">


        <Typography className="about-name-tab"> WORK EXPERIENCE</Typography>
        <div className="about-desc"><Typography className="about-name-tab">Co-Founder & CEO </Typography>
          <Typography className="sub-title-about">Marco</Typography>
          <Typography className="about-name-value">2018- Present</Typography>
        </div>
        <div className="about-desc"><Typography className="about-name-tab">Vice President - Operations</Typography>
          <Typography className="sub-title-about">Care Corner</Typography>
          <Typography className="about-name-value">2016 - 2018</Typography>
        </div>
        <div className="about-desc"><Typography className="about-name-tab">Sr. Manager</Typography>
          <Typography className="sub-title-about">Supa Cloth</Typography>
          <Typography className="about-name-value">2014 - 2016</Typography>
        </div>


      </Grid>
      <Grid item md={3} xs={12} className="about-div-main">
        <Typography className="about-name-tab">EDUCATION</Typography>
        <div className="about-desc"><Typography className="about-name-tab">Master of Design</Typography>
          <Typography className="sub-title-about">SP Jain School of Global Management</Typography>
          <Typography className="about-name-value">2006 - 2010</Typography>
        </div>
        <div className="about-desc"><Typography className="about-name-tab">Bachelors - Commerce</Typography>
          <Typography className="sub-title-about">Vivekananda Institute</Typography>
          <Typography className="about-name-value">2004 - 2006</Typography>
        </div>
        <div className="about-desc"><Typography className="about-name-tab">Higher Secondary</Typography>
          <Typography className="sub-title-about">Orchids High School</Typography>
          <Typography className="about-name-value">1996 - 2004</Typography>
        </div>
      </Grid>
    </Grid>

  )
}

export default PersonalDetails1