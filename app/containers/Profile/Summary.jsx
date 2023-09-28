import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from '@material-ui/core';
import React from 'react';
import KenButton from '../../global_components/KenButton';
import KenInput from '../../components/KenInputField';
import KenSelect from '../../global_components/KenSelect';
import KenTextField from '../../components/KenInputField';
import { useHistory } from 'react-router-dom';
import Routes from '../../utils/routes.json';
const Summary = ({
  Graduated,
  setGraduated,
  Degree,
  setDegree,
  Location,
  setLocation,
  Occupation,
  setOccupation,
  Company,
  setCompany,
  Title,
  setTitle,
  fb,
  setfb,
  twitter,
  settwitter,
  lik,
  setlik,
}) => {
  const allPrograms = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  const history = useHistory();
  const { ContactId } = JSON.parse(localStorage.getItem('userDetails'));
  return (
    <>
      <Grid container className="summary-main-div">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} className="summary-sub-div">
            <KenSelect
              name="program"
              required
              select
              label="Graduated In"
              onChange={e => setGraduated(e.target.value)}
              // labelClassName={classes.selectBox}
              options={allPrograms}
              value={Graduated}
            />
          </Grid>
          <Grid item xs={12}  md={3} className="summary-sub-div summary-degree-div">
            <KenSelect
              name="program"
              required
              select
              label="Degree"
              onChange={e => setDegree(e.target.value)}
              options={allPrograms}
              value={Degree}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        style={{ marginTop: 16 }}
        className="summary-main-div summary-location "
      >
        <Grid item xs={12}  md={3} className="summary-sub-div">
          <KenSelect
            name="program"
            required
            select
            label="Current Location"
            onChange={e => setLocation(e.target.value)}
            // labelClassName={classes.selectBox}
            options={allPrograms}
            value={Location}
          />
        </Grid>
        <Grid item xs={12}  md={3} className="summary-sub-div summary-degree-div">
          <KenSelect
            name="program"
            required
            select
            label="Current Occupation"
            onChange={e => setOccupation(e.target.value)}
            // labelClassName={classes.selectBox}
            options={allPrograms}
            value={Occupation}
          />
        </Grid>
        <Grid item  xs={12} md={3} className="summary-sub-div summary-degree-div">
          <KenSelect
            name="program"
            required
            select
            label="Current Company"
            onChange={e => setCompany(e.target.value)}
            // labelClassName={classes.selectBox}
            options={allPrograms}
            value={Company}
          />
        </Grid>
        <Grid item  xs={12} md={3} className="summary-sub-div summary-degree-div">
          <KenSelect
            name="program"
            required
            select
            label="Current Title"
            onChange={e => setTitle(e.target.value)}
            // labelClassName={classes.selectBox}
            options={allPrograms}
            value={Title}
          />
        </Grid>
      </Grid>
      <Grid style={{ marginTop: 16 }}>
        <KenTextField rows={3} label="Hobbies & Interest" />
      </Grid>
      <Grid container spacing={2} style={{ marginTop: 16 }}>
        <Grid item  xs={12} md={3}>
          <KenTextField
            label="LinkedIn Profile Link"
            value={lik}
            onChange={e => setlik(e.target.value)}
          />
        </Grid>
        <Grid item  xs={12}  md={3}>
          <KenTextField
            label="Facebook Profile Link"
            value={fb}
            onChange={e => setfb(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}  md={3}>
          <KenTextField
            label="Twitter Profile Link"
            value={twitter}
            onChange={e => settwitter(e.target.value)}
          />
        </Grid>
      </Grid>
      <div className="btndivend">
        <KenButton
          style={{ backgroundColor: '#DFDFE3', color: 'black' }}
          className="respButton"
          onClick={() => {
            history.push(`/${Routes.Profile}/${ContactId}`);
          }}
        >
          Discard Changes
        </KenButton>
        <KenButton variant="primary">Save</KenButton>
      </div>
    </>
  );
};
export default Summary;
