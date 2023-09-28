import {
  Button,
  Grid,
  makeStyles,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Input,
} from '@material-ui/core';
import React, { useState } from 'react';
import KenGridEditable from '../../../../global_components/kenGridEditable/kenGridEditable';
// Icons
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import { RiCheckFill } from 'react-icons/ri';
import KenInputField from '../../../../global_components/KenInputField';
const useStyles = makeStyles(theme => ({
  table_main_div: {
    margin: '1%',
  },
}));

const StudentListForEval = () => {
  const classes = useStyles();

  const [rows, setRows] = React.useState([
    {
      id: 1,
      studentName: 'test',
      marksObtain: 25,
      isEditMode: false,
    },
    {
      id: 2,
      studentName: 'test',
      marksObtain: 25,
      isEditMode: false,
    },
    {
      id: 3,
      studentName: 'test',
      marksObtain: 25,
      isEditMode: false,
    },
  ]);

  const [previous, setPrevious] = useState({});
  const [disableAddActivity, setDisableAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState(false);
  const [dataStream, setDataStream] = useState({});

  const [editIndex, setEditIndex] = useState();
  const [loading, setLoading] = React.useState(false);
  const createData = (id, studentName, marksObtain, isEditMode) => ({
    id,
    studentName,
    marksObtain,
    isEditMode,
  });
  const onToggleEditMode = (check, id, index) => {
    const newData = [...rows];
    // newData[index]?.array.forEach(row => {         // comment next line and uncomment this
    newData.forEach(row => {
      if (row.id === id) {
        // change row.id.id => row.id
        row.isEditMode = true;
        if (check === 'done') {
          // setLoading(true);
          row.isEditMode = false;
          setRows(newData);
        } else if (check === 'edit') {
          // setDisableAddActivity(true);
          row.isEditMode = true;
          setRows(newData);
        }
      }
    });
    setEditIndex(index);
  };

  const onRevert = (id, rows, index) => {
    const newData = [...rows];
    // newData[index].array.map(row => {         // comment next line and uncomment this
    newData.map(row => {
      if (row.id === id) {
        // change row.id.id => row.id
        return (row.isEditMode = false);
      }
    });
    setRows(newData);
    // setDisableAddActivity(false);
  };
  const handleSubject = (check, id, index) => {
    // setDisableAddActivity(true);
    if (check == 'save') {
      setLoading(true);
      id.forEach(item => {
        item.isEditMode = false;
      });
      setRows(id);
      setNewActivity(!newActivity);
      setLoading(false);
    } else {
      const newData = [...rows];
      // newData[index]?.array.push(
      newData.push(
        createData(
          // `rows${rows[index]?.array.length}`,
          `rows${rows.length}`,
          '',
          '',
          true
        )
      );
      setRows(newData);
    }
  };

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

  return (
    <div className={classes.table_main_div}>
      {' '}
      <Grid container xs={12}>
        <Table className={classes.table} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left" className={classes.headTitle}>
                Student
              </TableCell>{' '}
              <TableCell align="left" className={classes.headTitle}>
                Marks Obtained
              </TableCell>{' '}
              <TableCell align="left" className={classes.headTitle} />
              <TableCell
                align="left"
                style={{ display: 'flex', justifyContent: 'flex-end' }}
                className={classes.headTitle}
              >
                <Button
                  variant="contained"
                  color="primary"

                  // onClick={() => {
                  //   setOpenModel(true);
                  // }}
                >
                  Upload File
                </Button>
              </TableCell>{' '}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => {
              {
                console.log({ row });
              }
              return (
                <TableRow key={row.id}>
                  <TableCell />
                  <KenGridEditable
                    {...{
                      row,
                      onChange,
                      columns: [
                        {
                          column_name: 'studentName',
                          is_inline_edit: true,
                          label: 'Grade Type',
                          inline_edit_type: 'kenInput',
                        },

                        {
                          column_name: 'marksObtain',
                          is_inline_edit: true,
                          inline_edit_type: 'kenInput',
                          label: 'Percentage',
                        },
                      ],
                    }}
                  />
                  <TableCell
                    className={classes.selectTableCell}
                    style={{ textAlign: 'center' }}
                  >
                    {row.isEditMode ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            onToggleEditMode('done', row.id, index)
                          }
                        >
                          Save
                        </Button>
                        <IconButton
                          aria-label="revert"
                          onClick={() => onRevert(row.id, rows, index)}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        {!row.saved && (
                          <Button
                            aria-label="edit"
                            onClick={() =>
                              onToggleEditMode('edit', row.id, index)
                            }
                          >
                            <EditIcon />
                          </Button>
                        )}
                        {row.saved && (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSubject('save', rows, index)}
                            >
                              Save
                            </Button>
                            <IconButton
                              aria-label="revert"
                              onClick={() => handleCancel(row.id, rows, index)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell />
                </TableRow>
              );
            })}
            <TableRow>
              <Grid container xs={12} style={{ margin: '10px 0px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginRight: '15px' }}
                  onClick={() => handleSubject('add', rows, 0)}
                  // disabled={disableAddActivity}
                >
                  Add
                </Button>
              </Grid>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </div>
  );
};

export default StudentListForEval;
