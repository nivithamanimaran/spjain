import React from 'react';
import {
  Select,
  MenuItem,
  Typography,
  InputBase,
  withStyles,
  FormControl,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import KenTextLabel from '../KenTextLabel';
import StatusErrorIcon from './assets/StatusErrorIcon.svg';
import StatusSuccessIcon from './assets/StatusSuccessIcon.svg';
import StatusWarningIcon from './assets/StatusWarningIcon.svg';

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.KenColors.kenWhite,
    border: `1px solid ${theme.palette.KenColors.neutral40} !important`,
    fontSize: 16,
    padding: '10px 26px 10px 12px !important',
    textAlign: 'left',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      borderRadius: 4,
      borderColor: theme.palette.KenColors.tertiaryBlue75,
      boxShadow: `0 0 0 0.2rem ${theme.palette.KenColors.shadowColor}`,
    },
    '&.Mui-disabled': {
      background: '#FAFBFC',
    },
  },
}))(InputBase);

const useStyles = makeStyles(theme => ({
  label: {
    marginBottom: 2,
  },
  typoSupporting: {
    fontSize: '12px',
    // lineHeight: '16px',
    color: 'theme.palette.KenColors.neutral100',
    marginTop: 4,
  },
  inputBorderWarning: {
    border: `1px solid ${theme.palette.KenColors.tertiaryYellow300}`,
    borderRadius: 3,
  },
  inputBorderError: {
    border: `1px solid ${theme.palette.KenColors.tertiaryRed400}`,
    borderRadius: 3,
  },
  inputBorderSuccess: {
    border: `1px solid ${theme.palette.KenColors.tertiaryGreen300}`,
    borderRadius: 3,
  },
  inputBorder: {
    borderRadius: 3,
  },
  label: {
    marginBottom: 2,
  },
  selectMenuItem: {
    '&.Mui-selected': {
      // background: selectedMenuColor,
      color: '#DE350B',
      fontWeight: 600,
    },
  },
}));

function getStyles(name, value, theme) {
  return {
    fontWeight:
      value.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const KenSelect = function(props) {
  const classes = useStyles();
  const {
    id,
    options = [],
    value,
    onChange,
    label,
    name,
    placeholder,
    disabled,
    readonly,
    required,
    multiple,
    optionalLabel = true,
    errors,
    touched,
    onBlur,
    onFocus,
    autofocus,
    defaultValue,
    onOpen,
    menuItemRootClass,
    menuItemSelectedClass,
    inputBaseRootClass,
    labelClass,
    // disabledMenuItem,
  } = props;
  const theme = useTheme();

  const getErrorStatus = type => {
    let status, helpText;
    if (!touched) return;
    if (errors === 'Required') {
      status = 'warning';
      helpText = (
        <span style={{ color: '#FF991F' }}>
          <img src={StatusWarningIcon} alt="warning" /> Field cannot be empty.
        </span>
      );
    } else if (errors) {
      status = 'error';
      helpText = (
        <span style={{ color: '#B92500' }}>
          <img src={StatusErrorIcon} alt="error" /> {errors}
        </span>
      );
    }

    if (touched && !errors) {
      status = 'success';
      helpText = (
        <span style={{ color: '#006644' }}>
          <img src={StatusSuccessIcon} alt="success" /> Valid
        </span>
      );
    }

    if (type === 'error') {
      return helpText;
    }
    if (type === 'status') {
      switch (status) {
        case 'warning':
          return 'inputBorderWarning';
        case 'success':
          return 'inputBorderSuccess';

        case 'error':
          return 'inputBorderError';

        default:
          return 'inputBorder';
      }
    }
  };

  return (
    // <Tooltip title= {name=='domicile'?"The place or country of residence, which is legally or officially recognized":''}>
    <FormControl
      fullWidth
      disabled={disabled || readonly}
      className={classes.formControl}
    >
      <KenTextLabel
        label={label}
        required={required}
        optionalLabel={optionalLabel}
        className={labelClass}
      />
      <Select
        {...props}
        className={classes[getErrorStatus('status') || 'inputBorder']}
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled || readonly}
        fullWidth
        placeholder={placeholder}
        input={<BootstrapInput value={value} />}
        required={required}
        multiple={multiple}
        onBlur={onBlur}
        onFocus={onFocus}
        autoFocus={autofocus}
        defaultValue={defaultValue}
        onOpen={onOpen}
        classes={{ root: inputBaseRootClass }}
      >
        {options.map(el => (
          <MenuItem
            value={el.value || el}
            style={multiple ? getStyles(name, value, theme) : {}}
            disabled={el.disabled}
            classes={{
              root: menuItemRootClass,
              selected: menuItemSelectedClass,
              // classes={{ selected: classes.selectMenuItem }}
            }}
          >
            {el.label || el}
          </MenuItem>
        ))}
      </Select>
      <Typography className={classes.typoSupporting} align="left">
        {getErrorStatus('error')}
      </Typography>
      {errors === true && <label>Type Can't be Empty</label>}
    </FormControl>

    // </Tooltip>
  );
};

export default KenSelect;
