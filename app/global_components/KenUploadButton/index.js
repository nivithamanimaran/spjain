import { Box, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles(theme => ({
  label: {
    color: '#090F69',
    fontSize: '12px',
    lineHeight: '16px',
  },
  container: {
    background: '#FFFFFF',
    height: 32,
    border: '1px solid #DFE1E6',
    marginTop: 7,
  },
  upload: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '16px',
    color: '#000000',
    opacity: '0.5',
    marginTop: '4px',
  },
}));

export default function KenUploadButton(props) {
  const classes = useStyles();
  const { label, value = [], name, onChange } = props;
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    multiple: false,
    noKeyboard: true,
    onDrop: acceptedFiles => {
      console.log(acceptedFiles);
      onChange(name, [...value, ...acceptedFiles]);
    },
  });

  return (
    <Grid container {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <Grid className="display-Block-class" container xs={12} md={12}>
        <Grid item>
          <Typography align="left" className={classes.label}>
            {label}
          </Typography>
        </Grid>
        <Grid item>
          <Box className={classes.container}>
            <>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                onClick={open}
              >
                <Grid item>
                  <Typography className={classes.upload}>Upload</Typography>
                </Grid>
              </Grid>
            </>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
