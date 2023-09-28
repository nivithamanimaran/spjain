import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core';
import KenTextLabel from '../../components/KenTextLabel';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(2),
    },
  },
  input: {
    fontSize: 14,
    border: `1px solid ${theme.palette.KenColors.assessmentBorder}`,
    width: '100%',
    padding: '10px 12px',
    cursor: 'pointer',
    color: theme.palette.KenColors.neutral60,
  },
}))(InputBase);

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 220,
  },
}));

export default function DateAndTimePickers(props) {
  const {
    label,
    id,
    value,
    name,
    required,
    optionalLabel,
    defaultValue,
    inputBaseRootClass,
    onChange,
  } = props;
  const classes = useStyles();
  return (
    <Box>
      <KenTextLabel
        label={label}
        required={required}
        optionalLabel={optionalLabel}
      />

      <form className={classes.container} noValidate>
        <BootstrapInput
          id={id}
          type="date"
          name={name}
          onChange={onChange}
          defaultValue={defaultValue}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          value={value}
          classes={{ root: inputBaseRootClass }}
        />
      </form>
    </Box>
  );
}
