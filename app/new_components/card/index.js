import { Divider, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.KenColors.kenWhite,
    borderRadius: '12px',
    boxShadow: '0px 1px 40px rgba(0, 0, 0, 0.05)',
    padding: 16,
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: `inset 0 0 6px #d1d1d1`,
      webkitBoxShadow: `inset 0 0 6px #d1d1d1`,
      backgroundColor: `inset 0 0 6px #d1d1d1`,
      opacity: '0.2',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `inset 0 0 6px #d1d1d1`,
      opacity: '0.1',
      outline: `1px solid ${theme.palette.KenColors.neutral100}`,
    },
  },
  title: {
    fontWeight: 600,
    fontSize: 16,
    color: theme.palette.KenColors.kenBlack,
    marginBottom: 8,
    position : 'sticky',
    
  },
}));

export default function BaseCard(props) {
  const { title, rootStyles = {} } = props;
  const classes = useStyles();

  return (
    <Paper
      elevation={0}
      classes={{
        root: Object.keys(rootStyles).length > 0 ? rootStyles : classes.root,
      }}
      style={rootStyles}
    >
      {title && <Typography className={classes.title}>{title}</Typography>}
      {title && <Divider/>}
      {props.children}
    </Paper>
  );
}
