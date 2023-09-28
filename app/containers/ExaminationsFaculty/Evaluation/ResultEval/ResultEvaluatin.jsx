import {
  Button,
  Grid,
  makeStyles,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import KenGrid from '../../../../global_components/KenGrid';
import KenCard from '../../../../global_components/KenCard';
import KenGridEditable from '../../../../global_components/kenGridEditable/kenGridEditable';
// Icons
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import EditIcon from '@material-ui/icons/EditOutlined';
import { RiCheckFill } from 'react-icons/ri';
// import '../../Evaluation/index.css';
import '../index.css';
import AcceptIcon from '../../../../assets/ExamantionsFaculty/AcceptIcon.svg';
import rejectIcon from '../../../../assets/ExamantionsFaculty/rejectIcon.svg';

import { KEY_USER_DETAILS } from '../../../../utils/constants';
// import { getStudentCurrentExam } from '../../../../utils/ApiService';
import KenLoader from '../../../../global_components/KenLoader';
import KenInputField from '../../../../global_components/KenInputField';
import StudentListForEval from './StudentListForEval';

const useStyles = makeStyles(theme => ({}));

// const CollapseData = props => {
//   const [rows, setRows] = React.useState([
//     {
//       id: 1,
//       studentName: 'test',
//       marksObtain: 25,
//       isEditMode: false,
//     },
//     {
//       id: 2,
//       studentName: 'test',
//       marksObtain: 25,
//       isEditMode: false,
//     },
//     {
//       id: 3,
//       studentName: 'test',
//       marksObtain: 25,
//       isEditMode: false,
//     },
//   ]);
//   const [previous, setPrevious] = useState({});
//   const classes = useStyles();
//   const [disableAddActivity, setDisableAddActivity] = useState(false);
//   const [newActivity, setNewActivity] = useState(false);
//   const [dataStream, setDataStream] = useState({});
//   const [editIndex, setEditIndex] = useState();
//   const [loading, setLoading] = React.useState(false);
//   const createData = (id, studentName, marks, marksObtain, saved) => ({
//     id,
//     studentName,
//     marks,
//     marksObtain,
//     saved,
//   });
//   const onToggleEditMode = (check, id, index) => {
//     const newData = [...rows];
//     // newData[index]?.array.forEach(row => {         // comment next line and uncomment this
//     newData.forEach(row => {
//       if (row.id.id === id) {
//         // change row.id.id => row.id
//         row.isEditMode = true;
//         if (check === 'done') {
//           // setLoading(true);
//           row.isEditMode = false;
//           setRows(newData);
//         } else if (check === 'edit') {
//           setDisableAddActivity(true);
//           row.isEditMode = true;
//           setRows(newData);
//         }
//       }
//     });
//     setEditIndex(index);
//   };
//   const onRevert = (id, rows, index) => {
//     const newData = [...rows];
//     // newData[index].array.map(row => {         // comment next line and uncomment this
//     newData.map(row => {
//       if (row.id.id === id) {
//         // change row.id.id => row.id
//         return (row.isEditMode = false);
//       }
//     });
//     setRows(newData);
//     setDisableAddActivity(false);
//   };
//   const handleSubject = (check, id, index) => {
//     setDisableAddActivity(true);
//     if (check == 'save') {
//       setLoading(true);
//       id.forEach(item => {
//         item.isEditMode = false;
//       });
//       setRows(id);
//       setNewActivity(!newActivity);
//       setLoading(false);
//     } else {
//       const newData = [...rows];
//       // newData[index]?.array.push(
//       newData.push(
//         createData(
//           // `rows${rows[index]?.array.length}`,
//           `rows${rows.length}`,
//           <KenInputField
//             label="StudentName"
//             value={dataStream.studentName}
//             dropdownColor="#FFFFFF"
//             onChange={handleGradeTypeChange}
//             required
//           />,
//           <KenInputField
//             label="MarksMarks Obtained"
//             value={dataStream.marksObtain}
//             dropdownColor="#FFFFFF"
//             onChange={handlePercentageChange}
//             required
//           />,

//           true
//         )
//       );
//       setRows(newData);
//     }
//   };
//   const handlePercentageChange = event => {
//     let data = (dataStream.marksObtain = event.target.value);
//     setDataStream(data);
//   };

//   const handleGradeTypeChange = event => {
//     let data = (dataStream.studentName = event.target.value);
//     setDataStream(data);
//   };
//   const onChange = (e, row) => {
//     if (!previous[row.id]) {
//       setPrevious(state => ({ ...state, [row.id]: row }));
//     }
//     const value = e.target.value;
//     const name = e.target.name;
//     const { id } = row;
//     console.log('new-->', e, row, value, name, id);
//     const newRows = rows.map(row => {
//       if (row.id === id) {
//         return { ...row, [name]: value };
//       }
//       return row;
//     });
//     setRows(newRows);
//   };

//   const columnData = ['GRADETYPE', 'MARKS', 'PERCENTAGE', 'ACTIONS'];
//   return (
//     <Grid container xs={12}>
//       {loading && <KenLoader />}
//       <Table className={classes.table} aria-label="caption table">
//         <TableHead>
//           <TableRow>
//             <TableCell align="left" className={classes.headTitle}>
//               Student
//             </TableCell>{' '}
//             <TableCell align="left" className={classes.headTitle}>
//               Marks Obtained
//             </TableCell>{' '}
//             <TableCell
//               align="left"
//               className={classes.headTitle}
//               colSpan={2}
//               rowSpan={2}
//             />
//             <TableCell align="left" className={classes.headTitle}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 className="apply-btn-text"
//                 // onClick={() => {
//                 //   setOpenModel(true);
//                 // }}
//               >
//                 Qn Bank
//               </Button>
//             </TableCell>{' '}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows?.map((row, index) => {
//             return (
//               <TableRow key={row.id}>
//                 <KenGridEditable
//                   {...{
//                     row,
//                     onChange,
//                     columns: [
//                       {
//                         column_name: 'studentName',
//                         is_inline_edit: false,
//                         label: 'Grade Type',
//                       },

//                       {
//                         column_name: 'marksObtain',
//                         is_inline_edit: true,
//                         inline_edit_type: 'kenInput',
//                         label: 'Percentage',
//                       },
//                     ],
//                   }}
//                 />
//                 <TableCell
//                   className={classes.selectTableCell}
//                   style={{ textAlign: 'center' }}
//                   >
//                   {row.isEditMode ? (
//                     <>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() =>
//                           onToggleEditMode('done', row.id.id, index)
//                         }
//                       >
//                         Save
//                       </Button>
//                       <IconButton
//                         aria-label="revert"
//                         onClick={() => onRevert(row.id.id, rows, index)}
//                       >
//                         <RevertIcon />
//                       </IconButton>
//                     </>
//                   ) : (
//                     <>
//                       {!row.saved && (
//                         <Button
//                           aria-label="edit"
//                           onClick={() =>
//                             onToggleEditMode('edit', row.id.id, index)
//                           }
//                         >
//                           <EditIcon />
//                         </Button>
//                       )}
//                       {row.saved && (
//                         <>
//                           <Button
//                             variant="contained"
//                             color="primary"
//                             onClick={() => handleSubject('save', rows, index)}
//                           >
//                             Save
//                           </Button>
//                           <IconButton
//                             aria-label="revert"
//                             onClick={() => handleCancel(row.id.id, rows, index)}
//                           >
//                             <RevertIcon />
//                           </IconButton>
//                         </>
//                       )}
//                     </>
//                   )}
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//           <TableRow>
//             <Grid container xs={12} style={{ margin: '10px 0px' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 size="small"
//                 style={{ marginRight: '15px' }}
//                 onClick={() => handleSubject('add', rows, 0)}
//                 disabled={disableAddActivity}
//               >
//                 Add
//               </Button>
//             </Grid>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </Grid>
//   );
// };

const ResultEvaluatin = () => {
  const [openModel, setOpenModel] = useState(false);
  const classes = useStyles();
  const studentDetails = JSON.parse(localStorage.getItem(KEY_USER_DETAILS));
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState([
    {
      id: 1,
      Course: 'Artificial Intelligence',
      Program: 'GMBA',
      Term: 'Term 1',
      Date: '17-08-2022',
      Time: '09:00 AM',
      isEligible: true,
      Score: 'N/A',
    },
    {
      id: 2,
      Course: 'Artificial Intelligence',
      Program: 'GMBA',
      Term: 'Term 2',
      Date: '17-08-2022',
      Time: '09:00 AM',
      isEligible: false,
      Score: '98/100',
    },
    {
      id: 3,
      Course: 'Artificial Intelligence',
      Program: 'GMBA',
      Term: 'Term 1',
      Date: '17-08-2022',
      Time: '09:00 AM',
      isEligible: true,
      Score: '86/100',
    },
  ]);

  // Header
  const columns = [
    {
      Header: '#',
      accessor: '',
      disableGlobalFilter: true,
    },
    {
      Header: 'Program',
      accessor: 'Program',
      disableGlobalFilter: true,
    },
    {
      Header: `Term`,
      accessor: `Term`,
      disableGlobalFilter: true,
    },
    {
      Header: 'Course',
      accessor: 'Course',
      disableGlobalFilter: true,
    },
  ];

  const handleClose = () => {
    setOpenModel(false);
  };
  return (
    <div className="table_main">
      <Grid container xs={12} className="table">
        <Grid container xs={12} style={{ padding: '5px' }} className="table">
          <Grid className="table_header haeder_title_text table_data_text">
            <KenCard paperStyles={{ padding: 0 }}>
              {loading && <KenLoader />}
              <KenGrid
                columns={columns}
                data={data}
                pagination={{ disabled: true }}
                toolbarDisabled={true}
                isCollasable={true}
                component={StudentListForEval}
                gridProps={{
                  getRowProps: row => ({
                    isCollasable: true,
                  }),
                  // getCellProps: cell => ({
                  //   style: {
                  //     textAlign:
                  //       cell.column.id === 'GradeComponent' ? 'left' : 'center',
                  //   },
                  // }),
                }}
              />
            </KenCard>
            <div />
          </Grid>
        </Grid>
      </Grid>
      {/* <AlertDialog
        open={openModel}
        handleClose={handleClose}
        positiveButtonText={false}
        dialogActionFlag={false}
        dialogContentStyle={{ width: 'auto' }}
      >
        <RejectReason
        // openModel={openModel}
        // setOpenModel={setOpenModel}
        // handleClose={handleClose}
        />
      </AlertDialog> */}
    </div>
  );
};

export default ResultEvaluatin;
