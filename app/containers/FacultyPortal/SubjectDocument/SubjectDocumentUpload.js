import React, { Component, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
  Toolbar,
  Grid,
  Button,
  AppBar,
} from '@material-ui/core';
import './index.css';
import DropDown from '../../../components/KenSelect/index';
import KenSelectWrap from '../../../components/KenSelect';
// import KenPdfViewer from '../../../components/KenPdfViewer';

const useStyles = makeStyles(theme => ({
  back: {
    fontSize: '12px',
    '&:hover': {
      cursor: 'pointer',
    },
    marginLeft: '-8px',
  },
  iconBack: {
    height: 12,
  },
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00218D',
  },
  grid: {
    minWidth: '13.8vw',
  },
  boxContainer: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
    marginTop: '26px',
    // paddingTop: '62px',
    // paddingBottom: '30px',
  },
  boxContainer1: {
    color: theme.palette.KenColors.primary,
    marginTop: '33px',
    paddingLeft: '5%',

    // paddingTop: '62px',
    // paddingBottom: '30px',
  },
  headBox: {
    backgroundColor: theme.palette.KenColors.kenWhite,
  },
  redText: {
    color: '#EF4060',
  },
  greenText: {
    color: '#36B37E',
  },
}));

const dropdowndata = [
  {
    id: 1,
    value: 'Allotment_Letter',
    label: 'Allotment Letter',
  },
  {
    id: 2,
    value: 'Spd',
    label: 'SPD',
  },
  {
    id: 3,
    value: 'TEQSA_approved',
    label: 'TEQSA Approved',
  },
];

const pdfViwer = [
  {
    id: 1,
    value: 'Allotment_Letter',
    link: 'https://arxiv.org/pdf/quant-ph/0410100.pdf',
  },
  {
    id: 2,
    value: 'Spd',
    link: 'http://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 3,
    value: 'TEQSA_approved',
    link:
      'https://en.unesco.org/inclusivepolicylab/sites/default/files/dummy-pdf_2.pdf',
  },
];

const SubjectDocumentUpload = () => {
  const classes = useStyles();
  const [sessionValue, setsessionValue] = useState(dropdowndata[0].value);
  // const [pdfurl, setPdfUrl] = useState('');

  // const [pdfLink, setpdfLink] = useState(
  //   'https://arxiv.org/pdf/quant-ph/0410100.pdf'
  // );

  const handleSelectProgramChange = (e, value, id) => {
    // console.log('handleEventClick-------', e.target);
    // console.log('sssssssssssssssssssssssssssssssss-------', e.target.id);

    setsessionValue(e.target.value);
  };
  return (
    <div>
      {' '}
      <Box>
        <AppBar position="static" elevation={0} className={classes.header}>
          <Toolbar className="top-bar-section-doc">
            <Typography variant="h6" className={classes.title}>
              {/* My Profile */}
            </Typography>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                className="add-button"
                // onClick={() => setProfilePicUpdate(false)}
              >
                {/* <span>
                  <AddIcon />
                </span> */}
                Save
              </Button>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'start' }}>
          <Grid item xs={8}>
            <AppBar
              position="static"
              elevation={0}
              className={classes.boxContainer}
            >
              <KenSelectWrap
                // label="Type of sessions"
                options={dropdowndata}
                value={sessionValue}
                dropdownColor="#FFFFFF"
                onChange={handleSelectProgramChange}
                // defaultValue={dropdowndata[0]}
                // styles={CustomStyle}
                // required
              />
              {/* <DropDown
                options={dropdowndata}
                placeholder="Choose from template"
              /> */}
            </AppBar>
          </Grid>
          <Grid item xs={2} className={classes.boxContainer1}>
            <div class="upload-btn-wrapper">
              <Button
                variant="contained"
                color="primary"
                className="add-button"
                // onClick={() => setProfilePicUpdate(false)}
              >
                {/* <span>
                  <AddIcon />
                </span> */}
                UPLOAD
                <input type="file" name="myfile" />
              </Button>
              {/* <button class="btn">UPLOAD</button>
              <input type="file" name="myfile" /> */}
            </div>
          </Grid>
          <Grid item xs={2} className={classes.boxContainer1}>
            <Button
              variant="contained"
              color="primary"
              className="add-button"
              // onClick={() => setProfilePicUpdate(false)}
            >
              {/* <span>
                  <AddIcon />
                </span> */}
              Download
            </Button>
          </Grid>
        </Grid>

        {pdfViwer.map((item, index) => {
          return (
            item.value === sessionValue && (
              <AppBar
                position="static"
                elevation={0}
                className={classes.boxContainer}
              >
                <div style={{ height: '100px', paddingBottom: '20px' }}>
                  {console.log(
                    'sessionValuesessionValuesessionValue',
                    sessionValue
                  )}
                  {/* <KenPdfViewer pdfFileUrl={pdfLink} />{' '} */}
                  {/* <KenPdfViewer
                    pdfFileUrl={item.link}
                  /> */}
                </div>
              </AppBar>
            )
          );
        })}
      </Box>
    </div>
  );
};

export default SubjectDocumentUpload;
