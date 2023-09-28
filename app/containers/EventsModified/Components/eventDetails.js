import React from 'react';
import { Box, Fade, Modal, Typography, useTheme, useMediaQuery, Divider, Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'

import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import MovieCreationOutlinedIcon from '@material-ui/icons/MovieCreationOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Event from '../../../assets/Event.png'
import './index.css';
import { useHistory } from "react-router-dom";
import WebAssetIcon from '@material-ui/icons/WebAsset';
import FreeForAll from '../../../assets/Icon.png'
import { HiCash } from "react-icons/hi";
import AlertDialog from '../../../components/KenDialogBox';
// import sessionLogoutBox from '../../../utils/sessionLogoutBox/sessionLogoutBox';
// import KenDialog from '../../../global_components/KenDialog';

// const handleClose = () => console.log("res-------------->>","kavin");
function EventDetails() {
  const history = useHistory();
  function handleClick() {
    history.push("/eventDetails1");
  }
  return (
    <div >
      <Box className='container'>
        <Box >
          <img src={Event} alt="" className='imageSize' />
        </Box>
        <Box className='cardContainer'>
          <Typography className='Title'>New Age of Eco-Friendly Fashion..</Typography>
          <div className='containerContent'>
            <Grid container>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={2} >
                    <AccessTimeIcon className='IconStyle' />
                  </Grid>
                  <Grid item xs={8} className='alignItems'>
                    <Typography className='fontSize'>4PM – 4:45PM IST</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2} >
                    <LocationOnOutlinedIcon className='IconStyle' />
                  </Grid>
                  <Grid item xs={8} className='alignItems'>
                    <Typography className='fontSize'>Bangalore, India</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2} >
                    <HiCash className='IconStyle1' />
                  </Grid>
                  <Grid item xs={8} className='alignItems'>
                    <Typography className='fontSize'>Free for all</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <Box className='RightContainer'>
                  <Grid container className='RightArea'>
                    <Grid item xs={5.5}>
                      <Typography className='Day'>08</Typography>
                    </Grid>
                    <Grid item xs={5} className='monthArea'>
                      <Typography className='month'>OCT</Typography>
                    </Grid>
                  </Grid>
                  <Button
                    className='button'
                    type="button"
                    onClick={handleClick}>
                    Register
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Box>

      </Box>
    </div>
  )
}

export default EventDetails;