import React from 'react'
import './mentorshipProfile.css'
import {FormControlLabel, FormGroup, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Stack,useTheme,makeStyles} from '@material-ui/core';
import styled from 'styled-components';
import { Switch } from '@material-ui/core';
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(17px)',
      color: '#000000',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#E4E4E4' : '#E4E4E4',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },

  }

}));
const useStyles = makeStyles(theme => ({
  tempremove:{
    [theme.breakpoints.down('md')]:{
      display:"none !important"
    }
  }
}));
const Mentorship = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div>
      <div className='mentorProfile-main'>
        <div className='mprofilediv'>
          YOUR MENTORSHIP STATUS
        </div>
        <div className='mprofilediv'>
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
          />
          <div className='mprofileavailable'>
            Available to Mentor
          </div>
        </div>
      </div>
      <div className='mprofilemiddle'>
        <div className='mentorProfile-main'>
          <div className='mprofilesub'>
            SUBJECTS
          </div>
          <div className='mprofilesubdiv'>
            <div className='mprofilemanagement'>
              Management
            </div>
            <div className='mprofilemanagement'>
              Fashion Tech
            </div>
            <div className='mprofilenet'>
              Networking
            </div>
          </div>
        </div>
        <div className='mprofileformdiv'>
          <Typography className='mprofileformdivtypo'>CURRENT OCCUPATION</Typography>
          <FormControl className='remsResp' size="small">
            <InputLabel style={{ fontWeight: 500, color: 'black', fontSize: '14px' }} id="demo-select-small">2016 - 2020</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="2010"

            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

        </div>
        <div className='mprofileformdiv'>
          <Typography className='mprofileformdivtypo'>CURRENT OCCUPATION</Typography>
          <FormControl className='remsResp'  size="small">
            <InputLabel style={{ fontWeight: 500, color: 'black', fontSize: '14px' }} id="demo-select-small">Short Term (2 to 4 Weeks)</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="2010"

            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

        </div>
      </div>
      <div className='mentorprofilelast'>
        Your Mentorship Details
      </div>
      <div className='mentorprofilelast1'>
        <div className={`mentorProfile-main ${classes.tempremove}`}>
          <div className='mprofilesub'>
            MENTORING TOPIC
          </div>
          <div className='mentorprofilediv'>
            <div className='mentorprofilepara'>
              e.g. I can help in understanding how to
              establish a small business in Fashion industry.
            </div>
          </div>
        </div>
        <div className='mprofileformdiv'>
          <Typography className='mprofileformdivtypo'>CURRENT OCCUPATION</Typography>
          <FormControl className='remsResp' size="small">
            <InputLabel style={{ fontWeight: 500, color: 'black', fontSize: '14px' }} id="demo-select-small">30 mins</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="2010"

            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

        </div>
        <div className='mprofileformdiv'>
          <Typography className='mprofileformdivtypo'>CURRENT OCCUPATION</Typography>
          <FormControl className='remsResp' size="small">
            <InputLabel style={{ fontWeight: 500, color: 'black', fontSize: '14px' }} id="demo-select-small">GMT + 5:30 - Asia/Calcutta</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              label="2010"

            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

        </div>
      </div>
      <div className='mentorProfile-main'>
        <div className='mprofilesub'>
          AVAILABILITY IN A WEEK
        </div>
        <div className='formeProfilentordiv'>
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
          />
          <div className='mprofileavailable'>
            Monday
          </div>
          <div className='mentorProfileAvailable'>
            Available
          </div>
        </div>
        <div className='mentorprofileflex'>
          <div className='mprofileformdiv'>
            <Typography className='mprofileformdivtypo'>CURRENT OCCUPATION</Typography>
            <FormControl style={{ width: '8rem', }} size="small">
              <InputLabel style={{ fontWeight: 500, color: 'black', fontSize: '14px' }} id="demo-select-small">30 mins</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                label="2010"

              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', marginTop: '2rem', marginLeft: '0.5rem' }}>
            to
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', marginLeft: '0.5rem' }}>
            <Typography className='mprofileformdivtypo'>CURRENT OCCUPATION</Typography>
            <FormControl style={{ width: '8rem', }} size="small">
              <InputLabel style={{ fontWeight: 500, color: 'black', fontSize: '14px' }} id="demo-select-small">30 mins</InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                label="2010"

              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>

          </div>
          <div style={{ display: 'flex', fontWeight: 500, fontSize: '14px', padding: '6px', marginLeft: '1rem', marginTop: '2rem', backgroundColor: '#E4E5E5' }}>
            + Add another slot
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1rem' }}>
          <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
          />
          <div className='mprofileavailable'>
            Tuesday
          </div>
          <div className='mentorProfileAvailable'>
            Available
          </div>
        </div>
      </div>
    </div >
  )
}

export default Mentorship