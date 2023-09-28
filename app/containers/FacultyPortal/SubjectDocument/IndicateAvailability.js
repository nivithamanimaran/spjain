import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import KenCard from '../../../global_components/KenCard';
import { makeStyles } from '@material-ui/styles';
import KenGridEditable from '../../../global_components/kenGridEditable/kenGridEditable';
import KenDialogBox from '../../../global_components/KenDialog';
import { useTranslation } from 'react-i18next';

import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import EditIcon from '@material-ui/icons/EditOutlined';
import KenSelectWrap from '../../../global_components/KenSelect';
import KenInputField from '../../../global_components/KenInputField';
import KenDateTimePicker from '../../../global_components/KenDateTimePicker';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import CloseIcon from '@material-ui/icons/Close';
import KenGrid from '../../../global_components/KenGrid';
import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import KenSelect from '../../../global_components/KenSelect';
import Input from '@material-ui/core/Input';
import InputLabel from "@material-ui/core/InputLabel";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import moment from 'moment';
import './index.css';
import { RiCheckFill } from 'react-icons/ri';
const useStyles = makeStyles(theme => ({
  breadCrumbWrapper: {
    margin: '15px 0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#092682',
    marginLeft: '4px',
  },
  header: {
    background: '#ffffff',
    color: theme.palette.KenColors.primary,
  },
  holidayButton: {
    textTransform: 'none',
    fontWeight: 'bold',
    marginRight: '5px',
  },
  fitlerButton: {
    textTransform: 'none',
    fontWeight: 'bold',
  },
  sortingSection: {
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: 'repeat(7, 1fr)',
  },
  mainActions: {
    textAlign: 'right',
  },
  popOverHeading: {
    width: '100%',
    fontSize: '14px',
    fontWeight: '400',
    color: '#02195E',
  },
  tableBodyStyle: {
    fontSize: '12px',
    color: '#7A869A',
  },
  tableBodyStyleIgnoreHoliday: {
    fontSize: '12px',
    color: '#7A869A',
    padding: '0px',
  },
  textInputFieldDropDown: {
    background: 'transparent',
    borderRadius: '4px',
    color: '#000',
  },
  textInputField: {
    background: 'transparent',
    borderRadius: '4px',
    color: '#000',
  },
  kenDateTimePickerColor: {
    backgroundColor: '#fff',
  },
  noDataFound: {
    fontWeight: '600',
    fontSize: '14px',
  },
  headTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#092682',
    marginLeft: '4px',
  },
  filterButton: {
    marginRight: '10px',
  },
  iconBack: {
    height: 12,
  },
  selectWeek:{
    fontSize:12,
    paddingBottom:10
  },
  avatar:{
background:'blue',
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%'
  },
  indeterminateColor: {
    color: "#f50057"
  },
  selectAllText: {
    fontWeight: 500
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  }
}));
const ActionCells = (row, popOverOpen) => {
  return (
    <p
      onMouseOver={e => popOverOpen(e)}
      // onMouseOut={(e) => popOverClose(e)}
    >
      {row}
    </p>
  );
};
const createData = (
  id,
  from_date,
  to_date,
  Available_for_the_whole_day,
  saved
) => ({
  id,
  from_date,
  to_date,
  Available_for_the_whole_day,
  saved,
});

const IndicateAvailability = () => {
  const [previous, setPrevious] = useState({});
  const [dataStream, setDataStream] = useState({});
  const [dateObj, setDateObj] = useState({});
  const [state, setState] = React.useState({});
  const [anchorEls, setAnchorEls] = useState(null);
  const [messageDialog, setMessageDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);
  const [selected,setSelected] = useState([]);
  const [showAdvance,setShowAdvance] = useState(true);
  const { t } = useTranslation();

  function handleMessageDialog() {
    setMessageDialog(prevState => !prevState);
  }
  // const { id } = row.row.values;

  const handleClick = () => {
    handleMessageDialog();
  };
  function handleFilterDialog() {
    setFilterDialog(prevState => !prevState);
  }
  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    console.log('new-->', e, row, value, name, id);
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const handleChange = event => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  const handleChangedDate = event => {
    dataStream.to_date = event.target.value;
  };
  const handleChangedInternal = event => {
    dataStream.from_date = event.target.value;
  };

  const handleChangedInt = event => {
    setDateObj(prev => ({ ...prev, from_date: event.target.value }));
  };
  const handleChangedExt = event => {
    setDateObj(prev => ({ ...prev, to_date: event.target.value }));
  };

  const handleSubject = (check, id) => {
    if (check == 'save') {
      const newRows = rows.map(row => {
        console.log('rowrowrowrowrowrowrowrowrowrow', dataStream.from_date);

        if (row.id === id.id) {
          return {
            ...row,
            id: row.id,
            from_date: dataStream.from_date,
            to_date: dataStream.to_date,
            Available_for_the_whole_day: dataStream.Available_for_the_whole_day,
            saved: false,
          };
        }
        return row;
      });
      setRows(newRows);
      setDataStream({});
    }
  };
  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const handleChangedMarks = event => {
    console.log('event', event.target.value);
    dataStream.Available_for_the_whole_day = event.target.value;
  };

  const handlePopoverOpen = event => {
    setAnchorEls(event.currentTarget);
  };

  const [rows, setRows] = useState([
    createData(1, new Date(), new Date(), false),
    createData(2, new Date(), new Date(), false),
    createData(3, new Date(), new Date(), false),
    createData(4, new Date(), new Date(), false),
    createData(
      5,
      new Date(),
      new Date(),

      false
    ),
  ]);

  const idGenerater = () => {
    let id = Math.random()
      .toString(36)
      .substr(2, 9);
    return id;
  };
  const addTeachingRow = () => {
    console.log('dataStreamdataStream', dataStream);
    setRows([
      ...rows,
      {
        id: idGenerater(),
        from_date: dataStream.from_date,
        to_date: dataStream.to_date,
        Available_for_the_whole_day: dataStream.Available_for_the_whole_day,
        saved: false,
      },
    ]);
    setFilterDialog(false);
  };

  const classes = useStyles();

  const columnData = ['From', 'To', 'Available for the whole day', 'Edit'];
  const changeLang =(event) =>{
    // setCurrentMonth([...currentMonth , e.target.value])
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === months.length ? [] : months);
      return;
    }
    setSelected(value);
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  const months =[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
    // { label: 'Select', value: 'Select' },
    // { label: 'January', value: 'January' },
    // { label: 'February', value: 'February' },
    // { label: 'March', value: 'March' },
    // { label: 'April', value: 'April' },
    // { label: 'May', value: 'May' },
    // { label: 'June', value: 'June' },
    // { label: 'July', value: 'July' },
    // { label: 'August', value: 'August' },
    // { label: 'September', value: 'September' },
    // { label: 'October', value: 'October' },
    // { label: 'November', value: 'November' },
    // { label: 'December', value: 'December' }
  ];
  const isAllSelected =
  months.length > 0 && selected.length === months.length;
  return (
    // <div>GradesComponent</div>
    <Box>
      <div className="top-bar-div">
        <ArrowBackIcon className={classes.iconBack} color="primary" />
        <Typography className={classes.back} color="primary">
          {t('Back')}
        </Typography>
      </div>
      <AppBar position="static" elevation={0} className={classes.header}>
        <Toolbar className="top-bar-section-doc1">
          <Typography variant="h6" className={classes.title}>
            {/* My Profile */}
          </Typography>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className="add-button"
              onClick={handleFilterDialog}

              // onClick={() => setProfilePicUpdate(false)}
            >
              {/* <span>
                  <AddIcon />
                </span> */}
              Add New Availability
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
      <KenCard elevation={0}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow>
              {columnData.map(ele => {
                return (
                  <TableCell align="left" className={classes.headTitle}>
                    {ele}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              console.log('rowrow', row);
              const copyOfRow = {
                ...row,
                from_date: moment(row.from_date).format('D/M/YYYY HH:mm'),
                to_date: moment(row.to_date).format('D/M/YYYY HH:mm'),
              };

              return (
                <TableRow key={row.id}>
                  <KenGridEditable
                    {...{
                      row: row.isEditMode ? row : copyOfRow,
                      onChange,
                      columns: [
                        {
                          column_name: 'from_date',
                          is_inline_edit: true,
                          inline_edit_type: 'kenDatePicker',
                          label: 'From Date',
                        },
                        {
                          column_name: 'to_date',
                          is_inline_edit: true,
                          inline_edit_type: 'kenDatePicker',
                          label: 'To Date',
                        },
                        // {
                        //   column_name: 'Available_for_the_whole_day',
                        //   is_inline_edit: false,
                        // },
                      ],
                    }}
                  />
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.checkedB}
                          onChange={handleChange}
                          style={{ marginLeft: 65 }}
                          name="Available_for_the_whole_day"
                          color="primary"
                        />
                      }
                    />
                  </TableCell>

                  <TableCell className={classes.selectTableCell}>
                    {row.isEditMode ? (
                      <>
                        {/* <Button
                          variant="contained"
                          color="primary"
                          style={{ marginRight: '15px' }}
                          className={classes.addButton}
                          onClick={() => onToggleEditMode(row.id)}
                        >
                          Add
                        </Button> */}
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginRight: '15px' }}
                          className={classes.addButton}
                          onClick={() => onToggleEditMode(row.id)}
                        >
                          Save
                        </Button>
                        {/* <IconButton
                          aria-label="revert"
                          onClick={() => handleCancel(row.id.id, rows, index)}
                        >
                          <RevertIcon />
                        </IconButton> */}
                        {/* <IconButton
                          aria-label="done"
                          onClick={() => onToggleEditMode(row.id)}
                        >
                          <DoneIcon />
                        </IconButton> */}
                      </>
                    ) : (
                      <>
                        {!row.saved && (
                          <IconButton
                            variant="contained"
                            color="primary"
                            style={{ marginRight: '15px' }}
                            onClick={() => onToggleEditMode(row.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          // <IconButton
                          //   aria-label="delete"
                          //   onClick={() => onToggleEditMode(row.id)}
                          // >
                          //   <EditIcon />
                          // </IconButton>
                        )}
                        {row.saved && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ marginRight: '15px' }}
                              className={classes.addButton}
                              onClick={() => handleSubject('save', row)}
                            >
                              Save
                            </Button>
                            {/* <IconButton
                              aria-label="revert"
                              onClick={() => row.saved === false}
                            >
                              <RevertIcon />
                            </IconButton> */}
                          </>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </KenCard>
      {/* Popup model */}

      <KenDialogBox
        title={
          <Typography  className="test123">
            Update{' '}
            <span  style={{marginLeft:'80%'}}>
              <IconButton
                variant="contained"
                color="primary"
                // style={{ marginRight: '15px' }}
                onClick={() => handleFilterDialog()}
              >
                <CloseIcon />
              </IconButton>
            </span>
          </Typography>
        }
        titleContainerStyles={{ borderBottom: '1px solid' ,padding:'0px 16px'}}
        open={filterDialog}
        handleClose={() => handleFilterDialog()}
        negativeButtonClick={() => handleFilterDialog()}
        positiveButtonClick={() => addTeachingRow()}
        hidePositiveButton={false}
        hideNegativeButton={false}
        positiveButtonText="Submit"
        negativeButtonText="Cancel"
        className="Test12345ssssss6"
        dividers
      >
        <Grid container className="Test123456">
          <Grid item xs={12} sm={12} m={3} style={{padding:10}}>
            {/* <KenSelect
              value={currentMonth || []}
              onChange={changeLang}
              options={months}
              placeholder={'Select'}
              required={true}
              label="Select Month"
              multiple
              input={<Input />}
              MenuProps={MenuProps}
            /> */}
             <FormControl className={classes.formControl}>
      <InputLabel id="mutiple-select-label">Select Month</InputLabel>
      <Select
        labelId="mutiple-select-label"
        multiple
        value={selected}
        onChange={changeLang}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
        >
          <ListItemIcon>
            <Checkbox
              classes={{ indeterminate: classes.indeterminateColor }}
              checked={isAllSelected}
              indeterminate={
                selected.length > 0 && selected.length < months.length
              }
            />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="Select All"
          />
        </MenuItem>
        {months.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option) > -1} />
            </ListItemIcon>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} style={{padding:10}}>
          <Typography className={classes.selectWeek}> Select Day  </Typography>
          <div >
          <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-evenly' }}>
                <Avatar alt="user"className={classes.avatar} style={{background:'primary',color:'#fff'}}>S</Avatar>
                <Avatar alt="user">M</Avatar>
                <Avatar alt="user">T</Avatar>
                <Avatar alt="user">W</Avatar>
                <Avatar alt="user">T</Avatar>
                <Avatar alt="user">F</Avatar>
                <Avatar alt="user">S</Avatar>
              </div>
          </div>
          </Grid>
        
        </Grid>
        {showAdvance ? <>
        <div style={{ display: 'flex', alignItems: 'center',justifyContent:'space-between',borderBottom: '1px solid' ,padding:'0px 16px' }}>

        <Typography className={classes.advanceContent}> Advanced  </Typography>
        <span  >
              <IconButton
                variant="contained"
                color="primary"
                // style={{ marginRight: '15px' }}
                onClick={() => setShowAdvance(false)}
              >
                <CloseIcon />
              </IconButton>
            </span>
        </div>
      
        <Grid container className="Test123456" style={{padding:'15px'}}>

        <Grid item xs={12} sm={6}>
            <KenDateTimePicker
              name="from_date"
              label="From Date"
              value={dataStream.from_date}
              required={true}
              onChange={handleChangedInternal}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <KenDateTimePicker
              name="to_date"
              label="To Date"
              value={dataStream.to_date}
              required={true}
              // defaultValue={startData}
              onChange={handleChangedDate}
            />
          </Grid>

        </Grid>
        </>:null}
        <Toolbar style={{ paddingTop: 20 }} className="top-bar-section-doc1">
          <Typography variant="h6" className={classes.title}>
            {/* My Profile */}
          </Typography>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className="add-button"
              onClick={() => addTeachingRow()}
            >
              {/* <span>
                  <AddIcon />
                </span> */}
              Save{' '}
            </Button>
          </Grid>
        </Toolbar>
      </KenDialogBox>
    </Box>
  );
};

export default IndicateAvailability;
