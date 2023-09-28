import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function SplitButton({ setSelectedIndex }) {
  const [checked, setChecked] = useState(false);

  const toggleChecked = () => {
    setChecked(prev => !prev);
  };
  useEffect(() => {
    if (checked === false) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(1);
    }
  }, [checked]);

  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={checked} onChange={toggleChecked} />}
          label={checked === false ? 'Overview' : 'Detail'}
        />
      </FormGroup>
    </>
  );
}
