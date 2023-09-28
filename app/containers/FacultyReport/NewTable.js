import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useTable, useExpanded } from 'react-table';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// export default function StudentTable() {
//   return (
//     <div>StudentTable</div>
//   )
// }

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    marginTop: '20px',
  },
  tcell: {
    backgroundColor: '#fff',
    padding: 0,
    paddingBottom: '16px',
    paddingTop: '10px',
    paddingLeft: '10px',
    border: 0,
    fontSize: '11px',
    lineHeight: '150%',
    color: '#505F79',
    // backgroundColor:'#dfe1e6',
  },
  tablehead: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    '&>:nth-child(1)': {
      '&>:nth-child(3)': {
        // paddingLeft:"60px",
        // paddingBottom:0,
      },
      '&>:nth-child(8)': {
        // paddingLeft:"50px",
        // paddingBottom:0,
      },
    },
  },
}));

export function Newtable({ columns, data, renderComponents, dataLoader }) {
  // const Columns = useMemo(() => columns, [])
  // const Data = useMemo(() => data, [])
  const classes = useStyles();

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
    },
    useExpanded
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = tableInstance;
  return (
    <div>
      <TableContainer component={Paper} style={{ padding: '10px' }}>
        <Table {...getTableProps()}>
          <TableHead className={classes.tablehead}>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell
                    className={classes.tcell}
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map(row => {
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
              })
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length}>
                  {dataLoader != undefined ? dataLoader : ''}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
