import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  Typography,
  useTheme,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import KenHeader from '../../global_components/KenHeader/index';
import KenButton from '../../global_components/KenButton/index';
import KenSnackBar from '../../components/KenSnackbar';
import KenInputField from '../../global_components/KenInputField';
import KenCard from '../../global_components/KenCard';
import KenGrid from '../../global_components/KenGrid';
import KenGridEditable from '../../global_components/kenGridEditable/kenGridEditable';
import KenLoader from '../../components/KenLoader';
import KenDialogBox from '../../components/KenDialogBox';
import KenSelect from '../../components/KenSelect';
import GradebookData from './data.json';
import './styles.scss';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import { RiCheckFill } from 'react-icons/ri';

const useStyles = makeStyles(theme => ({
  header: {
    background: 'transparent',
    color: theme.palette.KenColors.primary,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'end',
  },
  headerBtn: {
    margin: '0 5px',
  },
  leftBox: {
    width: '100%',
    background: '#fff !important',
    padding: '10px',
    overflowY: 'auto',
  },
  RightBox: {
    background: '#fff',
    width: '100%',
    background: '#fff !important',
    padding: '10px',
  },
  sideCardTitle: {
    marginTop: '0px',
    color: '#0077FF',
    fontSize: '14px',
    fontWeight: 600,
  },
  sideCardVal: {
    margin: '0px',
  },
  selectTableCell: {
    textAlign: 'right !important',
  },
  gradeComp: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  totalBorder: {
    height: '35px !important',
    borderBottom: '1px solid #000',
    marginTop: '20px',
  },
}));
const CollapseData = props => {
  const [rows, setRows] = React.useState([
    {
      id: 1,
      gradeType: 'test',
      marks: 25,
      isEditMode: false,
    },
    {
      id: 2,
      gradeType: 'test',
      marks: 25,
      isEditMode: false,
    },
    {
      id: 3,
      gradeType: 'test',
      marks: 25,
      isEditMode: false,
    },
  ]);
  const [previous, setPrevious] = useState({});
  const classes = useStyles();
  const [disableAddActivity, setDisableAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState(false);
  const [dataStream, setDataStream] = useState({});
  const [editIndex, setEditIndex] = useState();
  const [loading, setLoading] = React.useState(false);
  const createData = (id, gradeType, marks, percentage, saved) => ({
    id,
    gradeType,
    marks,
    percentage,
    saved,
  });
  console.log("rowsrowsrowsrowsrows",rows);
  const onToggleEditMode = (check, id, index) => {
    const newData = [...rows];

    newData.forEach(row => {
      if (row.id.id === id) {
        row.isEditMode = true;
        if (check === 'done') {
          row.isEditMode = false;
          setRows(newData);
        } else if (check === 'edit') {
          setDisableAddActivity(true);
          row.isEditMode = true;
          setRows(newData);
        }
      }
    });
    setEditIndex(index);
  };
  const onRevert = (id, rows, index) => {
    const newData = [...rows];

    newData.map(row => {
      if (row.id.id === id) {
        return (row.isEditMode = false);
      }
    });
    setRows(newData);
    setDisableAddActivity(false);
  };
  const handleSubject = (check, id, index) => {
    setDisableAddActivity(true);
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
      newData.push(
        createData(
          `rows${rows.length}`,
          <KenInputField
            label="Grade"
            value={dataStream.gradeType}
            dropdownColor="#FFFFFF"
            onChange={handleGradeTypeChange}
            required
          />,
          <KenInputField
            label="Marks"
            value={dataStream.marks}
            dropdownColor="#FFFFFF"
            onChange={handleMarksChange}
            required
          />,
          <KenInputField
            label="Percentage"
            value={dataStream.percentage}
            dropdownColor="#FFFFFF"
            onChange={handlePercentageChange}
            required
          />,
          true
        )
      );
      setRows(newData);
    }
  };
  const handlePercentageChange = event => {
    let data = (dataStream.percentage = event.target.value);
    setDataStream(data);
  };
  const handleMarksChange = event => {
    let data = (dataStream.marks = event.target.value);
    setDataStream(data);
  };
  const handleGradeTypeChange = event => {
    let data = (dataStream.gradeType = event.target.value);
    setDataStream(data);
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
  
  const columnData = ['GRADETYPE', 'MARKS', 'PERCENTAGE', 'ACTIONS'];
  return (
    <Grid container xs={12}>
      {loading && <KenLoader />}
      <Table className={classes.table} aria-label="caption table">
        <TableBody>
          {rows?.map((row, index) => {
            return (
              <TableRow key={row.id}>
                <KenGridEditable
                  {...{
                    row,
                    onChange,
                    columns: [
                      {
                        column_name: 'gradeType',
                        is_inline_edit: false,
                        label: 'Grade Type',
                      },
                      {
                        column_name: 'marks',
                        is_inline_edit: false,
                        inline_edit_type: '',
                        label: 'Marks',
                      },
                      {
                        column_name: 'percentage',
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
                          onToggleEditMode('done', row.id.id, index)
                        }
                      >
                        Save
                      </Button>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(row.id.id, rows, index)}
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
                            onToggleEditMode('edit', row.id.id, index)
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
                            onClick={() => handleCancel(row.id.id, rows, index)}
                          >
                            <RevertIcon />
                          </IconButton>
                        </>
                      )}
                    </>
                  )}
                </TableCell>
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
                disabled={disableAddActivity}
              >
                Add
              </Button>
            </Grid>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  );
};
export default function GradeBook(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [data2, setData2] = React.useState([]);
  const [data3, setData3] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState(
    'Financial Accounting'
  );
  const [gradeDialog, setGradeDialog] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const columns = [
    {
      Header: '',
      accessor: 'GradeComponent',
      disableGlobalFilter: true,
    },
    {
      Header: '',
      accessor: 'Percentage',
      disableGlobalFilter: true,
    },
  ];
  const columns2 = [
    {
      Header: 'Grade Name',
      accessor: 'Grade Name',
      disableGlobalFilter: true,
    },
    {
      Header: 'Range',
      accessor: 'Range',
      disableGlobalFilter: true,
    },
    {
      Header: 'Grade Point',
      accessor: 'Grade Point',
      disableGlobalFilter: true,
    },
  ];

  React.useEffect(() => {
    const data = [];
    const data2 = [];
    const data3 = [];
    GradebookData['Grading Components'].map(item => {
      data.push({
        GradeComponent: item.label,
        Percentage: item.percentage,
        item: item.data,
      });
    });
    setData(data);
    GradebookData['Grade Points'].map(item => {
      data2.push({
        'Grade Name': item['Grade Name'],
        Range: item['Range'],
        'Grade Point': item['Grade Point'],
      });
    });
    setData2(data2);
    GradebookData['Subjects'].map(item => {
      data3.push({
        gradeType: item.label,
        SubjectCode: item.SubjectCode,
        Credits: item.Credits,
      });
    });
    setData3(data3);
  }, []);
  const handleSelectedCard = (e, item) => {
    setSelectedCard(item.gradeType);
  };
  const addGradeComponent = item => {
    console.log('add grade coponent', item);
    setGradeDialog(true);
  };
  const gradeDialogCancel = () => {
    setGradeDialog(false);
  };
  const gradeDialogSubmit = () => {
    setGradeDialog(false);
  };
  const onAddGradeItem = () => {};
  return (
    <Grid container xs={12}>
      {loading && <KenLoader />}
      <AppBar position="static" elevation={0} className={classes.header}>
        <Toolbar>
          <Grid container>
            <Grid item xs={6} className={classes.headerLeft}>
              <Typography variant="h6" className={classes.title}>
                Gradebook
              </Typography>
            </Grid>
            <Grid item xs={6} className={classes.headerRight} />
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container xs={3} style={{ padding: '5px' }}>
        <Grid className={classes.leftBox}>
          <Box>
            <Typography>Subjects</Typography>
          </Box>
          {data3?.map(item => {
            return (
              <KenCard elevation={0} className={classes.cardMain}>
                <Grid
                  container
                  xs={12}
                  onClick={e => handleSelectedCard(e, item)}
                >
                  <Grid container xs={12}>
                    <p className={classes.sideCardTitle}>{item.gradeType}</p>
                  </Grid>
                  <Grid container xs={6}>
                    <p className={classes.sideCardVal}>
                      <p>Subject Code</p>
                      <p>Credits</p>
                    </p>
                  </Grid>
                  <Grid container xs={6}>
                    <p className={classes.sideCardVal}>
                      <p>{item.SubjectCode}</p>
                      <p>{item.Credits}</p>
                    </p>
                  </Grid>
                </Grid>
              </KenCard>
            );
          })}
        </Grid>
      </Grid>
      <Grid container xs={9} style={{ padding: '5px' }}>
        <Grid className={classes.RightBox}>
          <Box>
            <Typography
              className={classes.sideCardTitle}
              style={{ margin: '0px 0px 20px 15px' }}
            >
              {selectedCard}
            </Typography>
          </Box>
          <KenCard paperStyles={{ padding: 16 }}>
            <div className={classes.gradeComp}>
              <Typography>Grading Components</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => addGradeComponent(data)}
              >
                Add
              </Button>
            </div>
            <KenGrid
              columns={columns}
              data={data}
              pagination={{ disabled: true }}
              toolbarDisabled={true}
              isCollasable={true}
              component={CollapseData}
              gridProps={{
                getRowProps: row => ({
                  isCollasable: true,
                }),
                getCellProps: cell => ({
                  style: {
                    textAlign:
                      cell.column.id === 'GradeComponent' ? 'left' : 'center',
                  },
                }),
              }}
            />
          </KenCard>
          <KenCard paperStyles={{ padding: 16 }}>
            <Typography>Grade Letters</Typography>
            <div className="grade-div">
              <KenGrid
                columns={columns2}
                data={data2}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={false}
                gridProps={{
                  getRowProps: row => ({
                    isCollasable: true,
                  }),
                  getHeaderProps: column => ({
                    style: {
                      textAlign: column.id === 'Grade Name' ? 'left' : 'center',
                    },
                  }),
                  getCellProps: cell => ({
                    style: {
                      textAlign:
                        cell.column.id === 'Grade Name' ? 'left' : 'center',
                    },
                  }),
                }}
              />
            </div>
          </KenCard>
        </Grid>
      </Grid>
      {/* Add Grade Component */}
      <div className="faculty-mgmt-div">
        <KenDialogBox
          title={
            <Typography variant="h6" className={classes.dialogHeader}>
              Add Grading Scheme
            </Typography>
          }
          open={gradeDialog}
          icon={<RiCheckFill />}
          handleClose={() => gradeDialogCancel()}
          negativeButtonClick={() => gradeDialogCancel()}
          positiveButtonClick={() => gradeDialogSubmit()}
          positiveButtonText="Ok"
          negativeButtonText="Cancel"
          style={{ width: '80%', height: 'auto !important' }}
          dividers
        >
          <Grid container xs={12}>
            <Grid xs={12}>
              <KenSelect
                label="Subject Name"
                options={[]}
                value={subjectName}
                dropdownColor="#FFFFFF"
                // onChange={handleSelectChangeSubject}
                required
              />
            </Grid>
            {data?.map(item => {
              return (
                <Grid container xs={12} style={{ marginTop: '10px' }}>
                  <Grid xs={6} style={{ marginRight: '24px' }}>
                    <KenInputField
                      defaultValue={item.GradeComponent}
                      dropdownColor="#FFFFFF"
                      // onChange={handleGradeType}
                      required
                    />
                  </Grid>
                  <Grid xs={4}>
                    <KenInputField
                      value={item.Percentage}
                      dropdownColor="#FFFFFF"
                      required
                    />
                  </Grid>
                </Grid>
              );
            })}

            <Grid container xs={12} style={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onAddGradeItem}
              >
                Add New
              </Button>
            </Grid>
            <Grid container xs={12} className={classes.totalBorder}>
              <Grid xs={6} style={{ marginRight: '24px' }}>
                <Typography>Total</Typography>
              </Grid>
              <Grid xs={4} style={{ marginRight: '24px' }}>
                <Typography>100%</Typography>
              </Grid>
            </Grid>
          </Grid>
        </KenDialogBox>
      </div>
    </Grid>
  );
}
