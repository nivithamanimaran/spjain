import React from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { BorderRight } from '@material-ui/icons';
import { BiBorderRadius } from 'react-icons/bi';

const useStyles = makeStyles(theme => ({
  areaWrap: {
    width: '100%',
    outline: 'none',
    border: `1px solid ${theme.palette.KenColors.assessmentBorder}`,
    minHeight:'290px',
    padding: 8,
    fontSize: 14,
    color: theme.palette.KenColors.neutral900,
    marginTop:'4px',
    BorderRadius:'8px'
  },
  label: {
    fontSize: '12px',
    color: theme.palette.KenColors.neutral400,
  },
}));

export default function Textarea(props) {
  const { minRows, maxRows, placeholder, label, defaultValue } = props;
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Typography className={classes.label}>{label}</Typography>

      <TextareaAutosize
        className={classes.areaWrap}
        minRows={minRows}
        maxRows={maxRows}
        aria-label="maximum height"
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    </Box>
  );
}
