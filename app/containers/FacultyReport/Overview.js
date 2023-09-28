import React, { useEffect } from 'react';
import { useTable, useExpanded } from 'react-table';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { getGradingDetails } from '../../utils/ApiService';
import KenCard from '../../global_components/KenCard';
import { Typography } from '@material-ui/core';
import NewTable from './NewTable';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import KenLoader from '../../components/KenLoader';

const useStyles = makeStyles(theme => ({
  profile: {
    color: theme.palette.KenColors.primary,
    cursor: 'pointer',
    fontSize: 12,
    textAlign: 'left',
    paddingLeft: '10px',
  },
}));

function Table({ columns: userColumns, data, renderComponents }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state: { expanded },
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded // Use the useExpanded plugin hook
  );

  return (
    <>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <React.Fragment {...row.getRowProps()}>
                <TableRow>
                  {row.cells.map(cell => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {row.isExpanded ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length}>
                      {/*
                        Inside it, call our renderRowSubComponent function. In reality,
                        you could pass whatever you want as props to
                        a component like this, including the entire
                        table instance. But for this example, we'll just
                        pass the row
                      */}
                      {renderComponents({ row })}
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            );
          })}
        </TableBody>
      </MaUTable>
    </>
  );
}

export default function Overview() {
  const classes = useStyles();

  const history = useHistory();
  // Profile Cell
  const ProfileCell = row => {
    const { studentName } = row.row.values;
    return (
      <Typography
        className={classes.profile}
        onClick={() => onProfileView(row?.row?.original)}
      >
        {studentName}
      </Typography>
    );
  };

  const columns = React.useMemo(() => [
    {
      Header: 'Student',
      accessor: 'studentName',
    },
    {
      Header: 'Marks',
      columns: [
        {
          Header: 'Max',
          accessor: 'maximumMarks',
        },
        {
          Header: 'Obtained',
          accessor: 'marksObtained',
        },
      ],
    },
    {
      Header: 'Percentage',
      accessor: 'percentage',
    },
    {
      Header: 'Grade',
      accessor: 'calculatedLetterGrade',
    },
    {
      Header: 'Penalty',
      accessor: 'penalty',
    },
    {
      Header: 'Final Grade',
      accessor: 'finalLetterGrade',
    },
    {
      Header: 'Credits',
      columns: [
        {
          Header: 'Total',
          accessor: 'credits',
        },
        {
          Header: 'Earned',
          accessor: 'creditsEarned',
        },
      ],
    },
    {
      Header: 'Status',
      accessor: 'passFailStatus',
    },
  ]);

  const [data, setData] = React.useState([]);
  const [courseData, setCourseData] = React.useState([]);
  const [courseEvalutionopt, setCourseEvalutionopt] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sectionId, setSectionID] = React.useState('');

  const renderComponents = React.useCallback(
    ({ row }) => <ComponentsMarksTable data={row.original} />,
    []
  );

  //   const handleSectionChange = e => {
  //     console.log('section id', e.target.value);
  //     setSectionID(e.target.value);
  //   };
  //   React.useEffect(
  //     res => {
  //       if (sectionId) {
  //         setLoading(true);
  //         getGradingDetails(sectionId)
  //           .then(res => {
  //             setData(res);
  //             setLoading(false);
  //           })
  //           .catch(err => {
  //             console.log('Err: ', err);
  //             setLoading(true);
  //           });
  //       }
  //     },
  //     [sectionId]
  //   );

  return (
    <div>
      {loading && <KenLoader />}

      <div>
        {data && data.length && (
          <NewTable
            columns={columns}
            data={data}
            renderComponents={renderComponents}
          />
        )}
      </div>
    </div>
  );
}

const ComponentsMarksTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '👇' : '👉'}
          </span>
        ),
      },
      {
        Header: 'Component',
        accessor: 'name',
      },
      {
        Header: 'Max Marks',
        accessor: 'maxMarks',
      },
      {
        Header: 'Marks Obtained',
        accessor: 'marksObtained',
      },
      {
        Header: 'Marks In course',
        accessor: 'marksInCourse',
      },
    ],
    []
  );

  const renderRowSubComponent = React.useCallback(
    ({ row }) => <SubComponentsMarksTable data={row.original} />,
    []
  );

  return (
    <>
      {data?.components?.length && (
        <Table
          columns={columns}
          data={data?.components}
          renderComponents={renderRowSubComponent}
        />
      )}
    </>
  );
};

function SubComponentsMarksTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sub Component',
        accessor: 'name',
        render: ({ value, row }) => ({ value }),
      },
      {
        Header: 'Max Marks',
        accessor: 'maxMarks',
      },
      {
        Header: 'Marks Obtained',
        accessor: 'marksObtained',
      },
      {
        Header: 'Component Marks',
        accessor: 'marksInComponent',
      },
      {
        Header: 'Score Finalized',
        accessor: 'fianlized',
      },
    ],
    []
  );

  return (
    <>
      {data?.subComponents && (
        <Table data={data?.subComponents} columns={columns} />
      )}
    </>
  );
}
