import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import './Faculty.css';
import {
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import KenInputField from '../../components/KenInputField';
import KenSelect from '../../global_components/KenSelect';


const PersonalDetails = ({
  state,
  setState,
  personalDetails,
  setpersonalDetails,
  onChange,
  onSubmit,
  onCancel,
}) => {

  const { t } = useTranslation();
  const [data, setData] = useState(state);
  const gender = [
    {
      label: 'Male',
      value: 'Male',
    },
    {
      label: 'Female',
      value: 'Female',
    },
    {
      label: 'Decline to state',
      value: 'Decline to state',
    },
  ];

  const handleSubmit = () => {
    onSubmit();
  };

  useEffect(() => {
    setData(state);
  }, [state]);

  const onCancelHandle = () => {
    onCancel();
  };
  const handleChangeInput = evt => {
    onChange(evt);
  };

  return (
    <>
      {personalDetails ? (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <KenInputField
              label="First Name"
              name="firstName"
              value={data.firstName}
              dropdownColor="#FFFFFF"
              onChange={e => {
                handleChangeInput(e);
              }}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <KenInputField
              label="Family/Last Name"
              name="lastName"
              value={data.lastName}
              dropdownColor="#FFFFFF"
              onChange={e => {
                handleChangeInput(e);
              }}
              disabled={true}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            {/* <KenInputField
              label="Gender"
              name="Gender"
              value={data.Gender}
              dropdownColor="#FFFFFF"
              onChange={e => {
                handleChangeInput(e);
              }}
            /> */}
            <KenSelect
              label="Gender"
              name="Gender"
              options={gender}
              value={data.Gender}
              onChange={e => {
                handleChangeInput(e);
              }}
              required={true}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <KenInputField
              label="Date of Birth"
              name="BirthDate"
              value={data.BirthDate}
              dropdownColor="#FFFFFF"
              type="date"
              onChange={e => {
                handleChangeInput(e);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <KenInputField
              label="Nationality"
              name="CountryOfResidence"
              value={data.CountryOfResidence}
              dropdownColor="#FFFFFF"
              onChange={e => {
                handleChangeInput(e);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <KenInputField
              label="Email ID"
              name="EmailID"
              value={data.Email}
              dropdownColor="#FFFFFF"
              onChange={e => {
                handleChangeInput(e);
              }}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <KenInputField
              label="Mobile Number"
              name="Phone"
              value={data.Phone}
              dropdownColor="#FFFFFF"
              onChange={e => {
                handleChangeInput(e);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} />
          <div className="btn-save-cancel">
            <div className="save-btn">
              <Button
                variant="contained"
                color="primary"
                className="btnMargin"
                // style={{ minWidth: '100%' }}
                onClick={() => handleSubmit()}
              >
                Save
              </Button>{' '}
            </div>
            <div>
              <Button
                variant="contained"
                className="cancel-btn"
                style={{ backgroundColor: 'gray', color: 'white' }}
                onClick={() => onCancelHandle()}
              >
                Cancel
              </Button>{' '}
            </div>
          </div>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} />
          <Grid item xs={12} sm={3}>
            <b className="text-size">Name:</b>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography className="userName">
              {data.firstName} {data.lastName}{' '}
              {!data.firstName && !data.lastName && 'N/A'}
              {/* {data.firstName?.toUpperCase()}{' '}
                    {data.lastName?.toUpperCase()} */}
            </Typography>{' '}
          </Grid>
          <Grid item xs={12} sm={3}>
            <b className="text-size">Gender:</b>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography>{data.Gender ? data.Gender : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <b className="text-size">Birthday :</b>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography>{data.BirthDate ? data.BirthDate : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <b className="text-size">Phone :</b>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography>{data.Phone ? data.Phone : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <b className="text-size">Email :</b>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography>{data.Email ? data.Email : 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <b className="text-size">Country of Residence :</b>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography>
              {data.CountryOfResidence ? data.CountryOfResidence : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PersonalDetails;
